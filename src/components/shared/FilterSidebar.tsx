import { Category } from '@/types';
import { cn } from '@/utils';

interface FilterSidebarProps {
  selectedCondition: 'ALL' | 'Brand New' | 'UK Used' | 'Refurbished' | 'Pre-owned';
  onConditionChange: (condition: 'ALL' | 'Brand New' | 'UK Used' | 'Refurbished' | 'Pre-owned') => void;
  selectedCategories: Category[];
  onCategoryToggle: (category: Category) => void;
}

export const FilterSidebar = ({
  selectedCondition,
  onConditionChange,
  selectedCategories,
  onCategoryToggle
}: FilterSidebarProps) => {
  const categories: Category[] = [
    'ALL',
    'Phones',
    'Laptops',
    'Tablets',
    'Watches',
    'Accessories'
  ];

  const brands = ['Apple', 'Samsung', 'Dell', 'HP'];

  return (
    <aside className="space-y-8">
      {/* Condition Toggle */}
      <div className="p-1.5 bg-zinc-100/50 rounded-2xl flex flex-wrap gap-1.5 border border-zinc-200/50">
        {(['ALL', 'Brand New', 'UK Used', 'Refurbished', 'Pre-owned'] as const).map((cond) => (
          <button 
            key={cond}
            onClick={() => onConditionChange(cond)}
            className={cn(
              "flex-1 min-w-[30%] py-2.5 px-3 rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap",
              selectedCondition === cond 
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" 
                : "text-zinc-500 hover:text-zinc-900 hover:bg-white/50"
            )}
          >
            {cond}
          </button>
        ))}
      </div>

      {/* Category */}
      <div>
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-4">Category</h3>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center group cursor-pointer">
              <input 
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => onCategoryToggle(cat)}
                className="w-3.5 h-3.5 rounded-sm border-outline-variant text-primary-container focus:ring-primary-container"
              />
              <span className="ml-2.5 text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-4">Price Range</h3>
        <input 
          type="range" 
          min="0"
          max="2500000"
          className="w-full h-1 bg-surface-container-high rounded-full appearance-none cursor-pointer accent-primary-container" 
        />
        <div className="flex justify-between mt-3">
          <span className="text-xs font-bold">₦0</span>
          <span className="text-xs font-bold">₦2.5M+</span>
        </div>
      </div>

      {/* Brand */}
      <div>
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-secondary mb-4">Popular Brands</h3>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <button 
              key={brand}
              className="py-1.5 px-2 border border-outline-variant/30 rounded text-[10px] font-bold hover:border-primary-container transition-all"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
