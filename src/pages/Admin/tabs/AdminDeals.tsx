import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, Search, Zap, Clock, Star, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion } from 'motion/react';

export const AdminDeals = () => {
  const [activeSection, setActiveSection] = useState('deal-of-the-day');

  const sections = [
    { id: 'deal-of-the-day', label: 'Deal of the Day', icon: Star },
    { id: 'hot-deals', label: 'Hot Deals', icon: Zap },
    { id: 'power-bundles', label: 'Power Bundles', icon: Package },
    { id: 'limited-edition', label: 'Limited Edition', icon: Clock },
    { id: 'final-call', label: 'Final Call', icon: AlertCircle },
  ];

  // Mock data for the active section
  const deals = [
    { id: 1, name: 'iPhone 15 Pro Max', originalPrice: 1200000, dealPrice: 1100000, status: 'Active', endDate: 'Oct 31, 2023' },
    { id: 2, name: 'MacBook Air M2', originalPrice: 1500000, dealPrice: 1350000, status: 'Scheduled', endDate: 'Nov 15, 2023' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-headline font-black text-3xl">Deals & Promotions</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Deal
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation for Deals */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-secondary mb-4 px-2">Deal Categories</h3>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all text-left",
                    activeSection === section.id 
                      ? "bg-primary-container text-on-primary-fixed" 
                      : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area for Active Section */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden"
          >
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
              <div>
                <h2 className="font-headline font-bold text-xl capitalize">{activeSection.replace(/-/g, ' ')}</h2>
                <p className="text-sm text-secondary mt-1">Manage products featured in this section.</p>
              </div>
              <div className="relative w-64 hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <Input className="pl-10 h-10 bg-surface" placeholder="Search deals..." />
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-secondary text-xs uppercase tracking-widest">
                      <th className="p-4 font-bold">Product</th>
                      <th className="p-4 font-bold">Original Price</th>
                      <th className="p-4 font-bold">Deal Price</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold">Ends On</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {deals.map((deal) => (
                      <tr key={deal.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-4 font-bold text-sm">{deal.name}</td>
                        <td className="p-4 text-sm text-secondary line-through">{formatCurrency(deal.originalPrice)}</td>
                        <td className="p-4 font-bold text-sm text-primary">{formatCurrency(deal.dealPrice)}</td>
                        <td className="p-4">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                            deal.status === 'Active' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          )}>
                            {deal.status}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-secondary">{deal.endDate}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {deals.length === 0 && (
                <div className="text-center py-12">
                  <Tag className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                  <h3 className="font-bold text-lg text-secondary">No deals found</h3>
                  <p className="text-sm text-secondary mt-2">Add products to this section to feature them.</p>
                  <Button className="mt-4" variant="outline">Add Products</Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Need to import Package for the icon
import { Package } from 'lucide-react';
