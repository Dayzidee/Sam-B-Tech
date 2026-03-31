import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, RefreshCw, Smartphone, DollarSign, Loader2, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';
import { RepairService, ServiceRequest } from '@/backend/services/firestore.service';
import { StatusModal } from '@/components/ui/StatusModal';

export const AdminTradeIns = () => {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [valuation, setValuation] = useState('');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [adminResponse, setAdminResponse] = useState('');
  const [statusModal, setStatusModal] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'info',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const data = await RepairService.getAll();
      setRequests(data.filter(r => r.type === 'trade-in')); 
    } catch (error) {
      console.error('Error fetching trade-ins:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'valuation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'offer-sent': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSendOffer = async () => {
    if (!valuation || !selectedRequest?.id) return;
    
    setIsUpdating(true);
    try {
      const updated = await RepairService.update(selectedRequest.id, {
        estimatedValue: Number(valuation),
        status: 'offer-sent',
        notes: `Offer of ${formatCurrency(Number(valuation))} sent by Admin.`
      });
      
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, ...updated } : r));
      setSelectedRequest({ ...selectedRequest, ...updated });
      setValuation('');
      setStatusModal({
        show: true,
        type: 'success',
        title: 'Offer Sent',
        message: `Firm offer of ${formatCurrency(Number(valuation))} has been sent to ${selectedRequest.userName}.`
      });
    } catch (error) {
      console.error('Error sending offer:', error);
      setStatusModal({
        show: true,
        type: 'error',
        title: 'Offer Failed',
        message: 'Could not send the offer. Please check your connection and try again.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updateStatus = async (status: ServiceRequest['status']) => {
    if (!selectedRequest?.id) return;
    
    setIsUpdating(true);
    try {
      const updated = await RepairService.update(selectedRequest.id, { status });
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, ...updated } : r));
      setSelectedRequest({ ...selectedRequest, ...updated });
      setStatusModal({
        show: true,
        type: 'success',
        title: 'Status Updated',
        message: `Request status changed to ${status.replace('-', ' ')}.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      setStatusModal({
        show: true,
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update request status.'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = (r.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                         (r.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || r.status === statusFilter.toLowerCase().replace(' ', '-');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline font-black text-4xl text-zinc-950 tracking-tight">Trade-In Portal</h1>
          <p className="text-zinc-500 text-sm mt-1">Review, value, and manage customer device trade-ins</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={fetchRequests} 
            className="flex items-center gap-2 border-zinc-200 hover:bg-zinc-50 transition-all rounded-xl"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={cn(
          "backdrop-blur-xl bg-white/70 rounded-3xl shadow-sm border border-zinc-200/50 overflow-hidden flex flex-col min-h-[600px] transition-all",
          selectedRequest ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/40">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                className="pl-12 h-12 bg-white/50 border-zinc-100 focus:bg-white transition-all rounded-2xl" 
                placeholder="Search by ID or customer name..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="h-12 px-4 rounded-2xl border border-zinc-100 bg-white/50 text-sm font-bold text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-100 w-full md:w-auto transition-all"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Valuation</option>
              <option>Offer Sent</option>
              <option>Accepted</option>
              <option>Rejected</option>
            </select>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 text-zinc-500 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="p-6">Ref ID</th>
                  <th className="p-6">Customer</th>
                  <th className="p-6">Device Model</th>
                  <th className="p-6 text-center">Status</th>
                  <th className="p-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-zinc-300 mx-auto mb-6" />
                      <p className="text-zinc-500 font-medium">Synchronizing requests...</p>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-24 text-center">
                      <div className="w-16 h-16 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="w-8 h-8 text-zinc-200" />
                      </div>
                      <p className="text-zinc-500 font-medium">No trade-in requests found</p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr 
                      key={request.id} 
                      className={cn(
                        "hover:bg-zinc-50/50 transition-all cursor-pointer group",
                        selectedRequest?.id === request.id ? "bg-zinc-50/80" : ""
                      )}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <td className="p-6">
                        <span className="font-mono text-xs font-black text-zinc-400">#{request.id?.slice(0, 8)}</span>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-950 text-sm group-hover:text-primary transition-colors">{request.userName}</span>
                          <span className="text-[10px] text-zinc-400 font-medium mt-0.5">{request.userEmail || 'No email associated'}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="font-black text-sm text-zinc-800">{request.deviceModel}</span>
                      </td>
                      <td className="p-6 text-center">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all", 
                          getStatusColor(request.status)
                        )}>
                          {request.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end">
                          <div className="p-2 text-zinc-400 group-hover:text-zinc-950 group-hover:bg-white rounded-xl shadow-none group-hover:shadow-sm border border-transparent group-hover:border-zinc-200 transition-all">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {selectedRequest && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-xl border border-zinc-200/50 flex flex-col h-fit sticky top-6 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
                <div>
                  <h2 className="font-headline font-black text-xl text-zinc-950 leading-tight">Request Details</h2>
                  <p className="text-[10px] tracking-widest text-zinc-400 font-black uppercase mt-1">Ref: {selectedRequest.id?.slice(0, 16)}</p>
                </div>
                <button 
                  onClick={() => setSelectedRequest(null)} 
                  className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-2xl border border-transparent hover:border-zinc-100 transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-8 max-h-[70vh]">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-5 flex items-center gap-2">
                    <Smartphone className="w-3 h-3" /> Technical Profile
                  </h3>
                  <div className="bg-white/50 p-5 rounded-2xl border border-zinc-100/50 shadow-sm">
                    <h4 className="font-black text-zinc-900 text-lg mb-4">{selectedRequest.deviceModel}</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                      <div className="space-y-1">
                        <p className="text-zinc-400 uppercase text-[9px] font-black tracking-wider">Condition</p>
                        <p className="font-black text-sm text-zinc-950 capitalize">{selectedRequest.deviceDetails?.condition || 'Unspecified'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-zinc-400 uppercase text-[9px] font-black tracking-wider">Storage</p>
                        <p className="font-black text-sm text-zinc-950">{selectedRequest.deviceDetails?.storage || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-zinc-400 uppercase text-[9px] font-black tracking-wider">Color</p>
                        <p className="font-black text-sm text-zinc-950">{selectedRequest.deviceDetails?.color || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-zinc-400 uppercase text-[9px] font-black tracking-wider">Battery</p>
                        <p className="font-black text-sm text-zinc-950">{selectedRequest.deviceDetails?.batteryHealth || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-5 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Customer Channel
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-zinc-50/50 p-3 rounded-2xl border border-zinc-50">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-950 text-sm truncate">{selectedRequest.userName}</p>
                        <p className="text-xs text-zinc-500 truncate">{selectedRequest.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 bg-zinc-50/50 p-3 rounded-2xl border border-zinc-50">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <p className="font-bold text-zinc-950 text-sm">{selectedRequest.userPhone || 'Unlisted'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950 p-6 rounded-3xl shadow-lg shadow-zinc-200/50 space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Valuation Intelligence
                  </h3>
                  
                  {selectedRequest.status === 'pending' || selectedRequest.status === 'valuation' ? (
                    <div className="space-y-4">
                      <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                        <Input 
                          type="number" 
                          placeholder="Offer amount (₦)" 
                          className="pl-12 h-14 text-xl font-black bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-zinc-700 transition-all rounded-2xl"
                          value={valuation}
                          onChange={(e) => setValuation(e.target.value)}
                        />
                      </div>
                      <Button 
                        className="w-full h-14 bg-white text-zinc-950 hover:bg-zinc-100 font-black uppercase tracking-widest text-xs rounded-2xl shadow-sm transition-all" 
                        onClick={handleSendOffer} 
                        disabled={!valuation || isUpdating}
                      >
                        {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Dispatch Firm Offer'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Locked Valuation</p>
                      <p className="font-headline font-black text-4xl text-white mb-6 tracking-tight">
                        {selectedRequest.estimatedValue ? formatCurrency(selectedRequest.estimatedValue) : 'N/A'}
                      </p>
                      <div className="flex gap-3">
                        {selectedRequest.status === 'offer-sent' && (
                          <>
                            <Button 
                              variant="outline" 
                              className="flex-1 text-[10px] h-12 font-black uppercase tracking-widest border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 rounded-2xl transition-all" 
                              onClick={() => updateStatus('accepted')}
                            >
                              Accept
                            </Button>
                            <Button 
                              variant="outline" 
                              className="flex-1 text-[10px] h-12 font-black uppercase tracking-widest border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 rounded-2xl transition-all" 
                              onClick={() => updateStatus('rejected')}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white/50 p-6 rounded-3xl border border-zinc-100 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Direct Customer Comms</h3>
                  <textarea
                    className="w-full p-4 rounded-2xl border border-zinc-100 bg-white text-zinc-950 placeholder:text-zinc-400 focus:outline-none focus:ring-4 focus:ring-zinc-50 min-h-[100px] resize-none text-sm transition-all"
                    placeholder="Type a formal update for the customer dashboard..."
                    value={adminResponse || selectedRequest.adminResponse || ''}
                    onChange={(e) => setAdminResponse(e.target.value)}
                  />
                  <Button
                    size="lg"
                    className="w-full text-xs font-black uppercase tracking-widest rounded-2xl bg-zinc-100 text-zinc-900 hover:bg-zinc-200 border-zinc-200 transition-all"
                    disabled={isUpdating || !adminResponse}
                    onClick={async () => {
                      if (!selectedRequest?.id || !adminResponse) return;
                      setIsUpdating(true);
                      try {
                        await RepairService.update(selectedRequest.id, { adminResponse });
                        setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, adminResponse } : r));
                        setSelectedRequest({ ...selectedRequest, adminResponse });
                        setStatusModal({ show: true, type: 'success', title: 'Comms Dispatched', message: 'The customer has been notified of your update.' });
                        setAdminResponse('');
                      } catch (error) {
                        setStatusModal({ show: true, type: 'error', title: 'Dispatch Failed', message: 'Could not send the update. Connection error.' });
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Update'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StatusModal 
        isOpen={statusModal.show}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal(prev => ({ ...prev, show: false }))}
      />
    </div>
  );
};
