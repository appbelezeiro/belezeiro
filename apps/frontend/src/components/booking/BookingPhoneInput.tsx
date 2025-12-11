import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Phone, ArrowRight, Loader2 } from "lucide-react";

interface BookingPhoneInputProps {
  onSubmit: (phone: string, isNewClient: boolean) => void;
}

export function BookingPhoneInput({ onSubmit }: BookingPhoneInputProps) {
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [forceNewClient, setForceNewClient] = useState(false);

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 10) return;

    setIsLoading(true);
    
    // Simulate API call to check if client exists
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Use forced value or random
    const isNewClient = forceNewClient || Math.random() < 0.5;
    
    setIsLoading(false);
    onSubmit(phone, isNewClient);
  };

  const isValidPhone = phone.replace(/\D/g, "").length >= 10;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Agendar horário</CardTitle>
        <CardDescription className="text-base">
          Digite seu WhatsApp para começar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              className="h-12 text-lg"
              autoFocus
            />
          </div>

          {/* Debug toggle */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">🧪 Debug:</span>
              <span className="text-sm">Forçar novo cliente</span>
            </div>
            <Switch
              checked={forceNewClient}
              onCheckedChange={setForceNewClient}
            />
          </div>
          
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={!isValidPhone || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
