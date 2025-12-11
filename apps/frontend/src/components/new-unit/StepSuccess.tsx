import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StepSuccessProps {
  unitName: string;
  onComplete: () => void;
}

interface Confetti {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export const StepSuccess = ({ unitName, onComplete }: StepSuccessProps) => {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    // Generate confetti particles
    const particles: Confetti[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
    }));
    setConfetti(particles);

    // Clear confetti after animation
    const timer = setTimeout(() => setConfetti([]), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-0 pointer-events-none animate-[confetti-fall_linear_forwards]"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        >
          <div
            className={cn(
              "rounded-full",
              particle.id % 3 === 0
                ? "bg-primary/60"
                : particle.id % 3 === 1
                ? "bg-primary/40"
                : "bg-primary/80"
            )}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        </div>
      ))}

      {/* Content */}
      <div className="max-w-md mx-auto text-center space-y-8 animate-scale-in relative z-10">
        {/* Success Icon */}
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-primary" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-primary animate-pulse" />
        </div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground">
            Unidade Criada! 🎉
          </h1>
          <p className="text-lg text-muted-foreground">
            A unidade <span className="font-semibold text-foreground">{unitName}</span> foi
            configurada com sucesso e já está pronta para uso.
          </p>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button
            onClick={onComplete}
            size="lg"
            className="h-14 px-8 text-base font-medium"
          >
            Ir para a unidade
          </Button>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Confetti Animation Keyframes */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
