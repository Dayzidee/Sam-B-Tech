import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, Users, Package, RefreshCw, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils';
import { OrderService, ProductService, UserService, RepairService, Order, Product } from '@/backend/services/firestore.service';

export const AdminOverview = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [pendingTradeIns, setPendingTradeIns] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [allOrders, allProducts, customerCount, allRequests] = await Promise.all([
        OrderService.getAll(),
        ProductService.getAll(),
        UserService.getCount(),
        RepairService.getAll()
      ]);

      // Total Revenue: sum of orders that aren't cancelled
      const revenue = allOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + (o.total || 0), 0);
      setTotalRevenue(revenue);

      // Active Orders: Processing, Shipped, In Transit
      const active = allOrders.filter(o =>
        o.status === 'Processing' || o.status === 'Shipped' || o.status === 'In Transit'
      ).length;
      setActiveOrders(active);

      // Total Customers
      setTotalCustomers(customerCount);

      // Products in Stock
      const stock = allProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
      setTotalStock(stock);

      // Pending Trade-Ins
      const pendingTI = allRequests.filter(r => r.type === 'trade-in' && r.status === 'pending').length;
      setPendingTradeIns(pendingTI);

      // Recent Orders (last 5 by createdAt)
      const sorted = [...allOrders].sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });
      setRecentOrders(sorted.slice(0, 5));

      // Low Stock Alerts (stock < 5)
      setLowStockProducts(allProducts.filter(p => p.stock < 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700';
      case 'Processing': return 'bg-yellow-100 text-yellow-700';
      case 'Shipped': case 'In Transit': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = [
    { title: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign },
    { title: 'Active Orders', value: activeOrders.toString(), icon: ShoppingCart },
    { title: 'Total Customers', value: totalCustomers.toString(), icon: Users },
    { title: 'Products in Stock', value: totalStock.toString(), icon: Package },
    { title: 'Pending Trade-Ins', value: pendingTradeIns.toString(), icon: RefreshCw },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-headline font-black text-3xl">Dashboard Overview</h1>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary-container/20 rounded-xl">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h3 className="text-secondary text-sm font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
            <p className="font-headline font-black text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Orders */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <h3 className="font-bold text-lg mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-10 h-10 text-outline-variant mx-auto mb-2 opacity-20" />
                <p className="text-sm text-secondary">No orders yet.</p>
              </div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low/50 border border-outline-variant/10">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{order.customerName || 'Customer'}</p>
                    <p className="text-xs text-secondary">
                      {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} • {
                        order.createdAt?.seconds
                          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
                          : 'N/A'
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm">{formatCurrency(order.total || 0)}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/20">
          <h3 className="font-bold text-lg mb-4">Low Stock Alerts</h3>
          <div className="space-y-3">
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-10 h-10 text-green-500/20 mx-auto mb-2" />
                <p className="text-sm text-secondary">All inventory at healthy levels.</p>
              </div>
            ) : (
              lowStockProducts.map(product => (
                <div key={product.id} className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{product.name}</p>
                      <p className="text-xs text-secondary">{product.category}</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-black text-sm whitespace-nowrap">{product.stock} left</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
