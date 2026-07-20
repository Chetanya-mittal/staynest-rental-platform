import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageGalleryProps {
  images: string[]
  title: string
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  const displayImages =
    images.length > 0 ? images : ["https://placehold.co/400x300?text=No+Image"]
  const [activeImage, setActiveImage] = useState(0)
  const hasMultiple = displayImages.length > 1

  const goPrev = useCallback(() => {
    setActiveImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))
  }, [displayImages.length])

  const goNext = useCallback(() => {
    setActiveImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))
  }, [displayImages.length])

  useEffect(() => {
    if (!hasMultiple) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [hasMultiple, goPrev, goNext])

  return (
    <div className="w-full">
      <div className="relative flex w-full justify-center overflow-hidden rounded-lg bg-muted">
        {/* blurred background fill */}
        <img
          src={displayImages[activeImage]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-3xl"
        />

        {/* glass overlay tint */}
        <div className="absolute inset-0 bg-background/10 backdrop-blur-2xl" />

        {/* actual image */}
        <img
          src={displayImages[activeImage]}
          alt={title}
          className="relative h-auto max-h-[70vh] w-full rounded-lg object-contain shadow-2xl ring-1 ring-border transition-opacity duration-300"
        />

        {hasMultiple && (
          <>
            {/* prev button */}
            <Button
              onClick={goPrev}
              size="icon"
              variant="ghost"
              aria-label="Previous image"
              className="absolute left-3 top-1/2 h-10 w-10 rounded-full bg-background/10 backdrop-blur-md ring-1 ring-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* next button */}
            <Button
              onClick={goNext}
              size="icon"
              variant="ghost"
              aria-label="Next image"
              className="absolute right-3 top-1/2 h-10 w-10 rounded-full bg-background/10 backdrop-blur-md ring-1 ring-border text-foreground hover:bg-accent hover:text-accent-foreground shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            {/* image counter */}
            <div className="absolute bottom-3 right-3 rounded-full bg-background/10 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-foreground ring-1 ring-border">
              {activeImage + 1} / {displayImages.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
