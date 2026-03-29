import { useState } from 'react';
import { 
  Smartphone, 
  Tablet, 
  Watch, 
  Laptop, 
  CheckCircle2, 
  BarChart3, 
  Truck, 
  Banknote, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ChevronDown,
  Globe,
  Mail,
  Send
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { formatCurrency, cn } from '@/utils';

const TradeInWizard = () => {
  const [step, setStep] = useState(1);
  const [deviceType, setDeviceType] = useState<string | null>(null);
  const [condition, setCondition] = useState('Flawless');
  const [storage, setStorage] = useState('256GB');

  const steps = [
    { id: 1, label: 'Device' },
    { id: 2, label: 'Details' },
    { id: 3, label: 'Condition' },
    { id: 4, label: 'Value' }
  ];

  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 md:p-12">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 md:mb-12 overflow-x-auto no-scrollbar pb-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center last:flex-none min-w-[60px]">
              <div className="flex flex-col items-center gap-1.5 group">
                <div className={cn(
                  "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold shadow-sm transition-colors",
                  step >= s.id ? "bg-primary-container text-on-primary-fixed" : "bg-surface-container-high text-secondary"
                )}>
                  {s.id}
                </div>
                <span className={cn(
                  "text-[9px] md:text-xs font-bold uppercase tracking-tighter whitespace-nowrap",
                  step >= s.id ? "text-on-surface" : "text-secondary"
                )}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn(
                  "flex-1 h-0.5 mx-2 md:mx-4 mt-4 md:mt-5 transition-colors min-w-[20px]",
                  step > s.id ? "bg-primary-container" : "bg-surface-container-high"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Device Type */}
        <div className="space-y-6 md:space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">What are you trading in?</h2>
            <p className="text-secondary text-sm">Select your device category to start the valuation.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { id: 'phones', icon: Smartphone, label: 'Phones' },
              { id: 'tablets', icon: Tablet, label: 'Tablets' },
              { id: 'watches', icon: Watch, label: 'Watches' },
              { id: 'laptops', icon: Laptop, label: 'Laptops' }
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setDeviceType(item.id);
                  setStep(2);
                }}
                className={cn(
                  "group p-4 md:p-6 bg-surface-container-low rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 md:gap-4 active:scale-95",
                  deviceType === item.id ? "border-primary-container bg-primary-container/5" : "border-transparent hover:border-primary-container"
                )}
              >
                <item.icon className="w-8 h-8 md:w-10 md:h-10 group-hover:scale-110 transition-transform text-on-surface" />
                <span className="font-bold text-xs md:text-sm uppercase tracking-tight">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2 & 3 Placeholder (Simulated UI) */}
        <div className="mt-10 md:mt-16 pt-10 md:pt-16 border-t border-surface-container-high">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Details */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-lg md:text-xl font-bold">Device Details</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Brand</label>
                  <select className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container font-medium text-sm h-11">
                    <option>Apple</option>
                    <option>Samsung</option>
                    <option>Google</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Model</label>
                  <select className="w-full bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary-container font-medium text-sm h-11">
                    <option>iPhone 15 Pro Max</option>
                    <option>iPhone 15 Pro</option>
                    <option>iPhone 15</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-secondary">Storage</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['256GB', '512GB', '1TB'].map((s) => (
                      <button 
                        key={s}
                        onClick={() => setStorage(s)}
                        className={cn(
                          "py-2.5 px-3 font-bold rounded-lg text-xs transition-all",
                          storage === s ? "bg-primary-container text-on-primary-fixed" : "bg-surface-container-low hover:bg-surface-container-high"
                        )}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Condition */}
            <div className="space-y-4 md:space-y-6">
              <h3 className="text-lg md:text-xl font-bold">Assess Condition</h3>
              <div className="space-y-2.5">
                {[
                  { id: 'Flawless', desc: 'No scratches, cracks, or dents. Functions perfectly.' },
                  { id: 'Good', desc: 'Minor scratches or light signs of wear. Fully functional.' },
                  { id: 'Cracked/Damaged', desc: 'Physical damage, screen cracks, or hardware issues.' }
                ].map((c) => (
                  <button 
                    key={c.id}
                    onClick={() => setCondition(c.id)}
                    className={cn(
                      "w-full text-left p-3.5 md:p-4 rounded-xl border-2 transition-all",
                      condition === c.id ? "border-primary-container bg-primary-container/5" : "border-transparent bg-surface-container-low hover:border-surface-container-high"
                    )}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-bold text-sm md:text-base">{c.id}</span>
                      {condition === c.id && <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary-container fill-primary-container" />}
                    </div>
                    <p className="text-[10px] md:text-xs text-secondary leading-tight">{c.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Valuation Summary */}
        <div className="mt-10 md:mt-16 p-6 md:p-8 bg-on-background rounded-2xl text-center space-y-4 md:space-y-6">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary-container">Valuation Summary</span>
          <div className="space-y-1">
            <h4 className="text-white/60 font-medium text-sm">Estimated Trade-In Value</h4>
            <p className="text-4xl md:text-7xl font-extrabold text-white tracking-tighter">{formatCurrency(450000)}</p>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-center pt-2">
            <Button variant="secondary" size="lg" className="w-full md:w-auto bg-tertiary text-white hover:bg-tertiary/90 px-8 h-14 rounded-xl font-bold text-xs uppercase tracking-widest">
              Accept Quote & Book Inspection
            </Button>
            <Button variant="outline" size="lg" className="w-full md:w-auto border-white/20 text-white hover:bg-white/5 px-8 h-14 rounded-xl font-bold text-xs uppercase tracking-widest">
              Save Quote for Later
            </Button>
          </div>
          <p className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-widest leading-relaxed">Quote valid for 7 days. Final valuation pending physical inspection.</p>
        </div>
      </div>
    </div>
  );
};

export const TradeInPage = () => {
  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-20 md:pt-24 pb-32">
        {/* Hero Section */}
        <section className="px-4 md:px-6 py-12 md:py-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
            <div className="space-y-4 md:space-y-6 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-fixed text-[10px] md:text-xs font-bold uppercase tracking-widest rounded-sm">Upgrade Today</span>
              <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
                Trade-In & Upgrade: <span className="text-primary-container">Sell or Swap</span> Your Tech
              </h1>
              <p className="text-sm md:text-xl text-secondary max-w-lg mx-auto md:mx-0 leading-relaxed">
                Get an instant valuation and trade in your old devices for credit towards something new, or simply get paid in cash.
              </p>
            </div>
            <div className="relative group px-4 md:px-0">
              <div className="absolute -inset-4 bg-primary-container/10 rounded-xl blur-3xl transition-all duration-700 group-hover:bg-primary-container/20"></div>
              <motion.img 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                alt="Premium smartphone mockup" 
                className="relative rounded-2xl shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] w-full max-w-md mx-auto md:max-w-none" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3FtxeOLgDNQHtAgAJt-shhz1AOTaDg2sjlIsJJHpTJEwMfPOLkr_6yL2b745slzBSwRUILRpP8_V5_o3gxqAs5BB3hitatuLAgAej-gvKnqcAeQaEpEiiwudI7vLdE0qLyZYHD_kKu9AGENHGCSitzbU0MS1MamGCYR75exjuNSsDH9OcVmJqgfuCZ2MrqQmGk6xbkt1fwDlzVjpKs56SYtyRxNnxE6Dumz1ICCAkigNl_GTJuYrRMvFOlvWzyt-2L7kHSTPN3Vw"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* Trade-In Wizard */}
        <section className="px-6 py-12 max-w-5xl mx-auto">
          <TradeInWizard />
        </section>

        {/* How It Works Section */}
        <section className="px-4 md:px-6 py-16 md:py-24 max-w-7xl mx-auto overflow-hidden">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">How It Works</h2>
            <div className="w-16 md:w-20 h-1.5 bg-primary-container mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 relative">
            {[
              { icon: BarChart3, title: "Get a Quote", desc: "Fill in your device details online and get an instant, fair market estimation in seconds.", step: 1 },
              { icon: Truck, title: "Visit Store or Ship", desc: "Bring your device to any SAM-B location or use our secure doorstep pickup service.", step: 2 },
              { icon: Banknote, title: "Get Paid or Credit", desc: "Once verified, receive instant cash payment or credit towards your next premium upgrade.", step: 3 }
            ].map((item) => (
              <div key={item.step} className="relative z-10 space-y-4 md:space-y-6 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-surface-container-highest rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 relative">
                  <item.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  <div className="absolute -top-1.5 -right-1.5 w-7 h-7 md:w-8 md:h-8 bg-primary-container rounded-full flex items-center justify-center font-black text-xs md:text-sm">{item.step}</div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold">{item.title}</h3>
                <p className="text-secondary text-sm md:text-base leading-relaxed">{item.desc}</p>
              </div>
            ))}
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-surface-container-high -z-0"></div>
          </div>
        </section>

        {/* Why Trade-In Section */}
        <section className="px-4 md:px-6 py-16 md:py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10 md:mb-16 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Why Trade-In with SAM-B?</h2>
              <p className="text-secondary text-sm mt-2">The most trusted premium tech exchange platform.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="sm:col-span-2 bg-white p-6 md:p-8 rounded-2xl space-y-4 shadow-sm">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-container/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-primary font-bold w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold">Fair Market Pricing</h3>
                <p className="text-secondary text-sm md:text-base leading-relaxed">We use real-time market data to ensure you get the absolute best value for your device, beating standard buy-back rates.</p>
              </div>
              <div className="bg-primary-container p-6 md:p-8 rounded-2xl space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-on-primary-fixed/10 rounded-lg flex items-center justify-center">
                  <Zap className="text-on-primary-fixed font-bold w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-on-primary-fixed">Quick Inspection</h3>
                <p className="text-on-primary-fixed/80 text-xs md:text-sm leading-relaxed">Our in-house technicians complete most inspections in under 15 minutes.</p>
              </div>
              <div className="bg-on-background p-6 md:p-8 rounded-2xl space-y-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="text-primary-container font-bold w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white">Secure Data Wiping</h3>
                <p className="text-white/60 text-xs md:text-sm leading-relaxed">Military-grade data destruction protocols for your complete privacy and peace of mind.</p>
              </div>
              <div className="sm:col-span-2 md:col-span-4 bg-white p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 md:gap-8 shadow-sm">
                <div className="md:w-1/2 space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl font-bold">Environmentally Friendly</h3>
                  <p className="text-secondary text-sm md:text-base leading-relaxed">Reduce e-waste by giving your tech a second life. We responsibly recycle devices that cannot be refurbished, minimizing landfill impact.</p>
                </div>
                <div className="w-full md:w-1/2 h-40 md:h-48 rounded-xl overflow-hidden">
                  <img 
                    alt="Eco-friendly tech" 
                    className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all duration-700" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUpbnTj6srAoVpGfFXosruLjX4WdG9hjstDNdxzVuVC_qVLdz5--l3yF531t7mhj4VtTIlyRNrmo8jBoonc4JFCBI9O_pcK6V7Uf8MKH2emMMyW6Ffe3fZvnJUdoK7jipCtE6BaOWWZVvUzClHJXEKwuDOh9Q6CSuRb4DJtSsTQDXSP7Bc_ge5PRkTaqPJ5JXDGWF9atxOTAbA_7g3-qaHYQCjzMPHBjBDMvF5GUgZRPOZ6_pQ2InjMhsYS8NBFmadV4gKOhji-Bs"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 md:px-6 py-16 md:py-24 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-10 md:mb-12 tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-3 md:space-y-4">
            {[
              { q: "What identification do I need to trade in?", a: "To comply with local regulations and ensure security, we require a valid government-issued ID (NIN, Driver's License, or International Passport) for all trade-in transactions." },
              { q: "How long does the payment take?", a: "Instant! Once our technician verifies the condition of your device in-store, we process bank transfers or store credit immediately. For doorstep pickups, payment is made within 24 hours of device arrival at our hub." },
              { q: "Are \"UK Used\" devices eligible for trade-in?", a: "Absolutely. We accept both brand-new and pre-owned devices (often referred to as UK Used) as long as they pass our internal security and authenticity checks." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl shadow-sm border border-transparent open:border-primary-container transition-all">
                <summary className="flex justify-between items-center p-5 md:p-6 cursor-pointer list-none">
                  <span className="font-bold text-base md:text-lg pr-4">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <div className="px-5 md:px-6 pb-5 md:pb-6 text-secondary text-sm md:text-base leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
