import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InputPassword } from "@/components/ui/input-password";
import { Logo } from "@/components/Logo";
import { resetPassword } from "@/http/api/auth";
import { toast } from "sonner";

const novaSenhaSchema = z
  .object({
    senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
    confirmarSenha: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });

type NovaSenhaFormValues = z.infer<typeof novaSenhaSchema>;

const NovaSenha = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const code = location.state?.code || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<NovaSenhaFormValues>({
    resolver: zodResolver(novaSenhaSchema),
    defaultValues: {
      senha: "",
      confirmarSenha: "",
    },
  });

  // Se não tiver email ou código, redireciona (DEPOIS dos hooks)
  if (!email || !code) {
    navigate("/recuperar-senha");
    return null;
  }

  const onSubmit = async (data: NovaSenhaFormValues) => {
    setIsLoading(true);

    try {
      // Chama API do backend passando email, código e nova senha
      await resetPassword({
        email,
        code,
        newPassword: data.senha,
      });

      setIsSuccess(true);
      toast.success("Senha alterada!", {
        description:
          "Sua senha foi alterada com sucesso. Faça login com sua nova senha.",
      });

      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Erro ao alterar senha", {
        description:
          error.response?.data?.message ||
          "Código pode ter expirado. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Tela de sucesso
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center mb-8">
            <Logo className="text-white h-16 md:h-24 w-auto" />
          </div>

          <div className="bg-card rounded-2xl p-8 text-center animate-scale-in">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Senha Redefinida!</h2>
            <p className="text-muted-foreground mb-6">
              Sua senha foi alterada com sucesso. Redirecionando para o login...
            </p>
            <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
          </div>
        </div>
      </div>
    );
  }

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
            NOVA SENHA
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Defina sua nova senha para acessar sua conta.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>nova senha</FormLabel>
                    <FormControl>
                      <InputPassword
                        placeholder="mínimo 6 caracteres"
                        className="bg-input border-border h-12"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>confirmar senha</FormLabel>
                    <FormControl>
                      <InputPassword
                        placeholder="repita a senha"
                        className="bg-input border-border h-12"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    SALVANDO...
                  </>
                ) : (
                  "SALVAR NOVA SENHA"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NovaSenha;
