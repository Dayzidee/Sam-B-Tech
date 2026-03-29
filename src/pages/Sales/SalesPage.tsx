import { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  ShoppingCart, 
  ShoppingBag, 
  Tag, 
  Bell,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/utils';
import { useCartStore } from '@/store/useCartStore';

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

  const hotDeals = [
    {
      id: 'ipad-pro-m2',
      name: "iPad Pro M2 12.9\"",
      category: "Tablets",
      price: 820000,
      oldPrice: 1100000,
      discount: "25% OFF",
      condition: "UK Used",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHsmcG_AsRMNOVOkxSD9Igh5bg2GnMz4fznbCLej29K5m5dFdDS2w0VItdR5oPBSJGaXEYiaLH4CPOFMvsEm13XvkHOQPjl2auPm2jUvMKtF-VYgYC5PceeZKmYz5HoY4Ku3El1OtgyMuBoLvu6epkv2gkZEPU08g0SYbtYoUuj3CsQv-UkvWITHj-3b-PEfGDchxTElePwC91xt-MWTUG6mPRE9hrMkki5iVQJIRr4NHOZOl5a4RjT52BlQTYAhQW1VWNh-Is5gQ"
    },
    {
      id: 'macbook-air-m2',
      name: "MacBook Air M2",
      category: "Laptops",
      price: 1150000,
      oldPrice: 1350000,
      discount: "FLASH SALE",
      condition: "Brand New",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBstFBuxxZcY0ehcXctC2pC1j14IHDQhr5w8xXkvpCyzmbRUJ6p3iVpIpimo3uPCGUCk3gww2zdrRkKORYVgGhpJieeLEZrYeMtd2hz-NSnyB1USJWNVhJRwevW-6y9fMZ22kRVdFCGBjfHAMmrU4ZKa_DppoZDV7h2lEqVnYCxWLvcM7BYZNhFeDN3x9TFdPJ1U132ymGh0zLjgp4QvazC34_2Ik3pJM86P7d6Jkimkd4jT06i12kV4YDbiBZg0_1aK4IWxHs8iY"
    },
    {
      id: 'sony-wh1000xm5',
      name: "Sony WH-1000XM5",
      category: "Audio",
      price: 320000,
      oldPrice: 380000,
      discount: "15% OFF",
      condition: "UK Used",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuByl3F4bx_vuXv6GofcovXfWxSlB3JOiJmAeGKOAXUQJUJNVWXptkm5wPreTyrEof9OJCv5uHBN7FvbNsyWXYavA29CHcnIVjQvIzqJ_fsEjZhBBad1WpEYFzvq0c_DUXZuSGauzvpGlF6W7D0SuagJp_H-i_qSDUOtWIQ94n2yw31gtRkM66Tpd7aQyOgAnoI4JpuD7OKWlQhGsRvKM9OFp19Amn_3LMx3q1eqHUR12zGkPqatfqXgQgiQPFvMi5p3Y9EnBgX-35g"
    },
    {
      id: 's23-ultra',
      name: "S23 Ultra 512GB",
      category: "Phones",
      price: 950000,
      oldPrice: 1100000,
      discount: "SALE",
      condition: "Brand New",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAumIRhLEVnYvr3KMHg4pAGDU6fuFpPPYmhI6IzPn-e5O3EIQxMqG46u2Q8MRpYO0hq4dOuuLwuviZiAlZQJPZ5XQUGYFTshGsAfAhB269wHh44lW2nFV2nml-lSTF5FmQmYCnVLHxfQHV3lPWtHeicAxyeCaVxb9ZT_MAVJy8UjRYNWgK8Ahykff75cNdv1wLmx3f53OXOj3kqPS81hagP5hZWwVdDn2GoL6wwRg6A-DIXHa5XzNTH5f0SvNHAoHWS6YhNPvbLtLM"
    }
  ];

  return (
    <div className="bg-background min-h-screen pt-20 md:pt-24 pb-32">
      {/* Hero: Deal of the Day */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-12 md:mb-20">
        <div className="relative overflow-hidden rounded-2xl bg-black min-h-[500px] md:min-h-0 md:aspect-[21/7] flex items-center">
          <div className="absolute inset-0 opacity-40 md:opacity-60">
            <img 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtM06NiLzIx_-_xWvonJ3RUxcq2hi15FGFl_n005g8LcSG6FkrztzUF_RIJYQetoSo3TzqiwgR6WBTbaaSXilyKXfpeTikJUMLSW-jEgq0J9488BdiTbkpmUm3USM4LjbBKhMpUDazSUd6gXYfTD5IIjM0i1Wg7CxwmYR1QhCVcOh_VDkh7J16rNAwboEuHsWeGsTWsfJEFlRSiJ2cOWcd_TUmjLC_b4lldb9ivCnOCnuxAr-xGhXLRhRSs3LvWl3cy8FQ5T9BMF4" 
              alt="iPhone 15 Pro Max Deal"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative z-10 px-6 py-12 md:py-0 md:px-20 w-full md:w-2/3">
            <div className="inline-flex items-center space-x-2 bg-primary-container text-on-primary-fixed px-3 py-1 rounded-full text-[10px] md:text-xs font-bold mb-4 md:mb-6 tracking-wider uppercase">
              <Zap className="w-3 h-3 fill-current" />
              <span>Deal of the Day</span>
            </div>
            <h1 className="font-headline font-extrabold text-4xl md:text-7xl text-white mb-4 tracking-tighter leading-none">iPhone 15 Pro Max</h1>
            <p className="text-slate-300 text-sm md:text-lg mb-6 md:mb-8 max-w-md leading-relaxed">Experience the pinnacle of tech. Titanium build. Pro cameras. Today only at an unbeatable price.</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-8 mb-8 md:mb-10">
              <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Price Drops to</span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-primary-container text-3xl md:text-4xl font-black">{formatCurrency(1250000)}</span>
                  <span className="text-slate-500 line-through text-base md:text-lg">{formatCurrency(1550000)}</span>
                </div>
              </div>
              <CountdownTimer />
            </div>

            <Button size="lg" className="w-full sm:w-auto bg-tertiary hover:bg-tertiary/90 text-white px-10 shadow-xl shadow-tertiary/20 h-14 rounded-xl font-bold uppercase tracking-widest text-xs">
              Claim Deal Now
            </Button>
          </div>
        </div>
      </section>

      {/* Hot Deals Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tighter text-on-background">Hot Deals</h2>
            <p className="text-secondary text-sm mt-1">The most wanted gadgets at prices you'll love.</p>
          </div>
          <button className="text-primary text-sm font-bold flex items-center hover:translate-x-1 transition-transform w-fit">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {hotDeals.map((deal) => (
            <div key={deal.id} className="group relative bg-surface-container-lowest rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-tertiary text-white text-[10px] font-black px-2 py-1 rounded tracking-tighter uppercase italic">{deal.discount}</span>
                <Badge variant={deal.condition === 'Brand New' ? 'new' : 'default'}>{deal.condition}</Badge>
              </div>
              <div className="aspect-square bg-surface-container-low p-8 overflow-hidden">
                <img 
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
                  src={deal.image} 
                  alt={deal.name}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <p className="text-secondary text-xs font-bold uppercase mb-1">{deal.category}</p>
                <h3 className="font-headline font-bold text-lg mb-3">{deal.name}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-on-background font-black text-xl">{formatCurrency(deal.price)}</span>
                    <span className="text-secondary line-through text-xs">{formatCurrency(deal.oldPrice)}</span>
                  </div>
                  <button 
                    onClick={addToCart}
                    className="bg-primary-container p-3 rounded-full hover:bg-primary transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5 text-on-primary-fixed" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bundle Deals */}
      <section className="bg-surface-container-low py-16 md:py-24 mb-16 md:mb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-12">
            <h2 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tighter text-on-background">The Power Bundles</h2>
            <p className="text-secondary text-sm">Double the tech, half the hassle, better prices.</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {/* Bundle 1 */}
            <div className="flex-1 bg-white p-1 rounded-2xl group cursor-pointer relative shadow-sm hover:shadow-xl transition-shadow duration-500">
              <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-primary-container text-on-primary-fixed font-black px-3 py-1.5 md:px-4 md:py-2 rounded-lg z-10 shadow-lg text-xs md:text-base">
                SAVE ₦85,000
              </div>
              <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
                  <h3 className="font-headline font-extrabold text-2xl md:text-3xl text-on-background mb-3 md:mb-4">The Creator Suite</h3>
                  <p className="text-secondary text-sm md:text-base mb-6 md:mb-8 leading-relaxed">iPhone 15 Pro + AirPods Pro Gen 2. Perfect for the modern storyteller.</p>
                  <div className="mb-6 md:mb-8">
                    <span className="block text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">Bundle Price</span>
                    <span className="text-on-background font-black text-3xl md:text-4xl">{formatCurrency(1380000)}</span>
                  </div>
                  <Button className="w-full py-6 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors uppercase tracking-widest text-xs">Add Bundle to Cart</Button>
                </div>
                <div className="md:w-1/2 relative bg-surface-container-highest flex items-center justify-center p-6 md:p-8 overflow-hidden rounded-xl min-h-[250px] md:min-h-0">
                  <img 
                    className="relative z-10 group-hover:scale-105 transition-transform duration-700 max-h-48 md:max-h-none object-contain" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0KYlnM29mRapZO1FHi5tepAWQ_jd0CrsgqNJnn-Hwq6XWXHVf-_2UmcNX3T1a50TRMR031MfQrpbXph33ONtLSF9RQHXM3yBPcWSHwPKzMip04LkI0xU-DAMrn5F5Eouh6xHAfjx5MM1RRR_SUUStsGrvqOqlzQlw4TVBlPBqw-_Ldrzxguc3WO5V21A0qwLqA4t3HVxn6H4Z8TTRDuKNphkDGHaZyYvc64MJUVxnnBP4AZlV7VWK0zv3KcdtTFwHkQuL0AUYrAk" 
                    alt="Creator Suite Bundle"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
            {/* Bundle 2 */}
            <div className="lg:w-1/3 bg-black rounded-2xl p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden min-h-[400px] lg:min-h-0">
              <div className="relative z-10">
                <div className="bg-tertiary w-fit text-white font-bold px-3 py-1 rounded text-[10px] mb-4 md:mb-6 uppercase tracking-widest">Limited Edition</div>
                <h3 className="font-headline font-extrabold text-2xl md:text-3xl mb-3 md:mb-4 leading-tight">MacBook Pro + Magic Mouse</h3>
                <p className="text-slate-400 text-xs md:text-sm mb-6 leading-relaxed">Upgrade your workstation with the ultimate M3 bundle.</p>
                <span className="text-primary-container font-black text-2xl md:text-3xl">{formatCurrency(2100000)}</span>
              </div>
              <div className="relative z-10 mt-8 md:mt-10">
                <Button className="w-full py-6 bg-primary-container text-on-primary-fixed font-bold rounded-xl hover:scale-105 transition-transform uppercase tracking-widest text-xs">Buy Now</Button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjy2sYEDQxJGOwh2MFSqUiHaRMAG9Wk83FsHinvvegAORGDKGPVoblGjtSp81JCZ3g6WEZ12ajmFQ3EkYVKweJ-nTKztt6kRYCd-E04i7FTNON495Vl_vG-Y8A65t4JLFJ6mKko3FoIYcRf7gv-FKQLpYP_R_TtGah8GA-XDHMkBTSuIR3p0yW6JKChX6nBXMBK1Zp2JiPxdxSLjqGQdrpqXw0S6A6CxwRnOwYUFQOc-ry8EMurmi3OTebANy-Ji1wREXNrUc86NI" 
                  alt="MacBook Pro Bundle"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Last Chance Bento */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-24">
        <div className="mb-8 md:mb-10 text-center">
          <span className="text-tertiary font-bold uppercase tracking-widest text-[10px] md:text-sm">Inventory Clear-out</span>
          <h2 className="font-headline font-extrabold text-3xl md:text-4xl tracking-tighter text-on-background mt-2">Last Chance Items</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Bento Item 1 */}
          <div className="md:col-span-2 bg-surface-container-lowest p-6 md:p-8 rounded-xl flex flex-col sm:flex-row items-center justify-between group cursor-pointer hover:shadow-lg transition-all gap-6">
            <div className="w-full sm:w-1/2">
              <span className="text-tertiary font-black text-[10px] uppercase">Only 2 Left</span>
              <h4 className="font-headline font-bold text-xl md:text-2xl mt-2 mb-3 md:mb-4">Samsung Galaxy Buds2 Pro</h4>
              <div className="flex items-center space-x-3 mb-4 md:mb-6">
                <span className="text-xl md:text-2xl font-black">{formatCurrency(145000)}</span>
                <span className="text-secondary text-sm line-through">{formatCurrency(190000)}</span>
              </div>
              <button className="text-on-background text-sm font-bold border-b-2 border-black pb-1 hover:text-tertiary hover:border-tertiary transition-colors">Grab it before it's gone</button>
            </div>
            <div className="w-full sm:w-2/5 p-2 md:p-4 flex justify-center">
              <img 
                className="max-h-40 md:max-h-none w-auto object-contain group-hover:rotate-6 transition-transform" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoNQtiinZA0DwTtcb1Gg1lJKS2cj2SH5wWWr0bo6MqXMFC__2306p9WPqwowdAHBvTi7aGbcJSnXrJvsiVt0kpGZrX7in1x_wkq0-d0KEVZhh_N-XSdBv53tN2B10oyKRur5vw1t2wHIwtsfv_iyF-sXovmLnvXJQ2M9EI3geZOPk8WV2BZDvr-BGCyEtjIiL7J0LCHXK_B1KYQ_GeP7WG5iOJKBbtjp_eO9yDRG-LgL6iKff5ynOk7IDFiWBvwMse13KqF8xjMeU" 
                alt="Galaxy Buds2 Pro"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          {/* Bento Item 2 */}
          <div className="bg-primary-container p-6 md:p-8 rounded-xl flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all min-h-[250px]">
            <div>
              <span className="bg-black text-white text-[10px] font-bold px-2 py-1 rounded">FINAL CALL</span>
              <h4 className="font-headline font-bold text-xl md:text-2xl mt-4 text-on-primary-fixed leading-tight">Apple Watch Ultra 2</h4>
              <p className="text-on-primary-container text-xs md:text-sm mt-2">Open box - Pristine condition.</p>
            </div>
            <div className="mt-6 md:mt-8 flex items-end justify-between">
              <span className="text-on-primary-fixed font-black text-2xl md:text-3xl">{formatCurrency(890000)}</span>
              <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-on-primary-fixed/30 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
          {/* Bento Item 3 */}
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl flex flex-col group cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-outline-variant">
            <img 
              className="w-full h-40 md:h-48 object-contain mb-4 md:mb-6" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Sd4GzAXkOWHI5d0lFaj9yhD1hv26bz5hkoBkro5g8t-m7IwUreHyzPPDZ3vGvhSXzg3IoHE7V6P1o8HPF26HbT8bqnvJ6MrOcTPgKavoM2FG9wG4dEIl00D3ijaCKw-sZ2M0xTPQcEcsxe1ryJVfUWHjb-TRAN0uUab6ddroeLYMTc6se0lH07lH8obDgEtWNiiCM7aM7EWYKpMyxwGt__YwNhuK1svQcnTNHSgc50esAX_ligDJvFc1DPGm4lhmOenpFENY75Y" 
              alt="Bose QuietComfort"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-tertiary font-black text-[10px] uppercase">Last Unit</span>
              <h4 className="font-headline font-bold text-lg md:text-xl mt-1">Bose QuietComfort</h4>
              <div className="flex items-center justify-between mt-4">
                <span className="text-on-background font-black text-xl md:text-2xl">{formatCurrency(285000)}</span>
                <button className="bg-black text-white p-2 rounded-lg"><ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
          {/* Bento Item 4 */}
          <div className="md:col-span-2 bg-zinc-900 p-6 md:p-8 rounded-xl flex flex-col sm:flex-row items-center justify-between group cursor-pointer hover:shadow-xl transition-all gap-6">
            <div className="w-full sm:w-1/2 text-white">
              <span className="text-primary-container font-black text-[10px] uppercase tracking-widest">UK USED CLEARANCE</span>
              <h4 className="font-headline font-bold text-2xl md:text-3xl mt-2 mb-3 md:mb-4 leading-tight">iPhone 13 128GB</h4>
              <p className="text-zinc-400 text-xs md:text-sm mb-6 leading-relaxed">Excellent battery health. Tested & Certified by Sam-B Tech pros.</p>
              <div className="flex items-baseline space-x-3 mb-6 md:mb-8">
                <span className="text-primary-container text-3xl md:text-4xl font-black">{formatCurrency(440000)}</span>
                <span className="text-zinc-600 text-sm line-through">{formatCurrency(510000)}</span>
              </div>
            </div>
            <div className="w-full sm:w-2/5 relative flex justify-center">
              <img 
                className="max-h-48 md:max-h-none w-auto object-contain group-hover:scale-110 transition-transform duration-700" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCjeryPtEqG6w3lXcxrCGg8fgXGAPePzCvQb5avhTeJeUxdmHB-LMPD74XtuBruCkOcn16d33TmqJs7zB5NMHcMS1be6_b4BaT0IaGqMrRbGGGd_ICSBppmK_7Pol9waxYjEAIUHo6TSt_2Nb1xR5Lsj8ZK2uXlDi10NmZclrBNRG8ioaxzvhIRP-JUkPvpYz5Nblk4EZLLoHZFzXJNCt9wJ_pNcRSQWfUz7hsju7ojvLq-IjbuPW_NUmYETpXJ8wQYeOOWymkIwo" 
                alt="iPhone 13 Clearance"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

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
