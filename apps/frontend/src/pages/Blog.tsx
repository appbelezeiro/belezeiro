import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight,
  TrendingUp,
  Users,
  Lightbulb,
  Scissors,
  MessageSquare,
  BarChart
} from "lucide-react";

const categories = [
  { name: "Todos", count: 24, active: true },
  { name: "Gestão", count: 8, icon: BarChart },
  { name: "Marketing", count: 6, icon: TrendingUp },
  { name: "Atendimento", count: 5, icon: Users },
  { name: "Dicas", count: 5, icon: Lightbulb },
];

const featuredPost = {
  title: "Como o Secretário Online pode triplicar seus agendamentos em 30 dias",
  excerpt: "Descubra como a inteligência artificial está revolucionando o atendimento no setor de beleza e como você pode aproveitar essa tecnologia para crescer.",
  category: "Marketing",
  date: "28 Nov 2024",
  readTime: "8 min",
  image: "gradient"
};

const posts = [
  {
    title: "7 estratégias para reduzir faltas de clientes no seu salão",
    excerpt: "Aprenda técnicas comprovadas para diminuir o no-show e aumentar seu faturamento mensal.",
    category: "Gestão",
    date: "25 Nov 2024",
    readTime: "5 min",
    icon: Calendar
  },
  {
    title: "Precificação de serviços: como cobrar o que você vale",
    excerpt: "Um guia completo para calcular o preço ideal dos seus serviços sem perder clientes.",
    category: "Gestão",
    date: "22 Nov 2024",
    readTime: "7 min",
    icon: TrendingUp
  },
  {
    title: "Instagram para salões: o que postar em 2024",
    excerpt: "Ideias de conteúdo que engajam e atraem novos clientes para o seu negócio.",
    category: "Marketing",
    date: "20 Nov 2024",
    readTime: "6 min",
    icon: MessageSquare
  },
  {
    title: "Como criar uma experiência memorável para seus clientes",
    excerpt: "Pequenos detalhes que transformam clientes ocasionais em fãs da sua marca.",
    category: "Atendimento",
    date: "18 Nov 2024",
    readTime: "4 min",
    icon: Users
  },
  {
    title: "Organização de agenda: erros que estão custando dinheiro",
    excerpt: "Identifique e corrija os problemas mais comuns na gestão do tempo.",
    category: "Gestão",
    date: "15 Nov 2024",
    readTime: "5 min",
    icon: Clock
  },
  {
    title: "Tendências de cortes e coloração para o verão",
    excerpt: "O que seus clientes vão pedir nos próximos meses e como se preparar.",
    category: "Dicas",
    date: "12 Nov 2024",
    readTime: "6 min",
    icon: Scissors
  }
];

const popularPosts = [
  "Como fidelizar clientes no primeiro atendimento",
  "Planilha gratuita: controle financeiro para salões",
  "Whatsapp Business: configurações essenciais",
  "Quanto investir em marketing digital",
  "Checklist de abertura de salão"
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4">Blog Belezeiro</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Conhecimento para você
                <span className="text-primary"> crescer</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Dicas, estratégias e insights para transformar seu negócio de beleza 
                em uma máquina de resultados.
              </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Buscar artigos..." 
                className="pl-12 h-12 text-base"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="pb-8 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={category.active ? "default" : "outline"}
                  className="gap-2"
                >
                  {category.icon && <category.icon className="w-4 h-4" />}
                  {category.name}
                  <span className="text-xs opacity-70">({category.count})</span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-8 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <Card className="overflow-hidden border-border hover:border-primary/50 transition-colors cursor-pointer group">
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto bg-gradient-to-br from-primary via-primary/80 to-primary/60 flex items-center justify-center">
                  <MessageSquare className="w-24 h-24 text-primary-foreground/30" />
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <Badge variant="secondary" className="w-fit mb-4">{featuredPost.category}</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime} de leitura
                    </span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Posts */}
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Artigos Recentes</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {posts.map((post, index) => (
                    <Card 
                      key={index} 
                      className="border-border hover:border-primary/50 transition-all cursor-pointer group hover:shadow-lg"
                    >
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                          <post.icon className="w-6 h-6 text-primary" />
                        </div>
                        <Badge variant="outline" className="mb-3">{post.category}</Badge>
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center pt-6">
                  <Button variant="outline" className="gap-2">
                    Carregar mais artigos
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Popular Posts */}
                <Card className="border-border">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Mais Lidos
                    </h3>
                    <ul className="space-y-4">
                      {popularPosts.map((title, index) => (
                        <li key={index}>
                          <a 
                            href="#" 
                            className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-start gap-3"
                          >
                            <span className="text-primary font-bold">{index + 1}.</span>
                            {title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-foreground mb-2">
                      Newsletter Semanal
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Receba as melhores dicas direto no seu e-mail, toda terça-feira.
                    </p>
                    <div className="space-y-3">
                      <Input placeholder="Seu e-mail" className="bg-background" />
                      <Button className="w-full">Inscrever-se</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Sem spam. Cancele quando quiser.
                    </p>
                  </CardContent>
                </Card>

                {/* CTA Card */}
                <Card className="border-border bg-gradient-to-br from-primary to-primary/80">
                  <CardContent className="p-6 text-center">
                    <Scissors className="w-10 h-10 text-primary-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-primary-foreground mb-2">
                      Teste o Belezeiro Grátis
                    </h3>
                    <p className="text-primary-foreground/80 text-sm mb-4">
                      Coloque em prática o que você aprende aqui.
                    </p>
                    <Button variant="secondary" size="sm" className="w-full">
                      Criar conta grátis
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Topics Section */}
        <section className="py-16 px-4 md:px-6 bg-muted/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-2">Explore por Tema</h2>
              <p className="text-muted-foreground">Encontre conteúdo específico para suas necessidades</p>
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "Gestão Financeira", count: "12 artigos", icon: BarChart },
                { title: "Marketing Digital", count: "8 artigos", icon: TrendingUp },
                { title: "Atendimento ao Cliente", count: "10 artigos", icon: Users },
                { title: "Tendências e Técnicas", count: "15 artigos", icon: Scissors },
              ].map((topic, index) => (
                <Card 
                  key={index} 
                  className="border-border hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <topic.icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{topic.title}</h3>
                    <p className="text-sm text-muted-foreground">{topic.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
};

export default Blog;
