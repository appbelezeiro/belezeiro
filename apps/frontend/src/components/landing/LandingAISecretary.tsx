import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageSquare, 
  CalendarCheck, 
  Bell, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Responde dúvidas automaticamente",
    description: "Horários, preços, localização — a IA responde na hora.",
  },
  {
    icon: CalendarCheck,
    title: "Confirma horários com antecedência",
    description: "Mensagem automática pedindo confirmação do cliente.",
  },
  {
    icon: Clock,
    title: "Agenda clientes sem sua intervenção",
    description: "O cliente escolhe o horário e a IA confirma tudo.",
  },
  {
    icon: Bell,
    title: "Envia lembretes e reduz faltas",
    description: "Lembrete no dia anterior evita esquecimentos.",
  },
  {
    icon: TrendingUp,
    title: "Aumenta sua conversão",
    description: "Resposta rápida = mais clientes fechados.",
  },
];

export function LandingAISecretary() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary hover:bg-primary/30 gap-2">
                <Sparkles className="w-3 h-3" />
                Exclusivo do Plano Pro
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Seu novo funcionário que{" "}
                <span className="text-primary">nunca dorme</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                O Secretário Online responde seus clientes 24 horas por dia via WhatsApp. 
                Enquanto você descansa, ele trabalha.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-background/80 backdrop-blur-sm border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => navigate("/onboarding?plan=pro")}
              className="text-base px-8 h-12 gap-2"
            >
              Quero ter meu Secretário Online
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            {/* Phone Mockup */}
            <div className="relative mx-auto max-w-[300px]">
              <div className="bg-card border-4 border-foreground/10 rounded-[2.5rem] p-2 shadow-2xl">
                <div className="bg-background rounded-[2rem] overflow-hidden">
                  {/* Phone Notch */}
                  <div className="h-6 bg-foreground/5 flex items-center justify-center">
                    <div className="w-20 h-4 bg-foreground/10 rounded-full" />
                  </div>
                  
                  {/* Chat Interface */}
                  <div className="p-4 space-y-3 min-h-[400px]">
                    {/* Header */}
                    <div className="flex items-center gap-3 pb-3 border-b border-border">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm">Secretário Belezeiro</div>
                        <div className="text-xs text-green-500">Online agora</div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="space-y-3">
                      {/* Client Message */}
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-2xl rounded-tr-md max-w-[80%]">
                          Oi, vocês têm horário amanhã às 14h?
                        </div>
                      </div>

                      {/* Bot Response */}
                      <div className="flex justify-start">
                        <div className="bg-muted text-foreground text-sm px-4 py-2 rounded-2xl rounded-tl-md max-w-[80%]">
                          Olá! 👋 Sim, temos horário disponível amanhã às 14h. Qual serviço você gostaria de agendar?
                        </div>
                      </div>

                      {/* Client Message */}
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded-2xl rounded-tr-md max-w-[80%]">
                          Corte feminino
                        </div>
                      </div>

                      {/* Bot Response */}
                      <div className="flex justify-start">
                        <div className="bg-muted text-foreground text-sm px-4 py-2 rounded-2xl rounded-tl-md max-w-[80%]">
                          Perfeito! ✅ Agendado para amanhã às 14h. Enviarei um lembrete antes. Até lá!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-float">
                24h Online
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
