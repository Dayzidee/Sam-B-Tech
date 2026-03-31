import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Truck, Package, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';

export const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const orders = [
    { id: 'SAM-1001', customer: 'John Doe', date: 'Oct 24, 2023', total: 1250000, status: 'Processing', items: 2, payment: 'Card' },
    { id: 'SAM-1002', customer: 'Jane Smith', date: 'Oct 23, 2023', total: 450000, status: 'Shipped', items: 1, payment: 'Transfer' },
    { id: 'SAM-1003', customer: 'Michael Johnson', date: 'Oct 22, 2023', total: 85000, status: 'Delivered', items: 3, payment: 'Pay on Delivery' },
    { id: 'SAM-1004', customer: 'Sarah Williams', date: 'Oct 21, 2023', total: 2100000, status: 'Cancelled', items: 1, payment: 'Card' },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-headline font-black text-3xl">Orders</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order List */}
        <div className={cn(
          "bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col",
          selectedOrder ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <Input className="pl-10 h-10" placeholder="Search orders by ID or customer..." />
            </div>
            <select className="h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm font-bold text-secondary focus:outline-none ml-4">
              <option>All Statuses</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-secondary text-xs uppercase tracking-widest">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={cn(
                      "hover:bg-surface-container-low/50 transition-colors cursor-pointer",
                      selectedOrder?.id === order.id ? "bg-primary-container/10" : ""
                    )}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4 font-bold text-sm">{order.id}</td>
                    <td className="p-4 text-sm">{order.customer}</td>
                    <td className="p-4 text-sm text-secondary">{order.date}</td>
                    <td className="p-4 font-bold text-sm">{formatCurrency(order.total)}</td>
                    <td className="p-4">
                      <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", getStatusColor(order.status))}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-primary hover:bg-primary-container/20 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Panel */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col h-full"
            >
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                <div>
                  <h2 className="font-headline font-bold text-xl">Order Details</h2>
                  <p className="text-sm text-secondary font-mono mt-1">{selectedOrder.id}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-secondary hover:bg-surface-container-low rounded-full">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Status Update */}
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Update Status</h3>
                  <div className="flex gap-2">
                    <select className="flex-1 h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <Button size="sm">Update</Button>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 border-b border-outline-variant/30 pb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold">Name:</span> {selectedOrder.customer}</p>
                    <p><span className="font-bold">Email:</span> customer@example.com</p>
                    <p><span className="font-bold">Phone:</span> +234 800 000 0000</p>
                    <p><span className="font-bold">Address:</span> 123 Tech Street, Ikeja, Lagos</p>
                  </div>
                </div>

                {/* Order Items (Mock) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 border-b border-outline-variant/30 pb-2">Order Items</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-bold">iPhone 15 Pro Max</p>
                          <p className="text-xs text-secondary">Qty: 1 • Titanium • 256GB</p>
                        </div>
                      </div>
                      <p className="font-bold">{formatCurrency(1200000)}</p>
                    </div>
                    {selectedOrder.items > 1 && (
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-bold">AirPods Pro Gen 2</p>
                            <p className="text-xs text-secondary">Qty: 1</p>
                          </div>
                        </div>
                        <p className="font-bold">{formatCurrency(50000)}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 border-b border-outline-variant/30 pb-2">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-secondary">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.total - 5000)}</span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Shipping</span>
                      <span>{formatCurrency(5000)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-outline-variant/30 mt-2">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                    <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-lg flex items-center gap-2 text-sm font-bold">
                      <CheckCircle className="w-4 h-4" />
                      Paid via {selectedOrder.payment}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low flex gap-3">
                <Button className="flex-1" variant="outline">Print Receipt</Button>
                <Button className="flex-1">Send Tracking</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
