import { 
  CalendarCheck, 
  Clock, 
  Moon, 
  LayoutDashboard, 
  MessageSquareOff, 
  Smile, 
  TrendingUp, 
  Bot 
} from "lucide-react";

const benefits = [
  {
    icon: CalendarCheck,
    title: "Organize sua rotina em poucos cliques",
    description: "Visualize toda sua semana de forma clara e intuitiva.",
  },
  {
    icon: Clock,
    title: "Nunca mais perca um horário",
    description: "Lembretes automáticos garantem que ninguém esqueça.",
  },
  {
    icon: Moon,
    title: "Receba agendamentos mesmo dormindo",
    description: "Seus clientes agendam sozinhos, 24 horas por dia.",
  },
  {
    icon: LayoutDashboard,
    title: "Veja tudo em um único painel",
    description: "Agenda, clientes, serviços e métricas centralizados.",
  },
  {
    icon: MessageSquareOff,
    title: "Reduza mensagens repetitivas",
    description: "A IA responde dúvidas comuns automaticamente.",
  },
  {
    icon: Smile,
    title: "Viva com mais tranquilidade",
    description: "Menos tarefas manuais, mais tempo para o que importa.",
  },
  {
    icon: TrendingUp,
    title: "Aumente seu faturamento sem esforço",
    description: "Menos faltas, mais horários preenchidos, mais receita.",
  },
  {
    icon: Bot,
    title: "Deixe a IA responder seus clientes",
    description: "O Secretário Online cuida das conversas no WhatsApp.",
  },
];

export function LandingBenefits() {
  return (
    <section id="beneficios" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Benefícios que{" "}
            <span className="text-primary">transformam sua rotina</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Não são apenas funcionalidades — são soluções reais para problemas reais.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <benefit.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
