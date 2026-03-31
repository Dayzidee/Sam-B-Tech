import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/utils';

export const AdminOverview = () => {
  const stats = [
    { title: 'Total Revenue', value: formatCurrency(12500000), icon: DollarSign, trend: '+15%' },
    { title: 'Active Orders', value: '45', icon: ShoppingCart, trend: '+5%' },
    { title: 'Total Customers', value: '1,204', icon: Users, trend: '+12%' },
    { title: 'Products in Stock', value: '342', icon: Package, trend: '-2%' },
    { title: 'Pending Trade-Ins', value: '18', icon: RefreshCw, trend: '+8%' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-headline font-black text-3xl mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-container/20 rounded-xl">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {stat.trend}
              </span>
            </div>
            <h3 className="text-secondary text-sm font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
            <p className="font-headline font-black text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-lg transition-colors">
                <div>
                  <p className="font-bold text-sm">Order #SAM-{1000 + i}</p>
                  <p className="text-xs text-secondary">2 mins ago • John Doe</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatCurrency(450000)}</p>
                  <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">Processing</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <h3 className="font-bold text-lg mb-4">Low Stock Alerts</h3>
          <div className="space-y-4">
            {[
              { name: 'iPhone 15 Pro Max', stock: 2 },
              { name: 'MacBook Air M2', stock: 1 },
              { name: 'AirPods Pro Gen 2', stock: 4 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-surface-container-low rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-secondary" />
                  </div>
                  <p className="font-bold text-sm">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-error">{item.stock} left</p>
                  <button className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Restock</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
