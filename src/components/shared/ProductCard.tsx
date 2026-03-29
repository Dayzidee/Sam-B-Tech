import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Product } from '@/types';
import { formatCurrency } from '@/utils';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  key?: string;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCartStore();

  return (
    <div className="group flex flex-col">
      <Link to={`/product/${product.id}`}>
        <motion.div 
          whileHover={{ y: -4 }}
          className="relative aspect-square mb-5 overflow-hidden bg-surface-container-lowest rounded-xl flex items-center justify-center p-8 transition-all hover:shadow-xl"
        >
          <img 
            className="object-contain w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-110" 
            src={product.image} 
            alt={product.name}
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.condition === 'UK Used' && <Badge variant="default">UK Used</Badge>}
            {product.condition === 'Brand New' && <Badge variant="new">New</Badge>}
            {product.isSale && <Badge variant="sale">Sale</Badge>}
          </div>

          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart();
            }}
            className="absolute bottom-4 right-4 bg-primary-container text-on-primary-fixed p-3 rounded-full opacity-0 translate-y-4 transition-all group-hover:opacity-100 group-hover:translate-y-0 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </motion.div>
      </Link>

      <div className="flex flex-col">
        <p className="text-[10px] font-extrabold text-secondary uppercase tracking-widest mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h2 className="text-base font-bold text-on-surface line-clamp-1 hover:text-primary transition-colors">{product.name}</h2>
        </Link>
        
        <div className="flex items-center gap-1 my-1">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-semibold">{product.rating}</span>
          <span className="text-xs text-secondary font-medium">({product.reviews})</span>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-black text-on-surface">{formatCurrency(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-secondary line-through">{formatCurrency(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </div>
  );
};
