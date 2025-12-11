import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Julia Alves",
    role: "Esteticista",
    location: "São Paulo, SP",
    avatar: "JA",
    rating: 5,
    text: "Antes eu perdia horas respondendo WhatsApp. Agora o Secretário Online faz isso por mim e ainda agenda os clientes. Minha agenda nunca esteve tão cheia!",
  },
  {
    name: "Carlos Mendes",
    role: "Barbeiro",
    location: "Belo Horizonte, MG",
    avatar: "CM",
    rating: 5,
    text: "Interface limpa, fácil de usar. Meus clientes adoram agendar online e eu consigo ver tudo no celular. Recomendo demais!",
  },
  {
    name: "Marina Costa",
    role: "Cabeleireira",
    location: "Curitiba, PR",
    avatar: "MC",
    rating: 5,
    text: "Reduzi as faltas em 70% com os lembretes automáticos. O Belezeiro se pagou no primeiro mês de uso. Melhor investimento que fiz.",
  },
];

const stats = [
  { value: "1.000+", label: "Profissionais" },
  { value: "50.000+", label: "Agendamentos/mês" },
  { value: "98%", label: "Satisfação" },
  { value: "4.9", label: "Avaliação média" },
];

export function LandingTestimonials() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Quem usa,{" "}
            <span className="text-primary">recomenda</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Histórias reais de profissionais que transformaram seus negócios.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-background border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-primary/20 mb-4" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">{testimonial.avatar}</span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} • {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-background border border-border rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
