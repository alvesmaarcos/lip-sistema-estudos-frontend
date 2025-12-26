import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-bold text-primary tracking-wide">ESTUDOS</h1>
        <p className="text-xl text-muted-foreground">
          Sistema de Gerenciamento de Estudos e Revisões
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/cadastro">Criar Conta</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Entrar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
