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
  if (['completed', 'delivered', 'approved'].includes(s)) return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (['processing', 'in transit', 'in-progress', 'shipped'].includes(s)) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  if (['cancelled', 'rejected'].includes(s)) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
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
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">
              My Dashboard
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              Welcome back, <span className="text-primary font-bold">{user.displayName || 'Customer'}</span>. Here's your account overview.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-2xl border-zinc-200 dark:border-zinc-800">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </Button>
            <Button onClick={() => setIsEditProfileOpen(true)} className="rounded-2xl shadow-lg shadow-primary/20">
              <Settings className="w-5 h-5 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
              <div className="relative mb-6 flex justify-center">
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden ring-4 ring-primary/10">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || 'U'}&background=random`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button 
                  onClick={() => setIsEditProfileOpen(true)}
                  className="absolute bottom-0 right-1/2 translate-x-16 bg-primary text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform border-4 border-white dark:border-zinc-900"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center space-y-1 mb-8">
                <h2 className="text-2xl font-black tracking-tight">{user.displayName || 'Customer'}</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{user.email}</p>
              </div>
              <div className="space-y-3">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Member Since</p>
                    <p className="text-sm font-bold">{user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-4 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
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
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon className="w-5 h-5" />
                      <span className="text-sm uppercase tracking-widest font-black">{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                  </button>
                ))}
                
                <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-bold"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm uppercase tracking-widest font-black">Sign Out</span>
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
                { label: 'Service Requests', value: serviceRequests.length.toString(), icon: Wrench, color: 'blue' },
                { label: 'Total Spent', value: `₦${totalSpent.toLocaleString()}`, icon: CreditCard, color: 'green' },
              ].map((stat, i) => (
                <div key={i} className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-lg shadow-zinc-200/30 dark:shadow-none hover:translate-y-[-4px] transition-transform">
                  <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-2xl flex items-center justify-center mb-6`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight mb-1">{stat.value}</h3>
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Tab Content: Overview / Orders */}
            {(activeTab === 'overview' || activeTab === 'orders') && (
              <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-800/30">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-widest">{activeTab === 'orders' ? 'All Orders' : 'Recent Orders'}</h2>
                    <p className="text-xs text-zinc-500 font-bold">Your purchase history</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50/50 dark:bg-zinc-800/50">
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Order ID</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Date</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Total</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {isLoadingOrders ? (
                        [1, 2, 3].map((n) => (
                          <tr key={n} className="animate-pulse">
                            <td colSpan={4} className="px-8 py-5">
                              <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg w-full" />
                            </td>
                          </tr>
                        ))
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 text-zinc-400" />
                              </div>
                              <p className="text-zinc-500 font-bold">No orders yet. Start shopping!</p>
                              <Button size="sm" onClick={() => navigate('/gadgets')} className="rounded-xl">Browse Gadgets</Button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orders.map((order) => (
                          <tr key={order.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors group">
                            <td className="px-8 py-5 font-mono text-xs font-bold text-primary">#{order.id.slice(0, 8)}</td>
                            <td className="px-8 py-5 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                              {order.date instanceof Date ? order.date.toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-8 py-5 text-sm font-black">₦{order.total?.toLocaleString()}</td>
                            <td className="px-8 py-5">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColor(order.status)}`}>
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
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                  <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-primary" /> Repair Requests
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold">Track your device repairs</p>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {isLoadingRequests ? (
                      <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : repairs.length === 0 ? (
                      <div className="p-12 text-center text-zinc-500 font-medium">
                        <Wrench className="w-10 h-10 mx-auto mb-3 text-zinc-300" />
                        No repair requests found.
                      </div>
                    ) : repairs.map((req) => (
                      <div key={req.id} className="p-6 md:p-8 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-sm">{req.deviceModel}</h3>
                            <p className="text-xs text-zinc-500">{req.issue}</p>
                          </div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest self-start ${statusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.createdAt instanceof Date ? req.createdAt.toLocaleDateString() : 'N/A'}</span>
                          {req.urgency && <span className="flex items-center gap-1">Urgency: <span className="font-bold text-zinc-700">{req.urgency}</span></span>}
                          {req.repairCost ? <span className="flex items-center gap-1">Cost: <span className="font-bold text-zinc-700">₦{req.repairCost.toLocaleString()}</span></span> : null}
                        </div>
                        {req.adminResponse && (
                          <div className="mt-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
                            <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Admin Response</p>
                              <p className="text-sm text-zinc-700 dark:text-zinc-300">{req.adminResponse}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade-Ins */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden">
                  <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
                    <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                      <ArrowLeftRight className="w-5 h-5 text-primary" /> Trade-In Requests
                    </h2>
                    <p className="text-xs text-zinc-500 font-bold">Your device trade-in valuations</p>
                  </div>
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {isLoadingRequests ? (
                      <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    ) : tradeIns.length === 0 ? (
                      <div className="p-12 text-center text-zinc-500 font-medium">
                        <ArrowLeftRight className="w-10 h-10 mx-auto mb-3 text-zinc-300" />
                        No trade-in requests found.
                      </div>
                    ) : tradeIns.map((req) => (
                      <div key={req.id} className="p-6 md:p-8 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-sm">{req.deviceModel}</h3>
                            <p className="text-xs text-zinc-500">{req.issue || 'Device trade-in'}</p>
                          </div>
                          <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest self-start ${statusColor(req.status)}`}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {req.createdAt instanceof Date ? req.createdAt.toLocaleDateString() : 'N/A'}</span>
                          {req.estimatedValue ? <span className="flex items-center gap-1">Estimated Value: <span className="font-bold text-green-600">₦{req.estimatedValue.toLocaleString()}</span></span> : null}
                        </div>
                        {req.adminResponse && (
                          <div className="mt-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
                            <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Admin Response</p>
                              <p className="text-sm text-zinc-700 dark:text-zinc-300">{req.adminResponse}</p>
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
              <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-xl p-8 md:p-12">
                <h2 className="text-xl font-black uppercase tracking-widest mb-8">Account Settings</h2>
                <div className="max-w-xl space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <Input 
                        defaultValue={user.displayName || ''} 
                        className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                    <div className="relative opacity-50">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <Input 
                        value={user.email || ''} 
                        disabled 
                        className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Shipping Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <Input 
                        placeholder="Enter your address" 
                        className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none"
                      />
                    </div>
                  </div>
                  <Button className="h-14 rounded-2xl shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs px-10">
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
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditProfileOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
            >
              <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/50">
                <h2 className="text-2xl font-black uppercase tracking-tight">Edit Profile</h2>
                <button 
                  onClick={() => setIsEditProfileOpen(false)}
                  className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <Input 
                        defaultValue={user.displayName || ''} 
                        className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Email</label>
                    <div className="relative opacity-50">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                      <Input 
                        value={user.email || ''} 
                        disabled 
                        className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Shipping Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
                    <Input 
                      placeholder="Enter your address" 
                      className="pl-12 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <Button variant="outline" onClick={() => setIsEditProfileOpen(false)} className="flex-1 h-14 rounded-2xl border-zinc-200 font-black uppercase tracking-widest text-xs">
                    Cancel
                  </Button>
                  <Button className="flex-1 h-14 rounded-2xl shadow-lg shadow-primary/20 font-black uppercase tracking-widest text-xs">
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
