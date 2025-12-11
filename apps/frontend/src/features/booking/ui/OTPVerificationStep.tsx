// ============================================================================
// OTP VERIFICATION STEP - Step to Verify OTP Code
// ============================================================================

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";

interface OTPVerificationStepProps {
  phone: string;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function OTPVerificationStep({
  phone,
  onVerify,
  onResend,
  onBack,
  isLoading = false,
  error,
}: OTPVerificationStepProps) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [resendCountdown, setResendCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    // Auto-submit when all digits are entered
    if (newCode.every((d) => d !== "") && index === 5) {
      onVerify(newCode.join(""));
      return;
    }

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    const newCode = [...code];

    for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
      newCode[i] = pastedData[i];
    }

    setCode(newCode);

    if (newCode.every((d) => d !== "")) {
      onVerify(newCode.join(""));
    } else {
      // Focus the next empty input
      const nextEmpty = newCode.findIndex((d) => d === "");
      if (nextEmpty !== -1) {
        inputRefs.current[nextEmpty]?.focus();
      }
    }
  };

  const handleResend = () => {
    onResend();
    setResendCountdown(60);
    setCode(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const formatPhone = (p: string) => {
    if (p.length === 11) {
      return `(${p.slice(0, 2)}) ${p.slice(2, 7)}-${p.slice(7)}`;
    }
    return p;
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Verifique seu telefone</CardTitle>
        <CardDescription className="text-base">
          Digite o código enviado para{" "}
          <span className="font-medium">{formatPhone(phone)}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-2">
          {code.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-2xl font-bold"
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <p className="text-center text-sm text-destructive">{error}</p>
        )}

        <div className="text-center">
          {resendCountdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Reenviar código em {resendCountdown}s
            </p>
          ) : (
            <Button
              variant="link"
              onClick={handleResend}
              disabled={isLoading}
              className="p-0 h-auto"
            >
              Reenviar código
            </Button>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button
            type="button"
            className="flex-1 h-12"
            onClick={() => onVerify(code.join(""))}
            disabled={code.some((d) => d === "") || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
