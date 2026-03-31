import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Package, 
  CreditCard, 
  Clock, 
  ChevronRight, 
  Camera,
  X,
  User,
  Mail,
  MapPin,
  LogOut,
  ShoppingBag,
  Heart,
  Bell,
  Wrench,
  ArrowLeftRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { db } from '@/backend/config/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AnimatePresence, motion } from 'framer-motion';

interface Order {
  id: string;
  date: any;
  total: number;
  status: string;
  items: any[];
  customerName?: string;
}

interface ServiceRequest {
  id: string;
  type: 'repair' | 'trade-in';
  deviceModel: string;
  issue?: string;
  status: string;
  adminResponse?: string;
  estimatedValue?: number;
  repairCost?: number;
  createdAt: any;
  urgency?: string;
}

const statusColor = (status: string) => {
  const s = status?.toLowerCase();
  if (['completed', 'delivered', 'approved'].includes(s)) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  if (['processing', 'in transit', 'in-progress', 'shipped'].includes(s)) return 'bg-sky-50 text-sky-700 border-sky-100';
  if (['cancelled', 'rejected'].includes(s)) return 'bg-rose-50 text-rose-700 border-rose-100';
  return 'bg-amber-50 text-amber-700 border-amber-100';
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedOrders.push({
            id: doc.id,
            ...data,
            date: data.createdAt?.toDate() || new Date(),
          } as Order);
        });
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    const fetchServiceRequests = async () => {
      try {
        const q = query(
          collection(db, 'service_requests'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const fetched: ServiceRequest[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          } as ServiceRequest);
        });
        setServiceRequests(fetched);
      } catch (error) {
        console.error('Error fetching service requests:', error);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchOrders();
    fetchServiceRequests();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return null;

  const repairs = serviceRequests.filter(r => r.type === 'repair');
  const tradeIns = serviceRequests.filter(r => r.type === 'trade-in');
  const totalSpent = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2">
              My Dashboard
            </h1>
            <p className="text-zinc-500 font-medium">
              Welcome back, <span className="text-primary font-bold">{user.displayName || 'Customer'}</span>. Here's your account overview.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-2xl border-zinc-200 bg-white/50 backdrop-blur-md">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </Button>
            <Button onClick={() => setIsEditProfileOpen(true)} className="rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <div className="relative mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-8 ring-primary/5 shadow-inner">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=random`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="absolute bottom-[-8px] right-1/2 translate-x-16 bg-primary text-white p-3.5 rounded-2xl shadow-xl shadow-primary/30 hover:scale-110 active:scale-90 transition-all border-4 border-white"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center space-y-1 mb-8">
                <h2 className="text-2xl font-black tracking-tight text-zinc-900">{user.displayName || 'Customer'}</h2>
                <p className="text-zinc-500 text-sm font-medium">{user.email}</p>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-zinc-50/50 rounded-[1.5rem] border border-zinc-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Member Since</p>
                    <p className="text-sm font-bold text-zinc-700">{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="bg-white/70 backdrop-blur-2xl p-4 rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: Package },
                  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
                  { id: 'requests', label: 'Service Requests', icon: Wrench },
                  { id: 'settings', label: 'Account Settings', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      activeTab === tab.id 
                        ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                        : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-white' : 'text-zinc-400'}`} />
                      <span className="text-[11px] uppercase tracking-widest font-black">{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                  </button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-zinc-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-[11px] uppercase tracking-widest font-black">Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Orders', value: orders.length.toString(), icon: Package, color: 'primary' },
                { label: 'Service Requests', value: serviceRequests.length.toString(), icon: Wrench, color: 'sky' },
                { label: 'Total Spent', value: `₦${totalSpent.toLocaleString()}`, icon: CreditCard, color: 'emerald' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:translate-y-[-4px] transition-all">
                  <div className={`w-14 h-14 bg-${stat.color}-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-zinc-900 mb-1">{stat.value}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tab Content: Overview / Orders */}
            {(activeTab === 'overview' || activeTab === 'orders') && (
              <section className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-zinc-900">{activeTab === 'orders' ? 'All Orders' : 'Recent Orders'}</h2>
                    <p className="text-xs text-zinc-500 font-bold">Your purchase history</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Order ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Total</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                      {isLoadingOrders ? (
                        [1, 2, 3].map((n) => (
                          <tr key={n} className="animate-pulse">
                            <td colSpan={4} className="px-8 py-5">
                              <div className="h-4 bg-zinc-100 rounded-lg w-full" />
                            </td>
                          </tr>
                        ))
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-100">
                                <ShoppingBag className="w-8 h-8 text-zinc-300" />
                              </div>
                              <p className="text-zinc-500 font-bold">No orders yet. Start shopping!</p>
                              <Button size="sm" onClick={() => navigate('/gadgets')} className="rounded-2xl px-8 h-12 text-[10px] uppercase font-black tracking-widest">Browse Gadgets</Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                            <td className="px-8 py-5 font-mono text-[11px] font-black text-primary">#{order.id.slice(0, 8)}</td>
                            <td className="px-8 py-5 text-sm font-medium text-zinc-600">
                              {order.date instanceof Date ? order.date.toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-8 py-5 text-sm font-black text-zinc-900">₦{order.total?.toLocaleString()}</td>
                            <td className="px-8 py-5">
                              <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${statusColor(order.status).replace('dark:', '').replace('dark-bg', 'bg').replace('dark-text', 'text')}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Tab Content: Service Requests */}
            {activeTab === 'requests' && (
              <section className="space-y-6">
                {/* Repairs */}
                <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="p-8 border-b border-zinc-100 bg-zinc-50/30">
                    <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-zinc-900">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-primary" />
                      </div>
                      Repair Requests
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold ml-13">Track your device repairs</p>
                  </div>
                  <div className="divide-y divide-zinc-50">
                    {isLoadingRequests ? (
                      <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : repairs.length === 0 ? (
                      <div className="p-16 text-center text-zinc-500 font-medium">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                          <Wrench className="w-8 h-8 text-zinc-300" />
                        </div>
                        <p className="text-zinc-500 font-bold">No repair requests found.</p>
                      </div>
                    ) : repairs.map((req) => (
                      <div key={req.id} className="p-8 space-y-4 hover:bg-zinc-50/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-black text-sm text-zinc-900">{req.deviceModel}</h3>
                            <p className="text-xs text-zinc-500 font-medium">{req.issue}</p>
                          </div>
                          <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border self-start ${statusColor(req.status).replace('dark:', '').replace('dark-bg', 'bg').replace('dark-text', 'text')}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {req.createdAt instanceof Date ? req.createdAt.toLocaleDateString() : 'N/A'}</span>
                          {req.urgency && <span className="flex items-center gap-1.5">Urgency: <span className="text-zinc-900">{req.urgency}</span></span>}
                          {req.repairCost ? <span className="flex items-center gap-1.5 text-primary">Cost: ₦{req.repairCost.toLocaleString()}</span> : null}
                        </div>
                        {req.adminResponse && (
                          <div className="p-5 bg-white border border-zinc-100 rounded-2xl flex gap-4 shadow-sm">
                            <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">Admin Response</p>
                              <p className="text-sm text-zinc-600 leading-relaxed font-medium">{req.adminResponse}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade-Ins */}
                <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="p-8 border-b border-zinc-100 bg-zinc-50/30">
                    <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-zinc-900">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <ArrowLeftRight className="w-5 h-5 text-primary" />
                      </div>
                      Trade-In Requests
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold ml-13">Your device trade-in valuations</p>
                  </div>
                  <div className="divide-y divide-zinc-50">
                    {isLoadingRequests ? (
                      <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : tradeIns.length === 0 ? (
                      <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-100">
                          <ArrowLeftRight className="w-8 h-8 text-zinc-300" />
                        </div>
                        <p className="text-zinc-500 font-bold">No trade-in requests found.</p>
                      </div>
                    ) : tradeIns.map((req) => (
                      <div key={req.id} className="p-8 space-y-4 hover:bg-zinc-50/30 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-black text-sm text-zinc-900">{req.deviceModel}</h3>
                            <p className="text-xs text-zinc-500 font-medium">{req.issue || 'Device trade-in valuation'}</p>
                          </div>
                          <span className={`inline-flex px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border self-start ${statusColor(req.status).replace('dark:', '').replace('dark-bg', 'bg').replace('dark-text', 'text')}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {req.createdAt instanceof Date ? req.createdAt.toLocaleDateString() : 'N/A'}</span>
                          {req.estimatedValue ? <span className="flex items-center gap-1.5 text-emerald-600">Estimated Value: ₦{req.estimatedValue.toLocaleString()}</span> : null}
                        </div>
                        {req.adminResponse && (
                          <div className="p-5 bg-white border border-zinc-100 rounded-2xl flex gap-4 shadow-sm">
                            <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1.5">Admin Response</p>
                              <p className="text-sm text-zinc-600 leading-relaxed font-medium">{req.adminResponse}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Tab Content: Settings */}
            {activeTab === 'settings' && (
              <section className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12">
                <div className="mb-10">
                  <h2 className="text-2xl font-black tracking-tight text-zinc-900">Account Settings</h2>
                  <p className="text-zinc-500 font-medium text-sm">Update your personal information and delivery details.</p>
                </div>
                <div className="max-w-xl space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                      <Input 
                        defaultValue={user.displayName || ''} 
                        className="pl-13 h-16 rounded-2xl bg-white border-zinc-100 focus:border-primary focus:ring-primary/10 transition-all font-bold text-zinc-900"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email Address</label>
                    <div className="relative opacity-60">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 w-5 h-5" />
                      <Input 
                        value={user.email || ''} 
                        disabled 
                        className="pl-13 h-16 rounded-2xl bg-zinc-50 border-zinc-100 cursor-not-allowed font-bold text-zinc-500"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-400 font-medium ml-1">Email cannot be changed for security reasons.</p>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Shipping Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                      <Input 
                        placeholder="E.g. 123 Sam-B Street, Lagos" 
                        className="pl-13 h-16 rounded-2xl bg-white border-zinc-100 focus:border-primary focus:ring-primary/10 transition-all font-bold text-zinc-900"
                      />
                    </div>
                  </div>
                  <Button className="h-16 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-xs px-12 transition-all hover:scale-105 active:scale-95">
                    Save Changes
                  </Button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.1)] overflow-hidden border border-white"
            >
              <div className="p-8 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
                <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">Edit Profile</h2>
                <button 
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-3 hover:bg-zinc-200/50 rounded-2xl transition-colors text-zinc-400 hover:text-zinc-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                      <Input 
                        defaultValue={user.displayName || ''} 
                        className="pl-13 h-16 rounded-[1.5rem] bg-white border-zinc-100 focus:border-primary focus:ring-primary/10 transition-all font-bold text-zinc-900 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                    <div className="relative opacity-60">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 w-5 h-5" />
                      <Input 
                        value={user.email || ''} 
                        disabled 
                        className="pl-13 h-16 rounded-[1.5rem] bg-zinc-50 border-zinc-100 cursor-not-allowed font-bold text-zinc-500 shadow-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Shipping Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-primary transition-colors w-5 h-5" />
                    <Input 
                      placeholder="Enter your address" 
                      className="pl-13 h-16 rounded-[1.5rem] bg-white border-zinc-100 focus:border-primary focus:ring-primary/10 transition-all font-bold text-zinc-900 shadow-sm"
                    />
                  </div>
                </div>

                <div className="pt-6 flex gap-6">
                  <Button variant="outline" onClick={() => setIsEditProfileOpen(false)} className="flex-1 h-16 rounded-2xl border-zinc-200 font-black uppercase tracking-widest text-[10px] bg-white">
                    Cancel
                  </Button>
                  <Button className="flex-1 h-16 rounded-2xl shadow-xl shadow-primary/20 font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95">
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
