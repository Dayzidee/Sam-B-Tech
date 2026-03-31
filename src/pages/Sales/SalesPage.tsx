import { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  ShoppingCart, 
  ShoppingBag, 
  Tag, 
  Bell,
  Clock,
  Loader2,
  Star,
  Package
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency } from '@/utils';
import { useCartStore } from '@/store/useCartStore';
import { DealService, Deal } from '@/backend/services/firestore.service';

const CountdownTimer = () => {
  const [time, setTime] = useState({ hrs: 8, min: 42, sec: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.sec > 0) return { ...prev, sec: prev.sec - 1 };
        if (prev.min > 0) return { ...prev, min: prev.min - 1, sec: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, min: 59, sec: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex space-x-4">
      {[
        { label: 'Hrs', val: time.hrs },
        { label: 'Min', val: time.min },
        { label: 'Sec', val: time.sec }
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="bg-white/10 backdrop-blur-md text-white font-black text-2xl w-14 h-14 flex items-center justify-center rounded-lg border border-white/10">
            {item.val.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] text-slate-400 uppercase mt-1 font-bold">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export const SalesPage = () => {
  const { addToCart } = useCartStore();

  const [flashSales, setFlashSales] = useState<Deal[]>([]);
  const [hotDeals, setHotDeals] = useState<Deal[]>([]);
  const [powerBundles, setPowerBundles] = useState<Deal[]>([]);
  const [lastChance, setLastChance] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const allDeals = await DealService.getAll();
      // Only active deals
      const active = allDeals.filter(d => d.status === 'Active');

      setFlashSales(active.filter(d => d.section === 'flash-sales'));
      setHotDeals(active.filter(d => d.section === 'hot-deals'));
      setPowerBundles(active.filter(d => d.section === 'power-bundles'));
      setLastChance(active.filter(d => d.section === 'last-chance'));
    } catch (error) {
      console.error('Error fetching sales page deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDiscount = (deal: Deal) => {
    if (!deal.originalPrice || deal.originalPrice === 0) return '';
    return `-${Math.round((1 - deal.dealPrice / deal.originalPrice) * 100)}%`;
  };

  const handleAddToCart = (e: React.MouseEvent, deal: Deal) => {
    e.preventDefault();
    addToCart({
      id: deal.id || '',
      name: deal.productName,
      price: deal.dealPrice,
      quantity: 1,
      image: deal.image || deal.images?.[0] || '',
      category: deal.category || 'Tech'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const allEmpty = flashSales.length === 0 && hotDeals.length === 0 && powerBundles.length === 0 && lastChance.length === 0;

  return (
    <div className="bg-background min-h-screen pt-20 md:pt-24 pb-32">
      {/* Flash Sales Hero */}
      {flashSales.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-black text-white p-8 md:p-16">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-black uppercase tracking-widest text-xs">Flash Sales</span>
                </div>
                <h1 className="font-headline font-black text-4xl md:text-6xl tracking-tighter mb-4">
                  Limited Time<br />Only.
                </h1>
                <p className="text-slate-400 text-sm md:text-base mb-8 max-w-md">
                  Exclusive flash deals on premium tech. When they're gone, they're gone.
                </p>
                <CountdownTimer />
              </div>
              {flashSales[0] && (
                <Link to={`/product/${flashSales[0].id}`} className="flex-shrink-0 group">
                  <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                    <span className="absolute -top-3 -right-3 bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full">
                      {getDiscount(flashSales[0])}
                    </span>
                    <img
                      src={flashSales[0].image || flashSales[0].images?.[0]}
                      alt={flashSales[0].productName}
                      className="w-48 h-48 object-contain group-hover:scale-110 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="mt-4 text-center">
                      <p className="font-bold text-sm">{flashSales[0].productName}</p>
                      <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="font-black text-xl">{formatCurrency(flashSales[0].dealPrice)}</span>
                        <span className="text-slate-400 line-through text-xs">{formatCurrency(flashSales[0].originalPrice)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Flash Sales Grid */}
          {flashSales.length > 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
              {flashSales.slice(1).map(deal => (
                <Link to={`/product/${deal.id}`} key={deal.id} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2">
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    <span className="bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded tracking-tighter">{getDiscount(deal)}</span>
                  </div>
                  <div className="aspect-square bg-surface-container-low p-8 overflow-hidden">
                    <img className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500" src={deal.image || deal.images?.[0]} alt={deal.productName} referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-5">
                    <p className="text-secondary text-xs font-bold uppercase mb-1">{deal.category}</p>
                    <h3 className="font-headline font-bold text-base mb-2">{deal.productName}</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-lg">{formatCurrency(deal.dealPrice)}</span>
                        <span className="text-secondary line-through text-xs ml-2">{formatCurrency(deal.originalPrice)}</span>
                      </div>
                      <button onClick={(e) => handleAddToCart(e, deal)} className="bg-primary-container p-2.5 rounded-full hover:bg-primary transition-colors">
                        <ShoppingCart className="w-4 h-4 text-on-primary-fixed" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* No deals placeholder */}
      {allEmpty && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20">
          <div className="relative overflow-hidden rounded-2xl bg-surface-container-high min-h-[300px] flex items-center justify-center border-2 border-dashed border-outline-variant">
            <div className="text-center p-8">
              <Tag className="w-16 h-16 text-secondary mx-auto mb-4 opacity-20" />
              <h2 className="text-2xl font-bold font-headline mb-2">No Active Sales</h2>
              <p className="text-secondary">Stay tuned for our upcoming exclusive tech deals.</p>
            </div>
          </div>
        </section>
      )}

      {/* Hot Deals Grid */}
      {hotDeals.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
            <div>
              <h2 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tighter text-on-background">Hot Deals</h2>
              <p className="text-secondary text-sm mt-1">The most wanted gadgets at prices you'll love.</p>
            </div>
            <Link to="/gadgets" className="text-primary text-sm font-bold flex items-center hover:translate-x-1 transition-transform w-fit">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {hotDeals.map((deal) => (
              <Link to={`/product/${deal.id}`} key={deal.id} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 block">
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <span className="bg-tertiary text-white text-[10px] font-black px-2 py-1 rounded tracking-tighter uppercase italic">{getDiscount(deal)}</span>
                  <Badge variant={deal.condition === 'Brand New' ? 'new' : 'default'}>{deal.condition || 'Brand New'}</Badge>
                </div>
                <div className="aspect-square bg-surface-container-low p-8 overflow-hidden">
                  <img 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                    src={deal.image || deal.images?.[0]} 
                    alt={deal.productName}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6">
                  <p className="text-secondary text-xs font-bold uppercase mb-1">{deal.category}</p>
                  <h3 className="font-headline font-bold text-lg mb-3">{deal.productName}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-on-background font-black text-xl">{formatCurrency(deal.dealPrice)}</span>
                      <span className="text-secondary line-through text-xs">{formatCurrency(deal.originalPrice)}</span>
                    </div>
                    <button 
                      onClick={(e) => handleAddToCart(e, deal)}
                      className="bg-primary-container p-3 rounded-full hover:bg-primary transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5 text-on-primary-fixed" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Power Bundles */}
      {powerBundles.length > 0 && (
        <section className="bg-surface-container-low py-16 md:py-24 mb-16 md:mb-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="mb-8 md:mb-12">
              <h2 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tighter text-on-background">The Power Bundles</h2>
              <p className="text-secondary text-sm">Double the tech, half the hassle, better prices.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {powerBundles.map((bundle) => (
                <Link key={bundle.id} to={`/product/${bundle.id}`} className="bg-white p-1 rounded-2xl group cursor-pointer relative shadow-sm hover:shadow-xl transition-shadow duration-500 block">
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-primary-container text-on-primary-fixed font-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg z-10 shadow-lg text-xs md:text-base">
                    SAVE {formatCurrency(bundle.originalPrice - bundle.dealPrice)}
                  </div>
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                      <h3 className="font-headline font-extrabold text-2xl md:text-3xl text-on-background mb-3 md:mb-4">{bundle.productName}</h3>
                      <p className="text-secondary text-sm md:text-base mb-6 md:mb-8 leading-relaxed">{bundle.description || 'Upgrade your setup with this exclusive professional bundle.'}</p>
                      <div className="mb-6 md:mb-8">
                        <span className="block text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">Bundle Price</span>
                        <span className="text-on-background font-black text-3xl md:text-4xl">{formatCurrency(bundle.dealPrice)}</span>
                      </div>
                      <Button 
                        onClick={(e) => handleAddToCart(e as any, bundle)}
                        className="w-full py-6 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors uppercase tracking-widest text-xs"
                      >
                        Add Bundle to Cart
                      </Button>
                    </div>
                    <div className="md:w-1/2 relative bg-surface-container-highest flex items-center justify-center p-6 md:p-8 overflow-hidden rounded-xl min-h-[250px] md:min-h-0">
                      <img 
                        className="relative z-10 group-hover:scale-105 transition-transform duration-700 max-h-48 md:max-h-none object-contain" 
                        src={bundle.image || bundle.images?.[0]} 
                        alt={bundle.productName}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Last Chance Items */}
      {lastChance.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
          <div className="mb-8 md:mb-10 text-center">
            <span className="text-tertiary font-bold uppercase tracking-widest text-[10px] md:text-sm">Inventory Clear-out</span>
            <h2 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tighter text-on-background mt-2">Last Chance Items</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {lastChance.map((item, index) => (
               <Link 
                key={item.id}
                to={`/product/${item.id}`} 
                className={cn(
                  "p-6 md:p-8 rounded-xl flex flex-col items-center justify-between group cursor-pointer hover:shadow-lg transition-all gap-6 block",
                  index === 0 ? "md:col-span-2 bg-surface-container-lowest sm:flex-row" : "bg-primary-container text-on-primary-fixed"
                )}
              >
                <div className={cn("w-full", index === 0 ? "sm:w-1/2" : "")}>
                  {index === 1 && <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded">FINAL CALL</span>}
                  <h4 className="font-headline font-bold text-xl md:text-2xl mt-2 mb-3 md:mb-4">{item.productName}</h4>
                  <div className="flex items-center space-x-3 mb-4 md:mb-6">
                    <span className="text-xl md:text-2xl font-black">{formatCurrency(item.dealPrice)}</span>
                    <span className={cn("text-sm line-through", index === 0 ? "text-secondary" : "text-on-primary-fixed/60")}>
                      {formatCurrency(item.originalPrice)}
                    </span>
                  </div>
                  <button className={cn(
                    "text-sm font-bold border-b-2 pb-1 transition-colors",
                    index === 0 ? "text-on-background border-black hover:text-tertiary hover:border-tertiary" : "text-white border-white"
                  )}>
                    Grab it now
                  </button>
                </div>
                <div className={cn("w-full flex justify-center", index === 0 ? "sm:w-2/5" : "")}>
                  <img 
                    className="max-h-40 md:max-h-none w-auto object-contain group-hover:scale-110 transition-transform" 
                    src={item.image || item.images?.[0]} 
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-24">
        <div className="bg-surface-container-high rounded-3xl p-8 md:p-20 flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
          <div className="w-full md:w-1/2 relative z-10">
            <h2 className="font-headline font-extrabold text-3xl md:text-5xl tracking-tighter text-on-background mb-4 md:mb-6 leading-tight">Never miss a price drop again.</h2>
            <p className="text-secondary text-sm md:text-lg mb-6 md:mb-8 leading-relaxed">Join 15,000+ tech enthusiasts getting exclusive early access to our Flash Sales and limited-time bundles.</p>
            <form className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <input className="flex-grow bg-white border-none px-5 py-3.5 md:px-6 md:py-4 rounded-xl focus:ring-2 focus:ring-primary-container outline-none text-on-background text-sm" placeholder="Your best email address" type="email"/>
              <Button className="bg-black text-white px-8 py-3.5 md:py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors text-sm uppercase tracking-widest">Notify Me</Button>
            </form>
          </div>
          <div className="hidden lg:block lg:w-1/3 relative">
            <Bell className="w-[150px] h-[150px] text-primary-container opacity-20 absolute -top-20 -right-8 rotate-12" />
            <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl relative z-10 border border-white">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-primary-container rounded-full flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-xs">Price Drop Alert!</p>
                  <p className="text-[10px] text-slate-500">Just now</p>
                </div>
              </div>
              <p className="text-xs font-medium">PlayStation 5 Slim just dropped to <span className="text-tertiary font-bold">₦680,000</span></p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
