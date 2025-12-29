import { NavLink } from 'react-router-dom';
import { Calendar, BookOpen, RefreshCcw, BarChart3, Settings, LogOut, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useStudy } from '@/contexts/StudyContext'; 

interface SidebarProps {
  userName?: string;
}

export function Sidebar({ userName = 'Usuário' }: SidebarProps) {
  const { getPendingReviews } = useStudy();
  const pendingCount = getPendingReviews();

  const navItems = [
    { 
      to: '/home', 
      icon: Calendar, 
      label: 'Cronograma',
    },
    { 
      to: '/registrar-estudo', 
      icon: BookOpen, 
      label: 'Registrar Estudo'
    },
    { 
      to: '/revisoes', 
      icon: RefreshCcw, 
      label: 'Revisões',
      badge: pendingCount 
    },
    { 
      to: '/relatorios', 
      icon: BarChart3, 
      label: 'Relatórios'
    },
    { 
      to: '/configuracoes', 
      icon: Settings, 
      label: 'Configurações'
    },
  ];

  return (
    <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col no-print">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-medium text-foreground">{userName}</span>
        <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={18} />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
              isActive 
                ? "bg-primary text-primary-foreground font-medium shadow-md" // Botão Ativo (Vermelho)
                : "text-foreground hover:bg-muted" // Botão Inativo
            )}
          >
            {/* Usamos render prop para acessar o isActive dentro do componente */}
            {({ isActive }) => (
              <>
                <item.icon size={20} />
                <span>{item.label}</span>
                
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge 
                    className={cn(
                      "ml-auto text-xs shadow-sm border border-transparent transition-colors",
                      isActive
                        // SE ATIVO (Fundo Vermelho): O Badge fica BRANCO com texto VERMELHO
                        ? "bg-white text-primary hover:bg-white/90" 
                        // SE INATIVO (Fundo Transparente): O Badge fica VERMELHO com texto BRANCO
                        : "bg-primary text-primary-foreground hover:bg-primary/90" 
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <NavLink
          to="/registrar-estudo"
          className="flex items-center gap-2 text-primary font-semibold text-lg hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-sm">
            <Plus size={20} className="text-primary-foreground" />
          </div>
          <span>ESTUDOS</span>
        </NavLink>
      </div>
    </aside>
  );
}