import { useState } from 'react';
import { Heart, ShoppingBag, ArrowRight, HeartOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { cn } from '@/utils';

interface FavouriteItem {
  id: string;
  name: string;
  specs: string;
  price: number;
  image: string;
  tag: string;
  tagClass: string;
}

export const FavouritesPage = () => {
  const [favourites, setFavourites] = useState<FavouriteItem[]>([
    {
      id: '1',
      name: "iPhone 15 Pro Max",
      specs: "256GB, Natural Titanium",
      price: 1099,
      tag: "UK Used",
      tagClass: "bg-secondary-container text-on-secondary-fixed-variant",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATGcyzMr-xVbk2isgiRFQMhYJnU-Lu7ES8_11UqGKKG6lvPppaxqDpL5RnwnP256DD59fD_nwstqDUKf9Ndo03j0knBJKjwxYFR2OuS0X5vmSt5dH8njl1bRTjf6TYDDgxJuO8CW6GAbY1D5FjCjBmtWRlHBvh2judwP0n7uvnCT1J2tRO98Nn7DkSC-xt24Cb-zppn7pWth7xz0N26fBcKHhuqLdKu8FvMD_dzN7YcMvJlwDXXnOMvP_xx84uPjgvKpbhmrFaQMU"
    },
    {
      id: '2',
      name: "MacBook Pro M3",
      specs: "14-inch, Space Black, 16GB RAM",
      price: 1599,
      tag: "Brand New",
      tagClass: "bg-green-100 text-green-800",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxuaLOtaeqld4rhFtQ8b4UtNi8DusRY7DyagEOZPtWTsYu-ju_j2BBHhg0SIYKa4fbBEBMOMLjPTrqCOn1tbvq3v8rftXSUTJNIIa95Z8iZ-h20Mb9DzL9_kee4wZAB5BJiwVyujjJW7h87fhuWdex_iAyY-Pu-9gn4pPpn72lSpHV8ixgJmCrwq_LVBAt9wMsynhv1Pd-GHoAYiDoSpXH-3j1oD98xEv3cGzMOAMH30qXnyDYw_PE5r8EbV-4rH_XNcNoUroYnnA"
    },
    {
      id: '3',
      name: "Apple Watch Ultra 2",
      specs: "49mm Titanium, Orange Alpine Loop",
      price: 649,
      tag: "UK Used",
      tagClass: "bg-secondary-container text-on-secondary-fixed-variant",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6fPY8mmNQw5y2fW6BBToVF66maZ9RGmGa3hEyRt-DJtXZuijKZD_Vg_aMuBXodWTXd4qCHrnqxOIvxV6RrZ2sLFlTVznJieUFvOB-d3uSxKQffDUPAGaPcsDpjTbbEdMbTJbJL8bAXAeGj2j904-K2y2kEMBMqPdvI8qxzWH-tjBYmeVoUgxAcAkzSrSW9zlE8fUwP0UJWwf2WXXpWQD_pQQ9e_XiqfCvR2nQ3K6bEOAmZAFICqWsd-V8kcudZDjRklTSHZrufS4"
    }
  ]);

  const removeFavourite = (id: string) => {
    setFavourites(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="bg-surface min-h-screen flex flex-col">
      <main className="flex-grow pt-20 md:pt-32 pb-32 px-4 md:px-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <header className="mb-8 md:mb-12 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-2"
          >
            My Favourites
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm md:text-lg text-secondary font-body max-w-2xl mx-auto md:mx-0 font-light"
          >
            Curate your tech collection. Review your most-wanted gadgets and bring them home with precision.
          </motion.p>
        </header>

        <AnimatePresence mode="wait">
          {favourites.length > 0 ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
            >
              {favourites.map((item) => (
                <motion.div 
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative bg-surface-container-lowest flex flex-col p-4 md:p-6 transition-all duration-500 hover:translate-y-[-4px] rounded-xl shadow-sm hover:shadow-md"
                >
                  <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                    <button 
                      onClick={() => removeFavourite(item.id)}
                      className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm text-tertiary hover:scale-110 transition-transform"
                    >
                      <Heart className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    </button>
                  </div>
                  
                  <div className="relative w-full aspect-square mb-4 md:mb-6 overflow-hidden bg-surface-container-low flex items-center justify-center rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="object-contain w-4/5 h-4/5 group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4">
                      <span className={cn("px-2 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs font-bold uppercase tracking-widest rounded-sm", item.tagClass)}>
                        {item.tag}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow">
                    <h3 className="text-lg md:text-xl font-bold font-headline mb-1">{item.name}</h3>
                    <p className="text-secondary font-body text-xs md:text-sm mb-4">{item.specs}</p>
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-container-low">
                      <span className="text-xl md:text-2xl font-black text-on-surface">${item.price.toLocaleString()}</span>
                      <Button className="bg-primary-container text-on-primary-fixed px-4 md:px-6 py-2 md:py-2.5 font-bold text-[10px] md:text-sm tracking-wide rounded-md hover:brightness-95 transition-all flex items-center gap-2">
                        <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                        Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 md:py-24 text-center px-4"
            >
              <div className="w-48 h-48 md:w-64 md:h-64 mb-6 md:mb-8 bg-surface-container flex items-center justify-center rounded-full overflow-hidden">
                <HeartOff className="w-24 h-24 md:w-32 md:h-32 text-outline-variant opacity-20" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-headline mb-3 md:mb-4">Your list is a blank canvas</h2>
              <p className="text-secondary font-body text-sm md:text-base max-w-sm mb-8 md:mb-10 leading-relaxed">
                It seems you haven't saved any masterpieces yet. Explore our curated tech gallery to find your next favorite gadget.
              </p>
              <Link 
                to="/gadgets"
                className="inline-flex items-center gap-2 md:gap-3 bg-black text-white px-8 md:px-10 py-3 md:py-4 font-bold tracking-tight text-base md:text-lg rounded-md hover:bg-zinc-800 transition-colors"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};
