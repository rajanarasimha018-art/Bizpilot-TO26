import os
import json
import logging
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

logger = logging.getLogger("bizpilot_ai")

# Initialize the Gemini GenAI client
# It automatically reads GEMINI_API_KEY from environment variables
api_key = os.getenv("GEMINI_API_KEY")
client = None
if api_key:
    try:
        client = genai.Client(api_key=api_key)
        logger.info("Gemini GenAI client initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing Gemini client: {e}")
else:
    logger.warn("GEMINI_API_KEY not found in environment. AI operations will use fallbacks.")

def extract_bill_from_image(image_bytes: bytes, mime_type: str) -> dict:
    """
    Sends receipt/bill image to Gemini 2.5 Flash for extraction.
    Returns: {vendor, date, items: [{name, qty, unit_price}], total}
    """
    if not client:
        logger.warn("Gemini client is not available. Using fallback empty draft.")
        return get_fallback_extraction()

    prompt = (
        "Analyze this bill/receipt image and extract key details. "
        "Return a JSON object containing the following keys:\n"
        "- vendor: Name of the merchant or service provider (string)\n"
        "- date: Date on the receipt in YYYY-MM-DD format (string)\n"
        "- items: List of items purchased, where each item has:\n"
        "  * name: Name or description of the product/service (string)\n"
        "  * qty: Quantity purchased (integer)\n"
        "  * unit_price: Price per unit (number)\n"
        "- total: The grand total amount on the receipt (number)\n\n"
        "Make sure to extract as many line items as possible. Return valid JSON only."
    )

    try:
        logger.info(f"Sending image to Gemini 2.5 Flash for OCR extraction. Mime type: {mime_type}...")
        image_part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[image_part, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        
        # Parse the JSON response
        text_response = response.text.strip()
        logger.info(f"Gemini response: {text_response}")
        extracted_data = json.loads(text_response)
        
        # Clean up keys and items to match exact structure
        cleaned_data = {
            "vendor": extracted_data.get("vendor", "Unknown Vendor"),
            "date": extracted_data.get("date", ""),
            "items": [],
            "total": float(extracted_data.get("total", 0))
        }
        
        raw_items = extracted_data.get("items", [])
        for item in raw_items:
            cleaned_data["items"].append({
                "name": item.get("name", "Product"),
                "qty": int(item.get("qty", 1)),
                "unit_price": float(item.get("unit_price", 0))
            })
            
        return cleaned_data

    except Exception as e:
        logger.error(f"Gemini vision call failed: {e}. Returning manual fallback draft.")
        return get_fallback_extraction()

def generate_report_recommendations(sales_summary: dict) -> list:
    """
    Phrases recommendation insights based on computed business aggregates.
    """
    if not client:
        return get_fallback_recommendations(sales_summary)

    prompt = (
        f"You are BizPilot AI, an expert business copilot. Based on the daily sales summary below, "
        "provide 1 or 2 concise, action-oriented, and specific recommendations in bullet points. "
        "Do NOT make up any numbers; use only the facts provided. Return a JSON list of strings.\n\n"
        f"Daily Sales Summary:\n"
        f"- Total Revenue: {sales_summary.get('revenue', 0)}\n"
        f"- Total Units Sold: {sales_summary.get('units_sold', 0)}\n"
        f"- Total Stock Added (Restocked): {sales_summary.get('stock_added', 0)}\n"
        f"- Top Products Sold: {sales_summary.get('top_products', [])}\n"
        f"- Low Stock Items: {sales_summary.get('low_stock_items', [])}\n"
    )

    try:
        logger.info("Requesting recommendations from Gemini...")
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.7
            )
        )
        text_response = response.text.strip()
        logger.info(f"Gemini recommendations: {text_response}")
        recommendations = json.loads(text_response)
        if isinstance(recommendations, list):
            return [str(r) for r in recommendations]
        return get_fallback_recommendations(sales_summary)
    except Exception as e:
        logger.error(f"Gemini recommendation failed: {e}. Returning fallback list.")
        return get_fallback_recommendations(sales_summary)

def get_fallback_extraction() -> dict:
    return {
        "vendor": "",
        "date": "",
        "items": [{"name": "", "qty": 1, "unit_price": 0}],
        "total": 0
    }

def get_fallback_recommendations(sales_summary: dict) -> list:
    low_stock = sales_summary.get('low_stock_items', [])
    top_products = sales_summary.get('top_products', [])
    
    recommendations = []
    if low_stock:
        recommendations.append(f"Stock levels are low for: {', '.join(low_stock[:3])}. Create a restock request to prevent stock-outs.")
    else:
        recommendations.append("All core stock levels are currently healthy. Continue monitoring sales velocity.")
        
    if top_products:
        recommendations.append(f"High demand noticed for: {', '.join(top_products[:2])}. Ensure suppliers can cover next week's moving average.")
    else:
        recommendations.append("Sales are steady. Monitor daily trends to identify high-performing products.")
        
    return recommendations


# --- AI BUSINESS COPILOT ADDITIONS ---

from typing import List, Optional
from pydantic import BaseModel, Field

class CopilotAction(BaseModel):
    label: str
    action_type: str # "view_inventory" | "request_restock" | "view_sales" | "view_billing" | "view_staff"
    payload: Optional[dict] = None

class CopilotResponse(BaseModel):
    response_type: str # "standard" | "business_health"
    main_text: str
    
    # For standard responses
    insight: Optional[str] = None
    why_it_matters: Optional[str] = None
    recommendation: Optional[str] = None
    action: Optional[CopilotAction] = None

    # For business_health responses
    revenue: Optional[str] = None
    expenses: Optional[str] = None
    profit: Optional[str] = None
    pending_collections: Optional[str] = None
    inventory_risk: Optional[str] = None
    top_insights: Optional[List[str]] = None
    top_actions: Optional[List[CopilotAction]] = None

def programmatically_analyze_context(query: str, context: dict) -> dict:
    """
    Analyzes the business context programmatically when Gemini is unavailable.
    Guarantees no fake data and provides real analysis of current business numbers.
    """
    lower = query.lower()
    
    # Extract general parameters from context
    revenue = context.get("grossRevenue", 0.0)
    expenses = context.get("totalExpenses", 0.0)
    profit = context.get("netProfit", 0.0)
    margin = context.get("profitMargin", 0.0)
    pending_collections = context.get("pendingCollections", 0.0)
    
    products = context.get("products", [])
    low_stock_products = [p for p in products if p.get("quantity", 0) <= p.get("minStock", 5)]
    top_selling = context.get("topSellingProducts", [])
    workers = context.get("workers", [])
    restock_reqs = context.get("restockRequests", [])
    
    currency_symbol = context.get("currency", "INR ")
    if currency_symbol == "INR":
        currency_symbol = "INR "
    
    def fmt(val):
        return f"{currency_symbol}{val:,.2f}"

    # A. Check if the query is about inventory worth/value/valuation
    if any(k in lower for k in ["inventory value", "inventory worth", "value of my inventory", "valuation of inventory", "inventory valuation"]):
        total_val = sum(float(p.get("quantity", 0)) * float(p.get("price", 0.0)) for p in products)
        return {
            "response_type": "standard",
            "main_text": f"Your total inventory valuation is {fmt(total_val)}.",
            "insight": f"This is calculated across {len(products)} products in your active catalog based on their current stock quantities and selling prices.",
            "why_it_matters": "Understanding inventory valuation is crucial for managing working capital and assessing business liquidity.",
            "recommendation": "Review slow-moving categories to optimize cash cycles and prevent cash tie-ups.",
            "action": {
                "label": "View Inventory",
                "action_type": "view_inventory",
                "payload": {}
            }
        }

    # B. Check if the query is about highest stock-out risk
    if any(k in lower for k in ["highest risk", "highest stock-out risk", "highest stockout risk", "most at risk", "maximum risk"]):
        risk_product = None
        min_ratio = 999.0
        for p in products:
            qty = float(p.get("quantity", 0))
            min_s = float(p.get("minStock", 5))
            if min_s > 0:
                ratio = qty / min_s
                if ratio < min_ratio:
                    min_ratio = ratio
                    risk_product = p
        
        if risk_product and min_ratio <= 1.0:
            suggested_qty = max(50, int(risk_product.get("minStock", 5) * 4))
            return {
                "response_type": "standard",
                "main_text": f"The product at highest stock-out risk is {risk_product.get('name')}.",
                "insight": f"Current stock is {int(risk_product.get('quantity', 0))} units against a safety threshold of {int(risk_product.get('minStock', 5))} units (Ratio: {min_ratio*100:.1f}%).",
                "why_it_matters": "Running out of stock on core products will lead to missed client delivery contracts and lost revenue.",
                "recommendation": f"Place a restock request for approximately {suggested_qty} units with supplier {risk_product.get('supplier', 'Local supplier')} immediately.",
                "action": {
                    "label": "Request Restock",
                    "action_type": "request_restock",
                    "payload": {
                        "product_name": risk_product.get("name"),
                        "product_id": risk_product.get("id"),
                        "qty": suggested_qty
                    }
                }
            }
        else:
            return {
                "response_type": "standard",
                "main_text": "All products are currently at healthy stock levels with minimal stock-out risk.",
                "insight": "All active inventory items exceed minimum safety reorder thresholds.",
                "why_it_matters": "Warehouse levels are healthy and supply lines are stable.",
                "recommendation": "Continue monitoring daily sales volumes to anticipate future demand spikes.",
                "action": {
                    "label": "View Inventory",
                    "action_type": "view_inventory",
                    "payload": {}
                }
            }

    # 1. Check if asking about a specific product in our catalog
    matched_product = None
    for p in products:
        p_name = p.get("name", "").lower()
        # check if full name or first word is in query
        if p_name in lower or (len(p_name.split()) > 0 and p_name.split()[0] in lower):
            matched_product = p
            break

    if matched_product:
        p = matched_product
        is_low = p.get("quantity", 0) <= p.get("minStock", 5)
        suggested_qty = max(50, p.get("minStock", 5) * 4)
        return {
            "response_type": "standard",
            "main_text": f"Restock analysis for {p.get('name')}.",
            "insight": f"Current stock is {p.get('quantity')} units, below the safety threshold of {p.get('minStock')} units." if is_low else f"Current stock is {p.get('quantity')} units, which exceeds the safety threshold of {p.get('minStock')} units.",
            "why_it_matters": f"At current demand, the business faces a high stock-out risk for {p.get('name')}." if is_low else f"{p.get('name')} has stable inventory levels with no immediate stock-out threat.",
            "recommendation": f"Order {suggested_qty} units from {p.get('supplier', 'Local supplier')} to replenish safety buffer." if is_low else f"No restock is required today. Continue monitoring sales velocity.",
            "action": {
                "label": "Request Restock",
                "action_type": "request_restock",
                "payload": {
                    "product_name": p.get("name"),
                    "product_id": p.get("id"),
                    "qty": suggested_qty
                }
            } if is_low else {
                "label": "View Inventory",
                "action_type": "view_inventory",
                "payload": {}
            }
        }

    # 2. Check if the query is business health, summary, or performance
    if any(k in lower for k in ["health", "how is", "summary", "doing today", "doing", "executive", "performance", "overview"]):
        # Top 3 insights
        insights = [
            f"Gross revenue today stands at {fmt(revenue)} with a net profit of {fmt(profit)} (Profit Margin: {margin:.1f}%).",
            f"You have outstanding client collections of {fmt(pending_collections)} across unpaid invoice ledgers."
        ]
        if low_stock_products:
            insights.append(f"{len(low_stock_products)} product(s) are low in stock (below safety levels), representing procurement risk.")
        else:
            insights.append("All inventory items currently exceed minimum safety reorder thresholds.")
            
        # Top 3 actions
        actions = [
            {"label": "View Sales & Reports", "action_type": "view_sales", "payload": {}},
            {"label": "View Billing & Invoices", "action_type": "view_billing", "payload": {}}
        ]
        if low_stock_products:
            actions.append({
                "label": "Request Restock",
                "action_type": "request_restock",
                "payload": {
                    "product_name": low_stock_products[0].get("name"),
                    "product_id": low_stock_products[0].get("id"),
                    "qty": max(50, low_stock_products[0].get("minStock", 5) * 4)
                }
            })
        else:
            actions.append({"label": "View Staff & Wages", "action_type": "view_staff", "payload": {}})
            
        return {
            "response_type": "business_health",
            "main_text": "Here is today's business health overview based on your active database transactions.",
            "revenue": fmt(revenue),
            "expenses": fmt(expenses),
            "profit": fmt(profit),
            "pending_collections": fmt(pending_collections),
            "inventory_risk": "High Risk" if low_stock_products else "Healthy (Low Risk)",
            "top_insights": insights,
            "top_actions": actions
        }

    # 3. Check if the query is about pending restock requests
    elif any(k in lower for k in ["pending restock", "awaiting action", "recent restock", "restock request", "status of restock"]):
        pending = [r for r in restock_reqs if r.get("status") in ["pending", "Request Initiated"]]
        if pending:
            r = pending[0]
            return {
                "response_type": "standard",
                "main_text": f"You have {len(pending)} pending restock requests.",
                "insight": f"Request for {r.get('productName')} ({r.get('requestedQty')} units) is currently '{r.get('status')}'",
                "why_it_matters": "Pending requests must be confirmed to ensure supplier dispatch schedules.",
                "recommendation": f"Check in with {r.get('requestedBy', 'procurement')} or follow up with the dealer.",
                "action": {
                    "label": "View Inventory",
                    "action_type": "view_inventory",
                    "payload": {}
                }
            }
        else:
            return {
                "response_type": "standard",
                "main_text": "No pending restock requests found in active tracking.",
                "insight": "All previous restock requests have been processed and received.",
                "why_it_matters": "Warehouse inventory levels are actively reconciled.",
                "recommendation": "Monitor safety levels on the inventory dashboard.",
                "action": {
                    "label": "View Inventory",
                    "action_type": "view_inventory",
                    "payload": {}
                }
            }
        
    # 4. Check if the query is about low stock or reorders
    elif any(k in lower for k in ["stock", "restock", "inventory", "product", "attention"]):
        if low_stock_products:
            p = low_stock_products[0]
            suggested_qty = max(50, p.get("minStock", 5) * 4)
            return {
                "response_type": "standard",
                "main_text": f"{p.get('name')} needs attention.",
                "insight": f"Current stock is {p.get('quantity')} units, which is below the safety threshold of {p.get('minStock')} units.",
                "why_it_matters": "At the current sales rate, the business may face a stock-out.",
                "recommendation": f"Place a restock request for approximately {suggested_qty} units with supplier {p.get('supplier', 'Waaree')}.",
                "action": {
                    "label": "Request Restock",
                    "action_type": "request_restock",
                    "payload": {
                        "product_name": p.get("name"),
                        "product_id": p.get("id"),
                        "qty": suggested_qty
                    }
                }
            }
        else:
            return {
                "response_type": "standard",
                "main_text": "All products are currently at healthy stock levels.",
                "insight": "All inventory quantities exceed safety reorder levels.",
                "why_it_matters": "Operations face no immediate threat of stock-out or supply chain disruption.",
                "recommendation": "Review weekly moving averages to optimize safety reorder points.",
                "action": {
                    "label": "View Inventory",
                    "action_type": "view_inventory",
                    "payload": {}
                }
            }
            
    # 5. Check if query is about cash-flow, receivables, bills or billing
    elif any(k in lower for k in ["cash", "flow", "receivable", "billing", "payment", "pending", "invoice", "outflow", "expense", "profit change", "why did profit", "performing"]):
        if pending_collections > 0:
            return {
                "response_type": "standard",
                "main_text": f"You have {fmt(pending_collections)} in pending collections.",
                "insight": "Outstanding payments are delaying cash flows and operations capital.",
                "why_it_matters": "Uncollected receivables reduce operational runway and working capital.",
                "recommendation": "Review outstanding customer ledgers and automate billing reminders.",
                "action": {
                    "label": "View Billing & Invoices",
                    "action_type": "view_billing",
                    "payload": {}
                }
            }
        else:
            return {
                "response_type": "standard",
                "main_text": "Your accounts receivables ledger is fully settled.",
                "insight": "All client invoices are currently paid and closed.",
                "why_it_matters": "Cash inflows are optimized with zero outstanding bad-debt risk.",
                "recommendation": "Continue dispatching immediate digital invoice links to keep cycles brief.",
                "action": {
                    "label": "View Billing & Invoices",
                    "action_type": "view_billing",
                    "payload": {}
                }
            }
            
    # 6. Check if workforce or focus or risk is mentioned
    elif any(k in lower for k in ["workforce", "staff", "wage", "focus", "risk", "action plan", "today"]):
        unpaid_wages = sum(float(w.get("unpaidWages", 0.0)) for w in workers)
        if unpaid_wages > 0:
            return {
                "response_type": "standard",
                "main_text": f"Unpaid wages total {fmt(unpaid_wages)} across your workforce.",
                "insight": "Active worker wages have accumulated for the current pay period.",
                "why_it_matters": "Settling labor payroll promptly maintains site operations and builder morale.",
                "recommendation": "Navigate to the Staff & Wages ledger to run payroll settlement.",
                "action": {
                    "label": "View Staff & Wages",
                    "action_type": "view_staff",
                    "payload": {}
                }
            }
        elif low_stock_products:
            p = low_stock_products[0]
            return {
                "response_type": "standard",
                "main_text": f"Your primary risk today is inventory replenishment.",
                "insight": f"{p.get('name')} has fallen below safety levels.",
                "why_it_matters": "Procurement delays can stall project timelines and installer workloads.",
                "recommendation": f"Procure {max(50, p.get('minStock', 5) * 4)} units of {p.get('name')} immediately.",
                "action": {
                    "label": "Request Restock",
                    "action_type": "request_restock",
                    "payload": {
                        "product_name": p.get("name"),
                        "product_id": p.get("id"),
                        "qty": max(50, p.get("minStock", 5) * 4)
                    }
                }
            }
        else:
            return {
                "response_type": "standard",
                "main_text": "Operations are currently running smoothly.",
                "insight": "No critical inventory stock-outs, workforce payroll delays, or cash-flow threats detected.",
                "why_it_matters": "Your business parameters are healthy and optimized.",
                "recommendation": "Review overall sales projections and daily reports to plan expansion.",
                "action": {
                    "label": "View Sales & Reports",
                    "action_type": "view_sales",
                    "payload": {}
                }
            }

    # Default fallback when there isn't enough details or keyword matching fails
    return {
        "response_type": "standard",
        "main_text": "I don't have enough business data to make that determination yet.",
        "insight": "The query requires details outside the active operational ledger database.",
        "why_it_matters": "Providing advice without grounding numbers could risk financial inaccuracy.",
        "recommendation": "Review the metrics manually from the main Dashboard.",
        "action": {
            "label": "View Sales & Reports",
            "action_type": "view_sales",
            "payload": {}
        }
    }

def ask_copilot_assistant(user_query: str, business_context: dict) -> dict:
    """
    Prompts Gemini 2.5 Flash with the user query and business context.
    Returns a structured dictionary matching CopilotResponse.
    Falls back gracefully if the Gemini API client is not configured or fails.
    """
    if not client:
        logger.info("Gemini client is not available. Using high-fidelity programmatic analyzer fallback.")
        return programmatically_analyze_context(user_query, business_context)

    # Construct the instruction and context prompt
    prompt = (
        "You are BizPilot AI, an expert business copilot and financial advisor.\n"
        "Your task is to analyze the business context below and answer the user query.\n\n"
        f"User Query: {user_query}\n\n"
        f"Business Context:\n{json.dumps(business_context, indent=2)}\n\n"
        "Instructions:\n"
        "1. Prioritize facts, numbers, and risks from the business context. Do NOT make up or invent any numbers.\n"
        "2. If you do not have enough business data to answer the query or determine a trend/risk, return exactly:\n"
        "   \"I don't have enough business data to make that determination yet.\" in the main_text field.\n"
        "3. If the user query is about business health today, performance, or how the business is doing:\n"
        "   Set response_type = \"business_health\".\n"
        "   Fill out: revenue, expenses, profit, pending_collections, inventory_risk.\n"
        "   Provide top_insights (exactly 3 strings) and top_actions (exactly 3 action objects).\n"
        "   Each action object in top_actions must contain 'label', 'action_type', and optional 'payload' dict.\n"
        "4. For specific queries (like risks, stockouts, restocking products, pending requests, cash-flow, action plan):\n"
        "   Set response_type = \"standard\".\n"
        "   Fill out: main_text (brief grounded answer), insight, why_it_matters, recommendation, and a relevant action object.\n"
        "5. Valid action_type values: \"view_inventory\", \"request_restock\", \"view_sales\", \"view_billing\", \"view_staff\".\n"
        "6. For \"request_restock\", set 'payload' to include 'product_id', 'product_name', and 'qty'.\n"
        "7. Do not output generic advice. Respond strictly based on the actual numbers in the context."
    )

    try:
        logger.info(f"Sending prompt to Gemini 2.5 Flash for query: {user_query}...")
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=CopilotResponse,
                temperature=0.2
            )
        )
        text_response = response.text.strip()
        logger.info(f"Gemini Copilot response: {text_response}")
        return json.loads(text_response)
    except Exception as e:
        logger.error(f"Gemini copilot call failed or schema parsing error: {e}. Falling back to programmatic analyzer.")
        try:
            # Try calling without schema constraints, just in case response_schema was the issue
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt + "\nReturn a valid JSON matching the CopilotResponse format.",
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    temperature=0.2
                )
            )
            return json.loads(response.text.strip())
        except Exception as e2:
            logger.error(f"Second Gemini attempt failed: {e2}. Falling back to programmatic analyzer.")
            return programmatically_analyze_context(user_query, business_context)

