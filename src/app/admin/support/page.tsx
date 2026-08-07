'use client';

import { useState, useEffect, useRef } from "react";
import { MessageCircle, Search, CheckCircle, Send, X, ChevronRight, AlertTriangle } from "lucide-react";
import { getAllTickets, getTicketMessages, addMessageToTicket, closeTicket } from "@/app/actions/support";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [replyText, setReplyText] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadTickets = async () => {
    const data = await getAllTickets();
    setTickets(data);
    filterTickets(data, search, statusFilter);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filterTickets = (data: any[], query: string, status: string) => {
    let filtered = data;
    if (status !== 'all') {
      filtered = filtered.filter(t => t.status === status);
    }
    if (query) {
      filtered = filtered.filter(t => 
        t.subject.includes(query) || 
        (t.profiles && t.profiles.full_name && t.profiles.full_name.includes(query))
      );
    }
    setFilteredTickets(filtered);
  };

  useEffect(() => {
    filterTickets(tickets, search, statusFilter);
  }, [search, statusFilter, tickets]);

  const selectTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    const msgs = await getTicketMessages(ticket.id);
    setMessages(msgs);
    setTimeout(() => scrollToBottom(), 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    
    const optimisticMsg = {
      id: Math.random().toString(),
      sender_id: 'admin', // placeholder
      message: replyText,
      created_at: new Date().toISOString(),
      profiles: { role: 'admin' }
    };
    
    setMessages(prev => [...prev, optimisticMsg]);
    setReplyText("");
    setTimeout(() => scrollToBottom(), 50);

    await addMessageToTicket(selectedTicket.id, optimisticMsg.message);
    const msgs = await getTicketMessages(selectedTicket.id);
    setMessages(msgs);
    loadTickets(); // Refresh list to update latest interaction
  };

  const handleCloseTicket = async () => {
    if (!selectedTicket || !confirm("هل أنت متأكد من إغلاق هذه التذكرة؟ لا يمكن للطالب الرد عليها بعد الإغلاق.")) return;
    
    const res = await closeTicket(selectedTicket.id);
    if (res.success) {
      setSelectedTicket({ ...selectedTicket, status: 'closed' });
      loadTickets();
    } else {
      alert(res.error);
    }
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 120px)", background: "var(--color-surface)", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
      
      {/* Tickets List */}
      <div style={{ width: selectedTicket ? "100%" : "100%", maxWidth: selectedTicket ? 350 : "100%", borderInlineEnd: "1px solid var(--color-border)", display: selectedTicket ? "none" : "flex", flexDirection: "column", transition: "all 0.3s ease" }} className="chat-list-container">
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", color: "var(--color-heading)" }}>💬 تذاكر الدعم العلمي</h1>
          </div>
          
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <Search size={16} style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", insetInlineStart: "0.9rem", color: "var(--color-text-muted)" }} />
            <input type="text" className="form-input" placeholder="ابحث باسم الطالب أو الموضوع..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingInlineStart: "2.5rem" }} />
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => setStatusFilter('all')} style={{ flex: 1, padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: statusFilter === 'all' ? "var(--primary-50)" : "transparent", color: statusFilter === 'all' ? "var(--primary-600)" : "inherit", fontWeight: statusFilter === 'all' ? 700 : 500, fontSize: "0.85rem", cursor: "pointer" }}>الكل</button>
            <button onClick={() => setStatusFilter('open')} style={{ flex: 1, padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: statusFilter === 'open' ? "#fef3c7" : "transparent", color: statusFilter === 'open' ? "#b45309" : "inherit", fontWeight: statusFilter === 'open' ? 700 : 500, fontSize: "0.85rem", cursor: "pointer" }}>مفتوح</button>
            <button onClick={() => setStatusFilter('closed')} style={{ flex: 1, padding: "0.5rem", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)", background: statusFilter === 'closed' ? "#f1f5f9" : "transparent", color: statusFilter === 'closed' ? "#64748b" : "inherit", fontWeight: statusFilter === 'closed' ? 700 : 500, fontSize: "0.85rem", cursor: "pointer" }}>مغلق</button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
          {filteredTickets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
              <MessageCircle size={48} color="var(--color-border-strong)" style={{ margin: "0 auto 1rem" }} />
              <p>لا توجد تذاكر تطابق بحثك.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {filteredTickets.map(ticket => (
                <button 
                  key={ticket.id} 
                  onClick={() => selectTicket(ticket)}
                  style={{ 
                    textAlign: "start", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid", 
                    borderColor: selectedTicket?.id === ticket.id ? "var(--primary-500)" : "transparent",
                    background: selectedTicket?.id === ticket.id ? "var(--primary-50)" : "transparent",
                    cursor: "pointer", transition: "all 0.2s ease", display: "flex", flexDirection: "column", gap: "0.5rem"
                  }}
                  className="hover-card"
                >
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start", gap: "0.5rem" }}>
                    <h4 style={{ fontWeight: 700, color: "var(--color-heading)", fontSize: "0.95rem", lineHeight: 1.4, margin: 0 }}>
                      {ticket.subject}
                    </h4>
                    <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-full)", fontWeight: 700, background: ticket.status === 'open' ? "#fef3c7" : "#f1f5f9", color: ticket.status === 'open' ? "#b45309" : "#64748b", flexShrink: 0 }}>
                      {ticket.status === 'open' ? 'مفتوح' : 'مغلق'}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--primary-600)", fontWeight: 600 }}>
                      👤 {ticket.profiles?.full_name || 'طالب مجهول'}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                      {new Date(ticket.updated_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedTicket && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--color-bg)", height: "100%" }} className="chat-area-container">
          <div style={{ padding: "1rem 1.5rem", background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "1rem" }}>
            <button onClick={() => setSelectedTicket(null)} className="btn btn-ghost mob-back-btn" style={{ padding: "0.5rem", borderRadius: "50%" }}>
              <ChevronRight size={20} />
            </button>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 800, color: "var(--color-heading)", fontSize: "1.1rem" }}>{selectedTicket.subject}</h3>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                الطالب: <strong style={{ color: "var(--primary-600)" }}>{selectedTicket.profiles?.full_name}</strong> - 
                الصف: {selectedTicket.profiles?.grade} ({selectedTicket.profiles?.section})
              </span>
            </div>
            
            {selectedTicket.status === 'open' && (
              <button onClick={handleCloseTicket} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#ef4444", borderColor: "#ef4444", padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
                <CheckCircle size={16} /> إغلاق التذكرة
              </button>
            )}
          </div>
          
          <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            {messages.map(msg => {
              const isAdmin = msg.profiles?.role === 'admin' || msg.profiles?.role === 'teacher';
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isAdmin ? "flex-end" : "flex-start" }}>
                  <div style={{ 
                    background: isAdmin ? "var(--primary-600)" : "var(--color-surface)", 
                    color: isAdmin ? "white" : "var(--color-text)",
                    padding: "1rem", borderRadius: "var(--radius-lg)", border: isAdmin ? "none" : "1px solid var(--color-border)",
                    maxWidth: "85%", boxShadow: "var(--shadow-sm)",
                    borderBottomInlineStartRadius: !isAdmin ? 0 : "var(--radius-lg)",
                    borderBottomInlineEndRadius: isAdmin ? 0 : "var(--radius-lg)"
                  }}>
                    {!isAdmin && (
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-600)", marginBottom: "0.25rem" }}>
                        {selectedTicket.profiles?.full_name}
                      </div>
                    )}
                    <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: "0.95rem" }}>
                      {msg.message}
                    </p>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: "0.25rem", marginInlineStart: "0.5rem", marginInlineEnd: "0.5rem" }}>
                    {new Date(msg.created_at).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {selectedTicket.status === 'open' ? (
            <div style={{ padding: "1rem", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)" }}>
              <form onSubmit={handleReply} style={{ display: "flex", gap: "0.5rem" }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="اكتب ردك للطالب هنا..." 
                  style={{ flex: 1, borderRadius: "var(--radius-full)", padding: "0.75rem 1.25rem" }} 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ width: 44, height: 44, padding: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Send size={18} />
                </button>
              </form>
            </div>
          ) : (
            <div style={{ padding: "1rem", background: "#f1f5f9", borderTop: "1px solid var(--color-border)", textAlign: "center", color: "#64748b", fontSize: "0.9rem", fontWeight: 700 }}>
              هذه التذكرة مغلقة.
            </div>
          )}
        </div>
      )}

      {!selectedTicket && (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", color: "var(--color-text-muted)" }} className="chat-area-container">
          <MessageCircle size={64} color="var(--color-border-strong)" />
          <h3>اختر تذكرة لعرض المحادثة والرد عليها</h3>
        </div>
      )}

      <style>{`
        .mob-back-btn { display: flex !important; }
        .hover-card:hover { background: var(--color-bg) !important; }
        
        @media (min-width: 900px) {
          .chat-list-container { display: flex !important; max-width: 350px !important; }
          .chat-area-container { display: flex !important; }
          .mob-back-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}
