import React, { useState, useEffect, useRef } from 'react';
import { Tag, Plus, Edit, Trash2, Search, Zap, Clock, Star, AlertCircle, Package, Loader2, X, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';
import { DealService, Deal } from '@/backend/services/firestore.service';
import { CloudinaryService } from '@/backend/services/cloudinary.service';
import { StatusModal } from '@/components/ui/StatusModal';

// Fixed deal categories — no add/remove
const DEAL_SECTIONS = [
  { id: 'flash-sales' as const, label: 'Flash Sales', icon: Zap },
  { id: 'hot-deals' as const, label: 'Hot Deals', icon: Star },
  { id: 'power-bundles' as const, label: 'Power Bundles', icon: Package },
  { id: 'last-chance' as const, label: 'Last Chance Items', icon: Clock },
];

const EMPTY_DEAL: Partial<Deal> = {
  productName: '',
  description: '',
  originalPrice: 0,
  dealPrice: 0,
  image: '',
  images: [],
  category: 'Phones',
  condition: 'Brand New',
  stock: 0,
  colors: [],
  storage: [],
  specs: { display: '', chip: '', camera: '', os: '' },
  section: 'flash-sales',
  status: 'Active',
  endDate: '',
};

export const AdminDeals = () => {
  const [activeSection, setActiveSection] = useState<Deal['section']>('flash-sales');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [editingDealId, setEditingDealId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const [newDeal, setNewDeal] = useState<Partial<Deal>>({ ...EMPTY_DEAL });

  useEffect(() => {
    fetchDeals();
  }, [activeSection]);

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const allDeals = await DealService.getAll();
      setDeals(allDeals.filter(d => d.section === activeSection));
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const response = await CloudinaryService.uploadImage(file);
      const url = response.secure_url;
      setNewDeal(prev => ({
        ...prev,
        image: prev.image || url,
        images: [...(prev.images || []), url]
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      setStatusModal({ isOpen: true, type: 'error', title: 'Upload Failed', message: 'Could not upload image.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setNewDeal(prev => {
      const updated = prev.images?.filter((_, i) => i !== index) || [];
      return { ...prev, images: updated, image: updated[0] || '' };
    });
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.productName || (newDeal.images?.length || 0) === 0) {
      setStatusModal({ isOpen: true, type: 'error', title: 'Missing Fields', message: 'Product name and at least one image are required.' });
      return;
    }

    setIsSaving(true);
    try {
      const dealData = {
        ...newDeal,
        originalPrice: Number(newDeal.originalPrice),
        dealPrice: Number(newDeal.dealPrice),
        stock: Number(newDeal.stock),
        image: newDeal.images?.[0] || newDeal.image || '',
        section: activeSection,
        colors: typeof newDeal.colors === 'string' ? (newDeal.colors as string).split(',').map(s => s.trim()).filter(Boolean) : newDeal.colors,
        storage: typeof newDeal.storage === 'string' ? (newDeal.storage as string).split(',').map(s => s.trim()).filter(Boolean) : newDeal.storage,
      };

      if (editingDealId) {
        await DealService.update(editingDealId, dealData as Partial<Deal>);
      } else {
        await DealService.create(dealData as any);
      }

      await fetchDeals();
      setIsAddingDeal(false);
      setEditingDealId(null);
      resetDealForm();
      setStatusModal({
        isOpen: true,
        type: 'success',
        title: editingDealId ? 'Deal Updated' : 'Deal Created',
        message: `${dealData.productName} has been ${editingDealId ? 'updated' : 'added to ' + DEAL_SECTIONS.find(s => s.id === activeSection)?.label}.`
      });
    } catch (error) {
      console.error('Error saving deal:', error);
      setStatusModal({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to save deal.' });
    } finally {
      setIsSaving(false);
    }
  };

  const startEditDeal = (deal: Deal) => {
    setNewDeal({
      productName: deal.productName,
      description: deal.description || '',
      originalPrice: deal.originalPrice,
      dealPrice: deal.dealPrice,
      image: deal.image,
      images: deal.images || (deal.image ? [deal.image] : []),
      category: deal.category || 'Phones',
      condition: deal.condition || 'Brand New',
      stock: deal.stock || 0,
      colors: deal.colors || [],
      storage: deal.storage || [],
      specs: deal.specs || { display: '', chip: '', camera: '', os: '' },
      section: deal.section,
      status: deal.status,
      endDate: deal.endDate,
    });
    setEditingDealId(deal.id!);
    setIsAddingDeal(true);
  };

  const handleDeleteDeal = async (id: string) => {
    if (!window.confirm('Delete this deal permanently?')) return;
    try {
      await DealService.delete(id);
      setDeals(prev => prev.filter(d => d.id !== id));
      setStatusModal({ isOpen: true, type: 'success', title: 'Deleted', message: 'Deal removed.' });
    } catch (error) {
      console.error('Error deleting deal:', error);
    }
  };

  const resetDealForm = () => {
    setNewDeal({ ...EMPTY_DEAL, section: activeSection });
  };

  const currentCategory = DEAL_SECTIONS.find(s => s.id === activeSection)!;
  const filteredDeals = deals.filter(d => (d.productName || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline font-black text-3xl">Deals & Promotions</h1>
          <p className="text-secondary text-sm">Manage sales with full product-like entries</p>
        </div>
        <Button onClick={() => { resetDealForm(); setIsAddingDeal(true); }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create New Deal
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar — Fixed Categories */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-4 sticky top-24">
            <h3 className="font-bold text-sm uppercase tracking-widest text-secondary mb-4 px-2">Deal Categories</h3>
            <nav className="space-y-1">
              {DEAL_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all text-left",
                    activeSection === section.id
                      ? "bg-primary-container text-on-primary-fixed"
                      : "text-secondary hover:bg-surface-container-low hover:text-on-surface"
                  )}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Deals Table */}
        <div className="flex-1">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden"
          >
            <div className="p-6 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/50">
              <div>
                <h2 className="font-headline font-bold text-xl flex items-center gap-2">
                  <currentCategory.icon className="w-5 h-5 text-primary" />
                  {currentCategory.label}
                </h2>
                <p className="text-sm text-secondary mt-1">{filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <Input
                  className="pl-10 h-10 bg-surface"
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredDeals.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tag className="w-8 h-8 text-secondary/40" />
                  </div>
                  <h3 className="font-bold text-lg text-secondary">No deals in {currentCategory.label}</h3>
                  <p className="text-sm text-secondary mt-2">Create a deal to start featuring products here.</p>
                  <Button className="mt-6" variant="outline" onClick={() => { resetDealForm(); setIsAddingDeal(true); }}>Create Deal</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-container-low text-secondary text-xs uppercase tracking-widest">
                        <th className="p-4 font-bold">Deal Item</th>
                        <th className="p-4 font-bold">Original</th>
                        <th className="p-4 font-bold">Deal Price</th>
                        <th className="p-4 font-bold">Stock</th>
                        <th className="p-4 font-bold">Status</th>
                        <th className="p-4 font-bold">Ends</th>
                        <th className="p-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {filteredDeals.map((deal) => (
                        <tr key={deal.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container-highest border border-outline-variant/30 shrink-0">
                                {deal.image ? (
                                  <img src={deal.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-4 h-4 text-secondary/40" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-sm">{deal.productName}</p>
                                <p className="text-[10px] text-secondary uppercase font-bold">{deal.condition || 'N/A'} • {deal.category || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-secondary line-through">{formatCurrency(deal.originalPrice)}</td>
                          <td className="p-4 font-bold text-sm text-primary">{formatCurrency(deal.dealPrice)}</td>
                          <td className="p-4 text-sm font-bold">{deal.stock ?? 'N/A'}</td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                              deal.status === 'Active' ? "bg-green-100 text-green-800" :
                              deal.status === 'Expired' ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                            )}>
                              {deal.status}
                            </span>
                          </td>
                          <td className="p-4 text-sm text-secondary">{deal.endDate || 'N/A'}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => startEditDeal(deal)} className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteDeal(deal.id!)} className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Create/Edit Deal Modal — Full Product Form */}
      <AnimatePresence>
        {isAddingDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsAddingDeal(false); setEditingDealId(null); resetDealForm(); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
                <div>
                  <h2 className="font-headline font-black text-2xl">
                    {editingDealId ? 'Edit Deal' : 'Create New Deal'}
                  </h2>
                  <p className="text-sm text-secondary mt-1">Adding to: <span className="font-bold text-primary">{currentCategory.label}</span></p>
                </div>
                <button
                  onClick={() => { setIsAddingDeal(false); setEditingDealId(null); resetDealForm(); }}
                  className="p-2 text-secondary hover:bg-surface-container-high rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="p-6 overflow-y-auto space-y-6">
                {/* Product Name + Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Product Name *</label>
                    <Input required value={newDeal.productName} onChange={e => setNewDeal({ ...newDeal, productName: e.target.value })} placeholder="e.g. iPhone 15 Pro Max" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Category</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20" value={newDeal.category} onChange={e => setNewDeal({ ...newDeal, category: e.target.value })}>
                      <option>Phones</option>
                      <option>Laptops</option>
                      <option>Accessories</option>
                      <option>Tablets</option>
                      <option>Watches</option>
                    </select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Original Price (₦)</label>
                    <Input type="number" required value={newDeal.originalPrice} onChange={e => setNewDeal({ ...newDeal, originalPrice: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Deal Price (₦) *</label>
                    <Input type="number" required value={newDeal.dealPrice} onChange={e => setNewDeal({ ...newDeal, dealPrice: Number(e.target.value) })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Stock</label>
                    <Input type="number" value={newDeal.stock} onChange={e => setNewDeal({ ...newDeal, stock: Number(e.target.value) })} />
                  </div>
                </div>

                {/* Condition + End Date + Status */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Condition</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20" value={newDeal.condition} onChange={e => setNewDeal({ ...newDeal, condition: e.target.value })}>
                      <option>Brand New</option>
                      <option>UK Used</option>
                      <option>Refurbished</option>
                      <option>Pre-owned</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">End Date</label>
                    <Input type="date" value={newDeal.endDate} onChange={e => setNewDeal({ ...newDeal, endDate: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Status</label>
                    <select className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20" value={newDeal.status} onChange={e => setNewDeal({ ...newDeal, status: e.target.value as Deal['status'] })}>
                      <option>Active</option>
                      <option>Scheduled</option>
                      <option>Expired</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Description</label>
                  <textarea
                    className="w-full p-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                    value={newDeal.description}
                    onChange={e => setNewDeal({ ...newDeal, description: e.target.value })}
                    placeholder="Detailed deal description..."
                  />
                </div>

                {/* Images */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Images *</label>
                  <div className="grid grid-cols-4 gap-3 mb-3">
                    {newDeal.images?.map((url, idx) => (
                      <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-outline-variant">
                        <img src={url} alt="Deal" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {(newDeal.images?.length || 0) < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="aspect-square rounded-xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center hover:bg-surface-container-low transition-colors disabled:opacity-50"
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        ) : (
                          <>
                            <Plus className="w-6 h-6 text-secondary mb-1" />
                            <span className="text-[10px] font-bold uppercase text-secondary">Add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>

                {/* Attributes */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-secondary border-b border-outline-variant/30 pb-2">Attributes</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Colors (comma sep.)</label>
                      <Input value={Array.isArray(newDeal.colors) ? newDeal.colors.join(', ') : newDeal.colors} onChange={e => setNewDeal({ ...newDeal, colors: e.target.value as any })} placeholder="Black, Silver..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Storage (comma sep.)</label>
                      <Input value={Array.isArray(newDeal.storage) ? newDeal.storage.join(', ') : newDeal.storage} onChange={e => setNewDeal({ ...newDeal, storage: e.target.value as any })} placeholder="256GB, 512GB..." />
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-secondary border-b border-outline-variant/30 pb-2">Technical Specs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input value={newDeal.specs?.display} onChange={e => setNewDeal({ ...newDeal, specs: { ...newDeal.specs!, display: e.target.value } })} placeholder="Display" />
                    <Input value={newDeal.specs?.chip} onChange={e => setNewDeal({ ...newDeal, specs: { ...newDeal.specs!, chip: e.target.value } })} placeholder="Processor" />
                    <Input value={newDeal.specs?.camera} onChange={e => setNewDeal({ ...newDeal, specs: { ...newDeal.specs!, camera: e.target.value } })} placeholder="Camera" />
                    <Input value={newDeal.specs?.os} onChange={e => setNewDeal({ ...newDeal, specs: { ...newDeal.specs!, os: e.target.value } })} placeholder="OS Version" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsAddingDeal(false); setEditingDealId(null); resetDealForm(); }}>Cancel</Button>
                  <Button type="submit" className="flex-1" disabled={isSaving || (newDeal.images?.length || 0) === 0}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    {isSaving ? 'Saving...' : (editingDealId ? 'Update Deal' : 'Publish Deal')}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <StatusModal
        isOpen={statusModal.isOpen}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
