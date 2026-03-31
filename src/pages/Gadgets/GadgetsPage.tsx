import { useState, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, X, Search, Loader2 } from 'lucide-react';
import { FilterSidebar } from '@/components/shared/FilterSidebar';
import { ProductCard } from '@/components/shared/ProductCard';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import { ProductService } from '@/backend/services/firestore.service';
import { motion, AnimatePresence } from 'motion/react';
// Dynamic products fetched from Firebase

export const GadgetsPage = () => {
  const [condition, setCondition] = useState<'ALL' | 'Brand New' | 'UK Used' | 'Refurbished' | 'Pre-owned'>('ALL');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['ALL']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Latest Arrivals');

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const firestoreProducts = await ProductService.getAll();
        const mappedProducts = firestoreProducts.map(p => ({
          id: p.id || '',
          name: p.name,
          brand: p.category, // Defaulting to category if brand is missing
          price: p.price,
          oldPrice: p.discountPrice,
          rating: 4.8, // Mock as it's not in db yet
          reviews: Math.floor(Math.random() * 50) + 10,
          image: p.images?.[0] || 'https://via.placeholder.com/300',
          condition: (p.condition || 'Brand New') as 'Brand New' | 'UK Used' | 'Refurbished' | 'Pre-owned',
          category: p.category,
          isSale: !!p.discountPrice,
          createdAt: p.createdAt?.toDate?.() || new Date(p.createdAt || 0)
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryToggle = (cat: Category) => {
    if (cat === 'ALL') {
      setSelectedCategories(['ALL']);
      return;
    }
    
    setSelectedCategories(prev => {
      const withoutAll = prev.filter(c => c !== 'ALL');
      if (withoutAll.includes(cat)) {
        const newSelection = withoutAll.filter(c => c !== cat);
        return newSelection.length === 0 ? ['ALL'] : newSelection;
      }
      return [...withoutAll, cat];
    });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = condition === 'ALL' || p.condition === condition;
    const matchesCategory = selectedCategories.includes('ALL') || selectedCategories.length === 0 || selectedCategories.includes(p.category as Category);
    return matchesSearch && matchesCondition && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Popularity':
        return (b.reviews || 0) - (a.reviews || 0);
      case 'Latest Arrivals':
      default:
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt || 0);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
    }
  });

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
              <p className="text-secondary text-xs font-bold uppercase tracking-widest">Showing {sortedProducts.length} results</p>
            </div>
            
            <div className="flex items-center bg-zinc-50 border border-zinc-100 px-4 py-2.5 rounded-xl w-full sm:w-auto">
              <span className="text-[10px] font-black text-secondary mr-3 uppercase tracking-widest">Sort by</span>
              <div className="relative flex items-center flex-1 sm:flex-none">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-xs font-bold focus:ring-0 p-0 pr-8 cursor-pointer appearance-none w-full uppercase tracking-widest outline-none"
                >
                  <option value="Latest Arrivals">Latest Arrivals</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Popularity">Popularity</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-0 pointer-events-none text-zinc-400" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-12">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {sortedProducts.length === 0 && (
                <div className="col-span-full py-20 text-center text-secondary">
                  No products found matching your active filters.
                </div>
              )}
            </div>
          )}

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
