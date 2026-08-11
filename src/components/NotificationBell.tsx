'use client'

import { Bell } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { getUserNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '@/app/actions/notifications'

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchNotifications()
    // Optional: Set up real-time subscription here using Supabase if needed
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    const data = await getUserNotifications()
    setNotifications(data)
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const handleNotificationClick = async (id: string, isRead: boolean) => {
    if (!isRead) {
      await markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }
  }

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead()
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: 40, height: 40, borderRadius: "50%", 
          border: "1.5px solid var(--color-border)", background: "var(--color-bg)", 
          display: "flex", alignItems: "center", justifyContent: "center", 
          cursor: "pointer", color: "var(--color-text)", position: "relative" 
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{ 
            position: "absolute", top: 8, right: 10, width: 10, height: 10, 
            background: "#ef4444", borderRadius: "50%", border: "2px solid var(--color-bg)" 
          }} />
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '120%', left: 0, width: 320, 
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
          zIndex: 100, display: 'flex', flexDirection: 'column', maxHeight: 400
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>الإشعارات</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.8rem', cursor: 'pointer' }}>
                تحديد الكل كمقروء
              </button>
            )}
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                لا توجد إشعارات حالياً
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif.id, notif.is_read)}
                  style={{ 
                    padding: '1rem', borderBottom: '1px solid var(--color-border)', 
                    background: notif.is_read ? 'transparent' : 'var(--primary-50)',
                    cursor: 'pointer', transition: 'background 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-heading)' }}>{notif.title}</strong>
                    {!notif.is_read && <span style={{ width: 8, height: 8, background: 'var(--primary-500)', borderRadius: '50%', flexShrink: 0, marginTop: 4 }} />}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {notif.message}
                  </p>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', marginTop: '0.5rem' }}>
                    {new Date(notif.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
