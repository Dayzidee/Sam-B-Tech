import React, { useState } from 'react';
import { Package, Search, Truck, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [orderStatus, setOrderStatus] = useState<any>(null);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setIsTracking(true);
    // Simulate API call
    setTimeout(() => {
      setOrderStatus({
        id: orderId,
        status: 'In Transit',
        estimatedDelivery: 'Oct 25, 2023',
        steps: [
          { title: 'Order Placed', date: 'Oct 20, 2023, 10:00 AM', completed: true },
          { title: 'Processing', date: 'Oct 21, 2023, 02:30 PM', completed: true },
          { title: 'Shipped', date: 'Oct 22, 2023, 09:15 AM', completed: true },
          { title: 'In Transit', date: 'Oct 23, 2023, 04:45 PM', completed: false },
          { title: 'Delivered', date: 'Pending', completed: false },
        ]
      });
      setIsTracking(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-headline font-black text-4xl md:text-5xl mb-4">Track Your Order</h1>
          <p className="text-secondary text-lg">Enter your order ID to see the real-time status of your package.</p>
        </div>

        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
              <Input 
                type="text" 
                placeholder="e.g. SAMB-12345678" 
                className="pl-12 h-14 text-lg"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" size="lg" className="h-14 px-8 font-bold" disabled={isTracking}>
              {isTracking ? 'Tracking...' : 'Track Order'}
            </Button>
          </form>
        </div>

        {orderStatus && (
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-outline-variant">
              <div>
                <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-1">Order #{orderStatus.id}</p>
                <h2 className="font-headline font-bold text-2xl text-primary">{orderStatus.status}</h2>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-1">Estimated Delivery</p>
                <p className="font-headline font-bold text-xl">{orderStatus.estimatedDelivery}</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-outline-variant"></div>
              <div className="space-y-8 relative">
                {orderStatus.steps.map((step: any, index: number) => (
                  <div key={index} className="flex gap-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 ${step.completed ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-secondary'}`}>
                      {step.completed ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${step.completed ? 'text-on-background' : 'text-secondary'}`}>{step.title}</h4>
                      <p className="text-secondary text-sm">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrderPage;
