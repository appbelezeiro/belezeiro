import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Target, 
  Users, 
  Lightbulb, 
  Shield, 
  Rocket,
  ArrowRight,
  Scissors,
  Calendar,
  TrendingUp
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Paixão pelo Cliente",
    description: "Cada decisão que tomamos começa com uma pergunta: isso vai facilitar a vida do nosso cliente?"
  },
  {
    icon: Lightbulb,
    title: "Inovação Constante",
    description: "Buscamos sempre novas formas de simplificar processos e entregar mais valor."
  },
  {
    icon: Shield,
    title: "Confiança e Segurança",
    description: "Seus dados são tratados com o máximo cuidado e proteção que você merece."
  },
  {
    icon: Users,
    title: "Parceria Verdadeira",
    description: "Não somos apenas uma ferramenta — somos parceiros no crescimento do seu negócio."
  }
];

const timeline = [
  {
    year: "2022",
    title: "O Início",
    description: "Nascemos da frustração de ver profissionais de beleza perdendo tempo com gestão manual."
  },
  {
    year: "2023",
    title: "Primeiros Clientes",
    description: "Lançamos a versão beta e conquistamos nossos primeiros 100 salões parceiros."
  },
  {
    year: "2024",
    title: "Secretário Online",
    description: "Introduzimos a IA que revolucionou o atendimento via WhatsApp no setor."
  },
  {
    year: "2025",
    title: "Expansão Nacional",
    description: "Hoje ajudamos milhares de profissionais em todo o Brasil a crescer."
  }
];

const stats = [
  { value: "5.000+", label: "Profissionais Ativos" },
  { value: "150.000+", label: "Agendamentos/Mês" },
  { value: "98%", label: "Satisfação" },
  { value: "24/7", label: "Suporte Disponível" }
];

const team = [
  {
    name: "Lucas Oliveira",
    role: "CEO & Fundador",
    bio: "Ex-desenvolvedor que viu de perto os desafios de familiares no ramo da beleza."
  },
  {
    name: "Camila Santos",
    role: "Head de Produto",
    bio: "10 anos de experiência em UX, apaixonada por criar experiências que encantam."
  },
  {
    name: "Rafael Costa",
    role: "CTO",
    bio: "Especialista em IA e automações, responsável pelo Secretário Online."
  }
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              Nossa História
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Simplificamos a gestão para você
              <span className="text-primary"> focar no que ama</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              O Belezeiro nasceu de um sonho: dar aos profissionais de beleza a liberdade 
              de fazer o que fazem de melhor, sem se preocupar com burocracia.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-primary text-sm font-medium mb-4">
                  <Target className="w-4 h-4" />
                  Nossa Missão
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Democratizar a tecnologia para o setor de beleza
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Acreditamos que todo profissional de beleza merece acesso a ferramentas 
                  profissionais de gestão, independente do tamanho do seu negócio.
                </p>
                <p className="text-lg text-muted-foreground">
                  Nossa missão é eliminar as barreiras tecnológicas e permitir que você 
                  construa o negócio dos seus sonhos com as mesmas ferramentas que as 
                  grandes redes utilizam.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Scissors className="w-10 h-10 text-primary mx-auto mb-3" />
                    <div className="font-semibold text-foreground">Salões</div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Calendar className="w-10 h-10 text-primary mx-auto mb-3" />
                    <div className="font-semibold text-foreground">Barbearias</div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                    <div className="font-semibold text-foreground">Clínicas</div>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-10 h-10 text-primary mx-auto mb-3" />
                    <div className="font-semibold text-foreground">Autônomos</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-4 md:px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossos Valores
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Princípios que guiam cada decisão e cada linha de código que escrevemos.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-background border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Nossa Jornada
              </h2>
              <p className="text-lg text-muted-foreground">
                De uma ideia a milhares de profissionais transformados.
              </p>
            </div>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-20 text-right">
                    <span className="text-2xl font-bold text-primary">{item.year}</span>
                  </div>
                  <div className="flex-shrink-0 w-4 h-4 bg-primary rounded-full mt-2 relative">
                    {index < timeline.length - 1 && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-16 bg-primary/20" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-4 md:px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Quem Faz o Belezeiro
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Um time apaixonado por tecnologia e pelo sucesso dos nossos clientes.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card key={index} className="bg-background border-border text-center">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/60 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary-foreground">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-8 md:p-12">
              <Rocket className="w-12 h-12 text-primary-foreground mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Pronto para fazer parte dessa história?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Junte-se a milhares de profissionais que já transformaram seus negócios com o Belezeiro.
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate("/onboarding")}
                className="text-base px-8 h-12 gap-2"
              >
                Começar grátis agora
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default AboutUs;
