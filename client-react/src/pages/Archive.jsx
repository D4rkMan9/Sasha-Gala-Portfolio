import { useEffect, useState, useRef } from 'react'
import './Home.css' // Reutilizamos el estilo
import './Archive.css' // Reutilizamos el estilo
import useWindowWidth from '../componentes/useWindowWidth';
import { Header } from '../componentes/Header'

export function Archive() {
  const [archiveImages, setArchiveImages] = useState([])
  const imagesTransform = useRef(0)
  const targetImagesTransform = useRef(0)
  const userDraggingImages = useRef(false)
  const imagesDragTimeout = useRef(null)
  const imagesContainerRef = useRef(null)
  const screenWidth = useWindowWidth();

  useEffect(() => {
    fetch('/api/archive', { headers: { 'ngrok-skip-browser-warning': 'true' } })
      .then((res) => res.json())
      .then((data) => {
        if (data.images) {
          setArchiveImages(data.images)
        }
      })
      .catch((error) => console.error('Error fetching archive:', error))
  }, [])

  useEffect(() => {
    if (!imagesContainerRef.current || archiveImages.length === 0) return

    const container = imagesContainerRef.current
    const isVertical = screenWidth <= 1157
    let animationId = null
    let lastTime = Date.now()

    // Arrancar con offset para que no se vea el borde izquierdo de la primera imagen
    requestAnimationFrame(() => {
      const firstImg = container.querySelector('img')
      if (firstImg) {
        const itemSize = isVertical ? firstImg.offsetHeight : firstImg.offsetWidth
        const offset = -(itemSize * 0.4)
        imagesTransform.current = offset
        targetImagesTransform.current = offset
      }
    })

    const animate = () => {
      const now = Date.now()
      const delta = now - lastTime
      lastTime = now

      if (!userDraggingImages.current) {
        const speed = 30
        const movement = (speed * delta) / 1000
        targetImagesTransform.current -= movement
        imagesTransform.current += (targetImagesTransform.current - imagesTransform.current) * 0.1;
      } else {
        targetImagesTransform.current = imagesTransform.current;
      }

      const firstImg = container.querySelector('img')
      if (firstImg) {
        const itemSize = isVertical ? firstImg.offsetHeight : firstImg.offsetWidth
        const totalSize = itemSize * archiveImages.length

        if (imagesTransform.current <= -totalSize) {
          imagesTransform.current += totalSize
          targetImagesTransform.current += totalSize
        }
        if (imagesTransform.current > 0) {
          imagesTransform.current -= totalSize
          targetImagesTransform.current -= totalSize
        }
      }

      if (isVertical) {
        container.style.transform = `translateY(${imagesTransform.current}px)`
      } else {
        container.style.transform = `translateX(${imagesTransform.current}px)`
      }

      animationId = requestAnimationFrame(animate)
    }

    const handleWheel = (e) => {
      e.preventDefault()
      userDraggingImages.current = true
      const delta = isVertical ? e.deltaY : (e.deltaX || e.deltaY)
      targetImagesTransform.current -= delta
      imagesTransform.current = targetImagesTransform.current;

      clearTimeout(imagesDragTimeout.current)
      imagesDragTimeout.current = setTimeout(() => {
        userDraggingImages.current = false
      }, 2000)
    }

    animate()

    const display = container.closest('.displaywork')
    if (display) {
      display.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (display) {
        display.removeEventListener('wheel', handleWheel)
      }
    }
  }, [archiveImages, screenWidth])

  return (
    <>
      <div className="workbanner">
        <Header />
      </div>
      
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="containerwork" style={{ width: '100%', height: '100%' }}>
          <div className="displaywork" style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
            <div className="carrousel" ref={imagesContainerRef} style={{ display: 'flex' }}>
              {/* Renderizar 3 copias para scroll infinito */}
              {[...archiveImages, ...archiveImages, ...archiveImages].map((image, index) => (
                <img 
                  src={image.img_route}
                  alt={image.img_alt || "Archived image"} 
                  key={`archive-${index}`}
                  style={{ height: '100%', objectFit: 'cover' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}