import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Logo } from "@/components/Logo";
import { forgotPassword } from "@/http/api/auth";
import { toast } from "sonner";

const VerificarCodigo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Se não tiver email, redireciona (DEPOIS dos hooks)
  if (!email) {
    navigate("/recuperar-senha");
    return null;
  }

  const handleVerifyCode = () => {
    if (code.length !== 6) {
      toast.error("Código inválido", {
        description: "Por favor, insira o código de 6 dígitos.",
      });
      return;
    }

    setIsLoading(true);

    // Simula validação - backend vai verificar se código está correto
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Código verificado!", {
        description: "Agora você pode definir sua nova senha.",
      });
      navigate("/nova-senha", { state: { email, code } });
    }, 1000);
  };

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      await forgotPassword(email);
      toast.success("Código reenviado!", {
        description: "Um novo código foi enviado para o seu e-mail.",
      });
    } catch (error) {
      toast.error("Erro ao reenviar código", {
        description: error.response?.data?.message || "Tente novamente.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Logo className="text-white h-16 md:h-24 w-auto" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-scale-in">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">Voltar para login</span>
          </button>

          <h2 className="text-2xl font-semibold text-foreground text-center mb-2">
            VERIFICAR CÓDIGO
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Insira o código de 6 dígitos enviado para{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>

          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              onClick={handleVerifyCode}
              className="w-full"
              size="lg"
              disabled={isLoading || code.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  VERIFICANDO...
                </>
              ) : (
                "VERIFICAR CÓDIGO"
              )}
            </Button>

            <div className="text-center">
              <button
                onClick={handleResendCode}
                disabled={isResending}
                className="text-primary hover:underline text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isResending ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificarCodigo;
