import { useState } from 'react';
import { 
  Search, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Wrench, 
  ArrowRight, 
  Smartphone, 
  BatteryCharging, 
  Droplets, 
  Calendar, 
  Star, 
  ChevronDown, 
  MapPin, 
  Phone, 
  MessageCircle,
  Globe,
  HelpCircle,
  Rss,
  Package,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils';

interface FAQItemProps {
  question: string;
  answer: string;
  key?: number;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-white">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors group"
      >
        <span className="font-bold text-lg">{question}</span>
        <ChevronDown className={cn(
          "w-5 h-5 text-primary-container transition-transform duration-300",
          isOpen && "rotate-180"
        )} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-8 py-6 text-secondary border-t border-outline-variant/30 text-sm leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SupportPage = () => {
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

  const quickAccess = [
    { icon: Truck, title: "Track My Order", desc: "Check the real-time status of your tech delivery.", action: "Enter Order ID", link: "#track-order-section" },
    { icon: ShieldCheck, title: "Warranty Claims", desc: "Register your product or file a claim for repairs.", action: "Submit Claim", link: "/warranty-claims" },
    { icon: RotateCcw, title: "Return Policy", desc: "7-day easy returns for all verified tech gadgets.", action: "View Details", link: "/return-policy" },
    { icon: Wrench, title: "Device Repair", desc: "Book a session with our certified tech experts.", action: "Book Now", link: "/repair" }
  ];

  const faqs = [
    { 
      q: "How do you guarantee \"UK Used\" quality?", 
      a: "Every \"UK Used\" device undergoes a rigorous 40-point diagnostic check. We verify battery health (must be 85%+), screen integrity, and ensure all parts are genuine. Each device comes with a 3-month store warranty." 
    },
    { 
      q: "What is your shipping timeframe for Ikorodu?", 
      a: "For orders within Ikorodu, we offer same-day or next-day delivery. Nationwide shipping typically takes 2-4 business days depending on your location." 
    },
    { 
      q: "How does the Trade-In program work?", 
      a: "Bring your current device to our physical store for appraisal. We offer immediate valuation and you can apply that credit toward any new or premium used device in our stock." 
    }
  ];

  return (
    <div className="bg-background min-h-screen">
      <main className="pt-20 md:pt-24 pb-32">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-6 md:px-8 overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-headline font-extrabold text-4xl md:text-7xl tracking-tighter text-on-surface mb-4 md:mb-6"
            >
              How can we help you?
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-body text-base md:text-lg text-secondary mb-8 md:mb-12 max-w-2xl mx-auto"
            >
              Get expert assistance for your premium gadgets, track your orders, or book a professional repair session.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto relative group"
            >
              <div className="absolute inset-y-0 left-5 md:left-6 flex items-center pointer-events-none">
                <Search className="text-primary-container w-5 h-5 md:w-6 md:h-6" />
              </div>
              <input 
                className="w-full bg-surface-container-lowest border-none h-14 md:h-16 pl-14 md:pl-16 pr-6 rounded-full shadow-lg text-on-surface text-base md:text-lg focus:ring-2 focus:ring-primary-container transition-all outline-none" 
                placeholder="Search help topics..." 
                type="text"
              />
            </motion.div>

            <div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-3 md:gap-4 text-[10px] md:text-sm font-semibold text-secondary">
              <span>Popular:</span>
              <a className="hover:text-primary-container transition-colors" href="#">Order Tracking</a>
              <a className="hover:text-primary-container transition-colors" href="#">Screen Repair</a>
              <a className="hover:text-primary-container transition-colors" href="#">Warranty</a>
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl"></div>
        </section>

        {/* Quick Access Bento Grid */}
        <section className="px-6 md:px-8 py-12 md:py-16 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {quickAccess.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between border-b-4 border-transparent hover:border-primary-container"
                >
                  <div>
                    <item.icon className="text-primary-container w-8 h-8 md:w-10 md:h-10 mb-4 md:mb-6" />
                    <h3 className="font-headline font-bold text-lg md:text-xl mb-2">{item.title}</h3>
                    <p className="text-secondary text-xs md:text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <a
                    className="mt-4 md:mt-6 inline-flex items-center text-primary font-bold text-xs md:text-sm uppercase tracking-wider group-hover:translate-x-1 transition-transform" 
                    href={item.link || "#"}
                  >
                    {item.action} <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Track Order Section */}
        <section className="px-6 md:px-8 py-16 md:py-24 bg-surface-container-lowest" id="track-order-section">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 md:mb-12">
              <h2 className="font-headline font-extrabold text-3xl md:text-4xl mb-4">Track Your Order</h2>
              <p className="text-secondary text-base md:text-lg">Enter your order ID to see the real-time status of your package.</p>
            </div>

            <div className="bg-surface p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/20 mb-8">
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-5 h-5" />
                  <Input 
                    type="text" 
                    placeholder="e.g. SAMB-12345678" 
                    className="pl-12 h-14 text-base md:text-lg bg-surface-container-lowest"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-8 font-bold w-full sm:w-auto" disabled={isTracking}>
                  {isTracking ? 'Tracking...' : 'Track Order'}
                </Button>
              </form>
            </div>

            {orderStatus && (
              <div className="bg-surface p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b border-outline-variant/30">
                  <div>
                    <p className="text-secondary text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Order #{orderStatus.id}</p>
                    <h2 className="font-headline font-bold text-xl md:text-2xl text-primary">{orderStatus.status}</h2>
                  </div>
                  <div className="mt-4 md:mt-0 text-left md:text-right">
                    <p className="text-secondary text-xs md:text-sm font-bold uppercase tracking-widest mb-1">Estimated Delivery</p>
                    <p className="font-headline font-bold text-lg md:text-xl">{orderStatus.estimatedDelivery}</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-outline-variant/30"></div>
                  <div className="space-y-8 relative">
                    {orderStatus.steps.map((step: any, index: number) => (
                      <div key={index} className="flex gap-4 md:gap-6">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center relative z-10 shrink-0 transition-colors",
                          step.completed ? "bg-primary text-on-primary" : "bg-surface-container-highest text-secondary"
                        )}>
                          {step.completed ? <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> : <Clock className="w-4 h-4 md:w-5 md:h-5" />}
                        </div>
                        <div>
                          <h4 className={cn(
                            "font-bold text-base md:text-lg",
                            step.completed ? "text-on-background" : "text-secondary"
                          )}>{step.title}</h4>
                          <p className="text-secondary text-xs md:text-sm mt-0.5">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Book a Repair Section */}
        <section className="px-6 md:px-8 py-16 md:py-24 bg-surface-container-low" id="repair-section">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-16">
              <div className="lg:w-1/2 text-center lg:text-left">
                <h2 className="font-headline font-extrabold text-3xl md:text-4xl mb-4 md:mb-6 leading-tight"> Professional Tech <span className="text-primary-container">Restoration</span></h2>
                <p className="text-secondary mb-8 md:mb-10 text-base md:text-lg leading-relaxed">Our technicians specialize in Apple and premium Android devices. We use only original-grade parts to ensure your device performs like new.</p>
                
                <div className="space-y-4 md:space-y-6 text-left max-w-md mx-auto lg:mx-0">
                  {[
                    { icon: Smartphone, title: "Screen Replacement", desc: "Original Retina and OLED displays for iPhone & Samsung." },
                    { icon: BatteryCharging, title: "Battery Service", desc: "High-capacity certified battery swaps with warranty." },
                    { icon: Droplets, title: "Water Damage Recovery", desc: "Advanced ultrasonic cleaning and component repair." }
                  ].map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 md:gap-4">
                      <div className="bg-primary-container/20 p-2 rounded-lg flex-shrink-0">
                        <feature.icon className="text-primary-container w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-on-surface">{feature.title}</h4>
                        <p className="text-xs md:text-sm text-secondary">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Link to="/repair">
                  <Button className="mt-10 md:mt-12 w-full sm:w-auto bg-primary-container text-on-primary-fixed px-10 py-4 rounded-lg font-bold hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-3">
                    <Calendar className="w-5 h-5" />
                    Book a Repair Slot
                  </Button>
                </Link>
              </div>

              <div className="lg:w-1/2 relative w-full max-w-lg mx-auto lg:max-w-none">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl rotate-0 lg:rotate-3 bg-white p-3 md:p-4">
                  <img 
                    className="w-full h-full object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC20RVixTtsc0uwqUSR-lTfeXmkYcMLTLBFMsU2YTMp1LXWy3HCyJfnyUW9gWFZBCT_8qamxG0_PmPbu2o-sgHvPPAl-L41iFZwCLzeJ7UKZEcEBNfDBKnqb1PtkfuFftsXLpYabNDaA4p6LHS0JgD2Gd6Yr9ax9vxSIyeO-IX_Q6VKda008hF6aYbOU0ynxGR3Djx0m10HPUZ6A6oZv8PUbEs8C7ViMMO2ovQ7xHEmGKCsnhySb9pmizUJgE9J6xeWwaU6d0GFhNE" 
                    alt="Technician at work"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -left-4 md:-bottom-8 md:-left-8 bg-white p-5 md:p-8 rounded-xl shadow-xl max-w-[240px] md:max-w-xs rotate-0 lg:-rotate-3 border-l-4 border-primary-container">
                  <div className="flex gap-1 text-primary-container mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 md:w-4 md:h-4 fill-current" />)}
                  </div>
                  <p className="text-xs md:text-sm font-medium italic">"Fixed my iPhone 14 Pro Max screen in under 45 minutes. Truly the best in Ikorodu!"</p>
                  <p className="mt-3 md:mt-4 text-[10px] md:text-xs font-bold text-secondary uppercase tracking-widest">— Tunde A., Customer</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="px-6 md:px-8 py-16 md:py-24 bg-surface-container-lowest">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-center mb-3 md:mb-4">Frequently Asked Questions</h2>
            <p className="text-secondary text-sm md:text-base text-center mb-10 md:mb-16">Quick answers to common questions about our services and products.</p>
            
            <div className="space-y-3 md:space-y-4">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.q} answer={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="px-6 md:px-8 py-16 md:py-24 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
              <div>
                <h2 className="font-headline font-extrabold text-3xl md:text-4xl mb-6 md:mb-8 text-center md:text-left">Visit Our Tech Hub</h2>
                <div className="space-y-4 md:space-y-8">
                  <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 rounded-xl bg-surface-container-lowest shadow-sm">
                    <MapPin className="text-primary-container w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-[10px] md:text-sm text-secondary uppercase tracking-widest mb-1">Physical Store</h4>
                      <p className="text-base md:text-lg font-semibold">56 Obafemi Awolowo Rd, Ikorodu, Lagos State.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 rounded-xl bg-surface-container-lowest shadow-sm">
                    <Phone className="text-primary-container w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-[10px] md:text-sm text-secondary uppercase tracking-widest mb-1">Call Us</h4>
                      <p className="text-base md:text-lg font-semibold">+234 (0) 800-SAMB-TECH</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 md:gap-6 p-5 md:p-6 rounded-xl bg-[#25D366]/10 shadow-sm border border-[#25D366]/20">
                    <MessageCircle className="text-[#25D366] w-6 h-6 md:w-8 md:h-8 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-[10px] md:text-sm text-secondary uppercase tracking-widest mb-1">WhatsApp Chat</h4>
                      <p className="text-base md:text-lg font-semibold">Message our support team directly</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[300px] md:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl grayscale contrast-125 border-4 md:border-8 border-white">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl-DtlVj6R0N2JFx65p6dASdZTbdF-wcHmvRwpat7BZ2Oy1UkDgAZLfh2ugXmprsdFDPdZGgjyECwlOa6KCMY6OUrw-LC60gU9FXZ7LjbMaJnlRBisK7LOaZ5nhEat4-m950OKaTrPWoe2zMMcHoh-bXOmGtp1Cjn8TQktjTZuc56mC5xXLTKHWU-oc_FQTMhRuosCTi-dMT_7iyO7uQVPajpnySaJIw6Cc3aK3ljUYVA9WcbaTeHM3_JGjk37js9S822yILMNm7A" 
                  alt="Store Location Map"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
