import { Link, useLocation } from 'react-router-dom';
import { Home, Smartphone, Tag, RefreshCw, Headphones } from 'lucide-react';
import { cn } from '@/utils';

const navItems = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Gadgets', path: '/gadgets', icon: Smartphone },
  { label: 'Sales', path: '/sales', icon: Tag },
  { label: 'Trade-In', path: '/trade-in', icon: RefreshCw },
  { label: 'Support', path: '/support', icon: Headphones },
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 bg-white/95 backdrop-blur-md border-t border-zinc-200 z-[9999] h-16">
      <div className="flex justify-around items-center h-full px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-all gap-1",
                isActive ? "text-yellow-600" : "text-zinc-500"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-current/10")} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-yellow-600" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
