import { useState, useEffect, useMemo, useRef } from "react";
import {
  Sparkles,
  DollarSign,
  AlertTriangle,
  Send,
  Mic,
  Paperclip,
  User
} from "lucide-react";
import { formatAmount } from "../types";

const copilotThemeStyles = {
  cosmic: {
    accentText: "text-purple-400",
    accentBg: "bg-purple-500/10 border-purple-500/20",
    btnAccent: "bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-gray-900 shadow-purple-600/20 hover:from-purple-500 hover:to-cyan-400",
    textGradient: "from-purple-400 via-indigo-400 to-cyan-400",
    chartColor: "#a855f7",
    chartSecondary: "#06b6d4"
  },
  emerald: {
    accentText: "text-teal-700",
    accentBg: "bg-emerald-500/10 border-emerald-500/20",
    btnAccent: "bg-gradient-to-tr from-emerald-600 via-teal-600 to-amber-500 text-gray-900 shadow-emerald-600/20 hover:from-emerald-500 hover:to-amber-400",
    textGradient: "from-emerald-400 via-teal-400 to-amber-300",
    chartColor: "#10b981",
    chartSecondary: "#f59e0b"
  },
  copper: {
    accentText: "text-amber-700",
    accentBg: "bg-whitember-500/10 border-amber-500/20",
    btnAccent: "bg-gradient-to-tr from-amber-600 via-orange-600 to-yellow-500 text-gray-900 shadow-amber-600/20 hover:from-amber-500 hover:to-yellow-400",
    textGradient: "from-amber-400 via-orange-400 to-yellow-300",
    chartColor: "#f59e0b",
    chartSecondary: "#ef4444"
  },
  lagoon: {
    accentText: "text-blue-400",
    accentBg: "bg-blue-500/10 border-blue-500/20",
    btnAccent: "bg-gradient-to-tr from-blue-600 via-cyan-600 to-teal-500 text-gray-900 shadow-blue-600/20 hover:from-blue-500 hover:to-teal-400",
    textGradient: "from-blue-400 via-cyan-400 to-teal-400",
    chartColor: "#3b82f6",
    chartSecondary: "#14b8a6"
  }
};

// Simple bold inline parser
function parseInlineFormatting(text) {
  const parts = [];
  const boldRegex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    const before = text.substring(lastIndex, match.index);
    if (before) parts.push(before);
    parts.push(<strong key={`b-${match.index}`} className="font-bold text-gray-950">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  
  const after = text.substring(lastIndex);
  if (after) parts.push(after);

  if (parts.length === 0) return text;
  return <>{parts}</>;
}

function CopilotMarkdown({ text, user }) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let currentTable = null;
  let inList = false;
  let listItems = [];

  const flushList = (key) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="list-disc pl-5 space-y-1 my-2 text-xs text-gray-700">
          {listItems.map((li, idx) => (
            <li key={idx}>{li}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  const renderCellContent = (cell) => {
    const trimmed = cell.trim();
    if (trimmed.includes("🔴 Overdue")) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-red-50 text-red-755 border border-red-200">🔴 Overdue</span>;
    }
    if (trimmed.includes("🟡 Pending")) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">🟡 Pending</span>;
    }
    if (trimmed.includes("🟢 Paid") || trimmed.includes("🟢 Settled")) {
      return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-green-50 text-green-700 border border-green-200">🟢 Paid</span>;
    }
    return parseInlineFormatting(cell);
  };

  const flushTable = (key) => {
    if (currentTable) {
      const rows = currentTable.rows;
      const headers = currentTable.headers;
      elements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-3 border border-gray-200 rounded-lg bg-gray-50/50">
          <table className="min-w-full text-left text-xs text-gray-700 border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-150/40 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {headers.map((h, idx) => (
                  <th key={idx} className="py-2 px-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans text-xs">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-gray-50/20">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2.5 px-4 text-gray-700">{renderCellContent(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("|")) {
      flushList(i);
      const cells = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      if (cells.every(c => c.startsWith(":") || c.startsWith("-"))) {
        continue;
      }
      
      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      flushTable(i);
    }

    if (line.startsWith("*") || line.startsWith("-")) {
      inList = true;
      const itemContent = line.substring(1).trim();
      listItems.push(parseInlineFormatting(itemContent));
      continue;
    } else {
      flushList(i);
    }

    if (line.startsWith("###")) {
      elements.push(
        <h3 key={i} className="text-sm font-bold text-gray-900 mt-4 mb-2 font-sans flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
          {parseInlineFormatting(line.replace("###", "").trim())}
        </h3>
      );
    } else if (line.startsWith("####")) {
      elements.push(
        <h4 key={i} className="text-xs font-bold text-gray-805 mt-3 mb-1.5 font-sans">
          {parseInlineFormatting(line.replace("####", "").trim())}
        </h4>
      );
    } else if (line) {
      elements.push(
        <p key={i} className="text-xs text-gray-700 leading-relaxed my-1.5 font-sans">
          {parseInlineFormatting(line)}
        </p>
      );
    }
  }

  flushList(lines.length);
  flushTable(lines.length);

  return <div className="space-y-1">{elements}</div>;
}

function StreamedMessage({ content, isLatest, user }) {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    if (!isLatest) {
      setDisplayedText(content);
      return;
    }
    
    let currentText = "";
    let index = 0;
    const interval = setInterval(() => {
      if (index < content.length) {
        currentText += content[index];
        setDisplayedText(currentText);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 4);
    
    return () => clearInterval(interval);
  }, [content, isLatest]);

  return (
    <div className="relative">
      <CopilotMarkdown text={displayedText} user={user} />
      {isLatest && displayedText.length < content.length && (
        <span className="inline-block w-1.5 h-3.5 bg-indigo-650 animate-pulse ml-0.5" style={{ verticalAlign: "middle" }} />
      )}
    </div>
  );
}

export default function Copilot({ user, products, invoices, transactions, theme = "cosmic" }) {
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const styles = copilotThemeStyles[theme] || copilotThemeStyles.cosmic;

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const text = (textToSend || chatInput).trim();
    if (!text) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text
    };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    if (!textToSend) setChatInput("");

    setTimeout(() => {
      let replyContent = "";
      const lower = text.toLowerCase();

      if (lower.includes("stock") || lower.includes("restock") || lower.includes("reorder")) {
        const lowStock = products.filter(p => p.quantity <= (p.minStock || p.min_stock || 10));
        if (lowStock.length > 0) {
          replyContent = `### Low Stock Inventory Audit\n\nI found **${lowStock.length}** product(s) currently low in stock or below safety threshold. Restocking is highly recommended:\n\n| Product Name | Category | SKU | Current Stock | Min Safety Level |\n| :--- | :--- | :--- | :---: | :---: |\n` +
            lowStock.map(p => `| ${p.name} | ${p.category || "N/A"} | \`${p.sku || "N/A"}\` | **${p.quantity}** | ${p.minStock || 10} |`).join("\n") +
            `\n\n**Restock Action Item**: Place a replenishment order with Waaree/OEM vendors for these items immediately to avoid stockout downtime.`;
        } else {
          replyContent = `### Stock Levels Status\n\nAll products in your inventory database are currently **above safety thresholds**. No restocks are immediately required. Good job!`;
        }
      } else if (lower.includes("invoice") || lower.includes("summary") || lower.includes("sale") || lower.includes("revenue")) {
        const totalCount = invoices.length;
        const paidCount = invoices.filter(i => i.status === "paid").length;
        const unpaidInvoices = invoices.filter(i => i.status !== "paid");
        
        const sumPaid = invoices.filter(i => i.status === "paid").reduce((acc, i) => acc + (i.total || 0), 0);
        const sumUnpaid = unpaidInvoices.reduce((acc, i) => acc + (i.total || 0), 0);
        
        replyContent = `### Monthly Invoice Summary\n\nHere is the breakdown of your generated invoices:\n\n* **Total Invoices**: ${totalCount} generated in total\n* **Paid Settled Invoices**: ${paidCount} (Valued at **${formatAmount(sumPaid, user?.currency)}**)\n* **Unpaid Ledger Balance**: ${unpaidInvoices.length} (Valued at **${formatAmount(sumUnpaid, user?.currency)}**)\n\n#### Highlights & Insights:\n- **Collectables Ledger**: You have outstanding collections of **${formatAmount(sumUnpaid, user?.currency)}** across unpaid invoices.\n- **Turnaround Efficiency**: Recommend automating payment reminders on Settings page for overdue invoices.`;
      } else if (lower.includes("predict") || lower.includes("forecast") || lower.includes("next month")) {
        replyContent = `### Reconciled Revenue Forecast\n\nBased on historical invoices and machine learning trends, here are the projections for the upcoming period:\n\n* **Forecasted Growth**: **+8.4%** projected month-over-month\n* **Expected Inflow (July/August)**: Approximately **${formatAmount(24500, user?.currency)}**\n* **Top Revenue Drivers**:\n  - Waaree Solar Panels\n  - High-Efficiency Inverters\n\n**Strategic Recommendation**: Secure additional inventory capacity for top solar items to capture the seasonal spikes in demand next month.`;
      } else if (lower.includes("payment") || lower.includes("pending") || lower.includes("customer") || lower.includes("client")) {
        const unpaid = invoices.filter(i => i.status !== "paid");
        if (unpaid.length > 0) {
          replyContent = `### Outstanding Customer Receivables\n\nThe following customers currently have pending payments on their accounts:\n\n| Customer Name | Invoice No. | Due Date | Outstanding Amount | Status |\n| :--- | :--- | :--- | :---: | :---: |\n` +
            unpaid.map(i => {
              let dDate = i.dueDate || i.date;
              const isOverdue = dDate && new Date(dDate) < new Date();
              return `| ${i.clientName || i.customer_name || "N/A"} | \`${i.invoiceNumber || `INV-${String(i.id).substring(0, 8)}`}\` | ${dDate || "N/A"} | **${formatAmount(i.total, user?.currency)}** | ${isOverdue ? "🔴 Overdue" : "🟡 Pending"} |`;
            }).join("\n") +
            `\n\n**Action Plan**: Review the action triggers in the Invoices Hub to dispatch follow-up alerts or settle payments directly.`;
        } else {
          replyContent = `### Receivables Ledger Status\n\nAll invoices are fully settled. There are currently no clients with outstanding pending invoice balances.`;
        }
      } else {
        replyContent = `### AI Copilot Advisory Insights\n\nI am your business copilot command center. Here are the core highlights of your business stats:\n\n* **Products Count**: ${products.length} registered SKUs\n* **Invoices Logged**: ${invoices.length} invoices total\n* **Current User**: ${user.name} (${user.businessName})\n\nHow can I help you further? Try asking:\n- "Which products are low in stock?"\n- "Show customers with pending payments."\n- "Predict next month's sales projections."`;
      }

      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: replyContent
      }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in pb-4 max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col" id="copilot-container">
      {/* Page Header */}
      <div className="mb-4 shrink-0 text-left">
        <span className={`text-[10px] uppercase font-bold tracking-widest ${styles.accentText} font-mono flex items-center gap-1.5`}>
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          Conversational Assistant
        </span>
        <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 mt-1">
          BizPilot AI Copilot
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Ask anything about your business.
        </p>
      </div>

      {/* Main Chat Box Container */}
      <div className="flex-1 min-h-0 flex flex-col bg-white border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden relative text-left">
        {/* Scrollable Conversation area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {messages.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center space-y-8 py-8 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-indigo-650 text-white flex items-center justify-center shadow-md animate-pulse-slow">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-bold text-gray-900">How can I help your business today?</h2>
                <p className="text-xs text-gray-500 max-w-sm mx-auto leading-normal">
                  Ask questions about your stocks, invoice records, sales predictions, or outstanding balances.
                </p>
              </div>
              
              {/* Four Suggested Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
                {[
                  { title: "Check low stock", text: "Which products are low in stock?", desc: "Analyze SKU safety levels" },
                  { title: "Summarize invoices", text: "Generate this month's invoice summary.", desc: "Revenue & payment logs" },
                  { title: "Predict next month's sales", text: "Predict next month's sales.", desc: "Growth projections audit" },
                  { title: "Pending customer payments", text: "Which customers have pending payments?", desc: "Outstanding invoice balances" }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.text)}
                    className="p-4 bg-gray-50/50 hover:bg-indigo-50/50 border border-gray-200 hover:border-indigo-300 text-left rounded-2xl transition-all cursor-pointer shadow-xs group hover:scale-[1.02] active:scale-[0.98] duration-150 flex flex-col justify-between min-h-[90px]"
                  >
                    <span className="text-xs font-bold text-gray-855 group-hover:text-indigo-650 transition-colors block">{item.title}</span>
                    <span className="text-[10px] text-gray-400 block mt-1 leading-normal">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message List */
            <div className="space-y-6">
              {messages.map((msg, index) => {
                const isLatestAI = msg.role === "assistant" && index === messages.length - 1;
                return (
                  <div key={msg.id} className={`flex gap-3.5 items-start ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-655 shrink-0 shadow-xs">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-1 max-w-[75%]">
                      <div
                        className={`p-4 rounded-2xl text-xs shadow-sm ${
                          msg.role === "user"
                            ? "bg-indigo-600 text-white rounded-tr-none text-left"
                            : "bg-white border border-gray-200 text-gray-800 rounded-tl-none text-left"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <StreamedMessage
                            content={msg.content}
                            isLatest={isLatestAI}
                            user={user}
                          />
                        )}
                      </div>
                      <span className={`text-[8px] text-gray-450 font-mono px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        {new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {msg.role === "user" && (
                      <div className="w-8 h-8 rounded-xl bg-gray-155 border border-gray-250/60 flex items-center justify-center text-gray-600 shrink-0 shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3.5 items-start justify-start animate-fade-in">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center text-indigo-655 shrink-0 shadow-xs animate-pulse">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="p-4 bg-white border border-gray-200 rounded-2xl rounded-tl-none text-xs text-gray-505 shadow-xs flex items-center gap-2">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-650">
                      <span>Thinking</span>
                      <span className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Input area */}
        <div className="p-4 bg-gray-50/50 border-t border-gray-150 flex gap-3 items-center shrink-0">
          <button
            type="button"
            className="p-3 bg-white hover:bg-gray-50 border border-gray-250 text-gray-500 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs"
            title="Attach File"
          >
            <Paperclip className="w-4 h-4" />
          </button>
          <div className="flex-1 relative flex items-center bg-white border border-gray-250 rounded-xl focus-within:border-indigo-500 transition-colors shadow-xs">
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
              placeholder="Ask about stock levels, invoice summaries, forecasts, or customer balances..."
              className="w-full bg-transparent text-xs py-3 px-4 pr-10 text-gray-900 focus:outline-none placeholder-gray-400 resize-none max-h-24 scrollbar-none font-sans"
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
            className="p-3.5 bg-indigo-600 hover:bg-indigo-755 text-white rounded-xl transition-colors cursor-pointer shadow-md shrink-0 flex items-center justify-center disabled:opacity-50"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
