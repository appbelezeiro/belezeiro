import { Wifi, Car, Coffee, Wind, Droplets, Sofa, Accessibility } from "lucide-react";

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  coffee: Coffee,
  ac: Wind,
  snacks: Droplets,
  "waiting-room": Sofa,
  accessibility: Accessibility,
};

const amenityLabels: Record<string, string> = {
  wifi: "Wi-Fi Grátis",
  parking: "Estacionamento",
  coffee: "Café e Água",
  ac: "Ar-condicionado",
  snacks: "Snacks",
  "waiting-room": "Sala de Espera",
  accessibility: "Acessibilidade",
};

interface PublicAboutProps {
  about: string;
  amenities: string[];
}

export const PublicAbout = ({ about, amenities }: PublicAboutProps) => {
  return (
    <div className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12">
          {/* About Text */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Sobre Nós</h2>
            <p className="text-muted-foreground leading-relaxed">{about}</p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Comodidades</h2>
            <div className="grid grid-cols-2 gap-4">
              {amenities.map((amenity) => {
                const Icon = amenityIcons[amenity] || Coffee;
                const label = amenityLabels[amenity] || amenity;
                return (
                  <div
                    key={amenity}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
