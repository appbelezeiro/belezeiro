import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  FileSpreadsheet, 
  MessageSquare, 
  UserX, 
  Clock, 
  TrendingDown,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Agenda bagunçada",
    description: "Papel, planilha, caderno... nada funciona de verdade",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp infinito",
    description: "Mensagens o dia inteiro perguntando horários",
  },
  {
    icon: UserX,
    title: "Clientes que faltam",
    description: "Sem confirmação, sem aviso, prejuízo no bolso",
  },
  {
    icon: Clock,
    title: "Horários perdidos",
    description: "Remarcações, encaixes, confusão constante",
  },
  {
    icon: TrendingDown,
    title: "Sem visão do negócio",
    description: "Faturamento? Clientes novos? Ninguém sabe",
  },
];

const solutions = [
  "Agenda digital organizada e visual",
  "Agendamento automático 24 horas",
  "Confirmação automática via WhatsApp",
  "Lembretes que reduzem faltas",
  "Dashboard com métricas em tempo real",
];

export function LandingProblemSolution() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Você merece menos preocupação e{" "}
            <span className="text-primary">mais clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Sabemos como é difícil gerenciar um negócio de beleza. 
            São muitas tarefas, pouco tempo e clientes que precisam de atenção.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-xl p-5 text-center hover:border-destructive/50 hover:bg-destructive/5 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-destructive/20 transition-colors">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{problem.title}</h3>
              <p className="text-sm text-muted-foreground">{problem.description}</p>
            </div>
          ))}
        </div>

        {/* Transition */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              O Belezeiro resolve tudo isso
            </div>
          </div>
        </div>

        {/* Solutions */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="bg-background border border-primary/20 rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
              Com o Belezeiro você tem:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {solutions.map((solution, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{solution}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => navigate("/onboarding")}
            className="text-base px-8 h-12 gap-2"
          >
            Quero organizar meu negócio
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
