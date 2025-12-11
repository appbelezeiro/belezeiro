import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { useEmptyStates } from "@/contexts/AppContext";
import { 
  LifeBuoy, 
  Bug, 
  Lightbulb, 
  HelpCircle,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare
} from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  description: string;
  type: "bug" | "help" | "feature";
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  createdBy: string;
  attendedAt?: string;
  attendedBy?: string;
  conclusion?: string;
}

const mockTickets: Ticket[] = [
  {
    id: "TK-001",
    title: "Erro ao salvar configurações do site",
    description: "Quando tento salvar as configurações do site público, aparece uma mensagem de erro e as alterações não são salvas.",
    type: "bug",
    status: "resolved",
    createdAt: "28/11/2024 às 14:32",
    createdBy: "João Silva",
    attendedAt: "29/11/2024 às 09:15",
    attendedBy: "Ana - Suporte Técnico",
    conclusion: "O problema foi identificado como uma falha na validação do formulário. A correção foi aplicada e as configurações agora são salvas corretamente. Recomendamos limpar o cache do navegador para garantir o funcionamento.",
  },
  {
    id: "TK-002",
    title: "Adicionar integração com Google Calendar",
    description: "Gostaria de sugerir a integração com o Google Calendar para sincronizar automaticamente os agendamentos.",
    type: "feature",
    status: "in_progress",
    createdAt: "25/11/2024 às 10:00",
    createdBy: "João Silva",
    attendedAt: "26/11/2024 às 11:30",
    attendedBy: "Carlos - Produto",
    conclusion: "Sua sugestão foi aceita e está em desenvolvimento. Previsão de lançamento: Janeiro/2025.",
  },
  {
    id: "TK-003",
    title: "Como configurar horários de funcionamento",
    description: "Preciso de ajuda para configurar os horários de funcionamento da minha unidade, especialmente para feriados.",
    type: "help",
    status: "open",
    createdAt: "03/12/2024 às 08:45",
    createdBy: "João Silva",
  },
];

const HelpSupport = () => {
  const { toast } = useToast();
  const { emptyStates } = useEmptyStates();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ticketType, setTicketType] = useState<string>("");

  const tickets = emptyStates.tickets ? [] : mockTickets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !ticketType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ticket criado com sucesso!",
      description: `Seu ticket #TK-004 foi aberto e será analisado em breve.`,
    });

    setTitle("");
    setDescription("");
    setTicketType("");
  };

  const getTypeIcon = (type: Ticket["type"]) => {
    switch (type) {
      case "bug": return <Bug className="h-4 w-4" />;
      case "feature": return <Lightbulb className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "resolved":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Resolvido
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Loader2 className="h-3 w-3 mr-1" />
            Em andamento
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Aberto
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="content-container py-6">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <LifeBuoy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Ajuda e Suporte</h1>
            <p className="text-sm text-muted-foreground">
              Abra tickets para reportar bugs, solicitar ajuda ou sugerir funcionalidades
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* New Ticket Form - Fixed width */}
          <div className="bg-card border border-border rounded-2xl p-6 lg:w-[380px] lg:flex-shrink-0 h-fit">
            <h2 className="text-lg font-medium mb-4">Abrir novo ticket</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de solicitação</Label>
                <Select value={ticketType} onValueChange={setTicketType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">
                      <div className="flex items-center gap-2">
                        <Bug className="h-4 w-4 text-red-500" />
                        Reportar bug
                      </div>
                    </SelectItem>
                    <SelectItem value="help">
                      <div className="flex items-center gap-2">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        Solicitar ajuda
                      </div>
                    </SelectItem>
                    <SelectItem value="feature">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        Sugerir funcionalidade
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Descreva brevemente o assunto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva com detalhes sua solicitação..."
                  className="min-h-[100px]"
                />
              </div>

              <Button type="submit" className="w-full">
                Enviar ticket
              </Button>
            </form>
          </div>

          {/* Tickets List - Flex grow with internal scroll */}
          <div className="bg-card border border-border rounded-2xl p-6 flex-1 flex flex-col min-h-[500px]">
            <h2 className="text-lg font-medium mb-4">Seus tickets</h2>

            {tickets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Nenhum ticket aberto</h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Quando você abrir um ticket, ele aparecerá aqui para você acompanhar o status.
                </p>
              </div>
            ) : (
              <ScrollArea className="flex-1 -mr-3 pr-3">
                <Accordion type="single" collapsible className="space-y-2">
                  {tickets.map((ticket) => (
                    <AccordionItem 
                      key={ticket.id} 
                      value={ticket.id}
                      className="border border-border rounded-xl px-4 data-[state=open]:bg-secondary/30"
                    >
                      <AccordionTrigger className="hover:no-underline py-3">
                        <div className="flex items-center gap-3 text-left">
                          <div className="text-muted-foreground">
                            {getTypeIcon(ticket.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs text-muted-foreground font-mono">
                                {ticket.id}
                              </span>
                              {getStatusBadge(ticket.status)}
                            </div>
                            <p className="text-sm font-medium truncate pr-4">
                              {ticket.title}
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-4 pt-2">
                          {/* Description */}
                          <div className="p-3 bg-secondary/50 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                              {ticket.description}
                            </p>
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>Aberto em: {ticket.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="h-4 w-4" />
                              <span>Por: {ticket.createdBy}</span>
                            </div>
                            
                            {ticket.attendedAt && (
                              <>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  <span>Atendido em: {ticket.attendedAt}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <User className="h-4 w-4" />
                                  <span>Por: {ticket.attendedBy}</span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Conclusion */}
                          {ticket.conclusion && (
                            <div className="border-t border-border pt-3">
                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                Parecer da equipe:
                              </p>
                              <p className="text-sm text-foreground">
                                {ticket.conclusion}
                              </p>
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpSupport;
