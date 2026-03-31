import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, RefreshCw, Smartphone, Wrench, Loader2, Mail, Phone, AlertTriangle, Wand2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';
import { RepairService, ServiceRequest } from '@/backend/services/firestore.service';
import { AIService, DiagnosticResult } from '@/backend/services/ai.service';
import { StatusModal } from '@/components/ui/StatusModal';

export const AdminRepairs = () => {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [repairCost, setRepairCost] = useState('');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [adminResponse, setAdminResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<DiagnosticResult | null>(null);
  const [statusModal, setStatusModal] = useState<{ isOpen: boolean; type: 'success' | 'error' | 'info'; title: string; message: string }>({
    isOpen: false,
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
      setRequests(data.filter(r => r.type === 'repair'));
    } catch (error) {
      console.error('Error fetching repairs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'in-progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch(urgency) {
      case 'high': return 'text-red-600 font-black';
      case 'medium': return 'text-amber-600 font-bold';
      default: return 'text-zinc-500 font-medium';
    }
  };

  const updateRepairDetails = async () => {
    if (!selectedRequest?.id) return;
    
    setIsUpdating(true);
    try {
      const updated = await RepairService.update(selectedRequest.id, {
        repairCost: repairCost ? Number(repairCost) : selectedRequest.repairCost,
        status: selectedRequest.status === 'pending' ? 'in-progress' : selectedRequest.status
      });
      
      setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, ...updated } : r));
      setSelectedRequest({ ...selectedRequest, ...updated });
      setRepairCost('');
      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Estimate Updated',
        message: 'The repair estimate has been successfully recorded and the customer notified.'
      });
    } catch (error) {
      console.error('Error updating repair:', error);
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: 'We encountered an error while saving the repair details. Please check your connection and try again.'
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
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAIDiagnosis = async () => {
    if (!selectedRequest) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const result = await AIService.getRepairDiagnosis(
        selectedRequest.deviceModel || 'Unknown Device',
        selectedRequest.issue || 'No issue described'
      );
      setAiResult(result);
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = (r.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                         (r.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (r.deviceModel?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || r.status === statusFilter.toLowerCase().replace(' ', '-');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline font-black text-3xl text-zinc-900 tracking-tight">Repair Workshop</h1>
          <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">{requests.length} TOTAL INVENTORY</p>
        </div>
        <Button 
          variant="outline" 
          className="h-11 rounded-2xl border-zinc-200 text-zinc-600 hover:bg-zinc-50 px-6 font-bold flex items-center gap-2" 
          onClick={fetchRequests}
        >
          <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Request List */}
        <div className={cn(
          "bg-white/70 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/50 overflow-hidden flex flex-col transition-all duration-500",
          selectedRequest ? "lg:col-span-2" : "lg:col-span-3"
        )}>
          <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input
                className="pl-11 h-11 bg-zinc-50/50 border-zinc-200/50 focus:bg-white rounded-2xl text-sm"
                placeholder="Search by device, ID or customer..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="h-11 px-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 text-sm font-black text-zinc-600 focus:bg-white focus:outline-none w-full md:w-auto appearance-none pr-10 cursor-pointer hover:bg-zinc-100/50 transition-colors"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23a1a1aa\' stroke-width=\'2\'%3E%3Cpath d=\'m19 9-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
            >
              <option>All Statuses</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] text-nowrap border-b border-zinc-100">
                  <th className="p-5 font-black uppercase tracking-widest">Ref ID</th>
                  <th className="p-5 font-black uppercase tracking-widest">Customer</th>
                  <th className="p-5 font-black uppercase tracking-widest">Device</th>
                  <th className="p-5 font-black uppercase tracking-widest">Urgency</th>
                  <th className="p-5 font-black uppercase tracking-widest">Status</th>
                  <th className="p-5 font-black uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <Loader2 className="w-10 h-10 animate-spin text-zinc-200 mx-auto mb-4" />
                      <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Workshop...</p>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100 text-zinc-300">
                        <Wrench className="w-8 h-8" />
                      </div>
                      <p className="text-zinc-900 font-bold text-lg">No repair requests</p>
                      <p className="text-zinc-400 text-sm mt-1">Check back later for new hardware</p>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => (
                    <tr 
                      key={request.id} 
                      className={cn(
                        "group hover:bg-zinc-50/50 transition-colors cursor-pointer",
                        selectedRequest?.id === request.id ? "bg-zinc-100/50 shadow-inner" : ""
                      )}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <td className="p-5">
                        <span className="font-mono text-zinc-400 text-[11px] font-bold tracking-tighter bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200/50">
                          #{request.id?.slice(0, 8).toUpperCase()}
                        </span>
                      </td>
                      <td className="p-5">
                        <p className="font-bold text-zinc-900 text-sm tracking-tight">{request.userName || 'Anonymous Client'}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">{request.userEmail || 'Guest Account'}</p>
                      </td>
                      <td className="p-5">
                        <p className="font-black text-zinc-900 text-sm tracking-tight">{request.deviceModel}</p>
                      </td>
                      <td className="p-5">
                        <span className={cn("text-[9px] font-black uppercase tracking-widest", getUrgencyColor(request.urgency))}>
                          {request.urgency || 'Normal'}
                        </span>
                      </td>
                      <td className="p-5">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-center shadow-sm border",
                          getStatusColor(request.status)
                        )}>
                          {request.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button className="p-3 text-zinc-400 group-hover:text-zinc-900 group-hover:bg-white rounded-2xl transition-all shadow-sm group-hover:shadow-md">
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

        {/* Request Details Panel */}
        <AnimatePresence mode="wait">
          {selectedRequest && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/80 backdrop-blur-3xl rounded-3xl shadow-xl border border-white/60 flex flex-col h-[calc(100vh-280px)] sticky top-6 overflow-hidden"
            >
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/30">
                <div>
                  <h2 className="font-headline font-black text-xl text-zinc-900 tracking-tight">Workbench</h2>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1">REF: {selectedRequest.id?.toUpperCase()}</p>
                </div>
                <button 
                  onClick={() => setSelectedRequest(null)} 
                  className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all border border-transparent hover:border-zinc-200"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-8 scrollbar-hide">
                {/* Diagnostic info */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2 flex items-center gap-2">
                    <Smartphone className="w-3 h-3" /> Diagnostic Report
                  </h3>
                  <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100 shadow-sm space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Issue Description</p>
                      <p className="font-bold text-zinc-900 text-sm leading-relaxed">{selectedRequest.issue || 'No diagnostic notes provided.'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Device Model</p>
                        <p className="font-black text-zinc-900 text-sm">{selectedRequest.deviceModel}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mb-1">Urgency Level</p>
                        <p className={cn("text-[10px] font-black uppercase", getUrgencyColor(selectedRequest.urgency))}>
                          {selectedRequest.urgency || 'Normal'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Integration */}
                <div className="p-5 bg-zinc-900 rounded-2xl shadow-lg shadow-zinc-200/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                      <Wand2 className="w-3 h-3" /> Smart AI Diagnosis
                    </h3>
                    <Button 
                      className="h-8 px-3 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 font-black text-[9px] uppercase tracking-widest shadow-lg shadow-white/10"
                      onClick={handleAIDiagnosis}
                      disabled={aiLoading}
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Run AI Scan'}
                    </Button>
                  </div>

                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700 italic text-[11px] text-zinc-300 leading-relaxed">
                        "{aiResult.diagnosis}"
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                          <p className="text-[8px] text-zinc-500 uppercase font-bold mb-1 tracking-widest">AI Estimate</p>
                          <p className="font-black text-[11px] text-white tracking-widest">{aiResult.estimatedCost}</p>
                        </div>
                        <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                          <p className="text-[8px] text-zinc-500 uppercase font-bold mb-1 tracking-widest">Complexity</p>
                          <p className={cn(
                            "font-black text-[11px] tracking-widest",
                            aiResult.complexity === 'High' ? 'text-red-400' : 
                            aiResult.complexity === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                          )}>{aiResult.complexity.toUpperCase()}</p>
                        </div>
                      </div>
                      {aiResult.suggestedParts.length > 0 && (
                        <div className="p-3 bg-zinc-800 rounded-xl border border-zinc-700">
                          <p className="text-[8px] text-zinc-500 uppercase font-bold mb-2 tracking-widest">Suggested Parts</p>
                          <div className="flex flex-wrap gap-1.5">
                            {aiResult.suggestedParts.map((part, i) => (
                              <span key={i} className="px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-lg text-[9px] font-black uppercase tracking-tight">
                                {part}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Repair Action */}
                <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg shadow-zinc-200/50 space-y-4">
                  <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
                    <Wrench className="w-3 h-3" /> Command Logistics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <p className="text-zinc-500 uppercase text-[8px] font-bold mb-2 tracking-widest">Repair Valuation (₦)</p>
                      <Input 
                        type="number" 
                        placeholder={selectedRequest.repairCost ? `Current: ₦${selectedRequest.repairCost}` : "Enter estimate..."}
                        className="h-12 text-lg font-black bg-zinc-800 border-zinc-700 text-white focus:bg-zinc-800 rounded-xl"
                        value={repairCost}
                        onChange={(e) => setRepairCost(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        className="w-full h-12 rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-white/10"
                        onClick={updateRepairDetails} 
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : (selectedRequest.status === 'pending' ? 'Initialize Repair' : 'Synchronize Estimate')}
                      </Button>
                      
                      {selectedRequest.status === 'in-progress' && (
                        <Button 
                          variant="outline"
                          className="w-full h-12 rounded-xl border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-black text-[10px] uppercase tracking-widest transition-all" 
                          onClick={() => updateStatus('completed')}
                          disabled={isUpdating}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Admin Note */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> Archive Notes
                  </h3>
                  <textarea 
                    className="w-full h-32 bg-zinc-50/50 border border-zinc-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-100 transition-all font-medium text-zinc-900"
                    placeholder="Log technical steps, internal diagnostics, etc..."
                    defaultValue={selectedRequest.notes}
                  />
                </div>

                {/* Response to customer */}
                <div className="space-y-4 pb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2">Client Dispatch</h3>
                  <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100 shadow-sm space-y-3">
                    <textarea
                      className="w-full p-4 rounded-xl border border-zinc-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-100 min-h-[100px] resize-none text-sm font-medium"
                      placeholder="Type a communication for the client dashboard..."
                      value={adminResponse || selectedRequest.adminResponse || ''}
                      onChange={(e) => setAdminResponse(e.target.value)}
                    />
                    <Button
                      className="w-full h-10 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 font-bold text-[10px] uppercase tracking-widest shadow-md"
                      disabled={isUpdating || !adminResponse}
                      onClick={async () => {
                        if (!selectedRequest?.id || !adminResponse) return;
                        setIsUpdating(true);
                        try {
                          await RepairService.update(selectedRequest.id, { adminResponse });
                          setRequests(prev => prev.map(r => r.id === selectedRequest.id ? { ...r, adminResponse } : r));
                          setSelectedRequest({ ...selectedRequest, adminResponse });
                          setStatusModal({ isOpen: true, type: 'success', title: 'Response Dispatched', message: 'The communication has been synchronized to the client dashboard.' });
                          setAdminResponse('');
                        } catch (error) {
                          setStatusModal({ isOpen: true, type: 'error', title: 'Dispatch Failed', message: 'System error during synchronization.' });
                        } finally {
                          setIsUpdating(false);
                        }
                      }}
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Dispatch Intelligence'}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StatusModal 
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </div>
  );
};
