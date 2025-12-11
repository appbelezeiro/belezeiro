import { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Upload, 
  X, 
  Plus, 
  Phone, 
  Clock, 
  Briefcase,
  Wifi,
  Car,
  Coffee,
  Wind,
  Droplets,
  Sofa,
  Accessibility,
  Save,
  Trash2,
  Home,
  Users,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { professions as defaultProfessions } from "@/data/professions";

const amenitiesList = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Estacionamento", icon: Car },
  { id: "coffee", label: "Café / Água", icon: Coffee },
  { id: "ac", label: "Ar-condicionado", icon: Wind },
  { id: "snacks", label: "Snacks", icon: Droplets },
  { id: "waiting-room", label: "Sala de espera", icon: Sofa },
  { id: "accessibility", label: "Acessibilidade", icon: Accessibility },
];

const days = [
  { key: "monday", label: "Segunda" },
  { key: "tuesday", label: "Terça" },
  { key: "wednesday", label: "Quarta" },
  { key: "thursday", label: "Quinta" },
  { key: "friday", label: "Sexta" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export const BusinessSettings = () => {
  const { toast } = useToast();
  
  // Business data
  const [businessName, setBusinessName] = useState("Salão Reis");
  
  // Unit data (mock - would come from selected unit)
  const [unitName, setUnitName] = useState("Unidade Centro");
  const [logo, setLogo] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [whatsapp, setWhatsapp] = useState("(11) 99999-9999");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("01310-100");
  const [street, setStreet] = useState("Av. Paulista");
  const [number, setNumber] = useState("1000");
  const [complement, setComplement] = useState("Sala 101");
  const [neighborhood, setNeighborhood] = useState("Bela Vista");
  const [city, setCity] = useState("São Paulo");
  const [state, setState] = useState("SP");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  // Specialties & Services
  const [selectedProfessions, setSelectedProfessions] = useState([
    { id: "cabeleireiro", name: "Cabeleireiro" },
    { id: "manicure", name: "Manicure" },
  ]);
  const [selectedServices, setSelectedServices] = useState([
    { name: "Corte masculino", professionId: "cabeleireiro" },
    { name: "Corte feminino", professionId: "cabeleireiro" },
    { name: "Manicure simples", professionId: "manicure" },
  ]);
  
  // Service type
  const [serviceType, setServiceType] = useState<"local" | "home" | "both">("local");
  
  // Amenities
  const [amenities, setAmenities] = useState(["wifi", "ac", "coffee"]);
  
  // Working hours
  const [workingHours, setWorkingHours] = useState<Record<string, { open: string; close: string; enabled: boolean }>>({
    monday: { open: "09:00", close: "18:00", enabled: true },
    tuesday: { open: "09:00", close: "18:00", enabled: true },
    wednesday: { open: "09:00", close: "18:00", enabled: true },
    thursday: { open: "09:00", close: "18:00", enabled: true },
    friday: { open: "09:00", close: "18:00", enabled: true },
    saturday: { open: "09:00", close: "13:00", enabled: true },
    sunday: { open: "09:00", close: "18:00", enabled: false },
  });
  const [lunchBreak, setLunchBreak] = useState({ enabled: true, start: "12:00", end: "13:00" });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            setGallery((prev) => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCepChange = async (value: string) => {
    const cleanCep = value.replace(/\D/g, "");
    setCep(cleanCep);

    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const result = await response.json();
        if (!result.erro) {
          setStreet(result.logradouro || "");
          setNeighborhood(result.bairro || "");
          setCity(result.localidade || "");
          setState(result.uf || "");
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const formatCep = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 5) return clean;
    return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
  };

  const toggleAmenity = (id: string) => {
    setAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const copyHoursToAll = (sourceDay: string) => {
    const source = workingHours[sourceDay];
    setWorkingHours((prev) => {
      const updated = { ...prev };
      days.forEach(({ key }) => {
        if (key !== sourceDay) {
          updated[key] = { ...source };
        }
      });
      return updated;
    });
    toast({ title: "Horários copiados para todos os dias" });
  };

  const handleSave = (section: string) => {
    toast({
      title: "Alterações salvas",
      description: `As configurações de ${section} foram atualizadas.`,
    });
  };

  const handleDeleteUnit = () => {
    toast({
      title: "Unidade excluída",
      description: "A unidade foi removida com sucesso.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-10">
      {/* Business Name Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Meu negócio
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Nome interno que organiza suas unidades
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="business-name">Nome do negócio</Label>
          <Input
            id="business-name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Nome do seu negócio"
          />
          <p className="text-xs text-muted-foreground">
            Este nome é interno e não é exibido aos seus clientes.
          </p>
        </div>

        <Button onClick={() => handleSave("negócio")} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </section>

      <hr className="border-border" />

      {/* Unit Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Unidade: {unitName}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure as informações desta unidade
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
              Excluir unidade
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir unidade?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Todos os dados desta unidade serão permanentemente removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteUnit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Basic Info Section */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Informações básicas</h3>
        
        <div className="flex gap-4 items-start">
          {/* Logo */}
          <div className="shrink-0">
            <Label className="text-sm mb-2 block">Logo</Label>
            <div
              className={cn(
                "relative w-20 h-20 border-2 border-dashed rounded-xl transition-colors cursor-pointer hover:border-primary/50 overflow-hidden",
                logo ? "border-primary/30 bg-primary/5" : "border-border"
              )}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Unit Name */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="unit-name">Nome da unidade</Label>
            <Input
              id="unit-name"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              placeholder="Ex: Unidade Jardins"
            />
            <p className="text-xs text-muted-foreground">
              Este nome é público e será exibido aos seus clientes.
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="space-y-2">
          <Label>Galeria de fotos</Label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {gallery.map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                <img src={img} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
            <div className="relative aspect-square border-2 border-dashed rounded-lg transition-colors cursor-pointer hover:border-primary/50 flex flex-col items-center justify-center gap-1 border-border bg-secondary/20">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        <Button onClick={() => handleSave("informações básicas")} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </section>

      <hr className="border-border" />

      {/* Contact Section */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          Contato
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone-secondary">Telefone secundário</Label>
            <Input
              id="phone-secondary"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 3333-4444"
            />
          </div>
        </div>

        <Button onClick={() => handleSave("contato")} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </section>

      <hr className="border-border" />

      {/* Address Section */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Endereço
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              placeholder="00000-000"
              value={formatCep(cep)}
              onChange={(e) => handleCepChange(e.target.value)}
              maxLength={9}
              className={isLoadingCep ? "animate-pulse" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Rua</Label>
            <Input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="Nome da rua"
              disabled={isLoadingCep}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="123"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Sala 101"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                disabled={isLoadingCep}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={isLoadingCep}
              />
            </div>
          </div>

          <div className="space-y-2 max-w-[100px]">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              maxLength={2}
              disabled={isLoadingCep}
            />
          </div>
        </div>

        <Button onClick={() => handleSave("endereço")} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </section>

      <hr className="border-border" />

      {/* Service Type Section */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground flex items-center gap-2">
          <Home className="h-4 w-4 text-primary" />
          Tipo de atendimento
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { value: "local", label: "Local próprio", icon: Building2 },
            { value: "home", label: "Na casa do cliente", icon: Home },
            { value: "both", label: "Ambos", icon: Users },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setServiceType(option.value as typeof serviceType)}
              className={cn(
                "p-4 rounded-lg border-2 transition-all text-left",
                serviceType === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <option.icon className={cn(
                "h-5 w-5 mb-2",
                serviceType === option.value ? "text-primary" : "text-muted-foreground"
              )} />
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>

        <Button onClick={() => handleSave("tipo de atendimento")} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </section>

      <hr className="border-border" />

      {/* Specialties & Services Section */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Especialidades e serviços
        </h3>

        <div className="space-y-3">
          <Label>Especialidades selecionadas</Label>
          <div className="flex flex-wrap gap-2">
            {selectedProfessions.map((prof) => (
              <Badge key={prof.id} variant="secondary" className="gap-1">
                {prof.name}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Serviços ativos</Label>
          <div className="flex flex-wrap gap-2">
            {selectedServices.map((service, idx) => (
              <Badge key={idx} variant="outline">
                {service.name}
              </Badge>
            ))}
          </div>
        </div>

        <Button onClick={() => handleSave("especialidades")} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </section>

      <hr className="border-border" />

      {/* Amenities Section */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground">Comodidades</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {amenitiesList.map((amenity) => {
            const isSelected = amenities.includes(amenity.id);
            return (
              <div
                key={amenity.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                  isSelected ? "border-primary/30 bg-primary/5" : "border-border"
                )}
              >
                <amenity.icon className={cn(
                  "h-4 w-4 shrink-0",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} />
                <span className="text-sm flex-1">{amenity.label}</span>
                <Switch
                  checked={isSelected}
                  onCheckedChange={() => toggleAmenity(amenity.id)}
                />
              </div>
            );
          })}
        </div>

        <Button onClick={() => handleSave("comodidades")} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </section>

      <hr className="border-border" />

      {/* Working Hours Section */}
      <section className="space-y-4">
        <h3 className="text-base font-medium text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Horários de funcionamento
        </h3>

        {/* Lunch Break */}
        <div className="flex items-center gap-4 p-3 rounded-lg border border-border">
          <div className="flex items-center gap-3 flex-1">
            <Switch
              checked={lunchBreak.enabled}
              onCheckedChange={(checked) => setLunchBreak((prev) => ({ ...prev, enabled: checked }))}
            />
            <span className="text-sm">Pausa para almoço</span>
          </div>
          {lunchBreak.enabled && (
            <div className="flex items-center gap-2">
              <Select value={lunchBreak.start} onValueChange={(v) => setLunchBreak((prev) => ({ ...prev, start: v }))}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-foreground text-xs">às</span>
              <Select value={lunchBreak.end} onValueChange={(v) => setLunchBreak((prev) => ({ ...prev, end: v }))}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Days */}
        <div className="space-y-2">
          {days.map(({ key, label }) => {
            const day = workingHours[key];
            return (
              <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3 flex-1">
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={(checked) => updateWorkingHours(key, "enabled", checked)}
                  />
                  <span className="text-sm font-medium w-20">{label}</span>
                </div>
                
                {day.enabled && (
                  <div className="flex items-center gap-2 ml-11 sm:ml-0">
                    <Select value={day.open} onValueChange={(v) => updateWorkingHours(key, "open", v)}>
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-xs">às</span>
                    <Select value={day.close} onValueChange={(v) => updateWorkingHours(key, "close", v)}>
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyHoursToAll(key)}
                      className="h-8 px-2 text-xs gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="hidden sm:inline">Copiar</span>
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Button onClick={() => handleSave("horários")} size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Salvar
        </Button>
      </section>
    </div>
  );
};
