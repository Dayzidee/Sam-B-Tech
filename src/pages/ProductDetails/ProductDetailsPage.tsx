import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  BatteryCharging, 
  Truck, 
  Store, 
  ShoppingBag, 
  Award,
  Star,
  Heart,
  Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusModal } from '@/components/ui/StatusModal';
import { formatCurrency, cn } from '@/utils';
import { useCartStore } from '@/store/useCartStore';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { ProductService, DealService, ReviewService } from '@/backend/services/firestore.service';
import { Loader2 } from 'lucide-react';



export const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [storage, setStorage] = useState('128GB');
  const [color, setColor] = useState('Graphite');
  const [activeTab, setActiveTab] = useState('specs');
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'info' | 'error';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });
  const { addToCart } = useCartStore();
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, userName: '', comment: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        setIsLoading(true);
        
        // Try product first
        let data = await ProductService.getById(id);
        
        if (data && data.name) {
          const mappedProduct = {
            ...data,
            price: data.discountPrice ? data.discountPrice : data.price,
            oldPrice: data.discountPrice ? data.price : undefined,
            discount: data.discountPrice ? `-${Math.round(((data.price - data.discountPrice) / data.price) * 100)}%` : null,
            reviews: Math.floor(Math.random() * 50) + 10,
            rating: 4.8
          };
          setProduct(mappedProduct);
          setColor(data.colors?.[0] || 'Default');
          setStorage(data.storage?.[0] || 'Default');
        } else {
          // Fallback: try deals collection (self-contained deals)
          const dealData = await DealService.getById(id);
          if (dealData && dealData.productName) {
            const mappedDeal = {
              id: dealData.id,
              name: dealData.productName,
              price: dealData.dealPrice,
              oldPrice: dealData.originalPrice,
              discount: dealData.originalPrice ? `-${Math.round((1 - dealData.dealPrice / dealData.originalPrice) * 100)}%` : null,
              category: dealData.category || 'Tech',
              condition: dealData.condition || 'Brand New',
              images: dealData.images?.length ? dealData.images : (dealData.image ? [dealData.image] : []),
              colors: dealData.colors || [],
              storage: dealData.storage || [],
              specs: dealData.specs || {},
              description: dealData.description,
              stock: dealData.stock,
              reviews: Math.floor(Math.random() * 50) + 10,
              rating: 4.8
            };
            setProduct(mappedDeal);
            setColor(dealData.colors?.[0] || 'Default');
            setStorage(dealData.storage?.[0] || 'Default');
          } else {
            setProduct(null);
          }
        }
        
        // Fetch reviews
        try {
          const reviewsData = await ReviewService.getWhere('productId', '==', id);
          const approved = reviewsData.filter(r => r.status === 'approved');
          const sorted = approved.sort((a: any, b: any) => {
            const timeA = a.createdAt?.toMillis?.() || 0;
            const timeB = b.createdAt?.toMillis?.() || 0;
            return timeB - timeA;
          });
          setReviews(sorted);
        } catch (e) {
          console.error("Failed to fetch reviews", e);
        }

      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-secondary">Product not found</div>;



  return (
    <main className="pt-20 md:pt-24 pb-32 px-4 md:px-6 max-w-screen-2xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-[10px] md:text-sm text-secondary mb-6 md:mb-8 font-medium overflow-x-auto whitespace-nowrap no-scrollbar pb-2 md:pb-0">
        <Link className="hover:text-primary transition-colors" to="/">Home</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <Link className="hover:text-primary transition-colors" to="/gadgets">Gadgets</Link>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="hover:text-primary transition-colors cursor-pointer">{product.category}</span>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="hover:text-primary transition-colors cursor-pointer">{product.brand}</span>
        <ChevronRight className="w-3 h-3 flex-shrink-0" />
        <span className="text-on-surface font-semibold">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-20">
        {/* Left: Media Gallery */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Thumbnails */}
          <div className="flex md:flex-col order-2 md:order-1 gap-3 md:gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar">
            {product.images?.map((img: string, i: number) => (
              <div 
                key={i}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-surface-container-lowest p-1.5 md:p-2 rounded-lg cursor-pointer transition-all",
                  selectedImage === i ? "border-2 border-primary-container" : "border border-outline-variant/20 hover:border-primary-container"
                )}
              >
                <img className="w-full h-full object-contain" src={img} alt={`Thumbnail ${i}`} referrerPolicy="no-referrer" />
              </div>
            ))}
          </div>
          {/* Main Image */}
          <div className="flex-grow order-1 md:order-2 bg-surface-container-lowest rounded-2xl overflow-hidden relative group cursor-zoom-in aspect-square md:aspect-auto">
            <motion.img 
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full h-full object-contain p-4 md:p-8 group-hover:scale-110 transition-transform duration-500" 
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/300'} 
              alt={product.name}
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-secondary-container/80 backdrop-blur px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-on-secondary-fixed-variant">
              {product.condition || 'UK Used'}
            </div>
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:col-span-5 flex flex-col space-y-6 md:space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 md:gap-4">
                <span className="text-2xl md:text-3xl font-bold text-on-surface">{formatCurrency(product.price)}</span>
                {product.oldPrice && (
                  <span className="text-base md:text-lg text-secondary line-through">{formatCurrency(product.oldPrice)}</span>
                )}
                {product.discount && (
                  <Badge variant="sale" className="text-[10px] md:text-xs">{product.discount}</Badge>
                )}
              </div>
            </div>
            <button 
              onClick={() => {
                if (!product) return;
                const isProdFav = isFavorite(product.id);
                if (isProdFav) {
                  removeFavorite(product.id);
                } else {
                  addFavorite({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images?.[0] || product.image || '',
                    category: product.category || ''
                  });
                  // Optional: success modal
                  setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Added to Favourites',
                    message: `${product.name} has been added to your favourites.`
                  });
                }
              }}
              className="p-3 rounded-full bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-container-low transition-colors"
            >
              <Heart className={cn("w-6 h-6", product && isFavorite(product.id) ? "fill-red-500 text-red-500" : "text-secondary")} />
            </button>
            <button 
              onClick={async () => {
                const shareData = {
                  title: product.name,
                  text: `Check out ${product.name} on SAM-B Tech! ₦${product.price?.toLocaleString()}`,
                  url: window.location.href
                };
                if (navigator.share) {
                  try { await navigator.share(shareData); } catch {}
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  setStatusModal({
                    isOpen: true,
                    type: 'success',
                    title: 'Link Copied',
                    message: 'Product link has been copied to your clipboard!'
                  });
                }
              }}
              className="p-3 rounded-full bg-surface-container-lowest border border-outline-variant/20 hover:bg-surface-container-low transition-colors"
            >
              <Share2 className="w-6 h-6 text-secondary" />
            </button>
          </div>


          {product.storage && product.storage.length > 0 && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary">Storage Capacity / Size</h3>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {product.storage.map((cap: string) => (
                <button 
                  key={cap}
                  onClick={() => setStorage(cap)}
                  className={cn(
                    "px-4 md:px-6 py-2 rounded-lg border-2 font-bold text-xs md:text-sm transition-all",
                    storage === cap ? "border-primary-container" : "border-outline-variant/30 text-secondary hover:border-outline"
                  )}
                >
                  {cap}
                </button>
              ))}
            </div>
          </div>
          )}

          {/* Color */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3 md:space-y-4">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-secondary">Color: {color}</h3>
              <div className="flex gap-3 md:gap-4">
                {product.colors.map((c: string) => (
                  <button 
                    key={c}
                    onClick={() => setColor(c)}
                    style={{ backgroundColor: c.toLowerCase().replace(' ', '') }}
                    className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full border-4 transition-all hover:scale-110",
                      color === c ? "border-primary-container ring-1 ring-offset-2 ring-transparent" : "border-outline-variant/30",
                      "bg-zinc-200" // fallback
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Battery Health */}
          {product.batteryHealth && (
            <div className="bg-surface-container-low p-3 md:p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BatteryCharging className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                <div>
                  <p className="text-[9px] md:text-xs font-bold text-secondary uppercase">Battery Health</p>
                  <p className="text-xs md:text-sm font-bold">{product.batteryHealth} Maximum Capacity</p>
                </div>
              </div>
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-primary-container border-r-transparent rotate-45 flex items-center justify-center">
                <span className="text-[9px] md:text-[10px] font-black -rotate-45">{product.batteryHealth}</span>
              </div>
            </div>
          )}

          {/* Fulfillment */}
          <div className="space-y-4 p-4 md:p-6 rounded-2xl border border-outline-variant/20">
            <div className="flex items-center gap-3 md:gap-4">
              <Truck className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div className="flex-grow">
                <p className="text-xs md:text-sm font-bold">Nationwide Delivery</p>
                <p className="text-[10px] md:text-xs text-secondary">Enter zip code for estimated arrival</p>
              </div>
              <input className="w-16 md:w-20 bg-surface-container-low border-none rounded-lg text-xs md:text-sm font-bold px-2 md:px-3 py-1 focus:ring-2 focus:ring-primary-container" placeholder="10001" type="text"/>
            </div>
            <div className="pt-4 border-t border-outline-variant/10 flex items-center gap-3 md:gap-4">
              <Store className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <div>
                <p className="text-xs md:text-sm font-bold">Kerbside Pickup</p>
                <p className="text-[10px] md:text-xs text-secondary">Ready in 2 hours at Ikorodu Rd Office</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2 md:gap-3">
            <Button 
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.images?.[0] || 'https://via.placeholder.com/300',
                  category: product.category || 'Category'
                });
                setStatusModal({
                  isOpen: true,
                  type: 'success',
                  title: 'Added to Cart',
                  message: `${product.name} has been added to your cart.`
                });
              }}
              variant="secondary" 
              size="lg" 
              className="w-full flex items-center justify-center gap-2 py-3 md:py-4 text-sm md:text-base"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" /> Add to Cart
            </Button>
            <Button 
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  quantity: 1,
                  image: product.images?.[0] || 'https://via.placeholder.com/300',
                  category: product.category || 'Category'
                });
                navigate('/checkout');
              }}
              variant="primary" 
              size="lg" 
              className="w-full bg-tertiary hover:bg-tertiary/90 py-3 md:py-4 text-sm md:text-base"
            >
              Buy It Now
            </Button>
          </div>
        </div>
      </div>

      {/* Tabbed Content Section */}
      <div className="mt-16 md:mt-24">
        <div className="flex border-b border-outline-variant/20 overflow-x-auto no-scrollbar">
          {[
            { id: 'specs', label: 'Specifications' },
            { id: 'description', label: 'Description' },
            { id: 'reviews', label: `Reviews (${product.reviews})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 md:px-8 py-3 md:py-4 text-xs md:text-sm whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "text-on-surface font-bold border-b-2 border-primary-container"
                  : "text-secondary font-medium hover:text-on-surface"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Specs Tab */}
        {activeTab === 'specs' && (
          <div className="py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6">
              <h2 className="text-xl md:text-2xl font-bold">Technical Specs</h2>
              <div className="space-y-3 md:space-y-4">
                {[
                  { label: "Display", val: product.specs?.display || 'N/A' },
                  { label: "Chip", val: product.specs?.chip || 'N/A' },
                  { label: "Camera", val: product.specs?.camera || 'N/A' },
                  { label: "OS", val: product.specs?.os || 'N/A' }
                ].map((spec, i) => (
                  <div key={i} className="flex justify-between py-2 md:py-3 border-b border-outline-variant/10 text-xs md:text-sm">
                    <span className="text-secondary">{spec.label}</span>
                    <span className="font-bold text-right ml-4">{spec.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-surface-container-low rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col justify-center">
              <div className="text-primary-container mb-3 md:mb-4">
                <Award className="w-10 h-10 md:w-12 md:h-12 fill-primary-container" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">SAM-B Verified</h3>
              <p className="text-xs md:text-sm text-secondary leading-relaxed">Every device undergoes a 45-point inspection by our technical experts. We guarantee 100% genuine parts and verified battery health status for all UK Used items.</p>
            </div>
          </div>
        )}

        {/* Description Tab */}
        {activeTab === 'description' && (
          <div className="py-8 md:py-12 max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold mb-4">About this product</h2>
            {product.description ? (
              <div className="prose prose-sm text-secondary leading-relaxed space-y-4">
                {product.description.split('\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <p className="text-secondary text-sm">No description available for this product.</p>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="py-8 md:py-12 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            <div className="lg:col-span-1 border border-outline-variant/20 rounded-2xl p-6 md:p-8 h-fit">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setNewReview({ ...newReview, rating: star })}>
                    <Star className={cn("w-6 h-6 transition-colors", star <= newReview.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200")} />
                  </button>
                ))}
              </div>
              <input 
                className="w-full bg-surface-container-low border-transparent rounded-xl p-3 mb-3 text-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none"
                placeholder="Your Name" 
                value={newReview.userName}
                onChange={e => setNewReview({ ...newReview, userName: e.target.value })}
              />
              <textarea 
                className="w-full bg-surface-container-low border-transparent rounded-xl p-3 mb-4 text-sm min-h-[100px] focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none resize-none"
                placeholder="Write your experience..."
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
              />
              <Button 
                onClick={async () => {
                  if (!newReview.userName || !newReview.comment || !product) return;
                  setIsSubmittingReview(true);
                  try {
                    await ReviewService.create({
                      productId: product.id,
                      userName: newReview.userName,
                      rating: newReview.rating,
                      comment: newReview.comment,
                      status: 'approved'
                    });
                    setStatusModal({ isOpen: true, type: 'success', title: 'Review Submitted', message: 'Thank you for your feedback!' });
                    setNewReview({ rating: 5, userName: '', comment: '' });
                    
                    const reviewsData = await ReviewService.getWhere('productId', '==', product.id);
                    const approved = reviewsData.filter(r => r.status === 'approved');
                    setReviews(approved.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)));
                  } catch (e) {
                    setStatusModal({ isOpen: true, type: 'error', title: 'Error', message: 'Failed to submit review. Try again.' });
                  } finally {
                    setIsSubmittingReview(false);
                  }
                }}
                disabled={isSubmittingReview || !newReview.userName || !newReview.comment}
                className="w-full bg-tertiary hover:bg-tertiary/90 text-on-tertiary py-3"
              >
                {isSubmittingReview ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Submit Review'}
              </Button>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="border-b border-outline-variant/10 pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold">{review.userName}</span>
                    <span className="text-secondary text-xs">{review.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                  </div>
                  <div className="flex gap-0.5 mb-3">
                    {[1,2,3,4,5].map(star => (
                      <Star key={star} className={cn("w-3 h-3", star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-200")} />
                    ))}
                  </div>
                  <p className="text-sm text-secondary leading-relaxed">{review.comment}</p>
                </div>
              )) : (
                <div className="text-center py-12 bg-surface-container-low rounded-2xl h-full flex flex-col items-center justify-center">
                  <p className="text-secondary font-medium">No reviews yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <StatusModal 
        isOpen={statusModal.isOpen} 
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </main>
  );
};
