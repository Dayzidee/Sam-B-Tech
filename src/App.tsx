/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, type RefObject } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';
import { HomePage } from '@/pages/Home/HomePage';
import { GadgetsPage } from '@/pages/Gadgets/GadgetsPage';
import { ProductDetailsPage } from '@/pages/ProductDetails/ProductDetailsPage';
import { SalesPage } from '@/pages/Sales/SalesPage';
import { TradeInPage } from '@/pages/TradeIn/TradeInPage';
import { SupportPage } from '@/pages/Support/SupportPage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import { FavouritesPage } from '@/pages/Favourites/FavouritesPage';
import { CheckoutPage } from '@/pages/Checkout/CheckoutPage';
import { RepairPage } from '@/pages/Repair/RepairPage';
import { BlogPage } from '@/pages/Blog/BlogPage';
import TrackOrderPage from '@/pages/Support/TrackOrderPage';
import WarrantyClaimsPage from '@/pages/Support/WarrantyClaimsPage';
import ReturnPolicyPage from '@/pages/Support/ReturnPolicyPage';
import LoginPage from '@/pages/Auth/LoginPage';
import SignupPage from '@/pages/Auth/SignupPage';
import { AdminDashboardPage } from '@/pages/Admin/AdminDashboardPage';
import { ProtectedRoute } from '@/components/shared/ProtectedRoute';
import { GlobalErrorBoundary } from '@/components/shared/GlobalErrorBoundary';
import { GlobalLoader } from '@/components/layout/GlobalLoader';
import { useAuth } from '@/hooks/useAuth';

const ScrollToTop = ({ scrollRef }: { scrollRef: RefObject<HTMLElement | null> }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [pathname, scrollRef]);

  return null;
};

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const { loading } = useAuth();

  return (
    <Router>
      <GlobalErrorBoundary>
        <GlobalLoader isLoading={loading} />
        <ScrollToTop scrollRef={mainRef} />
        <div className="h-full flex flex-col relative overflow-hidden">
          <Header />
          <main ref={mainRef} className="flex-grow overflow-y-auto pt-16">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/gadgets" element={<GadgetsPage />} />
              <Route path="/sales" element={<SalesPage />} />
              <Route path="/trade-in" element={<TradeInPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/repair" element={<RepairPage />} />
              <Route path="/blog/:id" element={<BlogPage />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/warranty-claims" element={<WarrantyClaimsPage />} />
              <Route path="/return-policy" element={<ReturnPolicyPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/favourites" 
                element={
                  <ProtectedRoute>
                    <FavouritesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/track-order" 
                element={
                  <ProtectedRoute>
                    <TrackOrderPage />
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Fallback for now */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <Footer />
            {/* Add padding for mobile bottom nav */}
            <div className="h-16 md:hidden" />
          </main>
          <BottomNav />
        </div>
      </GlobalErrorBoundary>
    </Router>
  );
}
