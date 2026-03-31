import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Tag, 
  RefreshCw, 
  Users, 
  Settings,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  TrendingUp,
  DollarSign,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';

// Sub-components for different tabs
import { AdminOverview } from './tabs/AdminOverview';
import { AdminProducts } from './tabs/AdminProducts';
import { AdminOrders } from './tabs/AdminOrders';
import { AdminDeals } from './tabs/AdminDeals';
import { AdminTradeIns } from './tabs/AdminTradeIns';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'deals', label: 'Deals & Promos', icon: Tag },
    { id: 'trade-ins', label: 'Trade-Ins', icon: RefreshCw },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'deals': return <AdminDeals />;
      case 'trade-ins': return <AdminTradeIns />;
      default: return <div className="p-8 text-center text-secondary">Module under construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row pt-16 md:pt-20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface-container-lowest border-r border-outline-variant/20 flex-shrink-0 md:min-h-[calc(100vh-80px)] overflow-y-auto">
        <div className="p-6">
          <h2 className="font-headline font-black text-xl text-primary mb-6">Admin Portal</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all",
                  activeTab === item.id 
                    ? "bg-primary-container text-on-primary-fixed" 
                    : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};
