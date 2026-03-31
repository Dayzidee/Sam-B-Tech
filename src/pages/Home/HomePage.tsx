import { useState } from 'react';
import { 
  ShieldCheck, 
  BadgeCheck, 
  ArrowLeftRight, 
  Truck, 
  ArrowRight, 
  Star,
  Smartphone,
  Laptop,
  Watch,
  Tablet,
  Gamepad2,
  Headphones,
  Calendar,
  Phone,
  ExternalLink,
  Wrench,
  BatteryCharging,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const Hero = () => (
  <section className="relative overflow-hidden min-h-[auto] lg:min-h-[700px] flex items-center mb-12 md:mb-16 px-4 sm:px-6 pt-20 lg:pt-24 pb-10 lg:pb-0">
    <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="z-10 order-2 lg:order-1 text-center lg:text-left"
      >
        <span className="inline-block px-4 py-1 bg-primary-container text-on-primary-fixed text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4 rounded-sm">Featured Launch</span>
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1] mb-4 md:mb-6">
          Premium Tech, <br className="hidden sm:block"/>
          <span className="text-primary-container">Unbeatable Prices</span>
        </h1>
        <p className="text-sm sm:text-lg text-secondary mb-8 md:mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
          The ultimate destination for the latest iPhones, MacBooks, and high-end gadgets. Hand-curated quality for the modern professional.
        </p>
        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 md:gap-4">
          <Link to="/gadgets" className="w-full sm:w-auto">
            <Button size="lg" className="px-8 w-full">Shop Now</Button>
          </Link>
          <Link to="/sales" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="px-8 w-full sm:w-auto">View Deals</Button>
          </Link>
        </div>
      </motion.div>
      <div className="relative h-[380px] sm:h-[500px] lg:h-[650px] order-1 lg:order-2 flex items-center justify-center">
        <div className="relative w-full max-w-[260px] sm:max-w-md aspect-[3/4]">
          <motion.img 
            initial={{ rotate: 0, y: 20, opacity: 0 }}
            animate={{ rotate: 6, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            alt="iPhone showcase" 
            className="absolute top-0 right-0 w-2/3 rounded-[1.5rem] md:rounded-[3rem] shadow-2xl z-20 border-2 md:border-8 border-black" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdjRuQfQnNMiMnfvwUOmakAtXAI4OnuHTodAP2PbrXqof34aGDtblaiX5o4kKxlhC5bc9OsTvqiv5SjYsmaCZgWU4lYEbVV5ho4b10FUXuTnVj0NhqqUzouLVorKT8RYmJZVao3znSX6GOzU66P-kiKD1QpO_MeZgH_ZRFqMe3Ha7ejPBNjg8khPcdZLNaxKuXrtpJf60fHXbIkqbrgd17wHCRLWc305D2J0LR3HButNjyGFvqrBPGycNM2BXft8L-gDMe5hwAt4I"
            referrerPolicy="no-referrer"
          />
          <motion.img 
            initial={{ rotate: 0, y: 20, opacity: 0 }}
            animate={{ rotate: -12, y: 0, opacity: 0.9 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            alt="iPhone secondary" 
            className="absolute bottom-10 left-0 w-2/3 rounded-[1.5rem] md:rounded-[3rem] shadow-xl z-10 border-2 md:border-8 border-zinc-800" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8uNs9jNGZn4hLMupRiNXuuaNAjl6U0GxmH-Mfi1T94hpuV1CdcycM4qOkSwOMP0WoX_BgmvGgweu0buHXlQ1pm80aBtxcFmCpqSEBd731IghJWoGbVzteJ6mzD43QVonlCdRZsx-p5utQs_q6CktExTSpUBCBbFqrUZAljE8-I2FFWtRlBWk-x-lWTZ8za0_5erDlfeG83Cs2tigPNGrXUumeeUeTbiHZCdExALt_yfmBmRe-_gnyJH5X0tbN5-IX-ySZXMpZ_nY"
            referrerPolicy="no-referrer"
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-4 right-0 lg:bottom-12 lg:-right-8 bg-white p-3 md:p-6 rounded-xl shadow-lg border border-outline-variant/10 max-w-[150px] md:max-w-xs z-30"
        >
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <Star className="w-3 h-3 md:w-5 md:h-5 text-primary-container fill-primary-container" />
            <span className="font-bold text-[9px] md:text-sm tracking-tight">Women-Owned Tech Hub</span>
          </div>
          <p className="text-[8px] md:text-xs text-secondary leading-tight md:leading-normal">
            Proudly serving Ikorodu with certified devices and same-day kerbside pickup.
          </p>
        </motion.div>
      </div>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/10 via-transparent to-transparent -z-10 opacity-50"></div>
  </section>
);

const TrustStrip = () => (
  <section className="bg-surface-container-low py-8 md:py-10 mb-16 md:mb-20 border-y border-outline-variant/5">
    <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {[
          { icon: ShieldCheck, title: "Authentic Devices", sub: "Certified Stock" },
          { icon: BadgeCheck, title: "Warranty Guaranteed", sub: "Shop with Peace" },
          { icon: ArrowLeftRight, title: "Trade-Ins Accepted", sub: "Best Value Given" },
          { icon: Truck, title: "Fast Delivery", sub: "Nationwide Shipping" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
              <item.icon className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-[10px] md:text-sm truncate md:whitespace-normal">{item.title}</h4>
              <p className="text-[7px] md:text-[10px] text-secondary uppercase tracking-widest font-semibold truncate md:whitespace-normal">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TrendingDeals = () => (
  <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mb-24">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">Trending Deals</h2>
        <p className="text-secondary text-sm md:text-base">Limited time offers on top-tier gadgets.</p>
      </div>
      <Link to="/gadgets" className="text-primary font-bold flex items-center gap-2 hover:underline text-sm md:text-base">
        View All <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {[
        { id: 1, name: "iPhone 14 Pro Max", brand: "APPLE", price: 650000, oldPrice: 765000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3E4exF9RTKw1NR9VBrOmtUoF1izrlWVo29-EAQ2U-JD0Z9rtfrND5SIr0eryYH859YotCw-QgUkwvu4iXlzOpheqyE8tCKHqc-vG8XdMIgDe68B8Orx3n-TmDZdtH1tFrXL8JTtL_CAFRk9zcdbXl0505TaSBIFwyJshuY2EKKbhE-oPtIJfGxT_Ohh8XMZCH5Lbo6_Wsgzb8qyJH0wKCj22-EhhI8VFzhiRpPQttCzdytiIIDlPbhD-RntS2TuzUcnVXCqqYAKM", tag: "15% OFF" },
        { id: 2, name: "Apple Watch Series 8", brand: "APPLE", price: 320000, oldPrice: 380000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBBYp28NFo9ImbRIFzxxFPgU4pu9Sdf2NFWcZWwqn9TPh1U0YHFZydnWuyWQ_bl4OU-gQIpKZyM1dQWwW8v3rn4UsbxYEdVUHzu3YjQ0isUvR6eZVxAplrYglfxw37ZfQJ_cHJsTnIuYwq87xvESEkb1kTj22yn1pAd04vw_644GrAL-jlb7pFySltzet7m9Ip4STsqTA-qKz5Lh3HFapOIck__rbwxtqBj1PEGa5RRdqM8kZG97OIDj63LmNHpZdKzvTthM2FiEvU", tag: "HOT DEAL" },
        { id: 3, name: "MacBook Pro M2", brand: "APPLE", price: 950000, oldPrice: 1100000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC63IUAOIU6DzXcrWFJ3IBeI8IERRuxZZUL4wJvbWrJE6GTgEuyft_Yop9M1Laf4_8arnAvd_bDTbjZ57f_xuXL0r9DC6pyBmrZpw0Ys_Wf-g59Jl6o_JWZyGi5Ih22zNDdy9qZMEcUO4xoJVRyUZjj20OB3rXpUu4F0tJ1VpUQDk9WjKk5uOCls8QEFtUcZyr7mAT1fZoaIGxLW9paXZJJyAs7Dir1QF5_V2Kev54HdZwtsZgfJDO2hz-qMFQfQM2DPM_3W8BG_Jg", tag: "NEW ARRIVAL" },
        { id: 4, name: "iPad Air (5th Gen)", brand: "APPLE", price: 420000, oldPrice: 525000, image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAH1TjupueZz164hyHOm8FqoqPtJ0NvofggT2xOSuI-jGPLCvopX7nwcTeQM9xBNlRjqQ4BRfs3tUVwwnDMp_p3rNujfxpHmbiRFI5Ua43ulmQ4CxhfvcCcgfR_pGWv2cewIy2N8R1CXwNkG_Oz8lYSOU66VRiky19KMHVJCm_el36_LiaY7l8rEXJtqO1A0aBkmEvlinNSLhGpqb1wrrM3uEfLy6BBtN6t1vL-MnF3NxdArhWs2reQn7qynz1XCXxnvzuT-mTGKtE", tag: "20% OFF" }
      ].map((product) => (
        <div key={product.id} className="group bg-surface-container-lowest p-4 md:p-6 rounded-xl border border-outline-variant/10 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
          <span className="absolute top-4 left-4 z-10 bg-primary-container text-on-primary-fixed text-[10px] font-bold px-3 py-1 rounded-full uppercase">{product.tag}</span>
          <div className="aspect-square mb-4 md:mb-6 overflow-hidden flex items-center justify-center">
            <img alt={product.name} className="w-4/5 object-contain transition-transform duration-500 group-hover:scale-110" src={product.image} referrerPolicy="no-referrer" />
          </div>
          <h3 className="font-bold text-base md:text-lg mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-secondary text-xs md:text-sm mb-4">{product.brand}</p>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl font-black text-on-background">₦{product.price.toLocaleString()}</span>
            <span className="text-secondary line-through text-xs md:text-sm">₦{product.oldPrice.toLocaleString()}</span>
          </div>
          <button className="mt-6 w-full py-3 bg-on-background text-white font-bold rounded hover:bg-primary transition-colors flex items-center justify-center gap-2 text-sm">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  </section>
);

const AboutSection = () => (
  <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mb-24 py-12 md:py-20 bg-white rounded-3xl border border-outline-variant/5">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      <div className="relative order-2 lg:order-1">
        <div className="aspect-square bg-primary-container/20 rounded-full absolute -top-10 -left-10 w-48 h-48 md:w-64 md:h-64 -z-10 blur-3xl"></div>
        <img 
          alt="Founder of SAM-B Tech" 
          className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/5] max-h-[500px] lg:max-h-none" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmYD9Op9BwlWvrbNAzhxqGcEC5zDuKwTsyWFhMPwS0PZVMPuNwtQfFSP84ShS648lIvSpW7wpPWdXKNM2u0QGVis1YuTebs_19ht-oyBPLG-fzok3AFfQTtBIV7rzpBbgDMd8KHkfG-e0y1yuR9hjWWvyrfCWsuafEpP-IIsxDoDj4-x_vV0lcGhfzFqD1vv1QR9mLm2le7tSA1xgfDxdr9ZsDzlEUKx95ts_ILbDiauP4bVrcdUJxcNPNuzVoRfnnZOcqjwY6dco"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-4 -right-2 md:-bottom-6 md:-right-6 bg-primary-container p-4 md:p-8 rounded-2xl shadow-xl max-w-[180px] md:max-w-xs">
          <p className="text-on-primary-fixed font-bold text-xs md:text-lg italic leading-tight">"We're not just selling gadgets; we're empowering the Ikorodu community through technology."</p>
          <p className="mt-2 md:mt-4 text-on-primary-fixed text-[8px] md:text-sm font-bold uppercase tracking-widest">— Bukola, Founder</p>
        </div>
      </div>
      <div className="order-1 lg:order-2">
        <span className="text-primary font-extrabold uppercase tracking-widest text-[10px] md:text-sm mb-4 block">Our Story</span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 md:mb-8 leading-tight">Meet SAM-B: A Women-Owned Tech Hub</h2>
        <div className="space-y-4 md:space-y-6 text-secondary leading-relaxed text-sm md:text-base">
          <p>
            Founded in the heart of Ikorodu, SAM-B TECH began with a simple mission: to bridge the gap between premium global technology and local accessibility. As a proudly women-owned business, we bring a meticulous eye for quality and a deep commitment to customer service.
          </p>
          <p>
            Our founder, Bukola, envisioned a hub where honesty is the currency. Every device in our store—from "UK-Used" Grade A+ iPhones to the latest MacBooks—undergoes a rigorous 50-point inspection before it ever touches our shelves.
          </p>
          <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 md:pt-6">
            <div className="border-l-4 border-primary-container pl-4">
              <span className="block text-2xl md:text-4xl font-black text-on-background">5+</span>
              <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-secondary">Years of Excellence</span>
            </div>
            <div className="border-l-4 border-primary-container pl-4">
              <span className="block text-2xl md:text-4xl font-black text-on-background">10k+</span>
              <span className="text-[10px] md:text-xs uppercase font-bold tracking-wider text-secondary">Happy Customers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PromoSection = () => (
  <section className="max-w-screen-2xl mx-auto px-6 mb-24">
    <div className="relative h-[300px] md:h-[400px] rounded-3xl overflow-hidden group">
      <img 
        alt="Seasonal Promotion" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZDfuWFcJXyuen_9n-BcVTfy4mH-DUJNKKRzxlrjXgH0Ms1WnxGARM57YKyWJ7ybKb_tHuATyXZ9KBeGZMJkRidPyQUC9lWEKxPYYxa3CH0VyhNV9xzsuEXf9CKW1omi8mNCNoJZrworLXQGanlROjSj-3BG3EYu7F15cvWECqUUS1XOy5SZ_iLa0wGBa8_WOly50ou7FVN8K4PvOzngDMb5LpDZUVfEp_LdwB8Ma2xaVNbqsMmGSYXBBoO7Lx8c_FgkJDvUZglw0"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-6 md:px-12">
        <div className="max-w-xl">
          <span className="inline-block bg-primary-container text-on-primary-fixed px-3 py-1 rounded text-[10px] md:text-xs font-black uppercase tracking-widest mb-4">Limited Partnership</span>
          <h2 className="text-white text-3xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6">Upgrade Season <br/><span className="text-primary-container">Mega Sale</span></h2>
          <p className="text-zinc-300 text-sm md:text-lg mb-6 md:mb-8 line-clamp-2 md:line-clamp-none">Get up to ₦50,000 instant credit when you trade in your old iPhone for the 15 Pro series. Partnership valid this month only.</p>
          <Link to="/sales">
            <Button variant="secondary" size="lg" className="flex items-center gap-2 text-sm md:text-base">
              Get Started <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const RepairSection = () => {
  const [showCallModal, setShowCallModal] = useState(false);

  return (
  <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mb-24">
    <div className="bg-on-background rounded-3xl p-6 md:p-16 text-white grid grid-cols-1 lg:grid-cols-5 gap-10 md:gap-12 items-center relative overflow-hidden">
      <Wrench className="absolute -right-10 -bottom-10 w-[200px] h-[200px] md:w-[300px] md:h-[300px] opacity-5 pointer-events-none" />
      <div className="lg:col-span-3 z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-[1px] bg-primary-container"></span>
          <span className="text-primary-container font-bold uppercase tracking-widest text-[10px] md:text-sm">Certified Service Center</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">Professional Device Repairs</h2>
        <p className="text-zinc-400 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed max-w-2xl">
          Don't let a cracked screen or a dying battery hold you back. Our certified technicians specialize in iPhone and MacBook repairs using genuine parts with same-day turnaround.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 mb-8 md:mb-10">
          <div className="flex items-center gap-3 md:gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-primary-container" />
            <div>
              <p className="font-bold text-sm md:text-base">Screen Replacement</p>
              <p className="text-[10px] md:text-xs text-zinc-500">Original OEM Displays</p>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
            <BatteryCharging className="w-5 h-5 md:w-6 md:h-6 text-primary-container" />
            <div>
              <p className="font-bold text-sm md:text-base">Battery Service</p>
              <p className="text-[10px] md:text-xs text-zinc-500">Health Restoration</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <Link to="/repair" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 text-sm md:text-base w-full">
              <Calendar className="w-4 h-4 md:w-5 md:h-5" /> Book a Repair
            </Button>
          </Link>
          <button onClick={() => setShowCallModal(true)} className="border border-white/20 px-8 md:px-10 py-3 md:py-4 rounded-md font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm md:text-base w-full sm:w-auto">
            <Phone className="w-4 h-4 md:w-5 md:h-5" /> Call Our Techs
          </button>
        </div>
      </div>
      <div className="lg:col-span-2 relative group z-10">
        <img 
          alt="Tech repair service" 
          className="rounded-2xl shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500 w-full object-cover aspect-video lg:aspect-square" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMJrpGic1XQhd0SMNmlFbkHurugjN_POIPpZHMOM4kmBQJcg1GHuYui0ZoM9DIMTT-dGEI2vqjOmj_icXdEyL2IArf50SDVsSDgrUxj4oDCPdAxX24OcYKYmySr9RrEgYmsSxEwzRlMT01Udmr3ldbdu0w49prPQyxsgLg8lw4cxxSj-mf8I-FtG531t-JpNB5JYTNZA1_OSoEQdDhW_V2dKcrwcWovNXqBkaLHqHElSMn2KPUlJ-e6YJacDfdrH8toHvzXQd2iDo"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -top-4 -left-4 bg-white text-black px-4 md:px-6 py-2 md:py-4 rounded-xl shadow-lg">
          <p className="text-xs md:text-sm font-black uppercase tracking-tighter leading-none">Express Service</p>
          <p className="text-[10px] md:text-xs text-secondary mt-1">Under 60 Mins</p>
        </div>
      </div>
    </div>

    {showCallModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-surface rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-outline-variant/20 relative">
          <button onClick={() => setShowCallModal(false)} className="absolute top-4 right-4 text-secondary hover:text-on-surface">
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-bold mb-4">Call Our Technicians</h3>
          <p className="text-sm text-secondary mb-6">Select the department you need help with:</p>
          <div className="space-y-3">
            <a href="tel:+2348000000001" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Phone Repair</p>
                <p className="text-xs text-secondary">+234 800 000 0001</p>
              </div>
            </a>
            <a href="tel:+2348000000002" className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/20 hover:border-primary hover:bg-primary/5 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Laptop Repair</p>
                <p className="text-xs text-secondary">+234 800 000 0002</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    )}
  </section>
  );
};

const BlogCard = ({ category, title, excerpt, date, readTime, image, id }: any) => (
  <Link to={`/blog/${id}`} className="group cursor-pointer block">
    <div className="rounded-2xl overflow-hidden mb-4 md:mb-6 aspect-video bg-surface-container shadow-sm">
      <img 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        src={image}
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="space-y-2 md:space-y-3">
      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{category}</span>
      <h3 className="text-lg md:text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
      <p className="text-secondary text-xs md:text-sm line-clamp-2">{excerpt}</p>
      <span className="text-[10px] md:text-xs text-zinc-400 font-medium">{date} · {readTime}</span>
    </div>
  </Link>
);

const TechInsights = () => (
  <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mb-24">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-4">
      <div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">Tech Insights & Tips</h2>
        <p className="text-secondary text-sm md:text-base">Learn how to make the most of your gadgets.</p>
      </div>
      <Link to="/support" className="text-primary font-bold flex items-center gap-2 hover:underline text-sm md:text-base">
        Read Blog <ExternalLink className="w-4 h-4" />
      </Link>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      <BlogCard 
        id="1"
        category="Pro Tips"
        title="How to maintain your iPhone battery health"
        excerpt="Simple habits that will keep your device running efficiently for years. Stop making these 3 common charging mistakes..."
        date="May 12, 2024"
        readTime="5 min read"
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAthakVx9kq_GHcu8zFDUCqB70hZzWC_SMqMzRQipEVNE97nyOYoIE8LTOCHoTmeKaV2xWa5DXeqctgASU7EjLSchpw64JYYCRcVNrXpBW-HlWjOY1pSB2jCX8JzilWQoF-44j_ojA3dGKW3O8impL7BlVqswPhwnk4UYj5tT1rherzRjbUiw-1Yo7dWNLHPfpmW3yW-FW9cWklYynJ68jYVEwB1QtGxQbKBR_PVIkUjt8m4AA-dmXKY6fNOXLWVoQfxDWUK0w1LAk"
      />
      <BlogCard 
        id="2"
        category="Buying Guide"
        title="Top Gadgets for 2024: The Essential List"
        excerpt="From the Vision Pro to the latest ultra-thin laptops, these are the devices that will redefine how you work and play this year."
        date="April 28, 2024"
        readTime="8 min read"
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuC3-KfvSMvNEr3cqzEq5W97YGAzVpRwutitKbtwATlS4OKAgYPm7Gr040LGeC_Z906U_P6xJtkOz8O8758ZZ4XIceOI9kodufdYHPmPGTOD_1h6NhkIJLx_-AWzhoD6M0FySGnY5q7i3D94uUqdoyFHJ_HcRzedcYl2gDIOso-1Bvu8Ura55mxv2AJ1rL4NISx3rh_2RU-O-1rI0V0P0OpA89Ik_q198kQLFqqwx5EoG3411McEbbW0bjU7XYzCRBxnc7yP739Rw24"
      />
      <BlogCard 
        id="3"
        category="Workspace"
        title="Maximizing Productivity on your new MacBook"
        excerpt="Unlock the hidden macOS features that will save you hours every week. A complete guide for tech-savvy professionals."
        date="April 15, 2024"
        readTime="6 min read"
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAGl38kSFT_gyBmz8_554Tfi1anH_IQe83ao6Y2DVoGBM-dDugwfy7M5pXW4QigVbD02Oj25jbF1Shpc_7GmLe3jsTrZwbZnlMqI0hVCqrfXqxrtDWu_scuP-3cHD4Vs-epTAuqTcpFg4hndPaNYyiriBI49cwcUSzBSAwAissHonOrSM0ghPuYOgYFtoLNIeSEfvEw4U5u2jdF87LamXwlxVQrDsFi7TlxXUeTiKmCLGXDGr5Yr5jimbCAw3rB_mzdkmuVwpRfgRA"
      />
    </div>
  </section>
);

const Categories = () => (
  <section className="max-w-screen-2xl mx-auto px-4 md:px-6 mb-24">
    <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-8 md:mb-12 text-center">Browse Categories</h2>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-6">
      {[
        { icon: Smartphone, label: "Phones" },
        { icon: Laptop, label: "Laptops" },
        { icon: Watch, label: "Watches" },
        { icon: Tablet, label: "Tablets" },
        { icon: Gamepad2, label: "Gaming" },
        { icon: Headphones, label: "Accessories" }
      ].map((cat, i) => (
        <Link key={i} to="/gadgets" className="flex flex-col items-center group">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center mb-3 md:mb-4 shadow-sm border border-outline-variant/5 transition-all group-hover:bg-primary-container group-hover:border-primary-container overflow-hidden">
            <cat.icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 group-hover:text-on-primary-fixed transition-colors" />
          </div>
          <span className="font-bold text-[10px] md:text-sm text-center">{cat.label}</span>
        </Link>
      ))}
    </div>
  </section>
);

const Newsletter = () => (
  <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 mb-24">
    <div className="relative bg-on-background rounded-3xl overflow-hidden p-6 md:p-20 text-center">
      <div className="relative z-10">
        <h2 className="text-white text-2xl md:text-5xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">Upgrade Your Tech Game Today.</h2>
        <p className="text-zinc-400 text-sm md:text-lg max-w-lg mx-auto mb-8 md:mb-10">Sign up for our newsletter to get exclusive deals on iPhones and MacBooks delivered straight to your inbox.</p>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 max-w-md mx-auto">
          <input className="flex-grow bg-white/10 border border-white/10 rounded-md px-6 py-4 text-white focus:ring-2 focus:ring-primary-container outline-none text-sm" placeholder="Your email address" type="email"/>
          <Button variant="secondary" size="lg" className="whitespace-nowrap text-sm md:text-base w-full md:w-auto">Subscribe Now</Button>
        </div>
      </div>
      <div className="absolute inset-0 opacity-5 md:opacity-10 flex flex-wrap gap-4 md:gap-8 overflow-hidden pointer-events-none p-6 md:p-10">
        <Smartphone className="w-16 h-16 md:w-32 md:h-32 text-white" />
        <Laptop className="w-16 h-16 md:w-32 md:h-32 text-white" />
        <Watch className="w-16 h-16 md:w-32 md:h-32 text-white" />
        <Tablet className="w-16 h-16 md:w-32 md:h-32 text-white" />
      </div>
    </div>
  </section>
);

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <TrustStrip />
      <TrendingDeals />
      <AboutSection />
      <PromoSection />
      <RepairSection />
      <TechInsights />
      <Categories />
      <Newsletter />
    </div>
  );
};
