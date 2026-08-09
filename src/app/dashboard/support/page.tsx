'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Video, Play, CheckCircle, Lock, Clock, Search, ChevronDown, ChevronUp, ChevronRight, BarChart2, FileText, AlertTriangle, MessageCircle, Settings, LogOut, Menu, X, BookOpen, Send, Plus } from "lucide-react";
import { getStudentTickets, getTicketMessages, createTicket, addMessageToTicket } from "@/app/actions/support";
import { getUserProfile, logout } from "@/app/actions/auth";

export default function SupportPage() {
  const [studentId, setStudentId] = useState<string>("");
  
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  const [showNewModal, setShowNewModal] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newMessageBody, setNewMessageBody] = useState("");
  
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadTickets = async () => {
    const data = await getStudentTickets();
    setTickets(data);
  };

  useEffect(() => {
    getUserProfile().then(profile => {
      if(profile) {
        setStudentId(profile.id);
      }
    });
    loadTickets();
  }, []);

  const selectTicket = async (ticket: any) => {
    setSelectedTicket(ticket);
    const msgs = await getTicketMessages(ticket.id);
    setMessages(msgs);
    setTimeout(() => scrollToBottom(), 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessageBody.trim()) return;
    const res = await createTicket(newSubject, newMessageBody);
    if (res.success) {
      setShowNewModal(false);
      setNewSubject("");
      setNewMessageBody("");
      await loadTickets();
      selectTicket(res.ticket);
    } else {
      alert(res.error);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    
    // Optimistic UI update
    const optimisticMsg = {
      id: Math.random().toString(),
      sender_id: studentId,
      message: replyText,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setReplyText("");
    setTimeout(() => scrollToBottom(), 50);

    await addMessageToTicket(selectedTicket.id, optimisticMsg.message);
    const msgs = await getTicketMessages(selectedTicket.id);
    setMessages(msgs);
    loadTickets();
  };

  return (
    <>
        <main style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
          
          {/* Tickets List */}
          <div style={{ width: selectedTicket ? "100%" : "100%", maxWidth: selectedTicket ? 350 : "100%", borderInlineEnd: "1px solid var(--color-border)", background: "var(--color-surface)", display: selectedTicket ? "none" : "flex", flexDirection: "column", transition: "all 0.3s ease" }} className="chat-list-container">
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--color-border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.25rem", color: "var(--color-heading)" }}>💬 الدعم العلمي</h1>
                <button onClick={() => setShowNewModal(true)} className="btn btn-primary" style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-full)", fontSize: "0.85rem" }}>
                  <Plus size={16} /> تذكرة جديدة
                </button>
              </div>
              <p style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>تواصل مع المعلم لطرح أسئلتك الأكاديمية أو الإبلاغ عن مشكلة.</p>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
              {tickets.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
                  <MessageCircle size={48} color="var(--color-border-strong)" style={{ margin: "0 auto 1rem" }} />
                  <p>لا توجد تذاكر دعم مسجلة لك.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {tickets.map(ticket => (
                    <button 
                      key={ticket.id} 
                      onClick={() => selectTicket(ticket)}
                      style={{ 
                        textAlign: "start", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid", 
                        borderColor: selectedTicket?.id === ticket.id ? "var(--primary-500)" : "var(--color-border)",
                        background: selectedTicket?.id === ticket.id ? "var(--primary-50)" : "var(--color-bg)",
                        cursor: "pointer", transition: "all 0.2s ease", display: "flex", flexDirection: "column", gap: "0.5rem"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "flex-start", gap: "0.5rem" }}>
                        <h4 style={{ fontWeight: 700, color: "var(--color-heading)", fontSize: "0.95rem", lineHeight: 1.4, margin: 0 }}>
                          {ticket.subject}
                        </h4>
                        <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", borderRadius: "var(--radius-full)", fontWeight: 700, background: ticket.status === 'open' ? "#fef3c7" : "#f1f5f9", color: ticket.status === 'open' ? "#b45309" : "#64748b" }}>
                          {ticket.status === 'open' ? 'مفتوح' : 'مغلق'}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {new Date(ticket.updated_at).toLocaleDateString('ar-EG')} - {new Date(ticket.updated_at).toLocaleTimeString('ar-EG', {hour: '2-digit', minute:'2-digit'})}
                      </span>
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
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>رقم التذكرة: {selectedTicket.id.slice(0,8)}</span>
                </div>
                <span style={{ fontSize: "0.8rem", padding: "0.3rem 0.8rem", borderRadius: "var(--radius-full)", fontWeight: 700, background: selectedTicket.status === 'open' ? "#fef3c7" : "#f1f5f9", color: selectedTicket.status === 'open' ? "#b45309" : "#64748b" }}>
                  {selectedTicket.status === 'open' ? 'مفتوح' : 'مغلق'}
                </span>
              </div>
              
              <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.map(msg => {
                  const isMine = msg.sender_id === studentId;
                  return (
                    <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
                      <div style={{ 
                        background: isMine ? "var(--primary-600)" : "var(--color-surface)", 
                        color: isMine ? "white" : "var(--color-text)",
                        padding: "1rem", borderRadius: "var(--radius-lg)", border: isMine ? "none" : "1px solid var(--color-border)",
                        maxWidth: "85%", boxShadow: "var(--shadow-sm)",
                        borderBottomRightRadius: !isMine ? 0 : "var(--radius-lg)",
                        borderBottomLeftRadius: isMine ? 0 : "var(--radius-lg)"
                      }}>
                        {!isMine && msg.profiles && (
                          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary-600)", marginBottom: "0.25rem" }}>
                            {msg.profiles.role === 'admin' ? 'الإدارة' : msg.profiles.role === 'teacher' ? 'المعلم' : msg.profiles.full_name}
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
                      placeholder="اكتب رسالتك هنا..." 
                      style={{ flex: 1, borderRadius: "var(--radius-full)", padding: "0.75rem 1.25rem" }} 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                    />
                    <button type="submit" disabled={!replyText.trim()} className="btn btn-primary" style={{ width: 44, height: 44, borderRadius: "50%", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Send size={18} style={{ transform: "translateX(-2px)" }} />
                    </button>
                  </form>
                </div>
              ) : (
                <div style={{ padding: "1rem", background: "var(--color-surface)", borderTop: "1px solid var(--color-border)", textAlign: "center", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                  هذه التذكرة مغلقة ولا يمكن الرد عليها.
                </div>
              )}
            </div>
          )}
        </main>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: '1rem' }}>
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 500, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 800, fontSize: '1.2rem' }}>إنشاء تذكرة دعم جديدة</h3>
              <button onClick={() => setShowNewModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">الموضوع</label>
                <input type="text" className="form-input" value={newSubject} onChange={e => setNewSubject(e.target.value)} required placeholder="مثال: استفسار بخصوص الدرس الثاني" />
              </div>
              <div className="form-group">
                <label className="form-label">الرسالة</label>
                <textarea className="form-input" value={newMessageBody} onChange={e => setNewMessageBody(e.target.value)} rows={4} required placeholder="اكتب سؤالك أو مشكلتك هنا بالتفصيل..." />
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>إرسال التذكرة</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
