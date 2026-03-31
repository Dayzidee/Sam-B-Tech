import React, { useState, useEffect } from 'react';
import { 
  Truck as TruckIcon, 
  Store as StoreIcon, 
  CreditCard as CardIcon, 
  Building2, 
  Wallet, 
  Trash2 as TrashIcon, 
  Lock as LockIcon, 
  ShieldCheck as ShieldIcon, 
  History as HistoryIcon, 
  Headphones,
  Plus,
  Minus,
  X,
  MessageCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { useCartStore } from '@/store/useCartStore';

export const CheckoutPage = () => {
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [payment, setPayment] = useState<'card' | 'transfer' | 'pod'>('card');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: 'Alexander',
    lastName: 'Pierce',
    email: 'a.pierce@precision.tech',
    address: '4421 Tech Plaza, Silicon Valley, CA 94025',
    city: 'Lagos',
    phone: '+2348000000000'
  });

  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const subtotal = getTotal();
  const shipping = fulfillment === 'delivery' ? 15000 : 0;
  const vat = subtotal * 0.075;
  const total = subtotal + shipping + vat;

  const handleCompleteOrder = () => {
    if (payment === 'card' || payment === 'transfer') {
      setIsPaymentModalOpen(true);
    } else {
      setIsReceiptModalOpen(true);
    }
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    const message = `Hello Sam-B Tech, I would like to place an order.\n\n*Order Summary:*\n${items.map(i => `- ${i.quantity}x ${i.name} (${formatCurrency(i.price)})`).join('\n')}\n\n*Total:* ${formatCurrency(total)}\n*Fulfillment:* ${fulfillment}\n*Payment:* ${payment}\n\n*Shipping Info:*\n${shippingInfo.firstName} ${shippingInfo.lastName}\n${shippingInfo.address}, ${shippingInfo.city}\n${shippingInfo.phone}`;
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
                  disabled={items.length === 0}
                  className="w-full bg-primary-container text-on-primary-fixed font-black text-base md:text-lg py-4 md:py-5 rounded-xl shadow-lg shadow-primary-container/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mt-6 md:mt-8"
                >
                  Complete Order
                  <LockIcon className="w-5 h-5" />
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
                  <Button type="submit" className="w-full h-14 font-bold text-lg">
                    {payment === 'card' ? `Pay ${formatCurrency(total)}` : 'I have made the transfer'}
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
                    <p className="text-secondary text-sm">Order #SAM-{Math.floor(Math.random() * 1000000)}</p>
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
                      // In a real app, clear cart and redirect to dashboard
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
