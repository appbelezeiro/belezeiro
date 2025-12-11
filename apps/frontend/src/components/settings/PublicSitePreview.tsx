import { useState } from "react";
import { MapPin, Phone, Clock, Wifi, Car, Coffee, Instagram, Facebook, MessageCircle, Globe, ChevronLeft, ChevronRight } from "lucide-react";

interface PublicSitePreviewProps {
  isEnabled: boolean;
  isBookingEnabled: boolean;
  title: string;
  description: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
    website?: string;
  };
}

// Mock gallery images (from "Meu Negócio")
const mockGalleryImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80",
];

// Mock logo (from "Meu Negócio")
const mockLogo: string | null = null;

// Primary color (from "Meu Negócio")
const primaryColor = "hsl(195, 70%, 45%)";

export const PublicSitePreview = ({
  isEnabled,
  isBookingEnabled,
  title,
  description,
  socialLinks,
}: PublicSitePreviewProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockGalleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockGalleryImages.length) % mockGalleryImages.length);
  };

  const hasSocialLinks = socialLinks.instagram || socialLinks.facebook || socialLinks.whatsapp || socialLinks.website;

  if (!isEnabled) {
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden h-[500px] flex items-center justify-center">
        <div className="text-center p-6">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="font-medium text-foreground mb-1">Site Desativado</h3>
          <p className="text-sm text-muted-foreground">
            Esta é a página que os visitantes verão
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden h-[600px] overflow-y-auto">
      {/* Mini Header */}
      <div 
        className="h-8 flex items-center justify-between px-3"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-1.5">
          {mockLogo ? (
            <img src={mockLogo} alt="Logo" className="h-4 w-4 rounded object-cover" />
          ) : (
            <div className="h-4 w-4 rounded flex items-center justify-center text-[8px] font-bold text-white bg-white/20">
              {title.charAt(0)}
            </div>
          )}
          <span className="text-[10px] text-white font-medium truncate max-w-[100px]">
            {title.split("—")[0]?.trim() || "Seu Negócio"}
          </span>
        </div>
        {isBookingEnabled && (
          <span className="text-[8px] bg-white/20 text-white px-2 py-0.5 rounded-full">
            Agendar
          </span>
        )}
      </div>

      {/* Mini Gallery Carousel */}
      <div className="h-20 relative group">
        <img 
          src={mockGalleryImages[currentImageIndex]} 
          alt="Gallery" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Navigation arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-2.5 w-2.5 text-white" />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-2.5 w-2.5 text-white" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
          {mockGalleryImages.map((_, index) => (
            <div 
              key={index}
              className={`h-1 w-1 rounded-full transition-colors ${
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Mini Content with Logo */}
      <div className="p-3 space-y-3">
        {/* Logo + Title + Description */}
        <div className="flex gap-2">
          {mockLogo ? (
            <img src={mockLogo} alt="Logo" className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: primaryColor }}
            >
              {title.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h4 className="text-[10px] font-semibold text-foreground truncate">{title}</h4>
            <p className="text-[8px] text-muted-foreground line-clamp-2">{description}</p>
          </div>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
          <MapPin className="h-2.5 w-2.5" />
          <span>Av. Paulista, 1000 - São Paulo</span>
        </div>
        <div className="flex items-center gap-2 text-[8px] text-muted-foreground">
          <Phone className="h-2.5 w-2.5" />
          <span>(11) 99999-9999</span>
        </div>

        {/* CTA */}
        {isBookingEnabled && (
          <button 
            className="w-full py-1.5 rounded text-[9px] font-medium text-white"
            style={{ backgroundColor: primaryColor }}
          >
            Agendar agora
          </button>
        )}

        {/* Amenities */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1 text-[7px] text-muted-foreground">
            <Wifi className="h-2 w-2" /> Wi-Fi
          </div>
          <div className="flex items-center gap-1 text-[7px] text-muted-foreground">
            <Car className="h-2 w-2" /> Estacionamento
          </div>
          <div className="flex items-center gap-1 text-[7px] text-muted-foreground">
            <Coffee className="h-2 w-2" /> Café
          </div>
        </div>

        {/* Services Preview */}
        <div className="space-y-1.5">
          <h5 className="text-[9px] font-semibold text-foreground">Serviços</h5>
          {["Corte de Cabelo", "Coloração", "Hidratação"].map((service) => (
            <div 
              key={service} 
              className="flex items-center justify-between p-1.5 rounded bg-muted/50"
            >
              <span className="text-[8px] text-foreground">{service}</span>
              <span className="text-[8px] text-muted-foreground">R$ 80</span>
            </div>
          ))}
        </div>

        {/* Hours Preview */}
        <div className="space-y-1">
          <h5 className="text-[9px] font-semibold text-foreground flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" /> Horários
          </h5>
          <div className="grid grid-cols-2 gap-1 text-[7px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Seg-Sex</span>
              <span className="text-foreground">09:00 - 19:00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sábado</span>
              <span className="text-foreground">09:00 - 17:00</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        {hasSocialLinks && (
          <div className="space-y-1">
            <h5 className="text-[9px] font-semibold text-foreground">Redes Sociais</h5>
            <div className="flex gap-1.5">
              {socialLinks.instagram && (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                  <Instagram className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
              )}
              {socialLinks.facebook && (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                  <Facebook className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
              )}
              {socialLinks.whatsapp && (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                  <MessageCircle className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
              )}
              {socialLinks.website && (
                <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                  <Globe className="h-2.5 w-2.5 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
