import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  DollarSign,
  AlertTriangle,
  Send,
  Mic,
  Paperclip,
  User,
  ArrowRight,
  Package,
  FileText,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { formatAmount } from "../types";

// Standard components for structured AI responses
function AICopilotMessageCard({ data, onActionClick }) {
  const { main_text, insight, why_it_matters, recommendation, action } = data;

  return (
    <div className="space-y-4">
      {/* Primary response text */}
      <p className="text-xs text-gray-800 leading-relaxed font-sans font-medium">
        {main_text}
      </p>

      {/* Structured segments */}
      {(insight || why_it_matters || recommendation) && (
        <div className="grid gap-3 mt-3 pt-3 border-t border-gray-100">
          {insight && (
            <div className="bg-emerald-50/40 border border-emerald-500/10 rounded-xl p-3.5 text-left">
              <span className="text-[9px] font-bold text-teal-700 uppercase tracking-widest font-mono block">Insight</span>
              <p className="text-xs text-gray-700 mt-1 leading-normal font-sans">{insight}</p>
            </div>
          )}
          
          {why_it_matters && (
            <div className="bg-amber-50/40 border border-amber-500/10 rounded-xl p-3.5 text-left">
              <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest font-mono block">Why It Matters</span>
              <p className="text-xs text-gray-700 mt-1 leading-normal font-sans">{why_it_matters}</p>
            </div>
          )}

          {recommendation && (
            <div className="bg-indigo-50/40 border border-indigo-500/10 rounded-xl p-3.5 text-left">
              <span className="text-[9px] font-bold text-indigo-750 uppercase tracking-widest font-mono block">Recommendation</span>
              <p className="text-xs text-gray-700 mt-1 leading-normal font-sans">{recommendation}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {action && (
        <div className="pt-1 flex justify-start">
          <button
            onClick={() => onActionClick(action)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-[10px] rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{action.label}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function AIBusinessHealthCard({ data, onActionClick }) {
  const { revenue, expenses, profit, pending_collections, inventory_risk, top_insights, top_actions } = data;

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-800 leading-relaxed font-sans font-medium">
        {data.main_text}
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 text-left">
          <span className="text-[8px] font-bold text-gray-450 uppercase tracking-wider block font-mono">Revenue</span>
          <span className="text-xs font-bold text-gray-900 block mt-0.5">{revenue || "—"}</span>
        </div>
        <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 text-left">
          <span className="text-[8px] font-bold text-gray-450 uppercase tracking-wider block font-mono">Expenses</span>
          <span className="text-xs font-bold text-rose-600 block mt-0.5">{expenses || "—"}</span>
        </div>
        <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 text-left col-span-2 md:col-span-1">
          <span className="text-[8px] font-bold text-gray-450 uppercase tracking-wider block font-mono">Profit</span>
          <span className="text-xs font-bold text-emerald-600 block mt-0.5">{profit || "—"}</span>
        </div>
        <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 text-left">
          <span className="text-[8px] font-bold text-gray-450 uppercase tracking-wider block font-mono">Pending Collections</span>
          <span className="text-xs font-bold text-teal-700 block mt-0.5">{pending_collections || "—"}</span>
        </div>
        <div className="bg-gray-50 border border-gray-150 rounded-xl p-3.5 text-left">
          <span className="text-[8px] font-bold text-gray-450 uppercase tracking-wider block font-mono">Inventory Risk</span>
          <span className={`text-[10px] font-bold block mt-1 ${inventory_risk?.toLowerCase().includes("high") ? "text-rose-600 animate-pulse" : "text-emerald-600"}`}>
            {inventory_risk || "Healthy"}
          </span>
        </div>
      </div>

      {/* Top 3 Insights */}
      {top_insights && top_insights.length > 0 && (
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <span className="text-[9px] font-bold text-teal-750 uppercase tracking-widest font-mono block">Top 3 Strategic Insights</span>
          <ul className="space-y-1.5 pl-1">
            {top_insights.slice(0, 3).map((insight, idx) => (
              <li key={idx} className="flex gap-2 items-start text-xs text-gray-700 leading-normal">
                <span className="w-4 h-4 flex items-center justify-center rounded bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-teal-750 font-mono shrink-0 mt-0.5">{idx + 1}</span>
                <span className="font-sans">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top 3 Actions */}
      {top_actions && top_actions.length > 0 && (
        <div className="pt-3 border-t border-gray-100 space-y-2">
          <span className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest font-mono block">Top Actions & Interventions</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {top_actions.slice(0, 3).map((act, idx) => (
              <button
                key={idx}
                onClick={() => onActionClick(act)}
                className="p-3 bg-indigo-50/20 hover:bg-indigo-50/60 border border-indigo-100/50 hover:border-indigo-200 text-left rounded-xl transition-all cursor-pointer shadow-xs group hover:scale-[1.02] flex items-center justify-between"
              >
                <span className="text-[10px] font-bold text-indigo-750 block">{act.label}</span>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AIErrorCard({ message }) {
  return (
    <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 flex gap-3 items-start text-left">
      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="text-xs text-rose-700 font-medium leading-relaxed font-sans">
          {message}
        </p>
        <span className="text-[9px] text-gray-450 block font-mono">
          You can still review metrics from other dashboards.
        </span>
      </div>
    </div>
  );
}

export default function Copilot({ user, products, invoices, transactions, theme = "emerald" }) {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleActionClick = (action) => {
    if (!action) return;
    const { action_type, payload } = action;
    
    if (action_type === "view_inventory") {
      navigate("/inventory");
    } else if (action_type === "request_restock") {
      const productName = payload?.product_name || "";
      const productId = payload?.product_id || "";
      const qty = payload?.qty || 100;
      
      let foundProduct = products.find(p => p.id === productId);
      if (!foundProduct && productName) {
        foundProduct = products.find(p => p.name.toLowerCase() === productName.toLowerCase());
      }
      
      if (!foundProduct) {
        foundProduct = {
          id: productId || `p_${Date.now()}`,
          name: productName || "Procurement Item",
          supplier: "Waaree",
          category: "Solar Panels"
        };
      }
      
      navigate("/inventory", {
        state: {
          autoOpenRestock: {
            product: foundProduct,
            qty: qty
          }
        }
      });
    } else if (action_type === "view_sales") {
      navigate("/reports");
    } else if (action_type === "view_billing") {
      navigate("/invoices");
    } else if (action_type === "view_staff") {
      navigate("/workforce");
    }
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    if (!textToSend) setChatInput("");

    try {
      const response = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI server");
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: "assistant",
        data: data,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      }]);
    } catch (err) {
      console.error("Copilot API error:", err);
      // Graceful error state card
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        role: "assistant",
        data: {
          response_type: "error",
          error_message: "AI analysis is temporarily unavailable. You can still review your latest business metrics from the dashboard."
        },
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="animate-fade-in pb-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col" id="copilot-container">
      {/* Page Header */}
      <div className="mb-4 shrink-0 text-left">
        <span className="text-[10px] uppercase font-bold tracking-widest text-teal-700 font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0 text-teal-600" />
          BizPilot Business Advisory Console
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 mt-1">
          AI Business Copilot
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Consult our business advisor on cash flows, risks, low stocks, and executive aggregates.
        </p>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 min-h-0 flex flex-col bg-white border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden relative text-left">
        {/* Scrollable Conversation area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center space-y-6 py-8 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-150 text-teal-700 flex items-center justify-center shadow-xs animate-pulse-slow">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-lg font-bold text-gray-900">How can I assist your business planning today?</h2>
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-normal">
                  I act as a dedicated business advisor. Ask me questions about operational health, risks, low stocks, or financial parameters.
                </p>
              </div>
              
              {/* Suggested Starter Prompt Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
                {[
                  { title: "Business Health Today", text: "How is my business doing today?", desc: "Analyze revenues, profit, risks" },
                  { title: "Procurement Risk Audit", text: "Which products need attention?", desc: "Identify low stock thresholds" },
                  { title: "Analyze Profit Change", text: "Why did my profit change?", desc: "Evaluate outflows and bills" },
                  { title: "Action Plan Checklist", text: "Give me today's action plan.", desc: "Critical tasks and interventions" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.text)}
                    className="p-4 bg-gray-50/50 hover:bg-teal-50/30 border border-gray-200 hover:border-teal-300 text-left rounded-2xl transition-all cursor-pointer shadow-xs group hover:scale-[1.01] active:scale-[0.99] duration-150 flex flex-col justify-between min-h-[85px]"
                  >
                    <span className="text-xs font-bold text-gray-800 group-hover:text-teal-700 transition-colors block">{item.title}</span>
                    <span className="text-[10px] text-gray-400 block mt-1 leading-normal font-sans">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3.5 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-150 flex items-center justify-center text-teal-700 shrink-0 shadow-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-1 max-w-[80%]">
                    <div
                      className={`p-4 rounded-2xl text-xs shadow-sm ${
                        msg.role === "user"
                          ? "bg-teal-700 text-white rounded-tr-none text-left"
                          : "bg-white border border-gray-200 text-gray-800 rounded-tl-none text-left"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="leading-relaxed whitespace-pre-wrap font-sans">{msg.content}</p>
                      ) : (
                        (() => {
                          const type = msg.data?.response_type;
                          if (type === "business_health") {
                            return <AIBusinessHealthCard data={msg.data} onActionClick={handleActionClick} />;
                          } else if (type === "error") {
                            return <AIErrorCard message={msg.data.error_message} />;
                          } else {
                            return <AICopilotMessageCard data={msg.data} onActionClick={handleActionClick} />;
                          }
                        })()
                      )}
                    </div>
                    <span className={`text-[8px] text-gray-400 font-mono px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3.5 items-start justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-150 flex items-center justify-center text-teal-700 shrink-0 shadow-xs animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-2xl rounded-tl-none text-xs text-gray-400 shadow-xs flex items-center gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-teal-700">
                      <span>Analyzing Context</span>
                      <span className="flex gap-1">
                        <span className="w-1 h-1.5 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1 h-1.5 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1 h-1.5 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Suggested Question Chips (Only visible when conversation is active) */}
        {messages.length > 0 && (
          <div className="px-6 py-2 bg-gray-50/40 border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
            {[
              "How is my business doing today?",
              "What is my biggest risk?",
              "Which products need restocking?",
              "Give me today's action plan."
            ].map((chipText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chipText)}
                disabled={isTyping}
                className="px-3 py-1.5 bg-white hover:bg-teal-50/50 border border-gray-200 hover:border-teal-200 text-[10px] font-semibold text-gray-600 hover:text-teal-750 rounded-lg shadow-2xs transition-all shrink-0 cursor-pointer disabled:opacity-50"
              >
                {chipText}
              </button>
            ))}
          </div>
        )}

        {/* Bottom Input area */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-200 flex gap-3 items-center shrink-0">
          <button
            type="button"
            className="p-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-400 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
            title="Attach File"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-1 relative flex items-center bg-white border border-gray-200 rounded-xl focus-within:border-teal-500 transition-colors shadow-xs">
            <textarea
              rows={1}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask about inventory restocking, billing changes, workforce risks, or today's strategic health summary..."
              className="w-full bg-transparent text-xs py-3 px-4 pr-10 text-gray-900 focus:outline-none placeholder-gray-450 resize-none max-h-24 scrollbar-none font-sans"
            />
            <button
              type="button"
              className="absolute right-3 p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-655 rounded-lg transition-colors cursor-pointer"
              title="Voice input"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={isTyping}
            className="p-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl transition-colors cursor-pointer shadow-md shrink-0 flex items-center justify-center disabled:opacity-50"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
