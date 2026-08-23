import os
import json
from datetime import datetime, timedelta
from db import get_collection

def seed_db():
    print("Starting database seeding...")

    # Clear existing collections to ensure fresh start
    products_col = get_collection("products")
    workers_col = get_collection("workers")
    attendance_col = get_collection("attendance")
    movements_col = get_collection("stock_movements")
    bills_col = get_collection("bills")
    invoices_col = get_collection("invoices")
    requests_col = get_collection("stock_requests")
    profile_col = get_collection("profile")

    products_col.delete_many({})
    workers_col.delete_many({})
    attendance_col.delete_many({})
    movements_col.delete_many({})
    bills_col.delete_many({})
    invoices_col.delete_many({})
    requests_col.delete_many({})
    profile_col.delete_many({})

    # 1. Seed Products
    products = [
        {
            "id": "p1",
            "name": "Printer Paper A4",
            "category": "Office Supplies",
            "reorder_threshold": 30,
            "unit_cost": 240.0,
            "price": 360.0,
            "sku": "PAP-A4-XYZ",
            "description": "High-quality 80gsm white A4 printing paper.",
            "supplier": "Global Paper Co"
        },
        {
            "id": "p2",
            "name": "Ponds Powder",
            "category": "Cosmetics",
            "reorder_threshold": 10,
            "unit_cost": 90.0,
            "price": 130.0,
            "sku": "PND-PWD-100",
            "description": "Sandalwood talcum powder 100g.",
            "supplier": "ABC Foods"
        },
        {
            "id": "p3",
            "name": "USB-C Cable",
            "category": "Electronics",
            "reorder_threshold": 20,
            "unit_cost": 120.0,
            "price": 200.0,
            "sku": "USB-C-3FT",
            "description": "3ft fast charging braided USB-C cable.",
            "supplier": "Apex Power"
        },
        {
            "id": "p4",
            "name": "Wireless Mouse",
            "category": "Electronics",
            "reorder_threshold": 15,
            "unit_cost": 350.0,
            "price": 600.0,
            "sku": "MSE-WRL-OPT",
            "description": "Ergonomic 2.4GHz wireless optical mouse.",
            "supplier": "Apex Power"
        },
        {
            "id": "p5",
            "name": "LED Bulb 12W",
            "category": "Electronics",
            "reorder_threshold": 25,
            "unit_cost": 80.0,
            "price": 140.0,
            "sku": "LED-12W-WHT",
            "description": "Energy-efficient warm white 12W LED bulb.",
            "supplier": "Apex Power"
        },
        {
            "id": "p6",
            "name": "Notebook A5",
            "category": "Office Supplies",
            "reorder_threshold": 15,
            "unit_cost": 40.0,
            "price": 70.0,
            "sku": "NTB-A5-RUL",
            "description": "Ruled A5 notebook, 160 pages.",
            "supplier": "Global Paper Co"
        },
        {
            "id": "p7",
            "name": "Keyboard",
            "category": "Electronics",
            "reorder_threshold": 15,
            "unit_cost": 400.0,
            "price": 750.0,
            "sku": "KBD-USB-STD",
            "description": "Standard full-size USB wired keyboard.",
            "supplier": "Apex Power"
        },
        {
            "id": "p8",
            "name": "Ball Pen Pack",
            "category": "Office Supplies",
            "reorder_threshold": 30,
            "unit_cost": 50.0,
            "price": 90.0,
            "sku": "PEN-BLU-10P",
            "description": "Pack of 10 blue ink fine-point ball pens.",
            "supplier": "ABC Foods"
        },
        {
            "id": "p9",
            "name": "Thermal Paper Roll",
            "category": "Office Supplies",
            "reorder_threshold": 15,
            "unit_cost": 20.0,
            "price": 35.0,
            "sku": "THM-PR-3IN",
            "description": "3-inch thermal POS receipt paper roll.",
            "supplier": "Speedy Logistics"
        },
        {
            "id": "p10",
            "name": "Cleaning Spray",
            "category": "Cleaning Utilities",
            "reorder_threshold": 12,
            "unit_cost": 100.0,
            "price": 160.0,
            "sku": "CLN-SPR-500",
            "description": "Multi-surface disinfectant cleaning spray 500ml.",
            "supplier": "Unilever Wholesale"
        },
        {
            "id": "p11",
            "name": "Power Adapter",
            "category": "Electronics",
            "reorder_threshold": 18,
            "unit_cost": 250.0,
            "price": 450.0,
            "sku": "PWR-AD-20W",
            "description": "20W USB-C PD fast charger wall adapter.",
            "supplier": "Apex Power"
        },
        {
            "id": "p12",
            "name": "Packaging Boxes",
            "category": "Packaging",
            "reorder_threshold": 40,
            "unit_cost": 20.0,
            "price": 40.0,
            "sku": "BOX-MED-BRN",
            "description": "Medium corrugated brown shipping boxes.",
            "supplier": "Unknown Supplier"
        }
    ]
    for p in products:
        products_col.insert_one(p)
    print(f"Seeded {len(products)} products.")

    # 2. Seed Workers
    workers = [
        {"id": "w1", "name": "Ravi Kumar", "role": "Solar Technician", "daily_wage_rate": 1200.0, "sector": "Assembly & Mounting", "unpaidWages": 6000.0, "totalWagesPaid": 10000.0},
        {"id": "w2", "name": "Priya Sharma", "role": "Junior Installer", "hourly_rate": 150.0, "sector": "Wiring & Testing", "unpaidWages": 3600.0, "totalWagesPaid": 0.0},
        {"id": "w3", "name": "Amit Patel", "role": "Warehouse Handler", "daily_wage_rate": 1000.0, "sector": "Inventory Packing", "unpaidWages": 2000.0, "totalWagesPaid": 0.0},
        {"id": "w4", "name": "Vikram Singh", "role": "Safety Supervisor", "hourly_rate": 200.0, "sector": "Quality Inspection", "unpaidWages": 0.0, "totalWagesPaid": 0.0}
    ]
    for w in workers:
        workers_col.insert_one(w)
    print(f"Seeded {len(workers)} workers.")

    # 3. Seed Attendance
    attendance_records = [
        {"id": "att_w1_1", "worker_id": "w1", "date": "2026-08-15", "status": "present", "hours_worked": 8.0},
        {"id": "att_w1_2", "worker_id": "w1", "date": "2026-08-16", "status": "present", "hours_worked": 8.0},
        {"id": "att_w1_3", "worker_id": "w1", "date": "2026-08-17", "status": "present", "hours_worked": 8.0},
        {"id": "att_w1_4", "worker_id": "w1", "date": "2026-08-18", "status": "present", "hours_worked": 8.0},
        {"id": "att_w1_5", "worker_id": "w1", "date": "2026-08-19", "status": "present", "hours_worked": 8.0},
        
        {"id": "att_w2_1", "worker_id": "w2", "date": "2026-08-15", "status": "present", "hours_worked": 8.0},
        {"id": "att_w2_2", "worker_id": "w2", "date": "2026-08-16", "status": "present", "hours_worked": 8.0},
        {"id": "att_w2_3", "worker_id": "w2", "date": "2026-08-17", "status": "present", "hours_worked": 8.0},
        
        {"id": "att_w3_1", "worker_id": "w3", "date": "2026-08-15", "status": "present", "hours_worked": 8.0},
        {"id": "att_w3_2", "worker_id": "w3", "date": "2026-08-16", "status": "present", "hours_worked": 8.0}
    ]
    for att in attendance_records:
        attendance_col.insert_one(att)
    print(f"Seeded {len(attendance_records)} attendance logs.")

    # 4. Seed Stock Movements
    movements = [
        {"id": "sm_d1_init", "product_id": "p1", "type": "added", "quantity": 268, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d1_sale1", "product_id": "p1", "type": "sold", "quantity": 150, "date": "2026-08-10", "source": "inv_1"},
        {"id": "sm_d1_sale2", "product_id": "p1", "type": "sold", "quantity": 100, "date": "2026-08-21", "source": "inv_unpaid_1"},

        {"id": "sm_d2_init", "product_id": "p2", "type": "added", "quantity": 403, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d2_sale", "product_id": "p2", "type": "sold", "quantity": 400, "date": "2026-08-12", "source": "inv_3"},

        {"id": "sm_d3_init", "product_id": "p3", "type": "added", "quantity": 244, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d3_sale1", "product_id": "p3", "type": "sold", "quantity": 100, "date": "2026-08-11", "source": "inv_2"},
        {"id": "sm_d3_sale2", "product_id": "p3", "type": "sold", "quantity": 100, "date": "2026-08-18", "source": "inv_7"},
        {"id": "sm_d3_sale3", "product_id": "p3", "type": "sold", "quantity": 2, "date": "2026-08-22", "source": "inv_unpaid_2"},

        {"id": "sm_d4_init", "product_id": "p4", "type": "added", "quantity": 84, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d4_sale1", "product_id": "p4", "type": "sold", "quantity": 50, "date": "2026-08-11", "source": "inv_2"},
        {"id": "sm_d4_sale2", "product_id": "p4", "type": "sold", "quantity": 10, "date": "2026-08-22", "source": "inv_unpaid_2"},

        {"id": "sm_d5_init", "product_id": "p5", "type": "added", "quantity": 565, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d5_sale", "product_id": "p5", "type": "sold", "quantity": 500, "date": "2026-08-14", "source": "inv_4"},

        {"id": "sm_d6_init", "product_id": "p6", "type": "added", "quantity": 526, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d6_sale1", "product_id": "p6", "type": "sold", "quantity": 200, "date": "2026-08-10", "source": "inv_1"},
        {"id": "sm_d6_sale2", "product_id": "p6", "type": "sold", "quantity": 300, "date": "2026-08-16", "source": "inv_6"},
        {"id": "sm_d6_sale3", "product_id": "p6", "type": "sold", "quantity": 1, "date": "2026-08-22", "source": "inv_unpaid_2"},

        {"id": "sm_d7_init", "product_id": "p7", "type": "added", "quantity": 88, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d7_sale1", "product_id": "p7", "type": "sold", "quantity": 50, "date": "2026-08-11", "source": "inv_2"},
        {"id": "sm_d7_sale2", "product_id": "p7", "type": "sold", "quantity": 10, "date": "2026-08-22", "source": "inv_unpaid_2"},

        {"id": "sm_d8_init", "product_id": "p8", "type": "added", "quantity": 495, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d8_sale", "product_id": "p8", "type": "sold", "quantity": 400, "date": "2026-08-16", "source": "inv_6"},

        {"id": "sm_d9_init", "product_id": "p9", "type": "added", "quantity": 507, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d9_sale1", "product_id": "p9", "type": "sold", "quantity": 500, "date": "2026-08-15", "source": "inv_5"},
        {"id": "sm_d9_sale2", "product_id": "p9", "type": "sold", "quantity": 1, "date": "2026-08-22", "source": "inv_unpaid_2"},

        {"id": "sm_d10_init", "product_id": "p10", "type": "added", "quantity": 202, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d10_sale", "product_id": "p10", "type": "sold", "quantity": 180, "date": "2026-08-20", "source": "inv_8"},

        {"id": "sm_d11_init", "product_id": "p11", "type": "added", "quantity": 109, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d11_sale", "product_id": "p11", "type": "sold", "quantity": 100, "date": "2026-08-18", "source": "inv_7"},

        {"id": "sm_d12_init", "product_id": "p12", "type": "added", "quantity": 1035, "date": "2026-08-10", "source": "manual"},
        {"id": "sm_d12_sale", "product_id": "p12", "type": "sold", "quantity": 1000, "date": "2026-08-15", "source": "inv_5"}
    ]
    for sm in movements:
        movements_col.insert_one(sm)
    print(f"Seeded {len(movements)} stock movements.")

    # 5. Seed Bills
    bills = [
        {
            "id": "bill_1",
            "date": "2026-08-01",
            "image_url": "/static/sample_receipt.png",
            "vendor": "Global Paper Co",
            "extracted_items": [
                {"name": "Printer Paper A4", "qty": 300, "unit_price": 240.0},
                {"name": "Notebook A5", "qty": 575, "unit_price": 40.0}
            ],
            "total": 95000.0,
            "billType": "materials",
            "status": "confirmed"
        },
        {
            "id": "bill_2",
            "date": "2026-08-02",
            "image_url": "/static/sample_receipt.png",
            "vendor": "Apex Power",
            "extracted_items": [
                {"name": "Keyboard", "qty": 100, "unit_price": 400.0},
                {"name": "Wireless Mouse", "qty": 100, "unit_price": 350.0},
                {"name": "USB-C Cable", "qty": 291, "unit_price": 120.0},
                {"name": "Thermal Paper Roll", "qty": 4, "unit_price": 20.0}
            ],
            "total": 110000.0,
            "billType": "materials",
            "status": "confirmed"
        },
        {
            "id": "bill_3",
            "date": "2026-08-03",
            "image_url": "/static/sample_receipt.png",
            "vendor": "ABC Foods",
            "extracted_items": [
                {"name": "Ponds Powder", "qty": 500, "unit_price": 90.0},
                {"name": "Ball Pen Pack", "qty": 600, "unit_price": 50.0}
            ],
            "total": 75000.0,
            "billType": "materials",
            "status": "confirmed"
        },
        {
            "id": "bill_4",
            "date": "2026-08-04",
            "image_url": "/static/sample_receipt.png",
            "vendor": "Unilever Wholesale",
            "extracted_items": [
                {"name": "Cleaning Spray", "qty": 250, "unit_price": 100.0},
                {"name": "Power Adapter", "qty": 160, "unit_price": 250.0}
            ],
            "total": 65000.0,
            "billType": "materials",
            "status": "confirmed"
        },
        {
            "id": "bill_5",
            "date": "2026-08-05",
            "image_url": "/static/sample_receipt.png",
            "vendor": "Speedy Logistics",
            "extracted_items": [
                {"name": "Packaging Boxes", "qty": 1000, "unit_price": 20.0},
                {"name": "Thermal Paper Roll", "qty": 750, "unit_price": 20.0}
            ],
            "total": 35000.0,
            "billType": "materials",
            "status": "confirmed"
        },
        {
            "id": "bill_wages_1",
            "date": "2026-08-15",
            "image_url": "/static/sample_receipt.png",
            "vendor": "Ravi Kumar",
            "extracted_items": [
                {"name": "Wages Payout - Solar Technician", "qty": 1, "unit_price": 10000.0}
            ],
            "total": 10000.0,
            "billType": "wages",
            "workerId": "w1",
            "status": "confirmed"
        },
        {
            "id": "bill_other",
            "date": "2026-08-10",
            "image_url": "/static/sample_receipt.png",
            "vendor": "Cloud Services",
            "extracted_items": [
                {"name": "Server Subscription", "qty": 1, "unit_price": 3000.0}
            ],
            "total": 3000.0,
            "billType": "other",
            "status": "confirmed"
        },
        {
            "id": "bill_transport",
            "date": "2026-08-12",
            "image_url": "/static/sample_receipt.png",
            "vendor": "DTDC Courier",
            "extracted_items": [
                {"name": "Courier & Shipping Charges", "qty": 1, "unit_price": 2000.0}
            ],
            "total": 2000.0,
            "billType": "transport",
            "status": "confirmed"
        }
    ]
    for b in bills:
        bills_col.insert_one(b)
    print(f"Seeded {len(bills)} bills.")

    # 6. Seed Invoices
    invoices = [
        {
            "id": "inv_1",
            "bill_id": None,
            "date": "2026-08-10",
            "customer_name": "General Office Stores",
            "items": [
                {"name": "Printer Paper A4", "qty": 150, "price": 360.0, "total": 54000.0},
                {"name": "Notebook A5", "qty": 200, "price": 70.0, "total": 14000.0}
            ],
            "total": 68000.0,
            "status": "paid",
            "pdf_url": "/static/invoices/invoice_seed_1.pdf"
        },
        {
            "id": "inv_2",
            "bill_id": None,
            "date": "2026-08-11",
            "customer_name": "City Tech Hub",
            "items": [
                {"name": "Keyboard", "qty": 50, "price": 750.0, "total": 37500.0},
                {"name": "Wireless Mouse", "qty": 50, "price": 600.0, "total": 30000.0},
                {"name": "USB-C Cable", "qty": 100, "price": 200.0, "total": 20000.0}
            ],
            "total": 87500.0,
            "status": "paid",
            "pdf_url": "/static/invoices/invoice_seed_2.pdf"
        },
        {
            "id": "inv_3",
            "bill_id": None,
            "date": "2026-08-12",
            "customer_name": "Vance Cosmetics",
            "items": [
                {"name": "Ponds Powder", "qty": 400, "price": 130.0, "total": 52000.0}
            ],
            "total": 52000.0,
            "status": "paid",
            "pdf_url": "/static/invoices/invoice_seed_3.pdf"
        },
        {
            "id": "inv_4",
            "bill_id": None,
            "date": "2026-08-14",
            "customer_name": "Bright Lights Retail",
            "items": [
                {"name": "LED Bulb 12W", "qty": 500, "price": 140.0, "total": 70000.0}
            ],
            "total": 70000.0,
            "status": "paid",
            "pdf_url": "/static/invoices/invoice_seed_4.pdf"
        },
        {
            "id": "inv_5",
            "bill_id": None,
            "date": "2026-08-15",
            "customer_name": "Alpha Logistics",
            "items": [
                {"name": "Packaging Boxes", "qty": 1000, "price": 40.0, "total": 40000.0},
                {"name": "Thermal Paper Roll", "qty": 500, "price": 35.0, "total": 17500.0}
            ],
            "total": 57500.0,
            "status": "paid",
            "pdf_url": "/static/invoices/invoice_seed_5.pdf"
        },
        {
            "id": "inv_6",
            "bill_id": None,
            "date": "2026-08-16",
            "customer_name": "Standard Stationers",
            "items": [
                {"name": "Ball Pen Pack", "qty": 400, "price": 90.0, "total": 36000.0},
                {"name": "Notebook A5", "qty": 300, "price": 70.0, "total": 21000.0}
            ],
            "total": 57000.0,
            "status": "paid",
            "pdf_url": "/static/invoices/invoice_seed_6.pdf"
        },
        {
            "id": "inv_7",
            "bill_id": None,
            "date": "2026-08-18",
            "customer_name": "Electronics Plaza",
            "items": [
                {"name": "Power Adapter", "qty": 100, "price": 450.0, "total": 45000.0},
                {"name": "USB-C Cable", "qty": 100, "price": 200.0, "total": 20000.0}
            ],
            "total": 65000.0,
            "status": "paid",
            "pdf_url": "/static/invoices/invoice_seed_7.pdf"
        },
        {
            "id": "inv_8",
            "bill_id": None,
            "date": "2026-08-20",
            "customer_name": "Clean & Safe Wholesale",
            "items": [
                {"name": "Cleaning Spray", "qty": 180, "price": 160.0, "total": 28800.0}
            ],
            "total": 28800.0,
            "status": "paid",
            "pdf_url": "/static/invoices/invoice_seed_8.pdf"
        },
        {
            "id": "inv_unpaid_1",
            "bill_id": None,
            "date": "2026-08-21",
            "customer_name": "City Office Supplies",
            "items": [
                {"name": "Printer Paper A4", "qty": 100, "price": 360.0, "total": 36000.0}
            ],
            "total": 36000.0,
            "status": "unpaid",
            "pdf_url": "/static/invoices/invoice_seed_unpaid_1.pdf"
        },
        {
            "id": "inv_unpaid_2",
            "bill_id": None,
            "date": "2026-08-22",
            "customer_name": "Apex Tech Distributors",
            "items": [
                {"name": "Keyboard", "qty": 10, "price": 750.0, "total": 7500.0},
                {"name": "Wireless Mouse", "qty": 10, "price": 600.0, "total": 6000.0},
                {"name": "USB-C Cable", "qty": 2, "price": 200.0, "total": 400.0},
                {"name": "Notebook A5", "qty": 1, "price": 70.0, "total": 70.0},
                {"name": "Thermal Paper Roll", "qty": 1, "price": 30.0, "total": 30.0}
            ],
            "total": 14000.0,
            "status": "unpaid",
            "pdf_url": "/static/invoices/invoice_seed_unpaid_2.pdf"
        }
    ]
    for inv in invoices:
        invoices_col.insert_one(inv)
    print(f"Seeded {len(invoices)} invoices.")

    # 7. Seed Stock Requests
    requests = [
        {
            "id": "sr_1",
            "product_id": "p2",
            "requested_qty": 50,
            "requested_by": "Ravi Kumar",
            "status": "pending",
            "date": "2026-08-22",
            "note": "running low, customer requests"
        }
    ]
    for r in requests:
        requests_col.insert_one(r)
    print(f"Seeded {len(requests)} stock requests.")

    # 8. Seed Profile
    profile = {
        "id": "profile_active",
        "email": "test@example.com",
        "name": "Siddu",
        "businessName": "BizPilot Solutions",
        "businessType": "Wholesale & Distribution",
        "currency": "INR"
    }
    profile_col.insert_one(profile)
    print("Seeded active profile.")
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_db()
