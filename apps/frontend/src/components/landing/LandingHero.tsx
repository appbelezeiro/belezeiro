import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, CreditCard, XCircle, HeadphonesIcon, Calendar, Users, BarChart3 } from "lucide-react";

export function LandingHero() {
  const navigate = useNavigate();

  const scrollToDemo = () => {
    const element = document.getElementById("demo");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <Badge variant="secondary" className="inline-flex items-center gap-2 px-4 py-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Mais de 1.000 profissionais já usam
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Sua agenda sempre{" "}
                <span className="text-primary">organizada.</span>
                <br />
                Seus clientes sempre{" "}
                <span className="text-primary">confirmados.</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                O Belezeiro é a plataforma completa para salões, barbearias e clínicas de estética 
                gerenciarem tudo em um só lugar.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => navigate("/bem-vindo")}
                className="text-base px-8 h-12 gap-2"
              >
                Começar grátis
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToDemo}
                className="text-base px-8 h-12 gap-2"
              >
                <Play className="w-4 h-4" />
                Ver demonstração
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <XCircle className="w-4 h-4 text-primary" />
                <span>Cancele quando quiser</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HeadphonesIcon className="w-4 h-4 text-primary" />
                <span>Suporte humanizado</span>
              </div>
            </div>
          </div>

          {/* Right Content - Mockup */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-4 text-sm text-muted-foreground">app.belezeiro.com</span>
                </div>
                <div className="p-6 space-y-4">
                  {/* KPI Row */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-primary/10 rounded-lg p-3 text-center">
                      <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                      <div className="text-lg font-bold text-foreground">12</div>
                      <div className="text-xs text-muted-foreground">Hoje</div>
                    </div>
                    <div className="bg-secondary/10 rounded-lg p-3 text-center">
                      <Users className="w-5 h-5 text-secondary-foreground mx-auto mb-1" />
                      <div className="text-lg font-bold text-foreground">248</div>
                      <div className="text-xs text-muted-foreground">Clientes</div>
                    </div>
                    <div className="bg-accent/10 rounded-lg p-3 text-center">
                      <BarChart3 className="w-5 h-5 text-accent-foreground mx-auto mb-1" />
                      <div className="text-lg font-bold text-foreground">R$ 4.2k</div>
                      <div className="text-xs text-muted-foreground">Mês</div>
                    </div>
                  </div>
                  {/* Appointment List */}
                  <div className="space-y-2">
                    {[
                      { time: "09:00", client: "Maria Silva", service: "Corte + Escova" },
                      { time: "10:30", client: "Ana Costa", service: "Manicure" },
                      { time: "14:00", client: "Julia Santos", service: "Coloração" },
                    ].map((apt, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="text-sm font-medium text-primary w-12">{apt.time}</div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-foreground">{apt.client}</div>
                          <div className="text-xs text-muted-foreground">{apt.service}</div>
                        </div>
                        <Badge variant="secondary" className="text-xs">Confirmado</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-3 shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-lg">✓</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Novo agendamento</div>
                    <div className="text-sm font-medium text-foreground">via WhatsApp</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-3 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary text-lg">🤖</span>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Secretário Online</div>
                    <div className="text-sm font-medium text-foreground">Respondendo...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
