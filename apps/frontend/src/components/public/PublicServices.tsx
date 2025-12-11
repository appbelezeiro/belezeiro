import { useState } from "react";
import { Clock, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
}

interface PublicServicesProps {
  services: Service[];
  specialties: { id: string; name: string; icon: string }[];
  primaryColor: string;
  isBookingEnabled: boolean;
}

export const PublicServices = ({
  services,
  specialties,
  primaryColor,
  isBookingEnabled,
}: PublicServicesProps) => {
  const categories = [...new Set(services.map((s) => s.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredServices = services.filter((s) => s.category === selectedCategory);

  return (
    <div className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
          Nossos Serviços
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          Conheça todos os tratamentos disponíveis
        </p>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-xl border border-border p-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    selectedCategory === category
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Services List */}
          <div className="flex-1">
            <div className="grid gap-4">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground text-lg mb-1">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.duration} min
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">A partir de</span>
                        <p className="text-xl font-bold text-foreground">
                          R$ {service.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      {isBookingEnabled && (
                        <Button 
                          size="sm"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Agendar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
