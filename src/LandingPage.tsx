import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart, 
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
  MessageSquare,
  Globe,
  Trophy
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from './backend/config/firebase';
import { motion } from 'motion/react';

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-outline-variant/10">
    <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
      <div className="text-2xl font-black tracking-tighter text-black">
        SAM-B TECH
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <a className="text-primary font-bold border-b-2 border-primary pb-1" href="#">Home</a>
        <a className="text-secondary hover:text-black transition-colors font-medium" href="#">Gadgets</a>
        <a className="text-secondary hover:text-black transition-colors font-medium" href="#">Sales</a>
        <a className="text-secondary hover:text-black transition-colors font-medium" href="#">Trade-In</a>
        <a className="text-secondary hover:text-black transition-colors font-medium" href="#">Support</a>
      </div>
      <div className="flex items-center space-x-6">
        <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full">
          <Search className="text-secondary w-4 h-4 mr-2" />
          <input className="bg-transparent border-none outline-none text-sm w-48 focus:ring-0" placeholder="Search tech..." type="text"/>
        </div>
        <div className="flex space-x-4 text-on-surface">
          <User className="w-5 h-5 cursor-pointer hover:text-primary transition-all" />
          <Heart className="w-5 h-5 cursor-pointer hover:text-primary transition-all" />
          <div className="relative">
            <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-primary transition-all" />
            <span className="absolute -top-1 -right-1 bg-tertiary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">3</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative overflow-hidden min-h-[600px] flex items-center mb-16 px-6 pt-20">
    <div className="max-w-screen-2xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="z-10 order-2 lg:order-1"
      >
        <span className="inline-block px-4 py-1 bg-primary-container text-on-primary-fixed text-xs font-bold tracking-widest uppercase mb-4 rounded-sm">Featured Launch</span>
        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-tight mb-6">
          Premium Tech, <br/>
          <span className="text-primary-container">Unbeatable Prices</span>
        </h1>
        <p className="text-lg text-secondary mb-10 max-w-md leading-relaxed">
          The ultimate destination for the latest iPhones, MacBooks, and high-end gadgets. Hand-curated quality for the modern professional.
        </p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-on-background text-white px-10 py-4 text-lg font-bold rounded-md hover:bg-primary transition-all active:scale-95">
            Shop Now
          </button>
          <button className="bg-white border border-outline-variant px-10 py-4 text-lg font-semibold rounded-md hover:bg-surface-container-low transition-all">
            View Deals
          </button>
        </div>
      </motion.div>
      <div className="relative h-[400px] lg:h-[600px] order-1 lg:order-2">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full max-w-md aspect-[3/4]">
            <motion.img 
              initial={{ rotate: 0, y: 20, opacity: 0 }}
              animate={{ rotate: 6, y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              alt="iPhone showcase" 
              className="absolute top-0 right-0 w-2/3 rounded-[3rem] shadow-2xl z-20 border-8 border-black" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdjRuQfQnNMiMnfvwUOmakAtXAI4OnuHTodAP2PbrXqof34aGDtblaiX5o4kKxlhC5bc9OsTvqiv5SjYsmaCZgWU4lYEbVV5ho4b10FUXuTnVj0NhqqUzouLVorKT8RYmJZVao3znSX6GOzU66P-kiKD1QpO_MeZgH_ZRFqMe3Ha7ejPBNjg8khPcdZLNaxKuXrtpJf60fHXbIkqbrgd17wHCRLWc305D2J0LR3HButNjyGFvqrBPGycNM2BXft8L-gDMe5hwAt4I"
              referrerPolicy="no-referrer"
            />
            <motion.img 
              initial={{ rotate: 0, y: 20, opacity: 0 }}
              animate={{ rotate: -12, y: 0, opacity: 0.9 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              alt="iPhone secondary" 
              className="absolute bottom-10 left-0 w-2/3 rounded-[3rem] shadow-xl z-10 border-8 border-zinc-800" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8uNs9jNGZn4hLMupRiNXuuaNAjl6U0GxmH-Mfi1T94hpuV1CdcycM4qOkSwOMP0WoX_BgmvGgweu0buHXlQ1pm80aBtxcFmCpqSEBd731IghJWoGbVzteJ6mzD43QVonlCdRZsx-p5utQs_q6CktExTSpUBCBbFqrUZAljE8-I2FFWtRlBWk-x-lWTZ8za0_5erDlfeG83Cs2tigPNGrXUumeeUeTbiHZCdExALt_yfmBmRe-_gnyJH5X0tbN5-IX-ySZXMpZ_nY"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-0 right-0 lg:bottom-12 lg:-right-8 bg-white p-6 rounded-xl shadow-lg border border-outline-variant/10 max-w-xs z-30"
        >
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-primary-container fill-primary-container" />
            <span className="font-bold text-sm tracking-tight">Women-Owned Tech Hub</span>
          </div>
          <p className="text-xs text-secondary leading-normal">
            Proudly serving Ikorodu with certified devices and same-day kerbside pickup.
          </p>
        </motion.div>
      </div>
    </div>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/10 via-transparent to-transparent -z-10 opacity-50"></div>
  </section>
);

const TrustStrip = () => (
  <section className="bg-surface-container-low py-10 mb-20 border-y border-outline-variant/5">
    <div className="max-w-screen-2xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { icon: ShieldCheck, title: "Authentic Devices", sub: "Certified Stock" },
          { icon: BadgeCheck, title: "Warranty Guaranteed", sub: "Shop with Peace" },
          { icon: ArrowLeftRight, title: "Trade-Ins Accepted", sub: "Best Value Given" },
          { icon: Truck, title: "Fast Delivery", sub: "Nationwide Shipping" }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{item.title}</h4>
              <p className="text-[10px] text-secondary uppercase tracking-widest font-semibold">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DealCard = ({ title, price, oldPrice, tag, image, desc }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="group bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/10 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
  >
    <span className={`absolute top-4 left-4 z-10 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase ${tag === 'NEW ARRIVAL' ? 'bg-primary-container text-on-primary-fixed' : 'bg-tertiary'}`}>
      {tag}
    </span>
    <div className="aspect-square mb-6 overflow-hidden flex items-center justify-center">
      <img 
        alt={title} 
        className="w-4/5 object-contain transition-transform duration-500 group-hover:scale-110" 
        src={image}
        referrerPolicy="no-referrer"
      />
    </div>
    <h3 className="font-bold text-lg mb-1">{title}</h3>
    <p className="text-secondary text-sm mb-4">{desc}</p>
    <div className="flex items-center gap-3">
      <span className="text-2xl font-black text-on-background">{price}</span>
      <span className="text-secondary line-through text-sm">{oldPrice}</span>
    </div>
    <button className="mt-6 w-full py-3 bg-on-background text-white font-bold rounded hover:bg-primary transition-colors flex items-center justify-center gap-2">
      <ShoppingCart className="w-4 h-4" /> Add to Cart
    </button>
  </motion.div>
);

const TrendingDeals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("FETCHED PRODUCTS:", fetchedProducts);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <section className="max-w-screen-2xl mx-auto px-6 mb-24 flex justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </section>
  );

  return (
    <section className="max-w-screen-2xl mx-auto px-6 mb-24">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2">Trending Deals</h2>
          <p className="text-secondary">Limited time offers on top-tier gadgets.</p>
        </div>
        <a className="text-primary font-bold flex items-center gap-2 hover:underline" href="/shop">
          View All <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <DealCard 
            key={product.id}
            title={product.name} 
            price={`₦${product.price.toLocaleString()}`} 
            oldPrice={product.discountPrice ? `₦${product.discountPrice.toLocaleString()}` : undefined} 
            tag={product.condition} 
            desc={product.category}
            image={product.images[0]}
          />
        ))}
      </div>
    </section>
  );
};

const AboutSection = () => (
  <section className="max-w-screen-2xl mx-auto px-6 mb-24 py-16 bg-white rounded-3xl border border-outline-variant/5">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <div className="aspect-square bg-primary-container/20 rounded-full absolute -top-10 -left-10 w-64 h-64 -z-10 blur-3xl"></div>
        <img 
          alt="Founder of SAM-B Tech" 
          className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/5]" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmYD9Op9BwlWvrbNAzhxqGcEC5zDuKwTsyWFhMPwS0PZVMPuNwtQfFSP84ShS648lIvSpW7wpPWdXKNM2u0QGVis1YuTebs_19ht-oyBPLG-fzok3AFfQTtBIV7rzpBbgDMd8KHkfG-e0y1yuR9hjWWvyrfCWsuafEpP-IIsxDoDj4-x_vV0lcGhfzFqD1vv1QR9mLm2le7tSA1xgfDxdr9ZsDzlEUKx95ts_ILbDiauP4bVrcdUJxcNPNuzVoRfnnZOcqjwY6dco"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-6 -right-6 bg-primary-container p-8 rounded-2xl shadow-xl max-w-xs">
          <p className="text-on-primary-fixed font-bold text-lg italic leading-tight">"We're not just selling gadgets; we're empowering the Ikorodu community through technology."</p>
          <p className="mt-4 text-on-primary-fixed text-sm font-bold uppercase tracking-widest">— Bukola, Founder</p>
        </div>
      </div>
      <div>
        <span className="text-primary font-extrabold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8">Meet SAM-B: A Women-Owned Tech Hub</h2>
        <div className="space-y-6 text-secondary leading-relaxed">
          <p>
            Founded in the heart of Ikorodu, SAM-B TECH began with a simple mission: to bridge the gap between premium global technology and local accessibility. As a proudly women-owned business, we bring a meticulous eye for quality and a deep commitment to customer service.
          </p>
          <p>
            Our founder, Bukola, envisioned a hub where honesty is the currency. Every device in our store—from "UK-Used" Grade A+ iPhones to the latest MacBooks—undergoes a rigorous 50-point inspection before it ever touches our shelves.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-6">
            <div className="border-l-4 border-primary-container pl-4">
              <span className="block text-3xl font-black text-on-background">5+</span>
              <span className="text-xs uppercase font-bold tracking-wider">Years of Excellence</span>
            </div>
            <div className="border-l-4 border-primary-container pl-4">
              <span className="block text-3xl font-black text-on-background">10k+</span>
              <span className="text-xs uppercase font-bold tracking-wider">Happy Customers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PromoSection = () => (
  <section className="max-w-screen-2xl mx-auto px-6 mb-24">
    <div className="relative h-[400px] rounded-3xl overflow-hidden group">
      <img 
        alt="Seasonal Promotion" 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZDfuWFcJXyuen_9n-BcVTfy4mH-DUJNKKRzxlrjXgH0Ms1WnxGARM57YKyWJ7ybKb_tHuATyXZ9KBeGZMJkRidPyQUC9lWEKxPYYxa3CH0VyhNV9xzsuEXf9CKW1omi8mNCNoJZrworLXQGanlROjSj-3BG3EYu7F15cvWECqUUS1XOy5SZ_iLa0wGBa8_WOly50ou7FVN8K4PvOzngDMb5LpDZUVfEp_LdwB8Ma2xaVNbqsMmGSYXBBoO7Lx8c_FgkJDvUZglw0"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-12">
        <div className="max-w-xl">
          <span className="inline-block bg-primary-container text-on-primary-fixed px-4 py-1 rounded text-xs font-black uppercase tracking-widest mb-4">Limited Partnership</span>
          <h2 className="text-white text-4xl md:text-6xl font-black tracking-tighter mb-6">Upgrade Season <br/><span className="text-primary-container">Mega Sale</span></h2>
          <p className="text-zinc-300 text-lg mb-8">Get up to ₦50,000 instant credit when you trade in your old iPhone for the 15 Pro series. Partnership valid this month only.</p>
          <button className="bg-primary-container text-on-primary-fixed px-8 py-4 rounded-md font-bold hover:brightness-110 transition-all flex items-center gap-2">
            Get Started <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </section>
);

const RepairSection = () => (
  <section className="max-w-screen-2xl mx-auto px-6 mb-24">
    <div className="bg-on-background rounded-3xl p-8 md:p-16 text-white grid grid-cols-1 lg:grid-cols-5 gap-12 items-center relative overflow-hidden">
      <Wrench className="absolute -right-10 -bottom-10 w-[300px] h-[300px] opacity-5 pointer-events-none" />
      <div className="lg:col-span-3">
        <div className="flex items-center gap-3 mb-6">
          <span className="w-10 h-[1px] bg-primary-container"></span>
          <span className="text-primary-container font-bold uppercase tracking-widest text-sm">Certified Service Center</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">Professional Device Repairs</h2>
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-2xl">
          Don't let a cracked screen or a dying battery hold you back. Our certified technicians specialize in iPhone and MacBook repairs using genuine parts with same-day turnaround.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
            <Smartphone className="w-6 h-6 text-primary-container" />
            <div>
              <p className="font-bold">Screen Replacement</p>
              <p className="text-xs text-zinc-500">Original OEM Displays</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl">
            <BatteryCharging className="w-6 h-6 text-primary-container" />
            <div>
              <p className="font-bold">Battery Service</p>
              <p className="text-xs text-zinc-500">Health Restoration</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="bg-primary-container text-on-primary-fixed px-10 py-4 rounded-md font-black hover:bg-white transition-all flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" /> Book a Repair
          </button>
          <a className="border border-white/20 px-10 py-4 rounded-md font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2" href="tel:+2348123456789">
            <Phone className="w-5 h-5" /> Call Our Techs
          </a>
        </div>
      </div>
      <div className="lg:col-span-2 relative group">
        <img 
          alt="Tech repair service" 
          className="rounded-2xl shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-500" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMJrpGic1XQhd0SMNmlFbkHurugjN_POIPpZHMOM4kmBQJcg1GHuYui0ZoM9DIMTT-dGEI2vqjOmj_icXdEyL2IArf50SDVsSDgrUxj4oDCPdAxX24OcYKYmySr9RrEgYmsSxEwzRlMT01Udmr3ldbdu0w49prPQyxsgLg8lw4cxxSj-mf8I-FtG531t-JpNB5JYTNZA1_OSoEQdDhW_V2dKcrwcWovNXqBkaLHqHElSMn2KPUlJ-e6YJacDfdrH8toHvzXQd2iDo"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -top-4 -left-4 bg-white text-black px-6 py-4 rounded-xl shadow-lg">
          <p className="text-sm font-black uppercase tracking-tighter leading-none">Express Service</p>
          <p className="text-xs text-secondary mt-1">Under 60 Mins</p>
        </div>
      </div>
    </div>
  </section>
);

const BlogCard = ({ category, title, excerpt, date, readTime, image }: any) => (
  <article className="group cursor-pointer">
    <div className="rounded-2xl overflow-hidden mb-6 aspect-video bg-surface-container shadow-sm">
      <img 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        src={image}
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="space-y-3">
      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{category}</span>
      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-secondary text-sm line-clamp-2">{excerpt}</p>
      <span className="text-xs text-zinc-400 font-medium">{date} · {readTime}</span>
    </div>
  </article>
);

const BlogSection = () => (
  <section className="max-w-screen-2xl mx-auto px-6 mb-24">
    <div className="flex justify-between items-end mb-12">
      <div>
        <h2 className="text-4xl font-black tracking-tighter mb-2">Tech Insights & Tips</h2>
        <p className="text-secondary">Learn how to make the most of your gadgets.</p>
      </div>
      <a className="text-primary font-bold flex items-center gap-2 hover:underline" href="#">
        Read Blog <ExternalLink className="w-4 h-4" />
      </a>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <BlogCard 
        category="Pro Tips"
        title="How to maintain your iPhone battery health"
        excerpt="Simple habits that will keep your device running efficiently for years. Stop making these 3 common charging mistakes..."
        date="May 12, 2024"
        readTime="5 min read"
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuAthakVx9kq_GHcu8zFDUCqB70hZzWC_SMqMzRQipEVNE97nyOYoIE8LTOCHoTmeKaV2xWa5DXeqctgASU7EjLSchpw64JYYCRcVNrXpBW-HlWjOY1pSB2jCX8JzilWQoF-44j_ojA3dGKW3O8impL7BlVqswPhwnk4UYj5tT1rherzRjbUiw-1Yo7dWNLHPfpmW3yW-FW9cWklYynJ68jYVEwB1QtGxQbKBR_PVIkUjt8m4AA-dmXKY6fNOXLWVoQfxDWUK0w1LAk"
      />
      <BlogCard 
        category="Buying Guide"
        title="Top Gadgets for 2024: The Essential List"
        excerpt="From the Vision Pro to the latest ultra-thin laptops, these are the devices that will redefine how you work and play this year."
        date="April 28, 2024"
        readTime="8 min read"
        image="https://lh3.googleusercontent.com/aida-public/AB6AXuC3-KfvSMvNEr3cqzEq5W97YGAzVpRwutitKbtwATlS4OKAgYPm7Gr040LGeC_Z906U_P6xJtkOz8O8758ZZ4XIceOI9kodufdYHPmPGTOD_1h6NhkIJLx_-AWzhoD6M0FySGnY5q7i3D94uUqdoyFHJ_HcRzedcYl2gDIOso-1Bvu8Ura55mxv2AJ1rL4NISx3rh_2RU-O-1rI0V0P0OpA89Ik_q198kQLFqqwx5EoG3411McEbbW0bjU7XYzCRBxnc7yP739Rw24"
      />
      <BlogCard 
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
  <section className="max-w-screen-2xl mx-auto px-6 mb-24">
    <h2 className="text-3xl font-black tracking-tighter mb-12 text-center">Browse Categories</h2>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
      {[
        { icon: Smartphone, label: "Phones" },
        { icon: Laptop, label: "Laptops" },
        { icon: Watch, label: "Watches" },
        { icon: Tablet, label: "Tablets" },
        { icon: Gamepad2, label: "Gaming" },
        { icon: Headphones, label: "Accessories" }
      ].map((cat, i) => (
        <a key={i} className="flex flex-col items-center group" href="#">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-outline-variant/5 transition-all group-hover:bg-primary-container group-hover:border-primary-container overflow-hidden">
            <cat.icon className="w-10 h-10 group-hover:text-on-primary-fixed transition-colors" />
          </div>
          <span className="font-bold text-sm">{cat.label}</span>
        </a>
      ))}
    </div>
  </section>
);

const Newsletter = () => (
  <section className="max-w-screen-2xl mx-auto px-6 mb-24">
    <div className="relative bg-on-background rounded-3xl overflow-hidden p-12 text-center">
      <div className="relative z-10">
        <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter mb-6">Upgrade Your Tech Game Today.</h2>
        <p className="text-zinc-400 max-w-lg mx-auto mb-10">Sign up for our newsletter to get exclusive deals on iPhones and MacBooks delivered straight to your inbox.</p>
        <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
          <input className="flex-grow bg-white/10 border-none rounded-md px-6 py-4 text-white focus:ring-2 focus:ring-primary-container outline-none" placeholder="Your email address" type="email"/>
          <button className="bg-primary-container text-on-primary-fixed font-bold px-8 py-4 rounded-md whitespace-nowrap active:scale-95 transition-all">Subscribe Now</button>
        </div>
      </div>
      <div className="absolute inset-0 opacity-10 flex flex-wrap gap-4 overflow-hidden pointer-events-none">
        <Smartphone className="w-32 h-32 text-white" />
        <Laptop className="w-32 h-32 text-white" />
        <Watch className="w-32 h-32 text-white" />
        <Tablet className="w-32 h-32 text-white" />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-zinc-100 w-full border-t border-zinc-200">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-16 max-w-screen-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-xl font-bold text-black">SAM-B TECH</div>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Premium gadget hub specializing in UK-used and brand-new Apple products. Certified quality you can trust.
        </p>
        <div className="flex space-x-4">
          <Trophy className="w-10 h-10 p-2 rounded-full bg-white text-zinc-600 hover:text-primary cursor-pointer transition-colors" />
          <Globe className="w-10 h-10 p-2 rounded-full bg-white text-zinc-600 hover:text-primary cursor-pointer transition-colors" />
          <MessageSquare className="w-10 h-10 p-2 rounded-full bg-white text-zinc-600 hover:text-primary cursor-pointer transition-colors" />
        </div>
      </div>
      <div>
        <h5 className="font-bold text-sm mb-6 uppercase tracking-wider">Quick Links</h5>
        <ul className="space-y-4 text-sm">
          <li><a className="text-zinc-500 hover:text-primary transition-all" href="#">Return Policy</a></li>
          <li><a className="text-zinc-500 hover:text-primary transition-all" href="#">Warranty Terms</a></li>
          <li><a className="text-zinc-500 hover:text-primary transition-all" href="#">Track Order</a></li>
          <li><a className="text-zinc-500 hover:text-primary transition-all" href="#">Repair Status</a></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-sm mb-6 uppercase tracking-wider">About Us</h5>
        <ul className="space-y-4 text-sm">
          <li><a className="text-zinc-500 hover:text-primary transition-all" href="#">Our Story</a></li>
          <li><a className="text-zinc-500 hover:text-primary transition-all" href="#">Women-Owned Tech Hub</a></li>
          <li><a className="text-zinc-500 hover:text-primary transition-all" href="#">Secure Ordering</a></li>
          <li><a className="text-zinc-500 hover:text-primary transition-all" href="#">Nationwide Delivery</a></li>
        </ul>
      </div>
      <div>
        <h5 className="font-bold text-sm mb-6 uppercase tracking-wider">Visit Us</h5>
        <p className="text-zinc-500 text-sm mb-4">
          56 Obafemi Awolowo Rd, Ikorodu.<br/>
          Mon-Sat, Closes 6 PM.
        </p>
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Phone className="w-4 h-4" /> +234 812 345 6789
        </div>
      </div>
    </div>
    <div className="border-t border-zinc-200 py-8 px-8 text-center">
      <p className="text-zinc-400 text-xs">© 2024 SAM-B TECH. 56 Obafemi Awolowo Rd, Ikorodu. Mon-Sat, Closes 6 PM.</p>
    </div>
  </footer>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <TrendingDeals />
        <AboutSection />
        <PromoSection />
        <RepairSection />
        <BlogSection />
        <Categories />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
