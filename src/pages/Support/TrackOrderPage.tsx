import React, { useState, useEffect } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { OrderService, Order } from '../../backend/services/firestore.service';

const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      trackOrder(id);
    }
  }, [searchParams]);

  const trackOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const foundOrder = await OrderService.getById(id.trim());
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please check the ID and try again.');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('An error occurred while fetching your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    trackOrder(orderId);
  };

  const statusSteps = [
    { label: 'Processing', icon: Clock, color: 'text-blue-500' },
    { label: 'Shipped', icon: Package, color: 'text-purple-500' },
    { label: 'In Transit', icon: Truck, color: 'text-amber-500' },
    { label: 'Delivered', icon: CheckCircle, color: 'text-green-500' },
  ];

  const currentStatusIndex = statusSteps.findIndex(step => step.label === order?.status);

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Track Your Order</h1>
          <p className="text-slate-400">Enter your order ID to see the current status of your package.</p>
        </motion.div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-8">
          <form onSubmit={handleTrack} className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ord_123...)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2"
            >
              {loading ? 'Searching...' : 'Track'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 mt-4 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Status Stepper */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Order Status</h2>
                    <p className="text-slate-400 text-sm">ID: {order.id}</p>
                  </div>
                  <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
                    <span className="text-blue-400 font-medium">{order.status}</span>
                  </div>
                </div>

                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const isCompleted = index <= currentStatusIndex;
                    const isActive = index === currentStatusIndex;
                    const Icon = step.icon;

                    return (
                      <div key={step.label} className="flex flex-col items-center relative z-10 w-1/4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-500 ${
                            isCompleted ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'
                          } ${isActive ? 'ring-4 ring-blue-500/20' : ''}`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className={`text-xs font-semibold uppercase tracking-wider ${isCompleted ? 'text-white' : 'text-slate-500'}`}>
                          {step.label}
                        </span>
                        
                        {index < statusSteps.length - 1 && (
                          <div className="absolute top-6 left-[60%] w-[80%] h-0.5 bg-slate-800 -z-10">
                            <motion.div
                              className="h-full bg-blue-600"
                              initial={{ width: 0 }}
                              animate={{ width: index < currentStatusIndex ? '100%' : '0%' }}
                              transition={{ duration: 0.5, delay: 0.2 }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-16 h-16 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-slate-400 text-sm">Qty: {item.quantity}</p>
                          <p className="text-blue-400 font-bold text-sm">₦{item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Shipping Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Customer</span>
                      <span className="text-white">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Address</span>
                      <span className="text-white text-right max-w-[200px]">{order.shippingAddress}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Method</span>
                      <span className="text-white capitalize">{order.fulfillmentMethod}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-slate-400 font-bold">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-400">₦{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TrackOrderPage;
