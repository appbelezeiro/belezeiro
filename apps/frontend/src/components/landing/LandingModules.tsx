import { 
  Calendar, 
  Users, 
  Scissors, 
  Globe, 
  CalendarPlus, 
  BarChart3, 
  Building2 
} from "lucide-react";

const modules = [
  {
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Visualize, arraste e organize seus horários com facilidade. Interface limpa e intuitiva que mostra tudo o que você precisa.",
    highlight: "Nunca mais se perca nos horários",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Histórico completo, preferências e anotações de cada cliente. Personalize o atendimento e fidelize sua base.",
    highlight: "Conheça seus clientes de verdade",
  },
  {
    icon: Scissors,
    title: "Catálogo de Serviços",
    description: "Organize serviços por categoria com preços e durações. Seus clientes escolhem exatamente o que precisam.",
    highlight: "Apresente seu trabalho com clareza",
  },
  {
    icon: Globe,
    title: "Página Pública",
    description: "Seu negócio online em segundos. Compartilhe nas redes sociais e deixe novos clientes te encontrarem.",
    highlight: "Sua vitrine digital profissional",
  },
  {
    icon: CalendarPlus,
    title: "Agendamento Online",
    description: "Clientes agendam sozinhos, 24 horas por dia. Você recebe notificação e a agenda já fica atualizada.",
    highlight: "Funciona enquanto você descansa",
  },
  {
    icon: BarChart3,
    title: "Dashboard com KPIs",
    description: "Métricas claras sobre agendamentos, clientes novos, serviços mais pedidos e faturamento estimado.",
    highlight: "Decisões baseadas em dados",
  },
  {
    icon: Building2,
    title: "Múltiplas Unidades",
    description: "Gerencie todas as filiais em um só lugar. Cada unidade com sua agenda, equipe e serviços próprios.",
    highlight: "Escale sem complicação",
  },
];

export function LandingModules() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Tudo que você precisa em{" "}
            <span className="text-primary">um só lugar</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Cada módulo foi pensado para resolver um problema específico do seu dia a dia.
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors duration-300">
                  <module.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">{module.title}</h3>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                  <p className="text-sm font-medium text-primary">{module.highlight}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
