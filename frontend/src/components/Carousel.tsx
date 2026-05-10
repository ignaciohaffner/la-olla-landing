import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselImage {
  src: string
  alt: string
}

interface CarouselProps {
  images: CarouselImage[]
  autoAdvanceMs?: number
  aspectRatio?: string
}

export default function Carousel({ images, autoAdvanceMs = 5000, aspectRatio = '4/3' }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    const timer = setInterval(next, autoAdvanceMs)
    return () => clearInterval(timer)
  }, [next, autoAdvanceMs])

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio }}>
      {images.map((image, idx) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Prev / Next buttons */}
      <button
        onClick={prev}
        aria-label="Imagen anterior"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente imagen"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Ir a imagen ${idx + 1}`}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center p-0`}
          >
            <span
              className={`block h-2 w-2 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
