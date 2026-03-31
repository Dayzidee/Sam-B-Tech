import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, Truck, Package, Clock, FileText, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';
import { OrderService, Order } from '@/backend/services/firestore.service';
import { StatusModal } from '@/components/ui/StatusModal';

export const AdminOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setNewStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await OrderService.getAll();
      // Sort by createdAt descending
      const sorted = data.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      setOrders(sorted);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder?.id || !newStatus || newStatus === selectedOrder.status) return;

    setIsUpdating(true);
    try {
      await OrderService.update(selectedOrder.id, { status: newStatus as Order['status'] });
      // Update local state
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus as Order['status'] } : o));
      setSelectedOrder({ ...selectedOrder, status: newStatus as Order['status'] });
      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Status Updated',
        message: `Order status changed to "${newStatus}".`
      });
    } catch (error) {
      console.error('Error updating order:', error);
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update order status. Please try again.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder?.id) return;
    
    if (!window.confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) return;

    setIsDeleting(true);
    try {
      await OrderService.delete(selectedOrder.id);
      setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
      setSelectedOrder(null);
      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Order Deleted',
        message: 'The order has been permanently deleted.'
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not delete order. Please try again.'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'In Transit': return 'bg-indigo-100 text-indigo-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp?.seconds) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString('en-NG', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (o.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline font-black text-3xl text-zinc-900 tracking-tight">Orders</h1>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">{orders.length} TOTAL TRANSACTIONS</p>
        </div>
        <Button 
          variant="outline" 
          className="h-11 rounded-2xl border-zinc-200 text-zinc-600 hover:bg-zinc-50 px-6 font-bold flex items-center gap-2" 
          onClick={fetchOrders}
        >
          <FileText className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Order List */}
        <div className={cn(
          "bg-white/70 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/50 overflow-hidden flex flex-col transition-all duration-500",
          selectedOrder ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                className="pl-11 h-11 bg-zinc-50/50 border-zinc-200/50 focus:bg-white rounded-2xl text-sm"
                placeholder="Search by ID or customer..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="h-11 px-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 text-sm font-black text-zinc-600 focus:bg-white focus:outline-none w-full md:w-auto appearance-none pr-10 cursor-pointer hover:bg-zinc-100/50 transition-colors"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\' stroke-width=\'2\'%3E%3Cpath d=\'m19 9-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
            >
              <option>All Statuses</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>In Transit</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] text-nowrap border-b border-zinc-100">
                  <th className="p-5 font-black uppercase tracking-widest">Order Reference</th>
                  <th className="p-5 font-black uppercase tracking-widest">Customer Details</th>
                  <th className="p-5 font-black uppercase tracking-widest">Transaction Date</th>
                  <th className="p-5 font-black uppercase tracking-widest">Value</th>
                  <th className="p-5 font-black uppercase tracking-widest">Status</th>
                  <th className="p-5 font-black uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-zinc-200 mx-auto mb-4" />
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Orders...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100 text-zinc-300">
                        <Clock className="w-8 h-8" />
                      </div>
                      <p className="text-zinc-900 font-bold text-lg">No orders found</p>
                      <p className="text-zinc-400 text-sm mt-1">Check back later for new transactions</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={cn(
                        "group hover:bg-zinc-50/50 transition-colors cursor-pointer",
                        selectedOrder?.id === order.id ? "bg-zinc-100/50 shadow-inner" : ""
                      )}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-5">
                        <span className="font-mono text-zinc-400 text-[11px] font-bold tracking-tighter bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200/50">
                          #{order.id?.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-zinc-900 text-sm tracking-tight">{order.customerName || 'Anonymous Customer'}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">{order.customerEmail || 'Guest Account'}</p>
                      </td>
                      <td className="p-5 text-sm font-medium text-zinc-500">{formatDate(order.createdAt)}</td>
                      <td className="p-5 font-black text-zinc-900 text-sm">{formatCurrency(order.total || 0)}</td>
                      <td className="p-5">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className={cn(
                            "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-center shadow-sm border",
                            order.status === 'Delivered' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            order.status === 'Cancelled' ? "bg-red-50 text-red-600 border-red-100" :
                            order.status === 'Processing' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            "bg-zinc-100 text-zinc-600 border-zinc-200"
                          )}>
                            {order.status}
                          </span>
                          {order.orderSource === 'whatsapp' && (
                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border border-green-100 inline-flex items-center gap-1">
                              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                              WhatsApp
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <button className="p-3 text-zinc-400 group-hover:text-zinc-900 group-hover:bg-white rounded-2xl transition-all shadow-sm group-hover:shadow-md">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Panel */}
        <AnimatePresence mode="wait">
          {selectedOrder && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-xl border border-white/60 flex flex-col h-[calc(100vh-280px)] sticky top-6 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
                <div>
                  <h2 className="font-headline font-black text-xl text-zinc-900 tracking-tight">Voucher Details</h2>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">REF: {selectedOrder.id?.toUpperCase()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleDeleteOrder} 
                    disabled={isDeleting} 
                    className="p-2.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100" 
                    title="Delete Order"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setSelectedOrder(null)} 
                    className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all border border-transparent hover:border-zinc-200"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
                {/* Status Update */}
                <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg shadow-zinc-200/50">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">Command Logistics</h3>
                  <div className="flex flex-col gap-3">
                    <select
                      className="w-full h-12 px-4 rounded-xl border border-zinc-800 bg-zinc-800 text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-white/10 transition-all cursor-pointer appearance-none"
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\' stroke-width=\'2\'%3E%3Cpath d=\'m19 9-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <Button
                      className="w-full h-12 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-white/10"
                      onClick={handleUpdateStatus}
                      disabled={isUpdating || newStatus === selectedOrder.status}
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Synchronize Status'}
                    </Button>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2">Client Intelligence</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100 shadow-sm">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Customer Identifier</p>
                      <p className="font-bold text-zinc-900 text-sm">{selectedOrder.customerName || 'N/A'}</p>
                    </div>
                    <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100 shadow-sm">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Contact Protocol</p>
                      <p className="font-bold text-zinc-900 text-sm truncate">{selectedOrder.customerEmail || 'N/A'}</p>
                      <p className="text-xs text-zinc-500 font-medium mt-0.5">{selectedOrder.customerPhone || 'N/A'}</p>
                    </div>
                    <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100 shadow-sm">
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Drop-off Coordinate</p>
                      <p className="font-bold text-zinc-900 text-sm leading-relaxed">{selectedOrder.shippingAddress || 'N/A'}{selectedOrder.city ? `, ${selectedOrder.city}` : ''}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="bg-zinc-100 text-zinc-600 items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-zinc-200">
                          {selectedOrder.fulfillmentMethod === 'pickup' ? 'IN-STORE PICKUP' : 'PLATFORM DELIVERY'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2">Inventory Manifest</h3>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-zinc-50/50 p-3 rounded-2xl border border-zinc-100 shadow-sm group/item">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-zinc-200 shadow-sm group-hover/item:scale-105 transition-transform">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-zinc-300" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-zinc-900 text-sm tracking-tight">{item.name}</p>
                              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-0.5">
                                QTY: {item.quantity} • {item.category || 'GENERAL'}
                              </p>
                            </div>
                          </div>
                          <p className="font-black text-zinc-900 text-sm">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                        <Package className="w-8 h-8 text-zinc-200 mx-auto mb-2" />
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">MANIFEST EMPTY</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Recap */}
                <div className="space-y-4 pb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2">Financial Summary</h3>
                  <div className="bg-zinc-50/50 rounded-2xl p-5 border border-zinc-100 space-y-3">
                    <div className="flex justify-between items-center text-zinc-500 font-medium">
                      <span className="text-[11px] uppercase tracking-widest">Valuation</span>
                      <span className="text-sm">{formatCurrency(selectedOrder.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-500 font-medium">
                      <span className="text-[11px] uppercase tracking-widest">Logistics</span>
                      <span className="text-sm">{formatCurrency(selectedOrder.shippingFee || 0)}</span>
                    </div>
                    {(selectedOrder.vat || 0) > 0 && (
                      <div className="flex justify-between items-center text-zinc-500 font-medium">
                        <span className="text-[11px] uppercase tracking-widest">Fiscal Duty (VAT)</span>
                        <span className="text-sm">{formatCurrency(selectedOrder.vat)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-zinc-200 mt-2">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">Final Settlement</span>
                        <span className="text-xl font-black text-zinc-900">{formatCurrency(selectedOrder.total || 0)}</span>
                    </div>
                    
                    <div className={cn(
                      "mt-6 p-4 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      selectedOrder.paymentMethod === 'whatsapp' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                      {selectedOrder.paymentMethod === 'card' ? <CheckCircle className="w-4 h-4" /> : 
                       selectedOrder.paymentMethod === 'whatsapp' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {selectedOrder.paymentMethod === 'card' ? 'DIGITAL TRANSACTION (CARD)' :
                       selectedOrder.paymentMethod === 'transfer' ? 'DIRECT SETTLEMENT (TRANSFER)' :
                       selectedOrder.paymentMethod === 'pod' ? 'SETTLEMENT ON ARRIVAL' : 
                       selectedOrder.paymentMethod === 'whatsapp' ? 'WHATSAPP DIRECT CHECKOUT' : 'SETTLEMENT PROTOCOL N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StatusModal 
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
