import { useState } from "react";
import { Bot, Smartphone, Check, Info, Zap, BarChart3, MessageSquare, Calendar, Users, Clock, AlertTriangle, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { WhatsAppQRCode } from "./WhatsAppQRCode";
import { useApp } from "@/contexts/AppContext";

export const OnlineSecretarySettings = () => {
  const { toast } = useToast();
  const { isPro } = useApp();
  const [isConnected, setIsConnected] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const [secretaryName, setSecretaryName] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [triggers, setTriggers] = useState({
    offHours: true,
    autoSchedule: true,
    sendConfirmation: true,
    sendReminder: false,
  });

  const handleTriggerChange = (key: keyof typeof triggers) => {
    setTriggers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do secretário foram atualizadas.",
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "WhatsApp desconectado",
      description: "Seu número foi desvinculado do secretário.",
    });
  };

  const stats = [
    { label: "Agendados este mês", value: "47", icon: Calendar },
    { label: "Atendidos este mês", value: "128", icon: Users },
    { label: "Resposta automát.", value: "92%", icon: MessageSquare },
    { label: "Mensagens totais", value: "1.2k", icon: BarChart3 },
  ];

  const freeBlockedFeatures = [
    { icon: Clock, text: "Você perde tempo respondendo manualmente no WhatsApp" },
    { icon: AlertTriangle, text: "Seus clientes ficam esperando resposta" },
    { icon: Calendar, text: "Risco de errar agendamentos importantes" },
    { icon: Users, text: "Possibilidade de marcar dois clientes no mesmo horário" },
    { icon: MessageSquare, text: "Clientes desistem quando não são atendidos rápido" },
  ];

  const proSecretaryBenefits = [
    "Atendimento automático 24 horas por dia",
    "Agendamentos sem erros ou conflitos",
    "Respostas instantâneas aos seus clientes",
    "Confirmações e lembretes automáticos",
    "Mais tempo para focar no seu trabalho",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Secretário online</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure seu assistente virtual de atendimento
        </p>
      </div>

      {!isPro ? (
        // FREE VERSION - CTA to upgrade
        <div className="space-y-6">
          {/* Warning Card */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Você está perdendo clientes!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sem o secretário online, você enfrenta esses problemas todos os dias:
                </p>
                <ul className="mt-4 space-y-3">
                  {freeBlockedFeatures.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Icon className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                        <span>{feature.text}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Upgrade CTA Card */}
          <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-violet-500/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Contrate seu secretário online
                </h3>
                <p className="text-sm text-muted-foreground">
                  Deixe a IA trabalhar por você enquanto você foca no que importa
                </p>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {proSecretaryBenefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* Highlight Card */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Atenda a qualquer hora, mesmo dormindo!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seus clientes recebem resposta instantânea às 3h da manhã, no domingo, ou no feriado. Nunca mais perca um agendamento.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
              <div className="text-sm text-muted-foreground">
                Disponível no <span className="font-bold text-foreground">Plano Pro</span>
              </div>
              <Button size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Assinar Pro agora
              </Button>
            </div>
          </div>
        </div>
      ) : !isConnected ? (
        // PRO - DISCONNECTED VERSION
        <div className="space-y-6">
          {/* What is it */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">O que é o Secretário Online?</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  O secretário é uma IA que responde seus clientes automaticamente pelo WhatsApp. Ele pode:
                </p>
                <ul className="mt-3 space-y-2">
                  {[
                    "Responder perguntas frequentes",
                    "Realizar agendamentos",
                    "Enviar confirmações e lembretes",
                    "Atender fora do horário comercial"
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Initial Configuration */}
          <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              📝 Configuração Inicial
            </h3>

            <div className="space-y-2">
              <Label htmlFor="secretary-name">Nome do secretário</Label>
              <Input
                id="secretary-name"
                placeholder="Ex: Belezeiro Assistente, Atendimento Salão"
                value={secretaryName}
                onChange={(e) => setSecretaryName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Este nome será usado para identificar o secretário nas conversas.
              </p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">Dica importante</p>
                  <p className="text-muted-foreground mt-1">
                    Se deixar em branco, o secretário responderá <strong>todas</strong> as mensagens automaticamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Se você usa o número para conversas pessoais, configure um nome para que o cliente precise chamá-lo antes de receber respostas automáticas.
                </p>
              </div>
            </div>
          </div>

          {/* Connect WhatsApp */}
          <div className="bg-muted/30 border border-border rounded-lg p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Vincular seu WhatsApp</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Para ativar o secretário, conecte seu número escaneando o QR Code.
              </p>
            </div>
            <Button onClick={() => setShowQRCode(true)} className="gap-2">
              <Smartphone className="h-4 w-4" />
              Vincular Celular
            </Button>
          </div>
        </div>
      ) : (
        // PRO - CONNECTED VERSION
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">WhatsApp Conectado</h3>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-700">Ativo</Badge>
                    <Badge variant="outline" className="text-xs">Business</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">+55 11 99999-9999</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleDisconnect}>
                Desconectar
              </Button>
            </div>
          </div>

          {/* Secretary Status */}
          <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">Status do Secretário</h3>
              </div>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            </div>

            <p className="text-sm text-muted-foreground">
              {isEnabled 
                ? "Seu assistente está atendendo seus clientes automaticamente."
                : "O secretário está pausado e não responderá mensagens."
              }
            </p>

            <div className="pt-4 border-t border-border space-y-2">
              <Label htmlFor="secretary-name-edit">Nome do secretário</Label>
              <div className="flex gap-2">
                <Input
                  id="secretary-name-edit"
                  placeholder="Belezeiro Assistente"
                  value={secretaryName}
                  onChange={(e) => setSecretaryName(e.target.value)}
                  disabled={!isEnabled}
                />
              </div>
            </div>
          </div>

          {/* Triggers */}
          <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Comportamentos Automáticos
            </h3>

            <div className="space-y-3">
              {[
                { key: "offHours" as const, label: "Responder mensagens fora do horário" },
                { key: "autoSchedule" as const, label: "Agendar automaticamente quando houver horário livre" },
                { key: "sendConfirmation" as const, label: "Enviar confirmação ao cliente" },
                { key: "sendReminder" as const, label: "Enviar lembrete antes do horário" },
              ].map((trigger) => (
                <div key={trigger.key} className="flex items-center space-x-3">
                  <Checkbox
                    id={trigger.key}
                    checked={triggers[trigger.key]}
                    onCheckedChange={() => handleTriggerChange(trigger.key)}
                    disabled={!isEnabled}
                  />
                  <Label 
                    htmlFor={trigger.key} 
                    className={!isEnabled ? "text-muted-foreground" : ""}
                  >
                    {trigger.label}
                  </Label>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <div className="bg-violet-500/10 border border-violet-500/20 rounded-lg p-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  🔮 Fluxos Avançados (em breve)
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Respostas personalizadas por serviço</li>
                  <li>• Integração com catálogo de serviços</li>
                  <li>• Mensagens de follow-up automáticas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-muted/30 border border-border rounded-lg p-5 space-y-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Estatísticas do Secretário
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-background/50 rounded-lg p-4 text-center">
                    <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} disabled={!isEnabled}>
            Salvar configurações
          </Button>
        </div>
      )}

      {/* WhatsApp QR Code Modal */}
      <WhatsAppQRCode 
        open={showQRCode} 
        onOpenChange={setShowQRCode}
        onConnect={() => setIsConnected(true)}
      />
    </div>
  );
};
