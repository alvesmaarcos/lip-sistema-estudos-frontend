import { NavLink } from 'react-router-dom';
import { Calendar, BookOpen, RefreshCcw, BarChart3, Settings, LogOut, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useStudy } from '@/contexts/StudyContext'; 

interface SidebarProps {
  userName?: string;
  className?: string; 
  onItemClick?: () => void; 
}


export function SidebarContent({ userName = 'Usuário', onItemClick }: SidebarProps) {
  const { getPendingReviews } = useStudy();
  const pendingCount = getPendingReviews();

  const navItems = [
    { to: '/home', icon: Calendar, label: 'Cronograma' },
    { to: '/registrar-estudo', icon: BookOpen, label: 'Registrar Estudo' },
    { to: '/revisoes', icon: RefreshCcw, label: 'Revisões', badge: pendingCount },
    { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    { to: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="flex flex-col h-full bg-card text-card-foreground">
      <div className="p-4 flex items-center gap-3 border-b border-border/50">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} 
            alt="Avatar" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
           <span className="font-medium text-sm truncate block" title={userName}>
            {userName}
          </span>
           <span className="text-xs text-muted-foreground truncate block">
            Eng. Software
          </span>
        </div>
        <button className="text-muted-foreground hover:text-destructive transition-colors" title="Sair">
          <LogOut size={18} />
        </button>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onItemClick}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
              isActive 
                ? "bg-primary text-primary-foreground font-medium shadow-md" 
                : "text-foreground hover:bg-muted"
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className="shrink-0" />
                <span className="truncate">{item.label}</span>
                
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge 
                    className={cn(
                      "ml-auto text-xs shadow-sm border border-transparent transition-colors",
                      isActive
                        ? "bg-white text-primary hover:bg-white/90" 
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

      {/* Botão de Ação Rápida */}
      <div className="p-4 border-t border-border/50">
        <NavLink
          to="/registrar-estudo"
          onClick={onItemClick}
          className="flex items-center gap-2 text-primary font-semibold text-lg hover:opacity-80 transition-opacity justify-center bg-primary/10 py-3 rounded-lg border border-primary/20"
        >
          <Plus size={20} className="text-primary" />
          <span>NOVO ESTUDO</span>
        </NavLink>
      </div>
    </div>
  );
}


export function Sidebar({ className, userName }: SidebarProps) {
  return (
    <aside className={cn("w-64 border-r border-border min-h-screen hidden md:flex flex-col bg-card", className)}>
      <SidebarContent userName={userName} />
    </aside>
  );
}