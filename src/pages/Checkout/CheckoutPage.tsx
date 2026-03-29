import { useState } from 'react';
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
  Minus
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

export const CheckoutPage = () => {
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [payment, setPayment] = useState<'card' | 'transfer' | 'pod'>('card');

  const cartItems = [
    {
      id: '1',
      name: "MacBook Pro M3 Max",
      specs: "16-inch, Space Black, 64GB RAM",
      price: 4250000,
      quantity: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgtXhc4CrkuFd6Bn5Vm858u10XpN0APJNaMg_XYTOtoLPfT8VDyW98FOye2w1IzeaIVFb2TyW8mZ__1xAfB-8wClV6T2TTUzlyAlc7CIzRcppMlO2__3sWaHyfCuNGMkrwp1-HlVjRcB2xXSWnV0AC7FMkIoieoonrOnU1dgNwz9fIGbGym_o46Wn-uFsu_Pp3XsZo0VZV5FNDCp6Mvrw25rfWsNCdKZLmRAq_R8GpbYtemBWGjkDB9dvmv1ieXBR63jJ02316voc"
    },
    {
      id: '2',
      name: "iPhone 15 Pro Max",
      specs: "Natural Titanium, 512GB",
      price: 1850000,
      quantity: 1,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxhEqwY85Co8jPOCxBeMjhYFdOFTa51KzBvfywmMnEtQrzciUs1rgJvUUnr39nbcbjT2a6Z9h8_-rXqBkfWL35zM5p2CotZ-qNvx7p0roSpPn7RtJeKMTTEfnBgvk_gVnf0SIi0HXW2eR1iJ2GI1z9F1y89ZVzTTeyHdwoT9x6c3AhE3acTBSjkcJy-_x8N9ORG4Udee354zIYjJNN4_ATcb2Rfrvd0w9sQfyQB0gOmjghSUORfACvywgJo7x_m0CzTqBCuv9BUl8"
    }
  ];

  const subtotal = 6100000;
  const shipping = 15000;
  const vat = 457500;
  const total = subtotal + shipping + vat;

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
              <div className="grid grid-cols-2 gap-2 md:gap-4 p-1 bg-surface-container-low rounded-xl">
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
                  <input className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" placeholder="e.g. Samuel" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">Last Name</label>
                  <input className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" placeholder="e.g. Benson" type="text"/>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">Email Address</label>
                  <input className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" placeholder="sam@tech-hub.com" type="email"/>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">Delivery Address</label>
                  <textarea className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none resize-none text-sm" placeholder="Street name, building number, and apartment..." rows="3"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">City</label>
                  <input className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" placeholder="Lagos" type="text"/>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-secondary">Phone Number</label>
                  <input className="w-full px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" placeholder="+234..." type="tel"/>
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
                  <label 
                    key={method.id}
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
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Summary */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8">Order Summary</h3>
              
              <div className="space-y-6 md:space-y-8 mb-8 md:mb-10">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 md:gap-5">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-container-low rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex flex-col justify-between flex-grow py-0.5 md:py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-base md:text-lg leading-tight">{item.name}</h4>
                          <button className="text-secondary hover:text-error transition-colors">
                            <TrashIcon className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                        <p className="text-xs text-secondary mt-1">{item.specs}</p>
                      </div>
                      <div className="flex justify-between items-center mt-3 md:mt-4">
                        <div className="flex items-center bg-surface-container-low rounded-full px-2.5 py-0.5 md:px-3 md:py-1 gap-3 md:gap-4">
                          <button className="text-on-surface-variant hover:text-primary transition-colors text-lg font-bold"><Minus className="w-3 h-3 md:w-4 md:h-4" /></button>
                          <span className="font-bold text-xs md:text-sm">{item.quantity}</span>
                          <button className="text-on-surface-variant hover:text-primary transition-colors text-lg font-bold"><Plus className="w-3 h-3 md:w-4 md:h-4" /></button>
                        </div>
                        <p className="font-black text-sm md:text-base text-on-background">₦{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 md:pt-8 border-t border-surface-container space-y-4">
                <div className="flex items-center gap-2">
                  <input className="flex-grow px-4 py-2.5 md:py-3 rounded-lg border-none bg-surface-container-low focus:ring-2 focus:ring-primary-container focus:bg-white transition-all outline-none text-sm" placeholder="Promo code" type="text"/>
                  <button className="bg-on-primary-fixed text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-bold text-sm hover:bg-black transition-all">Apply</button>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex justify-between text-sm text-secondary">
                    <span>Subtotal</span>
                    <span className="font-medium text-on-background">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-secondary">
                    <span>Shipping Fee</span>
                    <span className="font-medium text-on-background">₦{shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-secondary">
                    <span>VAT (7.5%)</span>
                    <span className="font-medium text-on-background">₦{vat.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-surface-container">
                    <span className="text-lg md:text-xl font-bold">Total</span>
                    <span className="text-xl md:text-2xl font-black text-primary">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button className="w-full bg-primary-container text-on-primary-fixed font-black text-base md:text-lg py-4 md:py-5 rounded-xl shadow-lg shadow-primary-container/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 mt-6 md:mt-8">
                  Complete Order
                  <LockIcon className="w-5 h-5" />
                </Button>
                <p className="text-[10px] text-center text-secondary uppercase tracking-widest font-bold">Secure Encrypted Checkout</p>
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
      </main>
    </div>
  );
};
