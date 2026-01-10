import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom"; // REMOVA 'BrowserRouter' daqui
import { StudyProvider } from "@/contexts/StudyContext";
import { DisciplineProvider } from "@/contexts/DisciplineContext";
import RegistrarEstudo from "./pages/RegistrarEstudo";
import Revisoes from "./pages/Revisoes";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Disciplinas from "./pages/Disciplinas";
import Home from "./pages/Home";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RecuperarSenha from "./pages/RecuperarSenha";
import VerificarCodigo from "./pages/VerificarCodigo";
import NovaSenha from "./pages/NovaSenha";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StudyProvider>
        <DisciplineProvider>
          <Toaster />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/registrar-estudo" element={<RegistrarEstudo />} /> { }
            <Route path="/disciplinas" element={<Disciplinas />} />
            <Route path="/recuperar-senha" element={<RecuperarSenha />} />
            <Route path="/verificar-codigo" element={<VerificarCodigo />} />
            <Route path="/nova-senha" element={<NovaSenha />} />
            {/* <Route path="/registrar" element={<RegistrarEstudo />} /> {} */}
            <Route path="/revisoes" element={<Revisoes />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

        </DisciplineProvider>
      </StudyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;