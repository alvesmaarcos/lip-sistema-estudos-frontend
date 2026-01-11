import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/http/api/auth";
import { toast } from "sonner";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("Token de verificação não encontrado na URL.");
      return;
    }

    // Função assíncrona para verificar o email
    const verify = async () => {
      try {
        await verifyEmail(token);

        setStatus("success");

        // Toast de sucesso APENAS uma vez
        toast.success("Email verificado!", {
          description: "Sua conta foi ativada com sucesso.",
          id: "verify-success", // ID para evitar duplicatas
        });

        // Redireciona após 3 segundos
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3000);
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error.response?.data?.message || "Token inválido ou expirado"
        );

        // Toast de erro APENAS uma vez
        toast.error("Erro na verificação", {
          description:
            error.response?.data?.message || "Token inválido ou expirado",
          id: "verify-error", // ID para evitar duplicatas
        });
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center">
          <Logo className="text-white h-16 md:h-24 w-auto" />
        </div>

        {/* Card de Status */}
        <div className="bg-card rounded-2xl p-8 text-center animate-scale-in shadow-xl">
          {status === "loading" && (
            <>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Verificando email...
              </h2>
              <p className="text-muted-foreground">
                Por favor, aguarde enquanto validamos seu email.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-green-600">
                Email verificado!
              </h2>
              <p className="text-muted-foreground mb-6">
                Sua conta foi ativada com sucesso. Redirecionando para login...
              </p>
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-destructive">
                Erro na verificação
              </h2>
              <p className="text-muted-foreground mb-6">{errorMessage}</p>

              <div className="space-y-3">
                <Button onClick={() => navigate("/login")} className="w-full">
                  Ir para Login
                </Button>

                <Button
                  onClick={() => navigate("/cadastro")}
                  variant="outline"
                  className="w-full"
                >
                  Criar Nova Conta
                </Button>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-3 text-left">
                  <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-1">Precisa de ajuda?</p>
                    <p>
                      Se o link expirou, você pode solicitar um novo email de
                      verificação entrando em contato com o suporte.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
