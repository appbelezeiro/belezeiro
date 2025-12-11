import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  HelpCircle,
  Headphones,
  FileText,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: Mail,
    title: "E-mail",
    value: "contato@belezeiro.com.br",
    description: "Resposta em até 24h úteis"
  },
  {
    icon: Phone,
    title: "WhatsApp",
    value: "(11) 99999-9999",
    description: "Seg-Sex, 9h às 18h"
  },
  {
    icon: MapPin,
    title: "Localização",
    value: "São Paulo, SP",
    description: "Brasil"
  },
  {
    icon: Clock,
    title: "Horário de Atendimento",
    value: "Segunda a Sexta",
    description: "9h às 18h (Horário de Brasília)"
  }
];

const supportOptions = [
  {
    icon: HelpCircle,
    title: "Central de Ajuda",
    description: "Artigos e tutoriais para tirar suas dúvidas rapidamente.",
    cta: "Acessar Central",
    href: "#"
  },
  {
    icon: Headphones,
    title: "Suporte Técnico",
    description: "Problemas com o sistema? Nossa equipe está pronta para ajudar.",
    cta: "Abrir Chamado",
    href: "#"
  },
  {
    icon: FileText,
    title: "Documentação",
    description: "Guias completos de todas as funcionalidades do Belezeiro.",
    cta: "Ver Documentação",
    href: "#"
  }
];

const faqs = [
  {
    question: "Qual o tempo médio de resposta?",
    answer: "Para e-mails, respondemos em até 24 horas úteis. Via WhatsApp, o atendimento é em tempo real durante o horário comercial."
  },
  {
    question: "Vocês oferecem suporte aos finais de semana?",
    answer: "Nosso suporte funciona de segunda a sexta. Para urgências, temos uma base de conhecimento disponível 24/7."
  },
  {
    question: "Como faço para agendar uma demonstração?",
    answer: "Preencha o formulário ao lado selecionando 'Demonstração' como assunto, e entraremos em contato para agendar."
  }
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve. Obrigado!",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              Fale Conosco
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Estamos aqui para
              <span className="text-primary"> ajudar você</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tem dúvidas, sugestões ou precisa de suporte? Entre em contato conosco. 
              Nossa equipe está pronta para atender você.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="pb-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-muted-foreground text-sm mb-1">{info.title}</h3>
                    <p className="font-semibold text-foreground mb-1">{info.value}</p>
                    <p className="text-xs text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Main Contact Section */}
        <section className="py-16 px-4 md:px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Envie uma mensagem</h2>
                <p className="text-muted-foreground mb-8">
                  Preencha o formulário abaixo e retornaremos o mais breve possível.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input 
                        id="name" 
                        name="name"
                        placeholder="Seu nome" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email" 
                        placeholder="seu@email.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone (opcional)</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        placeholder="(00) 00000-0000" 
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Assunto</Label>
                      <Input 
                        id="subject" 
                        name="subject"
                        placeholder="Como podemos ajudar?" 
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      placeholder="Descreva sua dúvida ou mensagem..." 
                      className="min-h-[150px]"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Enviar Mensagem
                  </Button>
                </form>
              </div>

              {/* FAQ & Support */}
              <div className="space-y-8">
                {/* Quick FAQ */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Perguntas Frequentes</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <Card key={index} className="border-border">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Social Media */}
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">Siga-nos nas redes</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Acompanhe nossas novidades e dicas exclusivas.
                    </p>
                    <div className="flex gap-3">
                      <a 
                        href="#" 
                        className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a 
                        href="#" 
                        className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a 
                        href="#" 
                        className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Support Options */}
        <section className="py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-2">Outras formas de ajuda</h2>
              <p className="text-muted-foreground">Escolha o canal que melhor atende sua necessidade</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {supportOptions.map((option, index) => (
                <Card 
                  key={index} 
                  className="border-border hover:border-primary/50 transition-all group cursor-pointer"
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                      <option.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg mb-2">{option.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{option.description}</p>
                    <Button variant="outline" className="gap-2">
                      {option.cta}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Map Placeholder */}
        <section className="py-16 px-4 md:px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Nossa Localização</h2>
              <p className="text-muted-foreground">São Paulo, Brasil - Trabalhamos 100% remoto para atender todo o país</p>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border h-[300px] bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Mapa interativo</p>
                <p className="text-sm text-muted-foreground">São Paulo, SP - Brasil</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 md:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="bg-gradient-to-br from-primary to-primary/80 border-0">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                  Prefere ver na prática?
                </h2>
                <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                  Crie sua conta gratuita e descubra como o Belezeiro pode transformar seu negócio.
                </p>
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base px-8 h-12 gap-2"
                  onClick={() => window.location.href = "/onboarding"}
                >
                  Começar grátis agora
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Contact;
