import { useState } from "react";
import { Calendar, Users, Scissors, Globe, CalendarPlus } from "lucide-react";

const demos = [
  {
    id: "agenda",
    icon: Calendar,
    title: "Agenda Inteligente",
    description: "Visualize todos os seus agendamentos em uma interface clean estilo Google Calendar. Arraste, reorganize e tenha controle total.",
    features: ["Visão diária e semanal", "Drag & Drop", "Filtros por profissional", "Bloqueio de horários"],
  },
  {
    id: "clientes",
    icon: Users,
    title: "Gestão de Clientes",
    description: "Cada cliente com seu histórico completo, preferências e anotações importantes. Nunca mais esqueça um detalhe.",
    features: ["Histórico de atendimentos", "Preferências salvas", "Anotações privadas", "Busca rápida"],
  },
  {
    id: "servicos",
    icon: Scissors,
    title: "Catálogo de Serviços",
    description: "Organize seus serviços por categoria, defina preços e durações. Seus clientes veem tudo de forma clara.",
    features: ["Categorias personalizadas", "Preços e durações", "Descrições detalhadas", "Fotos dos serviços"],
  },
  {
    id: "pagina",
    icon: Globe,
    title: "Página Pública",
    description: "Seu negócio online em segundos. Compartilhe o link e deixe clientes conhecerem seu trabalho.",
    features: ["URL personalizada", "Galeria de fotos", "Horários de funcionamento", "Redes sociais"],
  },
  {
    id: "agendamento",
    icon: CalendarPlus,
    title: "Agendamento Online",
    description: "Clientes escolhem serviço, profissional, data e horário. Tudo sem você precisar responder uma mensagem.",
    features: ["Escolha de serviços", "Seleção de horário", "Confirmação automática", "Funciona 24h"],
  },
];

export function LandingDemo() {
  const [activeDemo, setActiveDemo] = useState("agenda");
  const currentDemo = demos.find((d) => d.id === activeDemo) || demos[0];

  return (
    <section id="demo" className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Veja o Belezeiro{" "}
            <span className="text-primary">em ação</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Interface limpa, intuitiva e pensada para facilitar sua rotina.
          </p>
        </div>

        {/* Demo Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeDemo === demo.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              <demo.icon className="w-4 h-4" />
              {demo.title}
            </button>
          ))}
        </div>

        {/* Demo Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Screenshot Mockup */}
          <div className="relative">
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Browser Header */}
              <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-sm text-muted-foreground">app.belezeiro.com/{currentDemo.id}</span>
              </div>
              {/* Content Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <currentDemo.icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{currentDemo.title}</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {currentDemo.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
          </div>

          {/* Description */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <currentDemo.icon className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-primary">{currentDemo.title}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
              {currentDemo.description}
            </h3>

            <ul className="space-y-3">
              {currentDemo.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
