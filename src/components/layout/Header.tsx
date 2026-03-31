import { Link, useLocation } from 'react-router-dom';
import { User, Heart, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils';

export const Header = () => {
  const items = useCartStore((state) => state.items);
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gadgets', path: '/gadgets' },
    { name: 'Sales', path: '/sales' },
    { name: 'Trade-In', path: '/trade-in' },
    { name: 'Support', path: '/support' },
  ];

  // Determine where the profile button should go
  const getProfilePath = () => {
    if (!user) return '/login';
    return isAdmin ? '/admin' : '/dashboard';
  };

  const profilePath = getProfilePath();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm dark:shadow-none border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-2xl font-black tracking-tighter text-black dark:text-white">
          SAM-B TECH
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "transition-colors font-medium",
                location.pathname === link.path 
                  ? "text-yellow-600 dark:text-yellow-500 font-bold border-b-2 border-yellow-500 pb-1" 
                  : "text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-5">
          <Link to={profilePath} className="text-zinc-600 hover:text-yellow-600 transition-all group relative">
            <User className={cn(
              "w-5 h-5 transition-all", 
              (location.pathname === '/dashboard' || location.pathname.startsWith('/admin')) && "text-yellow-600 fill-current"
            )} />
            {user && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white dark:border-black" />
            )}
          </Link>
          <Link to="/favourites" className="text-zinc-600 hover:text-yellow-600 transition-all">
            <Heart className={cn("w-5 h-5", location.pathname === '/favourites' && "text-yellow-600 fill-current")} />
          </Link>
          <div className="relative">
            <Link to="/checkout" className="text-zinc-600 hover:text-yellow-600 transition-all">
              <ShoppingCart className={cn("w-5 h-5", location.pathname === '/checkout' && "text-yellow-600")} />
            </Link>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-500 text-on-primary-fixed text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                {items.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
