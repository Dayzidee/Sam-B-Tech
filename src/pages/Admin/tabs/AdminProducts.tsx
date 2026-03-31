import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';

export const AdminProducts = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: 'iPhone 15 Pro Max', price: 1200000, stock: 45, category: 'Phones', condition: 'Brand New' },
    { id: 2, name: 'MacBook Pro M3', price: 2500000, stock: 12, category: 'Laptops', condition: 'Brand New' },
    { id: 3, name: 'AirPods Pro Gen 2', price: 250000, stock: 100, category: 'Accessories', condition: 'Brand New' },
  ]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    quantity: '',
    category: 'Phones',
    condition: 'Brand New',
    colors: '',
    storage: '',
    batteryHealth: '',
    specs: {
      display: '',
      chip: '',
      camera: '',
      os: ''
    }
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate adding product
    const product = {
      id: products.length + 1,
      name: newProduct.name,
      price: Number(newProduct.price),
      stock: Number(newProduct.quantity),
      category: newProduct.category,
      condition: newProduct.condition,
    };
    setProducts([...products, product]);
    setIsAdding(false);
    // Reset form
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="font-headline font-black text-3xl">Products</h1>
        <Button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2">
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
            <h2 className="font-headline font-bold text-xl mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Product Name</label>
                    <Input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. iPhone 15 Pro" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Regular Price (₦)</label>
                      <Input type="number" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} placeholder="1200000" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Discount Price (₦)</label>
                      <Input type="number" value={newProduct.discountPrice} onChange={e => setNewProduct({...newProduct, discountPrice: e.target.value})} placeholder="1150000" />
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
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Condition</label>
                      <select className="w-full h-12 px-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20" value={newProduct.condition} onChange={e => setNewProduct({...newProduct, condition: e.target.value})}>
                        <option>Brand New</option>
                        <option>UK Used</option>
                        <option>Refurbished</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Available Quantity</label>
                    <Input type="number" required value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} placeholder="50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Description</label>
                    <textarea 
                      className="w-full p-4 rounded-xl border border-outline-variant bg-surface text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px]"
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Product description..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-sm uppercase tracking-widest text-secondary border-b border-outline-variant/30 pb-2">Variants & Specs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Colors (comma separated)</label>
                      <Input value={newProduct.colors} onChange={e => setNewProduct({...newProduct, colors: e.target.value})} placeholder="Titanium, Black, White" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Storage (comma separated)</label>
                      <Input value={newProduct.storage} onChange={e => setNewProduct({...newProduct, storage: e.target.value})} placeholder="128GB, 256GB, 512GB" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Battery Health (if used)</label>
                    <Input value={newProduct.batteryHealth} onChange={e => setNewProduct({...newProduct, batteryHealth: e.target.value})} placeholder="e.g. 95% - 100%" />
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary">Technical Specs</label>
                    <Input value={newProduct.specs.display} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, display: e.target.value}})} placeholder="Display (e.g. 6.1 Super Retina XDR)" />
                    <Input value={newProduct.specs.chip} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, chip: e.target.value}})} placeholder="Chip (e.g. A16 Bionic)" />
                    <Input value={newProduct.specs.camera} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, camera: e.target.value}})} placeholder="Camera (e.g. 48MP Main)" />
                    <Input value={newProduct.specs.os} onChange={e => setNewProduct({...newProduct, specs: {...newProduct.specs, os: e.target.value}})} placeholder="OS (e.g. iOS 17)" />
                  </div>

                  <div className="pt-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Product Images</label>
                    <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:bg-surface-container-low transition-colors cursor-pointer">
                      <ImageIcon className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <p className="text-sm font-bold text-primary">Click to upload images</p>
                      <p className="text-xs text-secondary mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-outline-variant/30">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit">Publish Product</Button>
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
            <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                <Input className="pl-10 h-10" placeholder="Search products..." />
              </div>
              <div className="flex gap-2">
                <select className="h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm font-bold text-secondary focus:outline-none">
                  <option>All Categories</option>
                  <option>Phones</option>
                  <option>Laptops</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-secondary text-xs uppercase tracking-widest">
                    <th className="p-4 font-bold">Product</th>
                    <th className="p-4 font-bold">Category</th>
                    <th className="p-4 font-bold">Price</th>
                    <th className="p-4 font-bold">Stock</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{product.name}</p>
                            <p className="text-xs text-secondary">{product.condition}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm">{product.category}</td>
                      <td className="p-4 font-bold text-sm">{formatCurrency(product.price)}</td>
                      <td className="p-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-bold",
                          product.stock > 20 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        )}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-secondary hover:text-primary hover:bg-primary-container/20 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
