import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

const BLOG_POSTS: Record<string, any> = {
  "1": {
    category: "Pro Tips",
    title: "How to maintain your iPhone battery health",
    content: `
      <p>Your iPhone battery is designed to retain up to 80% of its original capacity at 500 complete charge cycles. But how you charge and use your device can significantly impact this lifespan.</p>
      <h3>1. Avoid Extreme Temperatures</h3>
      <p>Your device is designed to perform well in a wide range of ambient temperatures, with 16° to 22° C (62° to 72° F) as the ideal comfort zone. It’s especially important to avoid exposing your device to ambient temperatures higher than 35° C (95° F), which can permanently damage battery capacity.</p>
      <h3>2. Remove Certain Cases During Charging</h3>
      <p>Charging your device when it’s inside certain styles of cases may generate excess heat, which can affect battery capacity. If you notice that your device gets hot when you charge it, take it out of its case first.</p>
      <h3>3. Store It Half-Charged When Storing Long Term</h3>
      <p>If you want to store your device long term, two key factors will affect the overall health of your battery: the environmental temperature and the percentage of charge on the battery when it’s powered down for storage.</p>
    `,
    date: "May 12, 2024",
    readTime: "5 min read",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAthakVx9kq_GHcu8zFDUCqB70hZzWC_SMqMzRQipEVNE97nyOYoIE8LTOCHoTmeKaV2xWa5DXeqctgASU7EjLSchpw64JYYCRcVNrXpBW-HlWjOY1pSB2jCX8JzilWQoF-44j_ojA3dGKW3O8impL7BlVqswPhwnk4UYj5tT1rherzRjbUiw-1Yo7dWNLHPfpmW3yW-FW9cWklYynJ68jYVEwB1QtGxQbKBR_PVIkUjt8m4AA-dmXKY6fNOXLWVoQfxDWUK0w1LAk",
    author: "Bukola"
  },
  "2": {
    category: "Buying Guide",
    title: "Top Gadgets for 2024: The Essential List",
    content: `
      <p>From the Vision Pro to the latest ultra-thin laptops, these are the devices that will redefine how you work and play this year.</p>
      <p>2024 is shaping up to be a massive year for consumer technology. We are seeing leaps in AI integration, battery technology, and display fidelity across the board.</p>
      <h3>The Rise of Spatial Computing</h3>
      <p>With major players entering the spatial computing space, we expect to see a shift in how professionals interact with digital environments. It's no longer just about screens; it's about immersion.</p>
      <h3>AI-Powered Everything</h3>
      <p>From your smartphone camera to your laptop's processor, dedicated neural engines are becoming standard. This means faster on-device processing and smarter battery management.</p>
    `,
    date: "April 28, 2024",
    readTime: "8 min read",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC3-KfvSMvNEr3cqzEq5W97YGAzVpRwutitKbtwATlS4OKAgYPm7Gr040LGeC_Z906U_P6xJtkOz8O8758ZZ4XIceOI9kodufdYHPmPGTOD_1h6NhkIJLx_-AWzhoD6M0FySGnY5q7i3D94uUqdoyFHJ_HcRzedcYl2gDIOso-1Bvu8Ura55mxv2AJ1rL4NISx3rh_2RU-O-1rI0V0P0OpA89Ik_q198kQLFqqwx5EoG3411McEbbW0bjU7XYzCRBxnc7yP739Rw24",
    author: "Tech Team"
  },
  "3": {
    category: "Workspace",
    title: "Maximizing Productivity on your new MacBook",
    content: `
      <p>Unlock the hidden macOS features that will save you hours every week. A complete guide for tech-savvy professionals.</p>
      <h3>Mastering Spotlight</h3>
      <p>Spotlight is more than just a search bar. It's a calculator, a unit converter, and a quick launcher. Press Cmd + Space and start typing.</p>
      <h3>Hot Corners</h3>
      <p>Set up Hot Corners in System Settings to quickly access Mission Control, show your desktop, or put your display to sleep just by moving your mouse to a corner of the screen.</p>
      <h3>Spaces and Mission Control</h3>
      <p>Organize your open windows by project using Spaces. Swipe up with three fingers to see all your open windows and create new desktops for different workflows.</p>
    `,
    date: "April 15, 2024",
    readTime: "6 min read",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGl38kSFT_gyBmz8_554Tfi1anH_IQe83ao6Y2DVoGBM-dDugwfy7M5pXW4QigVbD02Oj25jbF1Shpc_7GmLe3jsTrZwbZnlMqI0hVCqrfXqxrtDWu_scuP-3cHD4Vs-epTAuqTcpFg4hndPaNYyiriBI49cwcUSzBSAwAissHonOrSM0ghPuYOgYFtoLNIeSEfvEw4U5u2jdF87LamXwlxVQrDsFi7TlxXUeTiKmCLGXDGr5Yr5jimbCAw3rB_mzdkmuVwpRfgRA",
    author: "Bukola"
  }
};

export const BlogPage = () => {
  const { id } = useParams();
  const post = id ? BLOG_POSTS[id] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link to="/" className="text-primary hover:underline flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-background pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 md:pt-12">
        <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <span className="inline-block px-3 py-1 bg-primary-container text-on-primary-fixed text-xs font-bold tracking-widest uppercase rounded-full">
            {post.category}
          </span>
          
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-sm text-secondary border-y border-outline-variant/10 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" /> {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" /> {post.readTime}
            </div>
            <div className="font-medium text-on-background">
              By {post.author}
            </div>
          </div>

          <div className="aspect-video rounded-2xl overflow-hidden my-8">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div 
            className="prose prose-zinc max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-secondary prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
      </div>
    </article>
  );
};
