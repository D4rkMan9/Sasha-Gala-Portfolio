import { useEffect } from 'react'
import './ImageViewer.css'

export function ImageViewer({ src, onClose }) {
 useEffect(() => {
  const handleKey = (e) => {
   if (e.key === 'Escape') onClose()
  }
  document.addEventListener('keydown', handleKey)
  document.body.style.overflow = 'hidden'
  return () => {
   document.removeEventListener('keydown', handleKey)
   document.body.style.overflow = ''
  }
 }, [onClose])

 return (
  <div className="viewer-overlay" onClick={onClose}>
   <button className="viewer-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
   <img
    className="viewer-image"
    src={src}
    alt=""
    onClick={(e) => e.stopPropagation()}
   />
  </div>
 )
}
