'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ videoUrl, isOpen, onClose }: VideoModalProps) {
  // Prevent scrolling on body when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // URL Parsing Logic
  let embedUrl = videoUrl;
  let isVideoTag = false;
  let isGoogleDrive = false;

  try {
    const url = new URL(videoUrl);
    
    // YouTube
    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtu.be')) {
      let videoId = '';
      if (url.hostname.includes('youtu.be')) {
        videoId = url.pathname.slice(1);
      } else {
        videoId = url.searchParams.get('v') || '';
      }
      if (videoId) {
        embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      }
    } 
    // Vimeo
    else if (url.hostname.includes('vimeo.com')) {
      const videoId = url.pathname.split('/').pop();
      if (videoId) {
        embedUrl = `https://player.vimeo.com/video/${videoId}`;
      }
    }
    // Google Drive
    else if (url.hostname.includes('drive.google.com')) {
      isGoogleDrive = true;
      // Matches /file/d/ID/view or /file/d/ID
      const match = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
      }
    }
    // Direct Video Link (.mp4, .webm)
    else if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.webm') || videoUrl.endsWith('.ogg')) {
      isVideoTag = true;
    }
  } catch (error) {
    console.error("Invalid video URL", error);
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          aspectRatio: '16/9',
          background: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,0,0,0.8)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
        >
          <X size={20} />
        </button>

        {isVideoTag ? (
          <video 
            src={embedUrl} 
            controls 
            controlsList="nodownload"
            onContextMenu={(e) => e.preventDefault()}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            autoPlay
          />
        ) : (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {isGoogleDrive && (
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '60px',
                  height: '60px',
                  background: 'transparent',
                  zIndex: 5,
                  cursor: 'default'
                }} 
                title="مشاهدة ممتعة"
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ display: 'block', position: 'relative', zIndex: 1 }}
              onContextMenu={(e) => e.preventDefault()}
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
}
