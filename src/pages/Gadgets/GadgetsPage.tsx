import { useState } from 'react';
import { ChevronDown, SlidersHorizontal, X, Search } from 'lucide-react';
import { FilterSidebar } from '@/components/shared/FilterSidebar';
import { ProductCard } from '@/components/shared/ProductCard';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { motion, AnimatePresence } from 'motion/react';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max 256GB',
    brand: 'Apple',
    price: 1250000,
    oldPrice: 1400000,
    rating: 4.9,
    reviews: 42,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5j8UkmKkIYpVBQTfTdhdaRA0eWoH3Ir6YPmpdOeKqLIEzLhln8BHIboEfZtaINkV0O1N3J8X2MN-GvcwC6-cyH6bCh7wNaRcrwvG9bouHCid1ahhi-HFwZlObCEiqw4gQ7kF-UxofYsDOA8Tp7iYMi1PLoRsAA-eayFKi-wrHKCHhOeIA4qajLIx_fmjc8lucJJ1X3D-5P2wJ8IYlA2WfWBM6Z1dlP0laCg2tiOv2AM0Jdqam5wYeZ7NPCBOatCQPWhvpVhmy68s',
    condition: 'UK Used',
    isSale: true,
    category: 'Smartphones'
  },
  {
    id: '2',
    name: 'MacBook Air M2 13-inch',
    brand: 'Apple',
    price: 950000,
    rating: 5.0,
    reviews: 18,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC81-aDTX0JmKe6iIDFlgCtKhLj0X_kle6nyruah3bHXLIX6cK47COFFWJxq-wgFD4y08uE-bpPSja20cSz3sE2ByR2js-18svCrkmpkCQ8jTXlSvrXfufFluMyW0jN2ac1WXSiolnsZGtW0Q3vo5euSru4C0bJLw53-CdnolLneDY8xywR9ITwkNXzByznyPJDhc9icpKGiCyxt0Dc3KHY_MI9mv2Q-y2yOXtXZe5c3Fy1oaFGw2nm8KmDqMXgE9BqB7ebAItFVRM',
    condition: 'Brand New',
    category: 'Laptops & MacBooks'
  },
  {
    id: '3',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    price: 1100000,
    rating: 4.8,
    reviews: 31,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB30doA-Vx9AUOYAGC9D9hzz5wJGdhkrlY1MJADD-v6S0_KyVTUFU-H2R7QgGyjMNB-0QFx06uRYDmXtqEWekAIIO8DntpT509y_yjcQK9r9dPqLiemqNJ8AUopBzdQXdk2sBs6_4kDhbexoLisN4IbasgdYZyE-YPlQhDNor_vqGxG4A1bh1e7cjD7ERXhs0GB1HWa3zaELVeMbdMGCQIypf4W38ff40LoudluRizJ9QqoJ09OZO8-B-ggxRC8lHW-nBYoOEJmmzA',
    condition: 'UK Used',
    category: 'Smartphones'
  },
  {
    id: '4',
    name: 'iPad Pro 11-inch M2',
    brand: 'Apple',
    price: 650000,
    rating: 4.9,
    reviews: 27,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAps0_HN89vCEp62ak-GWEJYIp5GB42Fgk0AkAl0CeY1b2lIAxyUj3SXXq8LOMXi8NpbzyovkuQmKR9ox4uPQiw5eFIshzDq-AgWH3nmTJnKI_UPXlz5NZcqSMjmdDO6Fxh6SEuixhHQAwbCWJaV2d85JuVWQMDWvGSaj4UhJS9wRimWDe6JY3P-3SCdvtcgEcu_1m5MMOjjrvoDPBqBzE4oiY8EyRe78Nvzij7OjDrK5n_gYJakp6WHX3kqc1hWnM7FVq4Eict7jA',
    condition: 'Brand New',
    category: 'Tablets & iPads'
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5 ANC',
    brand: 'Sony',
    price: 320000,
    oldPrice: 380000,
    rating: 4.7,
    reviews: 89,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKR8vN-GEru-kRowKay28xgo1LCs0TH-VZLFVHCWZwo1xgtlpn07edJIoRChpO_QXIThKHNPZBf06yaa9UIEp3iV5uWfLDc3wTGsiyQ5Yw_Qvcoa7aNVvvJ9xiQSjhhRsB5fiOpZN0nA_fFpcnKuEzUHuFZpDs-p6EDFncm9ouORkq2IjzIDijqDjLEdNNBiXgujct2hxgKJ5YzIJnUOMVCZwPiCMAuNWMO1nMRLdGBTezBWDlX_S7T-0HbKRM8oxKv7a41FcUHH4',
    condition: 'UK Used',
    isSale: true,
    category: 'Accessories'
  }
];

export const GadgetsPage = () => {
  const [condition, setCondition] = useState<'Brand New' | 'UK Used'>('Brand New');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['Smartphones']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryToggle = (cat: Category) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="pt-16 md:pt-20 pb-32 max-w-screen-2xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-on-surface mb-2">Gadgets</h1>
        <p className="text-secondary text-xs md:text-sm max-w-2xl font-medium leading-tight mb-6">
          Discover our curated collection of high-end tech. From the latest UK-used iPhones to brand new MacBooks, we bring you precision-tested gadgets at unbeatable prices.
        </p>

        {/* Search Bar */}
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search gadgets (e.g. iPhone 15, MacBook...)"
            className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl py-3 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all outline-none shadow-sm h-11"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 h-10 px-4 rounded-xl border-zinc-200"
            onClick={() => setIsFilterOpen(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="font-bold">Filters</span>
          </Button>
          <p className="text-secondary text-[10px] font-black uppercase tracking-widest">
            {filteredProducts.length} Items Found
          </p>
        </div>

        {/* Sidebar Overlay for Mobile */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <div className={cn(
          "fixed inset-y-0 left-0 w-[300px] bg-white z-[101] p-6 transform transition-transform duration-300 md:relative md:inset-auto md:w-72 md:p-0 md:bg-transparent md:translate-x-0 md:z-0 flex flex-col",
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between mb-6 md:hidden flex-shrink-0">
            <h2 className="text-xl font-black tracking-tighter">Filters</h2>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 md:overflow-visible pr-2 md:pr-0">
            <FilterSidebar 
              selectedCondition={condition}
              onConditionChange={setCondition}
              selectedCategories={selectedCategories}
              onCategoryToggle={handleCategoryToggle}
            />
          </div>
        </div>

        <section className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-10 gap-4">
            <div className="hidden md:block">
              <p className="text-secondary text-xs font-bold uppercase tracking-widest">Showing {filteredProducts.length} results</p>
            </div>
            
            <div className="flex items-center bg-zinc-50 border border-zinc-100 px-4 py-2.5 rounded-xl w-full sm:w-auto">
              <span className="text-[10px] font-black text-secondary mr-3 uppercase tracking-widest">Sort by</span>
              <div className="relative flex items-center flex-1 sm:flex-none">
                <select className="bg-transparent border-none text-xs font-black focus:ring-0 p-0 pr-8 cursor-pointer appearance-none w-full uppercase tracking-tighter">
                  <option>Latest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Popularity</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-0 pointer-events-none text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 md:mt-20 flex justify-center">
            <Button variant="primary" size="lg" className="rounded-full group w-full sm:w-auto h-14 px-10">
              <span className="font-black uppercase tracking-widest text-sm">Load More Masterpieces</span>
              <ChevronDown className="ml-3 w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};
