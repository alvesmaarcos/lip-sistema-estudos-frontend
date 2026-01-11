import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Logo } from "@/components/Logo";
import { forgotPassword } from "@/http/api/auth";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Insira um e-mail válido."),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);

    try {
      await forgotPassword(data.email);

      toast.success("Código enviado!", {
        description: "Um código de 6 dígitos foi enviado para o seu e-mail.",
      });

      // Redireciona para tela de verificação de código
      navigate("/verificar-codigo", { state: { email: data.email } });
    } catch (error) {
      toast.error("Erro ao enviar código", {
        description:
          error.response?.data?.message || "Tente novamente em instantes.",
      });
    } finally {
      setIsLoading(false);
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
            RECUPERAR SENHA
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Informe seu e-mail para receber um código de recuperação.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>e-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
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
                    ENVIANDO...
                  </>
                ) : (
                  "ENVIAR CÓDIGO"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
