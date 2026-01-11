import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
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
import { InputPassword } from "@/components/ui/input-password";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Insira um e-mail válido."),
  password: z.string().min(1, "A senha é obrigatória."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { login } = useAuth();
  const [showEmailNotVerified, setShowEmailNotVerified] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setUserEmail(data.email);
      await login(data.email, data.password);
    } catch (error) {
      // Se o erro for de email não verificado
      if (error.response?.data?.message?.includes("Email not verified")) {
        setShowEmailNotVerified(true);
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      // TODO: Implementar endpoint de reenvio no backend
      toast.success("Email de verificação reenviado!", {
        description: "Verifique sua caixa de entrada.",
      });
    } catch (error) {
      toast.error("Erro ao reenviar email");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center justify-center">
          <Logo className="text-white h-16 md:h-24 w-auto" />
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg animate-scale-in">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
            LOGIN
          </h2>

          {/* Alerta de Email Não Verificado */}
          {showEmailNotVerified && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                    Email não verificado
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    Você precisa verificar seu email antes de fazer login.
                  </p>
                  <Button
                    onClick={handleResendVerification}
                    variant="outline"
                    size="sm"
                    className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                  >
                    Reenviar Email de Verificação
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>senha</FormLabel>
                    <FormControl>
                      <InputPassword
                        placeholder="insira sua senha"
                        disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "ENTRAR"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6 flex flex-col gap-3">
            <Link
              to="/cadastro"
              className="text-primary hover:underline text-sm font-medium transition-colors"
            >
              criar uma conta
            </Link>

            <Link
              to="/recuperar-senha"
              className="text-primary hover:underline text-sm font-medium transition-colors"
            >
              esqueceu sua senha?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
