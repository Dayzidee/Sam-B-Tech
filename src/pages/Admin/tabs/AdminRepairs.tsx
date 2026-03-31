import React, { useState, useEffect } from 'react';
import { Search, Eye, CheckCircle, XCircle, RefreshCw, Smartphone, Wrench, Loader2, Mail, Phone, AlertTriangle, Wand2 } from 'lucide-react';
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
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch(urgency) {
      case 'high': return 'text-red-600 font-black';
      case 'medium': return 'text-orange-600 font-bold';
      default: return 'text-secondary';
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
          <h1 className="font-headline font-black text-3xl">Repair Workshop</h1>
          <p className="text-secondary text-sm">Track and manage hardware repair requests</p>
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
                placeholder="Search by device, ID or customer..." 
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
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low text-secondary text-xs uppercase tracking-widest text-nowrap">
                  <th className="p-4 font-black">Ref ID</th>
                  <th className="p-4 font-black">Customer</th>
                  <th className="p-4 font-black">Device</th>
                  <th className="p-4 font-black">Urgency</th>
                  <th className="p-4 font-black text-center">Status</th>
                  <th className="p-4 font-black text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-secondary font-bold">Loading workshop data...</p>
                    </td>
                  </tr>
                ) : filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <Wrench className="w-12 h-12 text-secondary/30 mx-auto mb-4" />
                      <p className="text-secondary font-bold">No active repair requests</p>
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
                      <td className="p-4 font-mono text-xs font-bold text-secondary">{request.id?.slice(0, 8)}</td>
                      <td className="p-4">
                        <p className="font-bold text-sm">{request.userName}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-black text-sm">{request.deviceModel}</p>
                      </td>
                      <td className="p-4">
                        <span className={cn("text-[10px] font-black uppercase tracking-wider", getUrgencyColor(request.urgency))}>
                          {request.urgency || 'Normal'}
                        </span>
                      </td>
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
                  <h2 className="font-headline font-bold text-xl uppercase tracking-tight">Workbench</h2>
                  <p className="text-[10px] text-secondary font-mono mt-0.5">{selectedRequest.id}</p>
                </div>
                <button onClick={() => setSelectedRequest(null)} className="p-2 text-secondary hover:bg-surface-container-high rounded-full transition-colors">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <Smartphone className="w-3 h-3" /> Diagnostic Report
                  </h3>
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 space-y-4">
                    <div>
                      <p className="text-secondary uppercase text-[9px] font-bold mb-1">Issue Description</p>
                      <p className="font-bold text-sm leading-relaxed">{selectedRequest.issue || 'No diagnostic notes provided.'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-secondary uppercase text-[9px] font-bold">Device</p>
                        <p className="font-black text-sm">{selectedRequest.deviceModel}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-secondary uppercase text-[9px] font-bold">Urgency</p>
                        <p className={cn("text-xs font-black uppercase", getUrgencyColor(selectedRequest.urgency))}>
                          {selectedRequest.urgency || 'Normal'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Diagnostic Integration */}
                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Wand2 className="w-3 h-3" /> Smart AI Diagnosis
                    </h3>
                    <Button 
                      size="sm"
                      onClick={handleAIDiagnosis}
                      disabled={aiLoading}
                      className="h-8 px-3 text-[9px] font-black uppercase tracking-widest bg-primary text-white"
                    >
                      {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Run AI Scan'}
                    </Button>
                  </div>

                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="p-3 bg-surface rounded-xl border border-outline-variant/30 italic text-xs text-secondary leading-relaxed">
                        "{aiResult.diagnosis}"
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-surface rounded-xl border border-outline-variant/30">
                          <p className="text-[8px] text-secondary uppercase font-bold mb-1">AI Estimate</p>
                          <p className="font-black text-xs text-primary">{aiResult.estimatedCost}</p>
                        </div>
                        <div className="p-3 bg-surface rounded-xl border border-outline-variant/30">
                          <p className="text-[8px] text-secondary uppercase font-bold mb-1">Complexity</p>
                          <p className={cn(
                            "font-black text-xs",
                            aiResult.complexity === 'High' ? 'text-red-500' : 
                            aiResult.complexity === 'Medium' ? 'text-orange-500' : 'text-green-500'
                          )}>{aiResult.complexity}</p>
                        </div>
                      </div>
                      {aiResult.suggestedParts.length > 0 && (
                        <div className="p-3 bg-surface rounded-xl border border-outline-variant/30">
                          <p className="text-[8px] text-secondary uppercase font-bold mb-2">Suggested Parts</p>
                          <div className="flex flex-wrap gap-1.5">
                            {aiResult.suggestedParts.map((part, i) => (
                              <span key={i} className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[9px] font-bold">
                                {part}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> Admin Notes
                  </h3>
                  <textarea 
                    className="w-full h-32 bg-surface border border-outline-variant/40 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                    placeholder="Technical notes, parts used, etc..."
                    defaultValue={selectedRequest.notes}
                  />
                </div>

                <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Wrench className="w-3 h-3" /> Repair Action
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="relative">
                      <p className="text-secondary uppercase text-[9px] font-bold mb-2">Repair Cost (₦)</p>
                      <Input 
                        type="number" 
                        placeholder={selectedRequest.repairCost ? `Current: ₦${selectedRequest.repairCost}` : "Enter estimate..."}
                        className="h-12 text-lg font-black bg-surface"
                        value={repairCost}
                        onChange={(e) => setRepairCost(e.target.value)}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 h-12 font-black uppercase tracking-widest text-[10px]" 
                        onClick={updateRepairDetails} 
                        disabled={isUpdating}
                      >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : (selectedRequest.status === 'pending' ? 'Begin Repair' : 'Update Estimate')}
                      </Button>
                      
                      {selectedRequest.status === 'in-progress' && (
                        <Button 
                          variant="outline"
                          className="flex-1 h-12 font-black uppercase tracking-widest text-[10px] border-green-200 text-green-700 hover:bg-green-50" 
                          onClick={() => updateStatus('completed')}
                          disabled={isUpdating}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
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
                        setStatusModal({ isOpen: true, type: 'success', title: 'Response Sent', message: 'Your message has been sent to the customer.' });
                        setAdminResponse('');
                      } catch (error) {
                        setStatusModal({ isOpen: true, type: 'error', title: 'Failed', message: 'Could not send the response.' });
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
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </div>
  );
};
