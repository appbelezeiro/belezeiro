import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicMapProps {
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  businessName: string;
}

export const PublicMap = ({ address, businessName }: PublicMapProps) => {
  const fullAddress = `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ""} - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.cep}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Nossa Localização</h2>
        </div>
        <p className="text-muted-foreground text-center mb-8">
          Venha nos visitar
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Address Card */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Endereço</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{address.street}, {address.number}</p>
              {address.complement && <p>{address.complement}</p>}
              <p>{address.neighborhood}</p>
              <p>{address.city} - {address.state}</p>
              <p>CEP: {address.cep}</p>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 gap-2"
              onClick={() => window.open(mapsUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4" />
              Ver no Google Maps
            </Button>
          </div>

          {/* Map Embed */}
          <div className="md:col-span-2 rounded-2xl overflow-hidden border border-border h-[300px] md:h-auto">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "300px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa - ${businessName}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
