import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useApp } from "@/contexts/AppContext";
import CircularProgress from "@/components/referral/CircularProgress";
import { 
  Gift, 
  Link as LinkIcon, 
  Copy, 
  Check, 
  Users, 
  Calendar, 
  Award,
  UserPlus,
  Trophy,
  Target
} from "lucide-react";

const SLOTS_PER_LINK = 60;
const REWARD_MONTHS = 6;

interface ReferralLink {
  id: string;
  code: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

interface Referral {
  id: string;
  professionalName: string;
  signupDate: Date;
  linkId: string;
}

// Mock data
const mockLinks: ReferralLink[] = [
  {
    id: '1',
    code: 'REF-ABC123',
    usageLimit: SLOTS_PER_LINK,
    usedCount: 42,
    status: 'active',
    createdAt: new Date('2024-11-15'),
  },
  {
    id: '2',
    code: 'REF-XYZ789',
    usageLimit: SLOTS_PER_LINK,
    usedCount: 60,
    status: 'completed',
    createdAt: new Date('2024-10-01'),
    completedAt: new Date('2024-11-01'),
  },
];

const mockReferrals: Referral[] = [
  { id: '1', professionalName: 'Dra. Maria Santos', signupDate: new Date('2024-11-20'), linkId: '1' },
  { id: '2', professionalName: 'Dr. João Silva', signupDate: new Date('2024-11-18'), linkId: '1' },
  { id: '3', professionalName: 'Dra. Ana Oliveira', signupDate: new Date('2024-11-16'), linkId: '1' },
  { id: '4', professionalName: 'Dr. Carlos Mendes', signupDate: new Date('2024-10-15'), linkId: '2' },
  { id: '5', professionalName: 'Dra. Paula Costa', signupDate: new Date('2024-10-10'), linkId: '2' },
];

const ReferralProgram = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { emptyStates } = useApp();
  const [links, setLinks] = useState<ReferralLink[]>(emptyStates.referrals ? [] : mockLinks);
  const [referrals, setReferrals] = useState<Referral[]>(emptyStates.referrals ? [] : mockReferrals);
  const [copied, setCopied] = useState(false);

  // Sync with empty states toggle
  useEffect(() => {
    if (emptyStates.referrals) {
      setLinks([]);
      setReferrals([]);
    } else {
      setLinks(mockLinks);
      setReferrals(mockReferrals);
    }
  }, [emptyStates.referrals]);

  const activeLink = links.find(link => link.status === 'active');
  const hasActiveLink = !!activeLink;
  const canGenerateLink = !hasActiveLink || emptyStates.allowNewReferralLink;

  const handleGenerateLink = () => {
    if (!canGenerateLink) return;

    const newLink: ReferralLink = {
      id: String(Date.now()),
      code: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      usageLimit: SLOTS_PER_LINK,
      usedCount: 0,
      status: 'active',
      createdAt: new Date(),
    };

    setLinks(prev => [newLink, ...prev]);
    toast({
      title: "Link gerado com sucesso!",
      description: `Complete ${SLOTS_PER_LINK} cadastros para ganhar ${REWARD_MONTHS} meses Pro grátis.`,
    });
  };

  const handleCopyLink = () => {
    if (!activeLink) return;
    const fullLink = `${window.location.origin}/cadastro?ref=${activeLink.code}`;
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copiado!",
      description: "Cole e compartilhe com seus colegas.",
    });
  };

  const getStatusBadge = (status: ReferralLink['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Em andamento</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Concluído ✓</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="content-container py-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Gift className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Programa de Indicação</h1>
          </div>
          <p className="text-muted-foreground ml-13">
            Complete <span className="font-semibold text-primary">{SLOTS_PER_LINK} indicações</span> e ganhe <span className="font-semibold text-emerald-500">{REWARD_MONTHS} meses Pro grátis</span>
          </p>
        </div>

        <div className={`flex gap-6 ${isMobile ? 'flex-col' : ''}`}>
          {/* Main Section */}
          <div className="flex-1 space-y-6">
            {/* Benefits Highlight */}
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-primary/5">
              <CardContent className="pt-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-background/80 border border-border/50">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                      <Trophy className="h-6 w-6 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Você ganha</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-emerald-500">{REWARD_MONTHS} meses Pro grátis</span>
                      </p>
                      <p className="text-xs text-muted-foreground">ao completar {SLOTS_PER_LINK} indicações</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-background/80 border border-border/50">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <UserPlus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Seu amigo ganha</p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-primary">1 mês Pro grátis</span> de presente
                      </p>
                      <p className="text-xs text-muted-foreground">ao se cadastrar pelo link</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How it works */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Como funciona</CardTitle>
                <CardDescription>
                  Complete o desafio e ganhe meses Pro grátis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-sm">Gere seu link</p>
                      <p className="text-xs text-muted-foreground">Cada link tem {SLOTS_PER_LINK} slots de uso</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-sm">Compartilhe</p>
                      <p className="text-xs text-muted-foreground">Seus amigos ganham 1 mês Pro cada</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-sm">Complete e ganhe</p>
                      <p className="text-xs text-muted-foreground">{SLOTS_PER_LINK} cadastros = {REWARD_MONTHS} meses Pro</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Regras do programa</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm">
                    <Target className="h-4 w-4 text-primary shrink-0" />
                    <span>Cada link tem <strong>{SLOTS_PER_LINK} slots</strong> de uso</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Award className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Ao completar os {SLOTS_PER_LINK} cadastros, você ganha <strong>{REWARD_MONTHS} meses Pro grátis</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Gift className="h-4 w-4 text-primary shrink-0" />
                    <span>Cada pessoa que se cadastrar pelo seu link ganha <strong>1 mês Pro grátis</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>Você pode ter apenas <strong>1 link ativo</strong> por vez</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>Após completar, você pode <strong>gerar um novo link</strong></span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Generate Link */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {hasActiveLink ? 'Seu link ativo' : 'Gerar novo link'}
                </CardTitle>
                <CardDescription>
                  {hasActiveLink 
                    ? `Complete ${SLOTS_PER_LINK} cadastros para ganhar ${REWARD_MONTHS} meses Pro`
                    : 'Crie seu link e comece a indicar'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {canGenerateLink && !activeLink ? (
                  <div className="text-center py-4">
                    <div className="mb-4 p-4 rounded-xl bg-muted/50 inline-block">
                      <Target className="h-12 w-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Seu link terá <strong>{SLOTS_PER_LINK} slots</strong> de uso
                      </p>
                    </div>
                    <Button onClick={handleGenerateLink} className="gap-2" size="lg">
                      <LinkIcon className="h-4 w-4" />
                      Gerar link de indicação
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Active Link Display */}
                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={`${window.location.origin}/cadastro?ref=${activeLink?.code}`}
                        className="font-mono text-sm bg-muted"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyLink}
                        className="shrink-0"
                      >
                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>

                    {/* Link Stats with Circular Progress */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-xl bg-muted/30 border border-border/50">
                      <CircularProgress 
                        value={activeLink.usedCount} 
                        max={activeLink.usageLimit} 
                      />
                      <div className="flex-1 text-center sm:text-left">
                        <p className="text-lg font-semibold text-foreground mb-1">
                          {activeLink.usedCount >= activeLink.usageLimit ? (
                            <span className="text-emerald-500">🎉 Parabéns! Meta atingida!</span>
                          ) : (
                            <>Faltam <span className="text-primary">{activeLink.usageLimit - activeLink.usedCount}</span> cadastros</>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {activeLink.usedCount >= activeLink.usageLimit 
                            ? `Você ganhou ${REWARD_MONTHS} meses Pro grátis!`
                            : `Complete para ganhar ${REWARD_MONTHS} meses Pro grátis`
                          }
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3 inline mr-1" />
                          Criado em {formatDate(activeLink.createdAt)}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className={`space-y-6 ${isMobile ? '' : 'w-80 flex-shrink-0'}`}>
            {/* Previous Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Links gerados</CardTitle>
              </CardHeader>
              <CardContent>
                {links.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum link gerado ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {links.map(link => (
                      <div 
                        key={link.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="min-w-0">
                          <p className="font-mono text-sm truncate">{link.code}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(link.createdAt)} • {link.usedCount}/{link.usageLimit} usos
                          </p>
                        </div>
                        {getStatusBadge(link.status)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Referral History */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Inscrições recebidas</CardTitle>
                <CardDescription className="text-xs">
                  Profissionais que se cadastraram via seus links
                </CardDescription>
              </CardHeader>
              <CardContent>
                {referrals.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <UserPlus className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma inscrição ainda</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {referrals.map(referral => (
                      <div 
                        key={referral.id} 
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                          {referral.professionalName.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{referral.professionalName}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(referral.signupDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generate New Link Button */}
            {hasActiveLink && !emptyStates.allowNewReferralLink && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Link em andamento</p>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Complete os {SLOTS_PER_LINK} cadastros do seu link atual para gerar um novo.
                  </p>
                  <Button disabled className="w-full" variant="outline">
                    Gerar novo link
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReferralProgram;
