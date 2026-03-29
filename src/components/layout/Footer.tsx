import { Share2, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-16 max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          <div className="text-xl font-bold text-black dark:text-white">SAM-B TECH</div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
            The precision curator of high-end digital experiences and luxury tech gadgets in the heart of Ikorodu.
          </p>
        </div>
        
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-black dark:text-white mb-6">Customer Care</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><a className="text-zinc-500 hover:text-yellow-600 transition-all" href="#">Return Policy</a></li>
            <li><a className="text-zinc-500 hover:text-yellow-600 transition-all" href="#">Warranty Terms</a></li>
            <li><a className="text-zinc-500 hover:text-yellow-600 transition-all" href="#">Track Order</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-black dark:text-white mb-6">Our Store</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><a className="text-zinc-500 hover:text-yellow-600 transition-all" href="#">Women-Owned</a></li>
            <li><a className="text-zinc-500 hover:text-yellow-600 transition-all" href="#">Secure Ordering</a></li>
            <li><a className="text-zinc-500 hover:text-yellow-600 transition-all" href="#">Nationwide Delivery</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-black dark:text-white mb-6">Connect</h4>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary-container transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary-container transition-all">
              <Mail className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-6 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            © 2024 SAM-B TECH. 56 Obafemi Awolowo Rd, Ikorodu. Mon-Sat, Closes 6 PM.
          </p>
        </div>
      </div>
    </footer>
  );
};
