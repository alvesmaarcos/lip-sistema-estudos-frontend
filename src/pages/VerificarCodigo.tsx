import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";

const VerificarCodigo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || "";

    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleVerifyCode = () => {
        if (code.length !== 6) {
            toast.error("Código inválido", {
                description: "Por favor, insira o código de 6 dígitos.",
            });
            return;
        }

        setIsLoading(true);
        console.log("Código informado:", code);

        // TODO: Integrar com backend para verificar código
        // Simulação: código correto é "123456", qualquer outro é incorreto
        const isCodeCorrect = code === "123456"; // Remover quando integrar com backend

        setTimeout(() => {
            setIsLoading(false);

            if (isCodeCorrect) {
                toast.success("Código verificado!", {
                    description: "Agora você pode definir sua nova senha.",
                });
                navigate("/nova-senha", { state: { email, code } });
            } else {
                toast.error("Código incorreto", {
                    description: "Um novo código foi enviado para o seu e-mail.",
                });
                setCode("");
                // TODO: Backend reenvia código automaticamente quando incorreto
            }
        }, 1500);
    };

    const handleResendCode = () => {
        setIsResending(true);
        console.log("Reenviando código para:", email);

        // TODO: Integrar com backend para reenviar código
        setTimeout(() => {
            setIsResending(false);
            toast.success("Código reenviado!", {
                description: "Um novo código de 6 dígitos foi enviado para o seu e-mail.",
            });
        }, 1500);
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
                        <span className="font-medium text-foreground">{email || "seu e-mail"}</span>.
                    </p>

                    <div className="space-y-6">
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={code}
                                onChange={(value) => setCode(value)}
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
                            {isLoading ? "VERIFICANDO..." : "VERIFICAR CÓDIGO"}
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
