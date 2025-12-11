import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

// Confetti component
const Confetti = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    const colors = [
      'hsl(195 70% 45%)',   // primary blue
      'hsl(195 70% 60%)',   // lighter blue
      'hsl(195 80% 75%)',   // sky blue
      'hsl(200 60% 35%)',   // ocean deep
      'hsl(180 50% 70%)',   // teal
    ];

    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 3 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
    }));

    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <div
            className="rounded-sm"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Firework effect
const Fireworks = () => {
  const [bursts, setBursts] = useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    const newBursts = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left: 10 + Math.random() * 80,
      top: 10 + Math.random() * 40,
      delay: i * 0.8 + Math.random() * 0.5,
    }));

    setBursts(newBursts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute animate-firework"
          style={{
            left: `${burst.left}%`,
            top: `${burst.top}%`,
            animationDelay: `${burst.delay}s`,
          }}
        >
          <div className="w-20 h-20 rounded-full bg-primary/20 blur-xl" />
        </div>
      ))}
    </div>
  );
};

const OnboardingSuccess = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <Confetti />
      <Fireworks />

      <div className="content-container text-center space-y-8 relative z-10 max-w-md mx-auto">
        {/* Success Animation */}
        <div className="relative">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          
          {/* Floating sparkles */}
          <div className="absolute -top-2 -right-2 animate-float">
            <Sparkles className="h-6 w-6 text-primary/60" />
          </div>
          <div className="absolute -bottom-1 -left-3 animate-float" style={{ animationDelay: "0.5s" }}>
            <Sparkles className="h-5 w-5 text-primary/40" />
          </div>
          <div className="absolute top-0 left-0 animate-float" style={{ animationDelay: "1s" }}>
            <Sparkles className="h-4 w-4 text-primary/50" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">
            Seu espaço de trabalho está pronto! 🎉
          </h1>
          <p className="text-muted-foreground text-lg">
            Você já pode começar a gerenciar sua agenda e receber clientes.
          </p>
        </div>

        {/* Features reminder */}
        <div className="bg-secondary/50 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-foreground">O que você pode fazer agora:</h3>
          <ul className="text-sm text-muted-foreground space-y-2 text-left">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Personalizar seu negócio
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Configurar seu secretário(a)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Configurar seus horários de atendimento
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Definir preços e duração dos serviços
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Compartilhar seu link de agendamento
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
              Convidar membros da equipe
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div>
          <Button
            size="lg"
            onClick={handleGoToDashboard}
            className="w-full h-14 text-base font-semibold shadow-soft gap-2"
          >
            Ir para o painel
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSuccess;