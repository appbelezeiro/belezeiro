import { UserPlus, Scissors, Calendar, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crie sua conta",
    description: "Em segundos, com Google ou e-mail. Sem burocracia.",
  },
  {
    icon: Scissors,
    number: "02",
    title: "Cadastre seus serviços",
    description: "Preços, durações e descrições. Organize seu catálogo.",
  },
  {
    icon: Calendar,
    number: "03",
    title: "Configure sua agenda",
    description: "Horários de funcionamento, intervalos e disponibilidade.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Comece a receber clientes",
    description: "Agendamentos automáticos 24 horas por dia.",
  },
];

export function LandingHowItWorks() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simples de começar.{" "}
            <span className="text-primary">Poderoso de usar.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Em poucos minutos você configura tudo e já pode receber agendamentos.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
