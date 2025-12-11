import { useState, useEffect } from "react";
import { MapPin, Phone, Calendar, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface GalleryImage {
  url: string;
  title?: string;
  description?: string;
}

interface PublicHeroProps {
  title: string;
  description: string;
  logo: string | null;
  galleryImages: GalleryImage[];
  specialties: { id: string; name: string; icon: string }[];
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  phone: string;
  primaryColor: string;
  isBookingEnabled: boolean;
}

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

export const PublicHero = ({
  title,
  description,
  logo,
  galleryImages,
  specialties,
  address,
  phone,
  primaryColor,
  isBookingEnabled,
}: PublicHeroProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const fullAddress = `${address.street}, ${address.number} - ${address.neighborhood}, ${address.city} - ${address.state}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  // Auto-slide effect
  useEffect(() => {
    if (galleryImages.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
        setIsTransitioning(false);
      }, 300);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, [galleryImages.length]);

  const currentImage = galleryImages[currentImageIndex];

  const nextImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevImage = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToImage = (index: number) => {
    if (index === currentImageIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentImageIndex(index);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div className="relative">
      {/* Gallery Carousel */}
      <div className="h-[50vh] min-h-[400px] relative group overflow-hidden">
        {galleryImages.length > 0 ? (
          <>
            <img 
              src={currentImage.url} 
              alt={currentImage.title || "Gallery"} 
              className={`w-full h-full object-cover transition-all duration-500 ${
                isTransitioning ? "opacity-0 scale-105" : "opacity-100 scale-100"
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
            
            {/* Image Title/Description Overlay */}
            {(currentImage.title || currentImage.description) && (
              <div 
                className={`absolute top-6 left-6 max-w-md transition-all duration-500 ${
                  isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
                }`}
              >
                <div className="bg-background/70 backdrop-blur-md rounded-xl px-4 py-3 border border-border/50">
                  {currentImage.title && (
                    <h3 className="text-sm md:text-base font-semibold text-foreground">
                      {currentImage.title}
                    </h3>
                  )}
                  {currentImage.description && (
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                      {currentImage.description}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Navigation arrows */}
            {galleryImages.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5 text-foreground" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg"
                >
                  <ChevronRight className="h-5 w-5 text-foreground" />
                </button>

                {/* Dots indicator with progress */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
                  {galleryImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? "bg-white w-8" 
                          : "bg-white/50 hover:bg-white/70 w-2"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(135deg, ${primaryColor}20 0%, ${primaryColor}40 100%)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8">
          {/* Logo + Title + Description Row */}
          <div className="flex gap-4 md:gap-6 mb-6">
            {/* Logo */}
            {logo ? (
              <img 
                src={logo} 
                alt="Logo" 
                className="h-16 w-16 md:h-20 md:w-20 rounded-xl object-cover flex-shrink-0 shadow-md"
              />
            ) : (
              <div 
                className="h-16 w-16 md:h-20 md:w-20 rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold text-white flex-shrink-0 shadow-md"
                style={{ backgroundColor: primaryColor }}
              >
                {title.charAt(0)}
              </div>
            )}

            {/* Title + Description */}
            <div className="min-w-0 flex-1">
              {/* Specialties Chips */}
              <div className="flex flex-wrap gap-2 mb-3">
                {specialties.slice(0, 4).map((specialty) => (
                  <Badge 
                    key={specialty.id} 
                    variant="secondary"
                    className="text-xs font-medium"
                  >
                    {specialty.icon} {specialty.name}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {title}
              </h1>

              {/* Description */}
              <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                {description}
              </p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{fullAddress}</span>
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
            
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{phone}</span>
            </a>
          </div>

          {/* CTA */}
          {isBookingEnabled && (
            <Button 
              size="lg" 
              className="gap-2 text-base"
              style={{ backgroundColor: primaryColor }}
            >
              <Calendar className="h-5 w-5" />
              Agendar agora
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
