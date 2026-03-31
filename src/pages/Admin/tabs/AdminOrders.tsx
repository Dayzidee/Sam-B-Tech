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
          <h1 className="font-headline font-black text-3xl">Orders</h1>
          <p className="text-secondary text-sm">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2" onClick={fetchOrders}>
          <FileText className="w-4 h-4" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order List */}
        <div className={cn(
          "bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col",
          selectedOrder ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          <div className="p-4 border-b border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <Input
                className="pl-10 h-10"
                placeholder="Search orders by ID or customer..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm font-bold text-secondary focus:outline-none"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
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
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-secondary font-bold">Loading orders...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <Clock className="w-10 h-10 text-outline-variant mx-auto mb-2 opacity-20" />
                      <p className="text-sm text-secondary font-bold">No orders found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={cn(
                        "hover:bg-surface-container-low/50 transition-colors cursor-pointer",
                        selectedOrder?.id === order.id ? "bg-primary-container/10" : ""
                      )}
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="p-4 font-bold text-xs font-mono">{order.id?.slice(0, 8)}...</td>
                      <td className="p-4 text-sm">{order.customerName || 'N/A'}</td>
                      <td className="p-4 text-sm text-secondary">{formatDate(order.createdAt)}</td>
                      <td className="p-4 font-bold text-sm">{formatCurrency(order.total || 0)}</td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-center", getStatusColor(order.status))}>
                            {order.status}
                          </span>
                          {order.orderSource === 'whatsapp' && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter text-center border border-green-200">
                              WhatsApp Order
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-primary hover:bg-primary-container/20 rounded-lg transition-colors">
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
                  <p className="text-sm text-secondary font-mono mt-1">{selectedOrder.id?.slice(0, 12)}...</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleDeleteOrder} disabled={isDeleting} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors" title="Delete Order">
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 text-secondary hover:bg-surface-container-low rounded-full transition-colors">
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Status Update */}
                <div className="bg-surface-container-low p-4 rounded-xl">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">Update Status</h3>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20"
                      value={newStatus}
                      onChange={e => setNewStatus(e.target.value)}
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    <Button
                      size="sm"
                      onClick={handleUpdateStatus}
                      disabled={isUpdating || newStatus === selectedOrder.status}
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                    </Button>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 border-b border-outline-variant/30 pb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold">Name:</span> {selectedOrder.customerName || 'N/A'}</p>
                    <p><span className="font-bold">Email:</span> {selectedOrder.customerEmail || 'N/A'}</p>
                    <p><span className="font-bold">Phone:</span> {selectedOrder.customerPhone || 'N/A'}</p>
                    <p><span className="font-bold">Address:</span> {selectedOrder.shippingAddress || 'N/A'}{selectedOrder.city ? `, ${selectedOrder.city}` : ''}</p>
                    <p><span className="font-bold">Fulfillment:</span> {selectedOrder.fulfillmentMethod === 'pickup' ? 'In-Store Pickup' : 'Delivery'}</p>
                  </div>
                </div>

                {/* Order Items - Dynamic */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 border-b border-outline-variant/30 pb-2">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-surface-container-highest rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-5 h-5 text-secondary" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold">{item.name}</p>
                              <p className="text-xs text-secondary">Qty: {item.quantity} • {item.category || 'N/A'}</p>
                            </div>
                          </div>
                          <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-secondary italic">No items in this order.</p>
                    )}
                  </div>
                </div>

                {/* Payment Summary */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 border-b border-outline-variant/30 pb-2">Payment Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-secondary">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between text-secondary">
                      <span>Shipping</span>
                      <span>{formatCurrency(selectedOrder.shippingFee || 0)}</span>
                    </div>
                    {(selectedOrder.vat || 0) > 0 && (
                      <div className="flex justify-between text-secondary">
                        <span>VAT</span>
                        <span>{formatCurrency(selectedOrder.vat)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-outline-variant/30 mt-2">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total || 0)}</span>
                    </div>
                    <div className={cn(
                      "mt-4 p-3 rounded-lg flex items-center gap-2 text-sm font-bold",
                      selectedOrder.paymentMethod === 'whatsapp' ? "bg-green-50 text-green-800" : "bg-blue-50 text-blue-800"
                    )}>
                      <CheckCircle className="w-4 h-4" />
                      {selectedOrder.paymentMethod === 'card' ? 'Paid via Card' :
                       selectedOrder.paymentMethod === 'transfer' ? 'Paid via Transfer' :
                       selectedOrder.paymentMethod === 'pod' ? 'Pay on Delivery' : 
                       selectedOrder.paymentMethod === 'whatsapp' ? 'WhatsApp Checkout' : 'Payment Method N/A'}
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
