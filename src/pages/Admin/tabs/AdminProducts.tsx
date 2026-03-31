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
          <h1 className="font-headline font-black text-3xl text-zinc-900 tracking-tight">Inventory</h1>
          <p className="text-zinc-500 text-sm">Manage your listings and stock levels</p>
        </div>
        <Button 
          onClick={() => { if (isAdding) { setEditingProductId(null); resetForm(); } setIsAdding(!isAdding); }} 
          className={cn(
            "flex items-center gap-2 transition-all duration-300",
            isAdding ? "bg-zinc-100 text-zinc-600 hover:bg-zinc-200" : "bg-zinc-900 text-white hover:bg-zinc-800"
          )}
        >
          {isAdding ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {isAdding ? 'Cancel' : 'Add New Product'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white/70 backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-sm border border-white/50"
          >
            <h2 className="font-headline font-bold text-xl mb-6 text-zinc-900">{editingProductId ? 'Edit Product' : 'Create New Listing'}</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Product Identity</label>
                    <Input 
                      required 
                      value={newProduct.name} 
                      onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                      placeholder="e.g. iPhone 16 Pro Max" 
                      className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Retail Price (₦)</label>
                      <Input 
                        type="number" 
                        required 
                        value={newProduct.price} 
                        onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} 
                        placeholder="1,200,000" 
                        className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Offer Price (₦)</label>
                      <Input 
                        type="number" 
                        value={newProduct.discountPrice} 
                        onChange={e => setNewProduct({...newProduct, discountPrice: Number(e.target.value)})} 
                        placeholder="Sale price (optional)" 
                        className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Category</label>
                      <select 
                        className="w-full h-12 px-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 text-sm" 
                        value={newProduct.category} 
                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      >
                        <option>Phones</option>
                        <option>Laptops</option>
                        <option>Accessories</option>
                        <option>Tablets</option>
                        <option>Watches</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Condition</label>
                      <select 
                        className="w-full h-12 px-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 text-sm" 
                        value={newProduct.condition} 
                        onChange={e => setNewProduct({...newProduct, condition: e.target.value as any})}
                      >
                        <option>Brand New</option>
                        <option>UK Used</option>
                        <option>Refurbished</option>
                        <option>Pre-owned</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Current Stock</label>
                    <Input 
                      type="number" 
                      required 
                      value={newProduct.stock} 
                      onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} 
                      placeholder="Available quantity" 
                      className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Detailed Description</label>
                    <textarea 
                      className="w-full p-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 text-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/5 min-h-[120px] resize-none text-sm placeholder:text-zinc-400"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Specifications, warranty details, and unique selling points..."
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-1">Visual Gallery</h3>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {newProduct.images?.map((url, idx) => (
                        <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-zinc-100 bg-white shadow-sm">
                          <img src={url} alt="Product" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => removeImage(idx)}
                              className="p-2 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      {newProduct.images && newProduct.images.length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/30 flex flex-col items-center justify-center hover:bg-zinc-100/50 transition-all disabled:opacity-50 group hover:border-zinc-400"
                        >
                          {uploadingImage ? (
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
                          ) : (
                            <>
                              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                                <Plus className="w-4 h-4 text-zinc-900" />
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Add Image</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <p className="text-[10px] text-zinc-400 italic font-medium">Minimum 1 media asset required. First image is used as primary.</p>
                  </div>

                  <div className="space-y-6 pt-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-1 ml-1 leading-none">Specifications & Attributes</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Available Colors</label>
                        <Input 
                          value={Array.isArray(newProduct.colors) ? newProduct.colors.join(', ') : newProduct.colors} 
                          onChange={e => setNewProduct({...newProduct, colors: e.target.value as any})} 
                          placeholder="Titanium, Silver..." 
                          className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Capacity</label>
                        <Input 
                          value={Array.isArray(newProduct.storage) ? newProduct.storage.join(', ') : newProduct.storage} 
                          onChange={e => setNewProduct({...newProduct, storage: e.target.value as any})} 
                          placeholder="256GB, 1TB..." 
                          className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 mb-2 ml-1">Battery Condition (Used only)</label>
                      <Input 
                        value={newProduct.batteryHealth} 
                        onChange={e => setNewProduct({...newProduct, batteryHealth: e.target.value})} 
                        placeholder="e.g. 98% BH" 
                        className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                      />
                    </div>
                    
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          value={newProduct.specs?.display} 
                          onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs!, display: e.target.value}})} 
                          placeholder="Display Tech" 
                          className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                        />
                        <Input 
                          value={newProduct.specs?.chip} 
                          onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs!, chip: e.target.value}})} 
                          placeholder="Chipset" 
                          className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                        />
                        <Input 
                          value={newProduct.specs?.camera} 
                          onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs!, camera: e.target.value}})} 
                          placeholder="Camera System" 
                          className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                        />
                        <Input 
                          value={newProduct.specs?.os} 
                          onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs!, os: e.target.value}})} 
                          placeholder="OS" 
                          className="bg-zinc-50/50 border-zinc-200/50 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-8 border-t border-zinc-100">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)} className="rounded-2xl border-zinc-200 text-zinc-600 px-8">Discard</Button>
                <Button 
                  type="submit" 
                  disabled={isSaving || (newProduct.images?.length || 0) === 0} 
                  className="min-w-[150px] rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 px-8 disabled:bg-zinc-200"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  {isSaving ? 'Synchronizing...' : (editingProductId ? 'Update Item' : 'Publish Product')}
                </Button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white/70 backdrop-blur-2xl rounded-3xl shadow-sm border border-white/50 overflow-hidden"
          >
            <div className="p-5 border-b border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input 
                  className="pl-11 h-11 bg-zinc-50/50 border-zinc-200/50 focus:bg-white rounded-2xl text-sm" 
                  placeholder="Search inventory..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <select 
                  className="h-11 px-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/50 text-sm font-black text-zinc-600 focus:bg-white focus:outline-none w-full md:w-auto appearance-none pr-8 cursor-pointer hover:bg-zinc-100/50 transition-colors"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0\' stroke=\'%23a1a1aa\' stroke-width=\'2\'%3E%3Cpath d=\'m19 9-7 7-7-7\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                >
                  <option>All Categories</option>
                  <option>Phones</option>
                  <option>Laptops</option>
                  <option>Accessories</option>
                  <option>Watches</option>
                  <option>Tablets</option>
                </select>
                <Button 
                  variant="outline" 
                  className="h-11 rounded-2xl border-zinc-200 text-zinc-600 hover:bg-zinc-50 px-6 font-bold" 
                  onClick={fetchProducts}
                >
                  Refresh data
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] text-nowrap border-b border-zinc-100">
                    <th className="p-5">Product Master</th>
                    <th className="p-5 text-center">Category</th>
                    <th className="p-5">Market Value</th>
                    <th className="p-5 text-center">Unit Stock</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-zinc-200 mx-auto mb-4" />
                        <p className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing Cloud Database...</p>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100 text-zinc-300">
                          <Search className="w-8 h-8" />
                        </div>
                        <p className="text-zinc-900 font-bold text-lg">No matches found</p>
                        <p className="text-zinc-400 text-sm mt-1">Try refining your search terms or filters</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="group hover:bg-zinc-50/50 transition-colors">
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200/30 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                              {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-zinc-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-zinc-900 text-sm truncate max-w-[240px] tracking-tight">{product.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={cn(
                                  "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded shadow-sm",
                                  product.condition === 'Brand New' ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-600"
                                )}>
                                  {product.condition}
                                </span>
                                {product.discountPrice > 0 && (
                                  <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-100 text-red-600">On Sale</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-xl">
                            {product.category}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="space-y-0.5">
                            <p className="font-black text-zinc-900 text-sm">{formatCurrency(product.price)}</p>
                            {product.discountPrice > 0 && (
                              <p className="text-[10px] text-zinc-400 line-through font-medium">{formatCurrency(product.discountPrice)}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-5 text-center">
                          <motion.div 
                            initial={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                            className={cn(
                              "inline-flex items-center justify-center min-w-[3rem] h-10 px-3 rounded-2xl text-xs font-black shadow-sm",
                              product.stock > 10 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                              product.stock > 0 ? "bg-amber-50 text-amber-600 border border-amber-100" : 
                              "bg-red-50 text-red-600 border border-red-100"
                            )}>
                            {product.stock}
                          </motion.div>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(product)} className="p-3 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-2xl transition-all">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(product.id)}
                              className="p-3 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
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
