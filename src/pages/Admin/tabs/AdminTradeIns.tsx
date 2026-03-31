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
          <h1 className="font-headline font-black text-3xl">Trade-In Portal</h1>
          <p className="text-secondary text-sm">Review, value, and manage customer device trade-ins</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchRequests} className="flex items-center gap-2">
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={cn(
          "bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden flex flex-col min-h-[500px]",
          selectedRequest ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          <div className="p-4 border-b border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              <Input 
                className="pl-10 h-10" 
                placeholder="Search by ID or customer..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              className="h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm font-bold text-secondary focus:outline-none w-full md:w-auto"
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
                <tr className="bg-surface-container-low text-secondary text-xs uppercase tracking-widest text-nowrap">
                  <th className="p-4 font-black">Ref ID</th>
                  <th className="p-4 font-black">Customer</th>
                  <th className="p-4 font-black">Device Model</th>
                  <th className="p-4 font-black text-center">Status</th>
                  <th className="p-4 font-black text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-secondary font-bold">Fetching latest requests...</p>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-20 text-center">
                      <Smartphone className="w-12 h-12 text-secondary/30 mx-auto mb-4" />
                      <p className="text-secondary font-bold">No trade-in requests found</p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr 
                      key={request.id} 
                      className={cn(
                        "hover:bg-surface-container-low/50 transition-colors cursor-pointer",
                        selectedRequest?.id === request.id ? "bg-primary-container/10" : ""
                      )}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <td className="p-4 font-mono text-xs font-bold">{request.id?.slice(0, 8)}</td>
                      <td className="p-4">
                        <p className="font-bold text-sm">{request.userName}</p>
                        <p className="text-[10px] text-secondary">{request.userEmail || 'No email'}</p>
                      </td>
                      <td className="p-4 font-black text-sm">{request.deviceModel}</td>
                      <td className="p-4 text-center">
                        <span className={cn("px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border", getStatusColor(request.status))}>
                          {request.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2.5 text-primary hover:bg-primary-container/20 rounded-xl transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col h-full sticky top-0"
            >
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/30">
                <div>
                  <h2 className="font-headline font-bold text-xl uppercase tracking-tight">Request Details</h2>
                  <p className="text-[10px] text-secondary font-mono mt-0.5">{selectedRequest.id}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 text-secondary hover:bg-surface-container-high rounded-full transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Smartphone className="w-3 h-3" /> Hardware Inspection
                  </h3>
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
                    <h4 className="font-black text-lg mb-2">{selectedRequest.deviceModel}</h4>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                      <div className="space-y-1">
                        <p className="text-secondary uppercase text-[9px] font-bold">Condition</p>
                        <p className="font-black text-primary uppercase">{selectedRequest.deviceDetails?.condition || 'Not specified'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-secondary uppercase text-[9px] font-bold">Storage</p>
                        <p className="font-black">{selectedRequest.deviceDetails?.storage || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-secondary uppercase text-[9px] font-bold">Color</p>
                        <p className="font-black">{selectedRequest.deviceDetails?.color || 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-secondary uppercase text-[9px] font-bold">Battery</p>
                        <p className="font-black">{selectedRequest.deviceDetails?.batteryHealth || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Contact Info
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold">{selectedRequest.userName}</p>
                        <p className="text-xs text-secondary">{selectedRequest.userEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-secondary">
                        <Phone className="w-4 h-4" />
                      </div>
                      <p className="font-bold">{selectedRequest.userPhone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <DollarSign className="w-3 h-3" /> Valuation Action
                  </h3>
                  
                  {selectedRequest.status === 'pending' || selectedRequest.status === 'valuation' ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                        <Input 
                          type="number" 
                          placeholder="Enter offer amount (₦)" 
                          className="pl-10 h-12 text-lg font-black bg-surface"
                          value={valuation}
                          onChange={(e) => setValuation(e.target.value)}
                        />
                      </div>
                      <Button className="w-full h-12 font-black uppercase tracking-widest text-xs" onClick={handleSendOffer} disabled={!valuation || isUpdating}>
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Firm Offer'}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-[10px] font-bold text-secondary uppercase mb-1">Current Firm Offer</p>
                      <p className="font-headline font-black text-3xl text-primary mb-4 italic">
                        {selectedRequest.estimatedValue ? formatCurrency(selectedRequest.estimatedValue) : 'N/A'}
                      </p>
                      <div className="flex gap-2">
                        {selectedRequest.status === 'offer-sent' && (
                          <>
                            <Button variant="outline" className="flex-1 text-xs h-10 font-bold border-green-200 text-green-700 hover:bg-green-50" onClick={() => updateStatus('accepted')}>
                              Mark Accepted
                            </Button>
                            <Button variant="outline" className="flex-1 text-xs h-10 font-bold border-red-200 text-red-700 hover:bg-red-50" onClick={() => updateStatus('rejected')}>
                              Mark Rejected
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Admin Response to Customer */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 space-y-3">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-secondary">Admin Response to Customer</h3>
                  <textarea
                    className="w-full p-3 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[80px] resize-none text-sm"
                    placeholder="Type a message for the customer (visible in their dashboard)..."
                    value={adminResponse || selectedRequest.adminResponse || ''}
                    onChange={(e) => setAdminResponse(e.target.value)}
                  />
                  <Button
                    size="sm"
                    className="w-full text-xs font-bold"
                    disabled={isUpdating || !adminResponse}
                    onClick={async () => {
                      if (!selectedRequest?.id || !adminResponse) return;
                      setIsUpdating(true);
                      try {
                        await RepairService.update(selectedRequest.id, { adminResponse });
                        setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, adminResponse } : r));
                        setSelectedRequest({ ...selectedRequest, adminResponse });
                        setStatusModal({ show: true, type: 'success', title: 'Response Sent', message: 'Your message has been sent to the customer.' });
                        setAdminResponse('');
                      } catch (error) {
                        setStatusModal({ show: true, type: 'error', title: 'Failed', message: 'Could not send the response.' });
                      } finally {
                        setIsUpdating(false);
                      }
                    }}
                  >
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Response'}
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
