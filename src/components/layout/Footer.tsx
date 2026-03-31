import { Share2, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-zinc-100 border-t border-zinc-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-8 py-16 max-w-screen-2xl mx-auto">
        <div className="space-y-4">
          <div className="text-xl font-bold text-black">SAM-B TECH</div>
          <p className="text-zinc-500 text-sm leading-relaxed">
            The precision curator of high-end digital experiences and luxury tech gadgets in the heart of Ikorodu.
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <MapPin className="w-4 h-4" />
            <span>56 Obafemi Awolowo Rd, Ikorodu</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Phone className="w-4 h-4" />
            <span>+234 800-SAMB-TECH</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-black mb-6">Customer Care</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/support">Help Center</Link></li>
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/track-order">Track Order</Link></li>
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/repair">Device Repair</Link></li>
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/warranty-claims">Warranty Terms</Link></li>
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/return-policy">Return Policy</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-black mb-6">Shop & Explore</h4>
          <ul className="space-y-3 text-sm font-medium">
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/gadgets">All Gadgets</Link></li>
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/sales">Deals & Sales</Link></li>
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/trade-in">Trade-In Program</Link></li>
            <li><Link className="text-zinc-500 hover:text-yellow-600 transition-all" to="/admin">Admin Portal</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-widest text-black mb-6">Connect</h4>
          <div className="flex gap-4">
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary-container transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary-container transition-all">
              <Mail className="w-4 h-4" />
            </button>
          </div>
          <p className="mt-6 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            © 2026 SAM-B TECH. All rights reserved. Mon-Sat, Closes 6 PM.
          </p>
        </div>
      </div>
    </footer>
  );
};
