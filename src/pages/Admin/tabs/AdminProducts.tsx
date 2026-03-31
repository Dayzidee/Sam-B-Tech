import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit, Trash2, Image as ImageIcon, X, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ProductService, Product } from '@/backend/services/firestore.service';
import { CloudinaryService } from '@/backend/services/cloudinary.service';
import { StatusModal } from '@/components/ui/StatusModal';

export const AdminProducts = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    category: 'Phones',
    condition: 'Brand New',
    colors: [],
    storage: [],
    images: [],
    batteryHealth: '',
    specs: {
      display: '',
      chip: '',
      camera: '',
      os: ''
    }
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      setNewProduct(prev => ({
        ...prev,
        images: [...(prev.images || []), response.secure_url]
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload image. Please check your internet connection or Cloudinary configuration.'
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const startEdit = (product: Product) => {
    setEditingProductId(product.id || null);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      stock: product.stock,
      category: product.category,
      condition: product.condition,
      colors: product.colors || [],
      storage: product.storage || [],
      images: product.images || [],
      batteryHealth: product.batteryHealth || '',
      specs: product.specs || { display: '', chip: '', camera: '', os: '' }
    });
    setIsAdding(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const productToSave = {
        ...newProduct,
        price: Number(newProduct.price),
        discountPrice: Number(newProduct.discountPrice || 0),
        stock: Number(newProduct.stock),
        colors: typeof newProduct.colors === 'string' ? (newProduct.colors as string).split(',').map(s => s.trim()).filter(Boolean) : newProduct.colors,
        storage: typeof newProduct.storage === 'string' ? (newProduct.storage as string).split(',').map(s => s.trim()).filter(Boolean) : newProduct.storage,
      };

      if (editingProductId) {
        await ProductService.update(editingProductId, productToSave as Partial<Product>);
        setStatusModal({
          isOpen: true,
          type: 'success',
          title: 'Product Updated',
          message: `${productToSave.name} has been updated successfully.`
        });
      } else {
        await ProductService.create(productToSave as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>);
        setStatusModal({
          isOpen: true,
          type: 'success',
          title: 'Product Published',
          message: `${productToSave.name} is now live in the store.`
        });
      }
      await fetchProducts();
      setIsAdding(false);
      setEditingProductId(null);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: editingProductId ? 'Update Failed' : 'Publishing Failed',
        message: 'Could not save product. Please ensure all required fields are filled correctly.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await ProductService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Product Deleted',
        message: 'The item has been permanently removed from inventory.'
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Deletion Failed',
        message: 'Failed to delete the product. Please try again.'
      });
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      discountPrice: 0,
      stock: 0,
      category: 'Phones',
      condition: 'Brand New',
      colors: [],
      storage: [],
      images: [],
      batteryHealth: '',
      specs: {
        display: '',
        chip: '',
        camera: '',
        os: ''
      }
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All Categories' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline font-black text-3xl">Products</h1>
          <p className="text-secondary text-sm">Manage your inventory and product listings</p>
        </div>
        <Button onClick={() => { if (isAdding) { setEditingProductId(null); resetForm(); } setIsAdding(!isAdding); }} className="flex items-center gap-2">
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add New Product'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl shadow-sm border border-outline-variant/20"
          >
            <h2 className="font-headline font-bold text-xl mb-6">{editingProductId ? 'Edit Product' : 'Create New Listing'}</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Product Name</label>
                    <Input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. iPhone 15 Pro Max" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Price (₦)</label>
                      <Input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} placeholder="1200000" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Discount Price (₦)</label>
                      <Input type="number" value={newProduct.discountPrice} onChange={e => setNewProduct({...newProduct, discountPrice: Number(e.target.value)})} placeholder="Optional" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Category</label>
                      <select className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                        <option>Phones</option>
                        <option>Laptops</option>
                        <option>Accessories</option>
                        <option>Tablets</option>
                        <option>Watches</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Condition</label>
                      <select className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20" value={newProduct.condition} onChange={e => setNewProduct({...newProduct, condition: e.target.value as any})}>
                        <option>Brand New</option>
                        <option>UK Used</option>
                        <option>Refurbished</option>
                        <option>Pre-owned</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Inventory Quantity</label>
                    <Input type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} placeholder="Quantity in stock" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Full Description</label>
                    <textarea 
                      className="w-full p-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[120px] resize-none"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Detailed product specifications, features, and warranty info..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-widest text-secondary border-b border-outline-variant/30 pb-2 mb-4">Media Gallary</h3>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {newProduct.images?.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-outline-variant">
                          <img src={url} alt="Product" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {newProduct.images && newProduct.images.length < 5 && (
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
                              <span className="text-[10px] font-bold uppercase text-secondary">Add Image</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <p className="text-[10px] text-secondary italic">Minimum 1 image required. First image is the primary thumbnail.</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-sm uppercase tracking-widest text-secondary border-b border-outline-variant/30 pb-2">Attributes</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Colors (comma separated)</label>
                        <Input value={Array.isArray(newProduct.colors) ? newProduct.colors.join(', ') : newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value as any})} placeholder="Natural Titanium, Blue..." />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Storage (comma separated)</label>
                        <Input value={Array.isArray(newProduct.storage) ? newProduct.storage.join(', ') : newProduct.storage} onChange={e => setNewProduct({...newProduct, storage: e.target.value as any})} placeholder="256GB, 512GB..." />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Battery Health/Cycle (if used)</label>
                      <Input value={newProduct.batteryHealth} onChange={e => setNewProduct({...newProduct, batteryHealth: e.target.value})} placeholder="e.g. 100% (45 cycles)" />
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary">Technical Specs</label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input value={newProduct.specs?.display} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs!, display: e.target.value}})} placeholder="Display" />
                        <Input value={newProduct.specs?.chip} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs!, chip: e.target.value}})} placeholder="Processor" />
                        <Input value={newProduct.specs?.camera} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs!, camera: e.target.value}})} placeholder="Camera" />
                        <Input value={newProduct.specs?.os} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs!, os: e.target.value}})} placeholder="OS Version" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant/30">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving || (newProduct.images?.length || 0) === 0} className="min-w-[150px]">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? (editingProductId ? 'Updating...' : 'Publishing...') : (editingProductId ? 'Update Product' : 'Publish Product')}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden"
          >
            <div className="p-4 border-b border-outline-variant/30 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <Input 
                  className="pl-10 h-10" 
                  placeholder="Search by name..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select 
                  className="h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm font-bold text-secondary focus:outline-none w-full md:w-auto"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <option>All Categories</option>
                  <option>Phones</option>
                  <option>Laptops</option>
                  <option>Accessories</option>
                  <option>Watches</option>
                  <option>Tablets</option>
                </select>
                <Button variant="outline" className="h-10" onClick={fetchProducts}>
                  Refresh
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-secondary text-xs uppercase tracking-widest text-nowrap">
                    <th className="p-4 font-black">Product Item</th>
                    <th className="p-4 font-black text-center">Category</th>
                    <th className="p-4 font-black">Market Value</th>
                    <th className="p-4 font-black text-center">Stock</th>
                    <th className="p-4 font-black text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-secondary font-bold">Synchronizing with SamB DB...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="w-8 h-8 text-secondary" />
                        </div>
                        <p className="text-secondary font-bold text-lg">No products found</p>
                        <p className="text-secondary/60 text-sm">Try adjusting your filters or search terms</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-surface-container-highest rounded-xl overflow-hidden border border-outline-variant/30 flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-5 h-5 text-secondary/40" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-sm truncate max-w-[200px]">{product.name}</p>
                              <div className="flex gap-2 mt-0.5">
                                <span className="text-[10px] font-black uppercase text-primary/80">{product.condition}</span>
                                {product.discountPrice > 0 && (
                                  <span className="text-[10px] font-black uppercase text-error/80">On Sale</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xs font-bold px-2 py-1 bg-surface-container-high rounded-md">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="space-y-0.5">
                            <p className="font-black text-sm">{formatCurrency(product.price)}</p>
                            {product.discountPrice > 0 && (
                              <p className="text-[10px] text-secondary line-through italic opacity-50">{formatCurrency(product.discountPrice)}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <motion.div 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={cn(
                              "inline-flex items-center justify-center w-10 h-10 rounded-xl text-xs font-black",
                              product.stock > 10 ? "bg-green-100 text-green-700 shadow-sm shadow-green-100" : 
                              product.stock > 0 ? "bg-amber-100 text-amber-700 shadow-sm shadow-amber-100" : 
                              "bg-red-100 text-red-700 shadow-sm shadow-red-100"
                            )}>
                            {product.stock}
                          </motion.div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => startEdit(product)} className="p-2.5 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-xl transition-all active:scale-95">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-2.5 text-secondary hover:text-error hover:bg-error/10 rounded-xl transition-all active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
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
