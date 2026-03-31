import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Wrench, Upload, Calendar, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const RepairPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background pt-8 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-8 h-8 text-on-primary-fixed" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">Book a Repair Slot</h1>
          <p className="text-secondary text-lg">Describe your device issue and schedule a visit to our service center.</p>
        </div>

        {submitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface-container-low p-8 md:p-12 rounded-3xl text-center border border-outline-variant/10"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Booking Confirmed!</h2>
            <p className="text-secondary mb-8 max-w-md mx-auto">
              We've received your repair request. Our technicians will be ready for you at the scheduled time.
            </p>
            <Button onClick={() => setSubmitted(false)} variant="outline">Book Another Repair</Button>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl shadow-sm border border-outline-variant/10 space-y-8"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-outline-variant/10 pb-2">Device Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Device Type</label>
                  <select required className="w-full bg-surface border border-outline-variant/20 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                    <option value="">Select device type</option>
                    <option value="phone">Smartphone</option>
                    <option value="laptop">Laptop / MacBook</option>
                    <option value="tablet">Tablet / iPad</option>
                    <option value="watch">Smartwatch</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Brand & Model</label>
                  <input required type="text" placeholder="e.g. iPhone 13 Pro Max" className="w-full bg-surface border border-outline-variant/20 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Problem Description</label>
                <textarea required rows={4} placeholder="Please describe the issue you're facing..." className="w-full bg-surface border border-outline-variant/20 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-secondary">Image Reference (Optional)</label>
                <div className="border-2 border-dashed border-outline-variant/20 rounded-xl p-8 text-center hover:bg-surface-container-lowest transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-secondary mx-auto mb-3" />
                  <p className="text-sm font-bold mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-secondary">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-outline-variant/10 pb-2">Schedule Visit</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <input required type="date" className="w-full bg-surface border border-outline-variant/20 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Preferred Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                    <select required className="w-full bg-surface border border-outline-variant/20 rounded-lg pl-12 pr-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary">
                      <option value="">Select time slot</option>
                      <option value="morning">Morning (9AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 4PM)</option>
                      <option value="evening">Evening (4PM - 6PM)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b border-outline-variant/10 pb-2">Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Full Name</label>
                  <input required type="text" placeholder="John Doe" className="w-full bg-surface border border-outline-variant/20 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary">Phone Number</label>
                  <input required type="tel" placeholder="+234 800 000 0000" className="w-full bg-surface border border-outline-variant/20 rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full flex items-center justify-center gap-2">
              Confirm Booking <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.form>
        )}
      </div>
    </div>
  );
};
