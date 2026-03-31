import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck as ShieldIcon, 
  History as HistoryIcon, 
  Truck as TruckIcon, 
  Lock as LockIcon,
  Store as StoreIcon,
  CreditCard as CardIcon,
  Trash2 as TrashIcon,
  Building2,
  Wallet,
  Minus,
  Plus,
  Headphones,
  X,
  MessageCircle,
  CheckCircle2,
  FileText,
  Download,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as htmlToImage from 'html-to-image';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { useCartStore } from '@/store/useCartStore';
import { useAuth } from '@/hooks/useAuth';
import { OrderService } from '@/backend/services/firestore.service';
import { useNavigate } from 'react-router-dom';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [payment, setPayment] = useState<'card' | 'transfer' | 'pod'>('card');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [receiptImageUrl, setReceiptImageUrl] = useState<string | null>(null);
  const [isWhatsAppReadyModalOpen, setIsWhatsAppReadyModalOpen] = useState(false);
  const receiptRef = React.useRef<HTMLDivElement>(null);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [user]);

  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

  const subtotal = getTotal();
  const shipping = fulfillment === 'delivery' ? 15000 : 0;
  const vat = subtotal * 0.075;
  const total = subtotal + shipping + vat;

  const handleCompleteOrder = () => {
    if (payment === 'card' || payment === 'transfer') {
      setIsPaymentModalOpen(true);
    } else {
      processOrder(false);
    }
  };

  const processOrder = async (isPaid: boolean, source: 'web' | 'whatsapp' = 'web') => {
    if (!user) return null;
    setIsProcessing(true);
    try {
      const orderData = {
        userId: user.uid,
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        city: shippingInfo.city,
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category || 'General'
        })),
        subtotal,
        shippingFee: shipping,
        vat,
        total,
        fulfillmentMethod: fulfillment,
        paymentMethod: source === 'whatsapp' ? 'whatsapp' : payment,
        orderSource: source,
        status: 'Processing' as any
      };
      
      const newOrder = await OrderService.create(orderData as any);
      const orderId = newOrder.id || (newOrder as any)._id; // Check for ID variants
      setCreatedOrderId(orderId);
      return orderId;
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Failed to process your order. Please try again.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    const orderId = await processOrder(true, 'web');
    if (orderId) {
      setIsPaymentModalOpen(false);
      setIsReceiptModalOpen(true);
      clearCart(); // Clear cart after successful order
    } else {
      // Keep modal open so user can try again or see error
      setIsProcessing(false);
    }
  };

  const handleWhatsAppCheckout = async () => {
    if (!shippingInfo.phone || !shippingInfo.address) {
      alert('Please provide your phone number and address first.');
      return;
    }

    setIsGeneratingImage(true);
    
    // 1. Create order in Firestore
    const orderId = await processOrder(false, 'whatsapp');
    if (!orderId) {
       setIsGeneratingImage(false);
       return;
    }

    // 2. Wait a bit for the hidden receipt to render
    setTimeout(async () => {
      if (receiptRef.current) {
        try {
          const dataUrl = await htmlToImage.toPng(receiptRef.current, {
            quality: 1,
            backgroundColor: '#ffffff'
          });
          setReceiptImageUrl(dataUrl);
          setIsWhatsAppReadyModalOpen(true);
        } catch (error) {
          console.error('Error generating receipt image:', error);
          alert('Could not generate receipt image, but your order was recorded. Opening WhatsApp with text summary.');
          openWhatsApp(orderId);
        } finally {
          setIsGeneratingImage(false);
        }
      }
    }, 500);
  };

  const openWhatsApp = (orderId: string) => {
    const message = `Hello Sam-B Tech, I would like to place an order.\n\n*Order ID:* ${orderId}\n*Summary:*\n${items.map(i => `- ${i.quantity}x ${i.name} (${formatCurrency(i.price)})`).join('\n')}\n\n*Total:* ${formatCurrency(total)}\n*Fulfillment:* ${fulfillment}\n\n*Shipping Info:*\n${shippingInfo.firstName} ${shippingInfo.lastName}\n${shippingInfo.address}, ${shippingInfo.city}\n${shippingInfo.phone}\n\n_I have attached my receipt below._`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/2348000000000?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-20 md:pt-24 pb-32 px-4 md:px-6 max-w-screen-2xl mx-auto">
        <header className="mb-8 md:mb-12 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
          >
            Checkout
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-secondary font-medium"
          >
            Complete your premium tech upgrade.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            {/* Step 1: Fulfillment */}
            <section>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl font-bold flex items-center gap-3">
                  <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-on-primary-fixed text-white flex items-center justify-center text-xs md:text-sm">1</span>
                  Fulfillment Method
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4 p-1 bg-surface-container-low rounded-xl mb-4">
                <button 
                  onClick={() => setFulfillment('delivery')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 md:py-4 rounded-lg text-xs md:text-sm font-bold transition-all",
                    fulfillment === 'delivery' ? "bg-white shadow-sm text-on-background" : "text-secondary hover:text-on-background"
                  )}
                >
                  <TruckIcon className="w-4 h-4 md:w-5 md:h-5" />
                  Delivery
                </button>
                <button 
                  onClick={() => setFulfillment('pickup')}
                  className={cn(
                    "flex items-center justify-center gap-2 py-3 md:py-4 rounded-lg text-xs md:text-sm font-bold transition-all",
                    fulfillment === 'pickup' ? "bg-white shadow-sm text-on-background" : "text-secondary hover:text-on-background"
                  )}
                >
                  <StoreIcon className="w-4 h-4 md:w-5 md:h-5" />
                  Pickup
                </button>
              </div>
              {fulfillment === 'pickup' && (
                <div className="bg-primary-container/10 border border-primary-container/20 p-4 rounded-xl">
                  <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                    <StoreIcon className="w-4 h-4 text-primary" />
                    Pickup Location
                  </h4>
                  <p className="text-secondary text-sm">56 Obafemi Awolowo Rd, Ikorodu, Lagos State.</p>
                  <p className="text-xs text-secondary mt-2">Available for pickup within 2 hours of order confirmation.</p>
                </div>
              )}
            </section>

            {/* Step 2: Shipping Info */}
            <section>
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-3 mb-6 md:mb-8">
                <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-on-primary-fixed text-white flex items-center justify-center text-xs md:text-sm">2</span>
                Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">First Name</label>
                  <input 
                    value={shippingInfo.firstName}
                    onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" 
                    placeholder="e.g. Samuel" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">Last Name</label>
                  <input 
                    value={shippingInfo.lastName}
                    onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" 
                    placeholder="e.g. Benson" 
                    type="text"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">Email Address</label>
                  <input 
                    value={shippingInfo.email}
                    onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" 
                    placeholder="sam@tech-hub.com" 
                    type="email"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">Delivery Address</label>
                  <textarea 
                    value={shippingInfo.address}
                    onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none resize-none text-sm" 
                    placeholder="Street name, building number, and apartment..." 
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">City</label>
                  <input 
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" 
                    placeholder="Lagos" 
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">Phone Number</label>
                  <input 
                    value={shippingInfo.phone}
                    onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                    className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" 
                    placeholder="+234..." 
                    type="tel"
                  />
                </div>
              </div>
            </section>

            {/* Step 3: Payment */}
            <section>
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-3 mb-6 md:mb-8">
                <span className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-on-primary-fixed text-white flex items-center justify-center text-xs md:text-sm">3</span>
                Payment Method
              </h2>
              <div className="space-y-3 md:space-y-4">
                {[
                  { id: 'card', title: 'Credit / Debit Card', desc: 'Secure payment via Paystack', icon: CardIcon },
                  { id: 'transfer', title: 'Bank Transfer', desc: 'Direct transfer to SAM-B Tech accounts', icon: Building2 },
                  { id: 'pod', title: 'Pay on Delivery', desc: 'Cash or POS at your doorstep', icon: Wallet }
                ].map((method) => (
                  <div key={method.id}>
                    <label 
                      className={cn(
                        "flex items-center justify-between p-4 md:p-5 rounded-xl bg-surface-container-lowest border cursor-pointer transition-all group",
                        payment === method.id ? "border-primary-container shadow-sm" : "border-outline-variant/10 hover:border-primary-container/50"
                      )}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={payment === method.id}
                          onChange={() => setPayment(method.id as any)}
                          className="w-4 h-4 md:w-5 md:h-5 text-primary focus:ring-primary-container" 
                        />
                        <div>
                          <p className="font-bold text-sm md:text-base">{method.title}</p>
                          <p className="text-xs md:text-sm text-secondary">{method.desc}</p>
                        </div>
                      </div>
                      <method.icon className={cn("w-5 h-5 md:w-6 md:h-6", payment === method.id ? "text-primary-container" : "text-secondary")} />
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Order Summary</h3>
              
              <div className="space-y-6 md:space-y-8 mb-8 md:mb-10">
                {items.length === 0 ? (
                  <div className="text-center py-8 text-secondary">Your cart is empty.</div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 md:gap-5">
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-container-low rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex flex-col justify-between flex-grow py-0.5 md:py-1">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-base md:text-lg leading-tight">{item.name}</h4>
                            <button onClick={() => removeItem(item.id)} className="text-secondary hover:text-error transition-colors">
                              <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                          <p className="text-xs text-secondary mt-1">{item.category}</p>
                        </div>
                        <div className="flex justify-between items-center mt-3 md:mt-4">
                          <div className="flex items-center bg-surface-container-low rounded-full px-2.5 py-0.5 md:px-3 md:py-1 gap-3 md:gap-4">
                            <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-on-surface-variant hover:text-primary transition-colors text-lg font-bold"><Minus className="w-3 h-3 md:w-4 md:h-4" /></button>
                            <span className="font-bold text-xs md:text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-on-surface-variant hover:text-primary transition-colors text-lg font-bold"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                          </div>
                          <p className="font-black text-sm md:text-base text-on-background">{formatCurrency(item.price)}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-6 md:pt-8 border-t border-surface-container space-y-4">
                <div className="flex items-center gap-2">
                  <input className="flex-grow px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" placeholder="Promo code" type="text"/>
                  <button className="bg-on-primary-fixed text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-sm hover:bg-black transition-all">Apply</button>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-sm text-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium text-on-background">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-secondary">
                    <span>Shipping Fee</span>
                    <span className="font-medium text-on-background">{formatCurrency(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-secondary">
                    <span>VAT (7.5%)</span>
                    <span className="font-medium text-on-background">{formatCurrency(vat)}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-surface-container">
                    <span className="text-lg md:text-xl font-bold">Total</span>
                    <span className="text-xl md:text-2xl font-black text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCompleteOrder}
                  disabled={items.length === 0 || isProcessing}
                  className="w-full bg-primary-container text-on-primary-fixed font-black text-base md:text-lg py-4 md:py-5 rounded-xl shadow-lg shadow-primary-container/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mt-6 md:mt-8"
                >
                  {isProcessing ? 'Processing...' : 'Complete Order'}
                  {!isProcessing && <LockIcon className="w-5 h-5" />}
                </Button>
                <Button 
                  onClick={handleWhatsAppCheckout}
                  disabled={items.length === 0}
                  variant="outline"
                  className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 font-bold text-base py-4 rounded-xl flex items-center justify-center gap-2 mt-4"
                >
                  <MessageCircle className="w-5 h-5" />
                  Checkout via WhatsApp
                </Button>
                <p className="text-[10px] text-center text-secondary uppercase tracking-widest font-bold mt-4">Secure Encrypted Checkout</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 md:gap-8 px-2 md:px-4">
              <div className="flex items-center gap-1.5 md:gap-2 text-zinc-400">
                <ShieldIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tighter">Warranty Included</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-zinc-400">
                <HistoryIcon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tighter">7-Day Returns</span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-zinc-400">
                <Headphones className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-tighter">24/7 Support</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Hidden Receipt for Image Generation */}
        <div className="fixed -left-[2000px] top-0">
          <div 
            ref={receiptRef}
            className="w-[500px] bg-white p-10 text-black font-sans leading-relaxed"
          >
            <div className="text-center mb-10 pb-10 border-b-2 border-slate-100">
              <h1 className="text-3xl font-black tracking-tighter mb-2">SAM-B TECH</h1>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Premium Gadgets & Tech Hub</p>
            </div>

            <div className="flex justify-between items-start mb-10">
              <div>
                <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Order Information</h2>
                <p className="font-bold text-lg">#{createdOrderId}</p>
                <p className="text-slate-500 text-sm">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Checkout Type</h2>
                <p className="font-bold text-lg text-green-600">WhatsApp Order</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 mb-10 pb-10 border-b-2 border-slate-100">
              <div>
                <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Customer</h2>
                <p className="font-bold">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                <p className="text-slate-500 text-sm">{shippingInfo.email}</p>
                <p className="text-slate-500 text-sm">{shippingInfo.phone}</p>
              </div>
              <div>
                <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-2">Shipping To</h2>
                <p className="font-bold capitalize">{fulfillment}</p>
                <p className="text-slate-500 text-sm leading-snug">
                  {fulfillment === 'delivery' 
                    ? `${shippingInfo.address}, ${shippingInfo.city}`
                    : "Pickup at Ikorodu Hub (56 Obafemi Awolowo Rd)"}
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4">Order Items</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-slate-50">
                    <th className="pb-3 font-bold">Item Description</th>
                    <th className="pb-3 font-bold text-center">Qty</th>
                    <th className="pb-3 font-bold text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="py-4 font-bold">{item.name}</td>
                      <td className="py-4 text-center">{item.quantity}</td>
                      <td className="py-4 text-right font-bold">{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Shipping</span>
                <span>{formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>VAT (7.5%)</span>
                <span>{formatCurrency(vat)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-slate-200">
                <span className="text-xl font-black">TOTAL AMOUNT</span>
                <span className="text-2xl font-black text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>

            <div className="mt-10 pt-10 border-t-2 border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Verified Order Receipt</p>
              <p className="text-[9px] text-slate-300">This receipt was digitally generated at checkout by Sam-B Tech Platform.</p>
            </div>
          </div>
        </div>

        {/* Generating Image Overlay */}
        <AnimatePresence>
          {isGeneratingImage && (
            <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="relative w-24 h-24 mb-8 mx-auto">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full"
                  />
                  <FileText className="absolute inset-0 m-auto w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Preparing Your Receipt</h2>
                <p className="text-slate-400">Recording order and generating shareable image...</p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* WhatsApp Ready Modal */}
        <AnimatePresence>
          {isWhatsAppReadyModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-8 pb-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight">WhatsApp Checkout Ready</h2>
                  </div>
                  <button 
                    onClick={() => setIsWhatsAppReadyModalOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-8 pt-4 space-y-6">
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                    Your order has been recorded! We've generated your receipt image. Please follow these steps to complete your checkout:
                  </p>

                  <div className="bg-zinc-50 p-4 rounded-3xl border border-zinc-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Receipt Preview</span>
                      {receiptImageUrl && (
                        <a 
                          href={receiptImageUrl} 
                          download={`SamB-Receipt-${createdOrderId}.png`}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Image
                        </a>
                      )}
                    </div>
                    {receiptImageUrl ? (
                      <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden border border-zinc-200 shadow-inner">
                        <img src={receiptImageUrl} className="w-full h-full object-contain" alt="Order Receipt" />
                      </div>
                    ) : (
                      <div className="aspect-[4/5] bg-zinc-200 animate-pulse rounded-2xl" />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <p className="text-sm">Click <b>"Open WhatsApp"</b> below to start the chat.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <p className="text-sm"><b>Attach the receipt image</b> (download it first if on mobile) and send it.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsWhatsAppReadyModalOpen(false);
                        clearCart();
                        navigate('/');
                      }}
                      className="h-14 rounded-2xl font-bold"
                    >
                      Done
                    </Button>
                    <Button 
                      onClick={() => openWhatsApp(createdOrderId)}
                      className="h-14 rounded-2xl font-black bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 border-none"
                    >
                      Open WhatsApp
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {isPaymentModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-surface w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                  <h2 className="font-headline font-bold text-xl">
                    {payment === 'card' ? 'Card Payment' : 'Bank Transfer'}
                  </h2>
                  <button 
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-2 hover:bg-surface-container rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handlePaymentSubmit} className="p-6 space-y-6">
                  {payment === 'card' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-secondary">Card Number</label>
                        <Input placeholder="0000 0000 0000 0000" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-secondary">Expiry Date</label>
                          <Input placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-widest text-secondary">CVV</label>
                          <Input placeholder="123" type="password" required maxLength={3} />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-surface-container-low p-4 rounded-xl text-center">
                      <p className="text-sm text-secondary mb-2">Please transfer {formatCurrency(total)} to:</p>
                      <p className="font-bold text-lg">Sam-B Tech Ltd</p>
                      <p className="font-mono text-xl tracking-widest my-2">0123456789</p>
                      <p className="text-sm font-bold">GTBank</p>
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full h-14 font-bold text-lg flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      payment === 'card' ? `Pay ${formatCurrency(total)}` : 'I have made the transfer'
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Receipt Modal */}
        <AnimatePresence>
          {isReceiptModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm py-10">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="bg-surface w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-full flex flex-col"
              >
                <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-primary-container text-on-primary-fixed">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6" />
                    <h2 className="font-headline font-bold text-xl">Order Confirmed</h2>
                  </div>
                  <button 
                    onClick={() => setIsReceiptModalOpen(false)}
                    className="p-2 hover:bg-black/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-grow">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold text-2xl mb-1">Receipt</h3>
                    <p className="text-secondary text-sm">Order #{createdOrderId || `SAM-${Math.floor(Math.random() * 1000000)}`}</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-secondary mb-3 border-b pb-2">Customer Details</h4>
                      <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p className="text-sm text-secondary">{shippingInfo.email}</p>
                      <p className="text-sm text-secondary">{shippingInfo.phone}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-secondary mb-3 border-b pb-2">Shipping Info</h4>
                      <p className="font-medium capitalize">{fulfillment}</p>
                      {fulfillment === 'delivery' ? (
                        <p className="text-sm text-secondary">{shippingInfo.address}, {shippingInfo.city}</p>
                      ) : (
                        <p className="text-sm text-secondary">Pickup at Ikorodu Store</p>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-secondary mb-3 border-b pb-2">Order Items</h4>
                      <div className="space-y-3">
                        {items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-secondary mb-3 border-b pb-2">Payment Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-secondary">
                          <span>Subtotal</span>
                          <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-secondary">
                          <span>Shipping</span>
                          <span>{formatCurrency(shipping)}</span>
                        </div>
                        <div className="flex justify-between text-secondary">
                          <span>VAT</span>
                          <span>{formatCurrency(vat)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base pt-2 border-t">
                          <span>Total Paid</span>
                          <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between text-secondary pt-2">
                          <span>Method</span>
                          <span className="capitalize">{payment}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-outline-variant/30 bg-surface-container-lowest">
                  <Button 
                    onClick={() => {
                      setIsReceiptModalOpen(false);
                      clearCart();
                      navigate('/');
                    }}
                    className="w-full h-12 font-bold"
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
