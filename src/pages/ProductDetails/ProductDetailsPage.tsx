import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  BatteryCharging, 
  Truck, 
  Store, 
  ShoppingBag, 
  Award,
  Star,
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, cn } from '@/utils';
import { useCartStore } from '@/store/useCartStore';

const IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDQUehYnM1aGthXlXebLbST_0ZWQ5DPMTcuhKhtjA12pCBWRydL8vX2lym9tE6D882VHaOiQEqqPkoIE_bBovPbdDYsPelDpAMN3RkKqC-Ey-BTbpZEJmSMO5V7ZMr5HQe5kPmYWlBnRd0s2a4x3pO5iETO84QLDGPTZ9P7zrIk_RTNiRGpfbYhkuIILtgb1kHqCsQXLp69C_muapsCMuAmVjx1I9Tb8yn8ISEjpj2_tsyix9AzhF40Nhza4Y_vqYxMcRjOkcnVFqA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCCHGA7AweiStJGSw5l5EjNTGR_R9m0RO0uijOONKFXvCdewaXmz5yDQFDDfmH9MlcMXSu6uM_ak0W0qbkL2mUvPyS7heOp0uT8PNo2kHPrcNHSaNmoXMS4KcPhfibN5i-SRZS5n5oyWya6JXIXlyKMKNDusTQP9hlC7T-xpE-YcjPlOYFGz1AfuHkf6y-XfcybnLW9iwOkGPVcoktPVudgthDBu2S6MDvF2P5GBDe_WBhuNHYvB5s_2lerGMb2J-3sda-2YASHql8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAo7XnmouuGY6zT_KQQkVxtkBsOrVd8IHUjVPg8OZXOSefpc3Kok0oI3v8mmbGmIIXZne-QUEHn7CZrXb0Sq92anCJRdwM7iWj4ZczgotSYj4RbNofy8jZjqP3NUxmkP6zxnYVyQVzlvwFYHLKyG697W8dDKKfc-_LiIMaJjtabNH0s_-MtfhN4kbcEiTV5fR619BUxNVbD4pzoSP_lZdbmF03LACWKRXYBvzF-aaMMJRDWNoEHmdAxQ3fYrMryxG0F6OyhDnNlFaQ"
];

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [condition, setCondition] = useState<'UK Used' | 'Brand New'>('UK Used');
  const [storage, setStorage] = useState('128GB');
  const [color, setColor] = useState('Sierra Blue');
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCartStore();

  // Mock database fetch based on ID
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching data based on ID
    // In a real app, this would be an API call
    const fetchProduct = () => {
      // Mock data
      const mockProducts: Record<string, any> = {
        "1": {
          id: "1",
          name: "iPhone 14 Pro Max",
          category: "Phones",
          brand: "Apple",
          price: 650000,
          oldPrice: 765000,
          discount: "-15%",
          batteryHealth: "95%",
          rating: 4.9,
          reviews: 124,
          images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC3E4exF9RTKw1NR9VBrOmtUoF1izrlWVo29-EAQ2U-JD0Z9rtfrND5SIr0eryYH859YotCw-QgUkwvu4iXlzOpheqyE8tCKHqc-vG8XdMIgDe68B8Orx3n-TmDZdtH1tFrXL8JTtL_CAFRk9zcdbXl0505TaSBIFwyJshuY2EKKbhE-oPtIJfGxT_Ohh8XMZCH5Lbo6_Wsgzb8qyJH0wKCj22-EhhI8VFzhiRpPQttCzdytiIIDlPbhD-RntS2TuzUcnVXCqqYAKM",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCCHGA7AweiStJGSw5l5EjNTGR_R9m0RO0uijOONKFXvCdewaXmz5yDQFDDfmH9MlcMXSu6uM_ak0W0qbkL2mUvPyS7heOp0uT8PNo2kHPrcNHSaNmoXMS4KcPhfibN5i-SRZS5n5oyWya6JXIXlyKMKNDusTQP9hlC7T-xpE-YcjPlOYFGz1AfuHkf6y-XfcybnLW9iwOkGPVcoktPVudgthDBu2S6MDvF2P5GBDe_WBhuNHYvB5s_2lerGMb2J-3sda-2YASHql8"
          ],
          colors: [
            { name: 'Deep Purple', hex: '#594F63' },
            { name: 'Gold', hex: '#F5E7CF' },
            { name: 'Silver', hex: '#F0F2F2' },
            { name: 'Space Black', hex: '#2C2C2E' }
          ],
          storages: ['128GB', '256GB', '512GB', '1TB']
        },
        "2": {
          id: "2",
          name: "Apple Watch Series 8",
          category: "Watches",
          brand: "Apple",
          price: 320000,
          oldPrice: 380000,
          discount: "-15%",
          batteryHealth: "100%",
          rating: 4.8,
          reviews: 89,
          images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBBYp28NFo9ImbRIFzxxFPgU4pu9Sdf2NFWcZWwqn9TPh1U0YHFZydnWuyWQ_bl4OU-gQIpKZyM1dQWwW8v3rn4UsbxYEdVUHzu3YjQ0isUvR6eZVxAplrYglfxw37ZfQJ_cHJsTnIuYwq87xvESEkb1kTj22yn1pAd04vw_644GrAL-jlb7pFySltzet7m9Ip4STsqTA-qKz5Lh3HFapOIck__rbwxtqBj1PEGa5RRdqM8kZG97OIDj63LmNHpZdKzvTthM2FiEvU"
          ],
          colors: [
            { name: 'Midnight', hex: '#1C1C1E' },
            { name: 'Starlight', hex: '#F9F6EF' },
            { name: 'Silver', hex: '#E3E4E5' }
          ],
          storages: ['41mm', '45mm']
        },
        "3": {
          id: "3",
          name: "MacBook Pro M2",
          category: "Laptops",
          brand: "Apple",
          price: 950000,
          oldPrice: 1100000,
          discount: "-13%",
          batteryHealth: "99%",
          rating: 5.0,
          reviews: 210,
          images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC63IUAOIU6DzXcrWFJ3IBeI8IERRuxZZUL4wJvbWrJE6GTgEuyft_Yop9M1Laf4_8arnAvd_bDTbjZ57f_xuXL0r9DC6pyBmrZpw0Ys_Wf-g59Jl6o_JWZyGi5Ih22zNDdy9qZMEcUO4xoJVRyUZjj20OB3rXpUu4F0tJ1VpUQDk9WjKk5uOCls8QEFtUcZyr7mAT1fZoaIGxLW9paXZJJyAs7Dir1QF5_V2Kev54HdZwtsZgfJDO2hz-qMFQfQM2DPM_3W8BG_Jg"
          ],
          colors: [
            { name: 'Space Gray', hex: '#7D7E80' },
            { name: 'Silver', hex: '#E3E4E5' }
          ],
          storages: ['256GB', '512GB', '1TB']
        }
      };

      const foundProduct = mockProducts[id || "1"] || mockProducts["1"];
      setProduct(foundProduct);
      setColor(foundProduct.colors[0].name);
      setStorage(foundProduct.storages[0]);
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <main className="pt-20 md:pt-24 pb-32 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-[10px] md:text-sm text-secondary mb-6 md:mb-8 font-medium overflow-x-auto whitespace-nowrap no-scrollbar pb-2 md:pb-0">
        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link className="hover:text-primary transition-colors" to="/gadgets">Gadgets</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="hover:text-primary transition-colors cursor-pointer">{product.category}</span>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="hover:text-primary transition-colors cursor-pointer">{product.brand}</span>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="text-on-surface font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20">
        {/* Left: Media Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col order-2 md:order-1 gap-3 md:gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
            {product.images.map((img: string, i: number) => (
              <div 
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-surface-container-lowest p-1.5 md:p-2 rounded-lg cursor-pointer transition-all",
                  selectedImage === i ? "border-2 border-primary-container" : "border border-outline-variant/20 hover:border-primary-container"
                )}
              >
                <img className="w-full h-full object-contain" src={img} alt={`Thumbnail ${i}`} referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-grow order-1 md:order-2 bg-surface-container-lowest rounded-2xl overflow-hidden relative group cursor-zoom-in aspect-square md:aspect-auto">
            <motion.img 
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full object-contain p-4 md:p-8 group-hover:scale-110 transition-transform duration-500" 
              src={product.images[selectedImage]} 
              alt={product.name}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-secondary-container/80 backdrop-blur px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-secondary-fixed-variant">
              {condition}
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 flex flex-col space-y-6 md:space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl font-bold text-on-surface">{formatCurrency(product.price)}</span>
                <span className="text-base md:text-lg text-secondary line-through">{formatCurrency(product.oldPrice)}</span>
                <Badge variant="sale" className="text-[10px] md:text-xs">{product.discount}</Badge>
              </div>
            </div>
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-3 rounded-full bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-container-low transition-colors"
            >
              <Heart className={cn("w-6 h-6", isFavorite ? "fill-red-500 text-red-500" : "text-secondary")} />
            </button>
          </div>

          {/* Condition Selector */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary">Condition</h3>
            <div className="flex gap-3 md:gap-4">
              <button 
                onClick={() => setCondition('UK Used')}
                className={cn(
                  "flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg border-2 font-bold text-xs md:text-sm transition-all",
                  condition === 'UK Used' ? "border-primary-container bg-primary-container/10 text-on-primary-fixed" : "border-outline-variant/30 text-secondary hover:border-primary-container"
                )}
              >
                UK Used
              </button>
              <button 
                onClick={() => setCondition('Brand New')}
                className={cn(
                  "flex-1 py-2.5 md:py-3 px-3 md:px-4 rounded-lg border-2 font-bold text-xs md:text-sm transition-all",
                  condition === 'Brand New' ? "border-primary-container bg-primary-container/10 text-on-primary-fixed" : "border-outline-variant/30 text-secondary hover:border-primary-container"
                )}
              >
                Brand New
              </button>
            </div>
          </div>

          {/* Storage */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary">Storage Capacity / Size</h3>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {product.storages.map((cap: string) => (
                <button 
                  key={cap}
                  onClick={() => setStorage(cap)}
                  className={cn(
                    "px-4 md:px-6 py-2 rounded-lg border-2 font-bold text-xs md:text-sm transition-all",
                    storage === cap ? "border-primary-container" : "border-outline-variant/30 text-secondary hover:border-outline"
                  )}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary">Color: {color}</h3>
            <div className="flex gap-3 md:gap-4">
              {product.colors.map((c: any) => (
                <button 
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  style={{ backgroundColor: c.hex }}
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full border-4 transition-all hover:scale-110",
                    color === c.name ? "border-primary-container ring-1 ring-offset-2 ring-transparent" : "border-outline-variant/30"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Battery Health */}
          <div className="bg-surface-container-low p-3 md:p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BatteryCharging className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div>
                <p className="text-[9px] md:text-xs font-bold text-secondary uppercase">Battery Health</p>
                <p className="text-xs md:text-sm font-bold">{product.batteryHealth} Maximum Capacity</p>
              </div>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-primary-container border-r-transparent rotate-45 flex items-center justify-center">
              <span className="text-[9px] md:text-[10px] font-black -rotate-45">{product.batteryHealth}</span>
            </div>
          </div>

          {/* Fulfillment */}
          <div className="space-y-4 p-4 md:p-6 rounded-2xl border border-outline-variant/20">
            <div className="flex items-center gap-3 md:gap-4">
              <Truck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div className="flex-grow">
                <p className="text-xs md:text-sm font-bold">Nationwide Delivery</p>
                <p className="text-[10px] md:text-xs text-secondary">Enter zip code for estimated arrival</p>
              </div>
              <input className="w-16 md:w-20 bg-surface-container-low border-none rounded-lg text-xs md:text-sm font-bold px-2 md:px-3 py-1 focus:ring-2 focus:ring-primary-container" placeholder="10001" type="text"/>
            </div>
            <div className="pt-4 border-t border-outline-variant/10 flex items-center gap-3 md:gap-4">
              <Store className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div>
                <p className="text-xs md:text-sm font-bold">Kerbside Pickup</p>
                <p className="text-[10px] md:text-xs text-secondary">Ready in 2 hours at Ikorodu Rd Office</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2 md:gap-3">
            <Button 
              onClick={() => addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.images[0],
                category: product.category
              })}
              variant="secondary" 
              size="lg" 
              className="w-full flex items-center justify-center gap-2 py-3 md:py-4 text-sm md:text-base"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" /> Add to Cart
            </Button>
            <Button variant="primary" size="lg" className="w-full bg-tertiary hover:bg-tertiary/90 py-3 md:py-4 text-sm md:text-base">
              Buy It Now
            </Button>
          </div>
        </div>
      </div>

      {/* Tabbed Content Section */}
      <div className="mt-16 md:mt-24">
        <div className="flex border-b border-outline-variant/20 overflow-x-auto no-scrollbar">
          <button className="px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm text-on-surface font-bold border-b-2 border-primary-container whitespace-nowrap">Specifications</button>
          <button className="px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm text-secondary font-medium hover:text-on-surface transition-colors whitespace-nowrap">Description</button>
          <button className="px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm text-secondary font-medium hover:text-on-surface transition-colors whitespace-nowrap">What's in the Box</button>
          <button className="px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm text-secondary font-medium hover:text-on-surface transition-colors whitespace-nowrap">Reviews ({product.reviews})</button>
        </div>
        <div className="py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">Technical Specs</h2>
            <div className="space-y-3 md:space-y-4">
              {[
                { label: "Display", val: "6.1\" Super Retina XDR with ProMotion" },
                { label: "Chip", val: "A15 Bionic chip" },
                { label: "Camera", val: "Pro 12MP camera system" },
                { label: "OS", val: "iOS 15 (Upgradable to iOS 17)" }
              ].map((spec, i) => (
                <div key={i} className="flex justify-between py-2 md:py-3 border-b border-outline-variant/10 text-xs md:text-sm">
                  <span className="text-secondary">{spec.label}</span>
                  <span className="font-bold text-right ml-4">{spec.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-surface-container-low rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-center">
            <div className="text-primary-container mb-3 md:mb-4">
              <Award className="w-10 h-10 md:w-12 md:h-12 fill-primary-container" />
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">SAM-B Verified</h3>
            <p className="text-xs md:text-sm text-secondary leading-relaxed">Every device undergoes a 45-point inspection by our technical experts. We guarantee 100% genuine parts and verified battery health status for all UK Used items.</p>
          </div>
        </div>
      </div>
    </main>
  );
};
