import React from 'react';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

const WarrantyClaimsPage = () => {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl mb-4">Warranty Claims</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">We stand behind the quality of our products. Learn about our warranty coverage and how to file a claim.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-sm">
            <h3 className="font-bold text-xl mb-2">12-Month Warranty</h3>
            <p className="text-secondary text-sm">On all brand new devices purchased directly from Sam-B Tech.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-sm">
            <h3 className="font-bold text-xl mb-2">6-Month Warranty</h3>
            <p className="text-secondary text-sm">On all certified UK used devices and refurbished items.</p>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-2xl text-center shadow-sm">
            <h3 className="font-bold text-xl mb-2">3-Month Warranty</h3>
            <p className="text-secondary text-sm">On accessories and repaired devices.</p>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl shadow-sm">
          <h2 className="font-headline font-bold text-3xl mb-8">How to File a Claim</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-primary-container text-primary rounded-full flex items-center justify-center shrink-0 font-black text-xl">1</div>
              <div>
                <h4 className="font-bold text-xl mb-2">Gather Your Information</h4>
                <p className="text-secondary">You will need your original order number, the serial number or IMEI of the device, and a clear description of the issue.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-primary-container text-primary rounded-full flex items-center justify-center shrink-0 font-black text-xl">2</div>
              <div>
                <h4 className="font-bold text-xl mb-2">Contact Support</h4>
                <p className="text-secondary">Reach out to our support team via email or phone. Provide the gathered information and any relevant photos or videos of the issue.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-primary-container text-primary rounded-full flex items-center justify-center shrink-0 font-black text-xl">3</div>
              <div>
                <h4 className="font-bold text-xl mb-2">Assessment & Resolution</h4>
                <p className="text-secondary">Our technicians will assess the claim. If approved, we will provide instructions for returning the item for repair, replacement, or refund.</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-surface-container-highest rounded-xl border border-outline-variant">
            <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              What is NOT covered?
            </h4>
            <ul className="space-y-2 text-secondary">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-1 text-tertiary shrink-0" /> Accidental damage (drops, spills, liquid damage).</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-1 text-tertiary shrink-0" /> Normal wear and tear (scratches, dents, battery degradation over time).</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-1 text-tertiary shrink-0" /> Unauthorized modifications or repairs.</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 mt-1 text-tertiary shrink-0" /> Software issues caused by third-party apps or jailbreaking/rooting.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyClaimsPage;
