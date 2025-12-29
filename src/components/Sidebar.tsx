import { NavLink } from 'react-router-dom';
import { Calendar, BookOpen, RefreshCcw, BarChart3, Settings, LogOut, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  userName?: string;
  revisoesPendentes?: number;
}

export function Sidebar({ userName = 'Usuário', revisoesPendentes = 49 }: SidebarProps) {
  const navItems = [
    { 
      to: '/home', 
      icon: Calendar, 
      label: 'Cronograma',
      active: true
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
      badge: revisoesPendentes
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
    <aside className="w-56 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Clidenor" 
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
                ? "bg-primary text-primary-foreground font-medium" 
                : "text-foreground hover:bg-muted"
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto bg-primary/20 text-primary text-xs">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4">
        <NavLink
          to="/registrar-estudo"
          className="flex items-center gap-2 text-primary font-semibold text-lg hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Plus size={20} className="text-primary-foreground" />
          </div>
          <span>ESTUDOS</span>
        </NavLink>
      </div>
    </aside>
  );
}
