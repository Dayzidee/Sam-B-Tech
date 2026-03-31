import React from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';

const ReturnPolicyPage = () => {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center mx-auto mb-6">
            <RefreshCcw className="w-8 h-8" />
          </div>
          <h1 className="font-headline font-black text-4xl md:text-5xl mb-4">Return Policy</h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto">We want you to be completely satisfied with your purchase. Read our return policy below.</p>
        </div>

        <div className="bg-surface-container-lowest p-8 md:p-12 rounded-3xl shadow-sm prose prose-slate max-w-none">
          <h2 className="font-headline font-bold text-2xl mb-4">7-Day Return Window</h2>
          <p className="text-secondary mb-8">
            You have 7 days from the date of delivery to initiate a return for eligible items. To be eligible for a return, your item must be unused, in the same condition that you received it, and in its original packaging with all accessories and manuals included.
          </p>

          <h2 className="font-headline font-bold text-2xl mb-4">Eligible Items for Return</h2>
          <ul className="list-disc pl-6 text-secondary mb-8 space-y-2">
            <li>Brand new devices that remain sealed in their original packaging.</li>
            <li>UK Used devices that are in the exact condition as received, with no new physical damage or software modifications.</li>
            <li>Accessories in their original, unopened packaging.</li>
          </ul>

          <h2 className="font-headline font-bold text-2xl mb-4">Non-Returnable Items</h2>
          <ul className="list-disc pl-6 text-secondary mb-8 space-y-2">
            <li>Items marked as "Final Sale" or "Clearance".</li>
            <li>Software, digital downloads, or gift cards.</li>
            <li>Items that have been damaged by the customer (e.g., dropped, liquid damage).</li>
            <li>Items missing original packaging or accessories.</li>
          </ul>

          <div className="bg-tertiary/10 p-6 rounded-xl border border-tertiary/20 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-tertiary shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-lg text-tertiary mb-2">Restocking Fee</h4>
              <p className="text-secondary text-sm">
                A 15% restocking fee may apply to returns of opened brand new devices or items that are not in their original condition. This fee will be deducted from your refund amount.
              </p>
            </div>
          </div>

          <h2 className="font-headline font-bold text-2xl mb-4">Refund Process</h2>
          <p className="text-secondary">
            Once we receive your returned item, our team will inspect it to ensure it meets our return criteria. We will notify you of the approval or rejection of your refund. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 5-10 business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicyPage;
