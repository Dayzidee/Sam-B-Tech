import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, RefreshCw, Smartphone, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';

export const AdminTradeIns = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [valuation, setValuation] = useState('');

  const tradeIns = [
    { id: 'TRD-1001', customer: 'John Doe', device: 'iPhone 13 Pro', condition: 'Good', date: 'Oct 24, 2023', status: 'Pending Valuation', estimatedValue: null },
    { id: 'TRD-1002', customer: 'Jane Smith', device: 'MacBook Air M1', condition: 'Excellent', date: 'Oct 23, 2023', status: 'Offer Sent', estimatedValue: 450000 },
    { id: 'TRD-1003', customer: 'Michael Johnson', device: 'Samsung S22 Ultra', condition: 'Fair', date: 'Oct 22, 2023', status: 'Accepted', estimatedValue: 300000 },
    { id: 'TRD-1004', customer: 'Sarah Williams', device: 'iPad Pro 11"', condition: 'Poor', date: 'Oct 21, 2023', status: 'Rejected', estimatedValue: 150000 },
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending Valuation': return 'bg-yellow-100 text-yellow-800';
      case 'Offer Sent': return 'bg-blue-100 text-blue-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSendOffer = () => {
    if (!valuation) return;
    // Simulate sending offer
    alert(`Offer of ${formatCurrency(Number(valuation))} sent to ${selectedRequest.customer}`);
    setSelectedRequest(null);
    setValuation('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-headline font-black text-3xl">Trade-In Requests</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh List
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade-In List */}
        <div className={cn(
          "bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col",
          selectedRequest ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <Input className="pl-10 h-10" placeholder="Search requests by ID or customer..." />
            </div>
            <select className="h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm font-bold text-secondary focus:outline-none ml-4">
              <option>All Statuses</option>
              <option>Pending Valuation</option>
              <option>Offer Sent</option>
              <option>Accepted</option>
            </select>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-secondary text-xs uppercase tracking-widest">
                  <th className="p-4 font-bold">Request ID</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Device</th>
                  <th className="p-4 font-bold">Condition</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {tradeIns.map((request) => (
                  <tr 
                    key={request.id} 
                    className={cn(
                      "hover:bg-surface-container-low/50 transition-colors cursor-pointer",
                      selectedRequest?.id === request.id ? "bg-primary-container/10" : ""
                    )}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <td className="p-4 font-bold text-sm">{request.id}</td>
                    <td className="p-4 text-sm">{request.customer}</td>
                    <td className="p-4 font-bold text-sm">{request.device}</td>
                    <td className="p-4 text-sm text-secondary">{request.condition}</td>
                    <td className="p-4">
                      <span className={cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest", getStatusColor(request.status))}>
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-primary hover:bg-primary-container/20 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade-In Details Panel */}
        <AnimatePresence>
          {selectedRequest && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col h-full"
            >
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center">
                <div>
                  <h2 className="font-headline font-bold text-xl">Valuation Details</h2>
                  <p className="text-sm text-secondary font-mono mt-1">{selectedRequest.id}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 text-secondary hover:bg-surface-container-low rounded-full">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {/* Device Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 border-b border-outline-variant/30 pb-2">Device Information</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-surface-container-highest rounded-xl flex items-center justify-center">
                      <Smartphone className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{selectedRequest.device}</h4>
                      <p className="text-sm text-secondary">Condition: <span className="font-bold text-primary">{selectedRequest.condition}</span></p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold">Storage:</span> 256GB</p>
                    <p><span className="font-bold">Color:</span> Graphite</p>
                    <p><span className="font-bold">Battery Health:</span> 88%</p>
                    <p><span className="font-bold">Accessories Included:</span> Box, Cable</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-secondary mb-3 border-b border-outline-variant/30 pb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-bold">Name:</span> {selectedRequest.customer}</p>
                    <p><span className="font-bold">Email:</span> customer@example.com</p>
                    <p><span className="font-bold">Phone:</span> +234 800 000 0000</p>
                    <p><span className="font-bold">Requested On:</span> {selectedRequest.date}</p>
                  </div>
                </div>

                {/* Valuation Section */}
                <div className="bg-primary-container/10 p-4 rounded-xl border border-primary/20">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Provide Valuation</h3>
                  {selectedRequest.status === 'Pending Valuation' ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                        <Input 
                          type="number" 
                          placeholder="Enter offer amount (₦)" 
                          className="pl-10 h-12 text-lg font-bold"
                          value={valuation}
                          onChange={(e) => setValuation(e.target.value)}
                        />
                      </div>
                      <Button className="w-full" onClick={handleSendOffer} disabled={!valuation}>
                        Send Offer
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-secondary mb-2">Current Offer Status</p>
                      <p className="font-headline font-black text-2xl text-primary mb-2">
                        {selectedRequest.estimatedValue ? formatCurrency(selectedRequest.estimatedValue) : 'N/A'}
                      </p>
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest inline-block", getStatusColor(selectedRequest.status))}>
                        {selectedRequest.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
