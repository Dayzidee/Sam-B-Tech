import { 
  Package, 
  Repeat, 
  Ticket, 
  Settings as SettingsIcon, 
  Lock as LockIcon, 
  ArrowRight,
  History,
  Smartphone,
  Laptop
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';

export const DashboardPage = () => {
  const stats = [
    { 
      label: "Total Orders", 
      value: "24", 
      icon: Package, 
      className: "bg-surface-container-lowest border-l-4 border-primary-container" 
    },
    { 
      label: "Active Trade-ins", 
      value: "02", 
      icon: Repeat, 
      className: "bg-primary-container text-on-primary-fixed" 
    },
    { 
      label: "Support Tickets", 
      value: "01", 
      icon: Ticket, 
      className: "bg-on-surface text-white",
      iconClassName: "text-primary-container"
    }
  ];

  const gadgets = [
    {
      name: "MacBook Pro M3",
      serial: "SAM-992-XP",
      condition: "Excellent Condition",
      conditionClass: "bg-green-100 text-green-800",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0lb_ZMz0gziM8csdeUSwQR-_ED5XUjPheeEa9oeihRhE-vFzYNhbdf6KxbKs9vM5WM2wbxJDmAdqRyP8GtHxihf1YK6DVygqk7bu7EwAx9Z5JI0NIwnB3DYyZUZYr4XfP1DxlNiMaAPyYef9p3MUM9IlJ21pFOhgtk1wNYPZrDquH0Kt1-NzbDCcJ1JkXORWL774jWu2n-zX8U9A_IbsDzqxEfAasAOG5QB3QDst5TOrcszSm9OGAkL1fOmO0MXKml3-t5ZQTS_I"
    },
    {
      name: "iPhone 15 Pro",
      serial: "SAM-102-LV",
      condition: "UK Used",
      conditionClass: "bg-secondary-container text-on-secondary-fixed-variant",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBb1iNJcwDoU8uTHfyItNBmkrYam8gVYDJM4mGsYxSHoG6OlAGCX6LnEruAsHYlatpZBDP4FSUjyJJYDuUCIz7vP024FYdILpf1EkODOivVivi3nd1_cuElq0YKaQfGIQK_X-ybUgBdFOGB4viK_9h4JrcCu3PURktCyJI6pndpDdK3T0CS0GPdH9rBvV1TIT4SZp3JNyMH8dKRaAcgJz_11bTZvjHPmfI-ozHkgm7GI2PmxLRLwaJeIe-NYH8kCeVsKaLxyiYQX2M"
    }
  ];

  const orders = [
    { id: "#SAM-2024-8819", date: "Oct 12, 2023", status: "Processing", statusColor: "bg-orange-600", textColor: "text-orange-600", action: "Details" },
    { id: "#SAM-2024-7742", date: "Sep 28, 2023", status: "Shipped", statusColor: "bg-blue-600", textColor: "text-blue-600", action: "Track" },
    { id: "#SAM-2023-1102", date: "Aug 15, 2023", status: "Delivered", statusColor: "bg-green-700", textColor: "text-green-700", action: "Invoice" }
  ];

  return (
    <div className="bg-surface min-h-screen">
      <main className="pt-20 md:pt-24 pb-32 px-4 md:px-6 max-w-screen-2xl mx-auto">
        {/* Welcoming Header */}
        <header className="mb-8 md:mb-12 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2"
          >
            Welcome back, Alexander
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-base text-secondary font-body font-light"
          >
            Manage your precision tech, track orders, and explore trade-in opportunities.
          </motion.p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Quick Stats/Widgets */}
          <section className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn("p-6 md:p-8 flex flex-col justify-between shadow-sm rounded-xl", stat.className)}
              >
                <stat.icon className={cn("w-8 h-8 md:w-10 md:h-10 mb-4", stat.iconClassName || "text-primary-container")} />
                <div>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest font-bold mb-1 opacity-70">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-black">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Profile Overview (Side Sticky) */}
          <aside className="lg:col-span-4 lg:row-span-3">
            <div className="bg-surface-container-low p-6 md:p-8 sticky top-28 rounded-xl">
              <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-8 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Profile Settings
              </h2>
              <div className="space-y-8 md:space-y-10">
                {/* Personal Info */}
                <div>
                  <h3 className="text-[10px] md:text-xs uppercase tracking-widest font-black text-secondary mb-4">Personal Info</h3>
                  <div className="space-y-4">
                    <div className="group">
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Full Name</label>
                      <p className="text-sm font-semibold border-b border-outline-variant/30 pb-2 group-hover:border-primary-container transition-colors">Alexander Pierce</p>
                    </div>
                    <div className="group">
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase mb-1">Email Address</label>
                      <p className="text-sm font-semibold border-b border-outline-variant/30 pb-2 group-hover:border-primary-container transition-colors">a.pierce@precision.tech</p>
                    </div>
                  </div>
                </div>
                {/* Shipping */}
                <div>
                  <h3 className="text-[10px] md:text-xs uppercase tracking-widest font-black text-secondary mb-4">Shipping Address</h3>
                  <div className="bg-surface-container-lowest p-4 text-xs md:text-sm leading-relaxed text-secondary italic rounded-lg">
                    4421 Tech Plaza, Silicon Valley,<br/>
                    CA 94025, United States
                  </div>
                </div>
                {/* Security */}
                <div>
                  <Button className="w-full bg-on-surface text-white py-4 font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
                    <LockIcon className="w-4 h-4" />
                    Manage Password
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* My Gadgets Grid */}
          <section className="lg:col-span-8">
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-xl md:text-2xl font-bold">My Gadgets</h2>
              <a className="text-primary-container font-bold text-xs md:text-sm border-b-2 border-primary-container pb-0.5" href="#">View Trade-in Values</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gadgets.map((gadget, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.02 }}
                  className="bg-surface-container-lowest p-4 md:p-6 flex items-center gap-4 md:gap-6 group hover:shadow-lg transition-all rounded-xl"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-surface-container rounded-lg overflow-hidden flex-shrink-0">
                    <img src={gadget.image} alt={gadget.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base md:text-lg mb-1">{gadget.name}</h4>
                    <p className="text-[10px] md:text-xs text-secondary mb-2 md:mb-3">Serial: {gadget.serial}</p>
                    <span className={cn("inline-block px-2 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded", gadget.conditionClass)}>
                      {gadget.condition}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Order History List */}
          <section className="lg:col-span-8 mb-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Recent Orders</h2>
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-surface-container-high">
                    <th className="py-4 text-[10px] font-black uppercase text-secondary tracking-widest">Order ID</th>
                    <th className="py-4 text-[10px] font-black uppercase text-secondary tracking-widest">Date</th>
                    <th className="py-4 text-[10px] font-black uppercase text-secondary tracking-widest">Status</th>
                    <th className="py-4 text-[10px] font-black uppercase text-secondary tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {orders.map((order, i) => (
                    <tr key={i} className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-6 font-bold text-sm">{order.id}</td>
                      <td className="py-6 text-sm text-secondary">{order.date}</td>
                      <td className="py-6">
                        <span className={cn("flex items-center gap-2 text-xs font-bold", order.textColor)}>
                          <span className={cn("w-2 h-2 rounded-full", order.statusColor)}></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-6 text-right">
                        <button className="text-[10px] font-black uppercase text-on-surface hover:text-primary-container transition-colors">
                          {order.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
