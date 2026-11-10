"use client";

import Link from "next/link";
import { CreditCard, RefreshCw, AlertTriangle, CheckCircle, Clock, ShieldAlert, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function RefundAndPaymentPolicyPage() {
  const lastUpdated = "November 2026";

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-navy-950 text-slate-100">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-4xl">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-400 hover:text-yellow-400 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 inline-flex items-center gap-2">
            <CreditCard size={13} className="text-yellow-400" />
            Transparent Financial Terms
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
            Refund & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">Payment Policy</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Effective & Last Updated: <strong className="text-slate-200">{lastUpdated}</strong>
          </p>
          <p className="text-slate-300 text-base mt-4 leading-relaxed">
            At <strong>MHM Travels</strong> (Make Holidays Memorable), our goal is to deliver seamless luxury travel experiences with absolute financial clarity and transparency. This policy sets forth our official terms governing booking deposits, milestone payments, cancellation fees, non-refundable inclusions, and refund processing timelines.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-10">

          {/* Section 1: Payment Schedule */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <CreditCard size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">1. Payment Terms & Booking Milestones</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              To confirm reservations with airlines, luxury hotels, and local ground operators, payments are structured according to the following schedule:
            </p>
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
                <CheckCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-bold">Booking Deposit (Token Amount)</h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    A minimum deposit of <strong>25% to 30%</strong> of the total package value is required at the time of initial booking confirmation. For flight-inclusive packages, 100% of the airfare must be paid upfront to guarantee ticketing rates.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
                <CheckCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-bold">Second Milestone Payment</h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    An additional <strong>40%</strong> of the package cost is payable 30 to 45 days prior to the travel departure date (or prior to visa submission if required by foreign missions).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 flex items-start gap-3">
                <CheckCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white text-sm font-bold">Final Balance Payment</h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    The remaining balance (100% payment) must be cleared at least <strong>15 to 21 days</strong> prior to departure date. Vouchers, hotel confirmation codes, and final tickets are released only upon receipt of full settlement.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-2 italic">
              * Note: For peak season travels (Christmas, New Year, Diwali, Summer Vacations), 100% non-refundable advance payment may be required at the time of booking per hotel and airline mandates.
            </p>
          </div>

          {/* Section 2: Accepted Modes of Payment */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <RefreshCw size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">2. Accepted Payment Methods & Forex</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              We accept payments through secure, regulated financial channels:
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li><strong className="text-white">Bank Transfer:</strong> NEFT, RTGS, and IMPS directly to MHM Travels official corporate current accounts.</li>
              <li><strong className="text-white">UPI & QR Code:</strong> Google Pay, PhonePe, Paytm, and BHIM UPI handles.</li>
              <li><strong className="text-white">Credit & Debit Cards:</strong> Visa, MasterCard, RuPay, and American Express processed via encrypted payment gateways.</li>
              <li><strong className="text-white">Foreign Exchange / TCS:</strong> As per Reserve Bank of India (RBI) regulations and the Liberalised Remittance Scheme (LRS), Tax Collected at Source (TCS) will be levied on outbound foreign tour packages where applicable by statutory law.</li>
            </ul>
          </div>

          {/* Section 3: Cancellation Charges Table */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Clock size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">3. Cancellation Schedule & Deductions</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              In the event that you must cancel your booking, the following standard cancellation slabs will apply based on the date your written cancellation request is officially received by our team:
            </p>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs md:text-sm border border-white/10 rounded-xl overflow-hidden">
                <thead className="bg-slate-900 text-yellow-400 uppercase tracking-wider font-bold">
                  <tr>
                    <th className="p-3.5 border-b border-white/10">Cancellation Notice Period</th>
                    <th className="p-3.5 border-b border-white/10">Cancellation Charge</th>
                    <th className="p-3.5 border-b border-white/10">Eligible Refund</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-medium text-white">45 or more days prior to departure</td>
                    <td className="p-3.5 text-yellow-400 font-bold">10% of total tour package cost</td>
                    <td className="p-3.5 text-green-400 font-bold">90% of tour cost*</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-medium text-white">30 to 44 days prior to departure</td>
                    <td className="p-3.5 text-yellow-400 font-bold">25% of total tour package cost</td>
                    <td className="p-3.5 text-green-400 font-bold">75% of tour cost*</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-medium text-white">15 to 29 days prior to departure</td>
                    <td className="p-3.5 text-yellow-400 font-bold">50% of total tour package cost</td>
                    <td className="p-3.5 text-green-400 font-bold">50% of tour cost*</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-medium text-white">0 to 14 days prior / No-Show</td>
                    <td className="p-3.5 text-red-400 font-bold">100% of total tour package cost</td>
                    <td className="p-3.5 text-red-400 font-bold">0% (Non-refundable)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-400 text-xs mt-2 italic">
              * Note: Cancellation fees are calculated after deducting non-refundable supplier costs (e.g. non-refundable flights, visas, and peak hotel lock-ins) as outlined below.
            </p>
          </div>

          {/* Section 4: Non-Refundable Items */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-red-500/20 bg-red-950/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 font-bold shrink-0">
                <AlertTriangle size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">4. Non-Refundable Components</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Regardless of cancellation timing, the following items are strictly non-refundable once committed or processed:
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li>
                <strong className="text-white">Visa Fees:</strong> Embassy processing fees, VFS/consular charges, courier fees, and MHM administrative documentation charges are 100% non-refundable once filed, regardless of whether the visa is granted, delayed, or rejected by immigration authorities.
              </li>
              <li>
                <strong className="text-white">Airfare:</strong> Flight cancellations and date changes are governed strictly by the respective airline fare rules. Non-refundable promotional or group tickets cannot be refunded.
              </li>
              <li>
                <strong className="text-white">Peak Holiday Stays:</strong> Hotel reservations during high season, trade fairs, festivals, or New Year periods subject to 100% lock-in by hoteliers.
              </li>
              <li>
                <strong className="text-white">Permits & Special Attractions:</strong> Non-refundable tickets for specific attractions (e.g., helicopter flights, wildlife safari permits, luxury rail bookings, private boat charters).
              </li>
            </ul>
          </div>

          {/* Section 5: Refund Process Timeline */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <RefreshCw size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">5. Refund Processing Timelines</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              When a refund is approved by MHM Travels:
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li>Cancellation requests must be submitted in writing from the registered traveler email to <a href="mailto:info.mhmtravels@gmail.com" className="text-yellow-400 font-semibold hover:underline">info.mhmtravels@gmail.com</a>.</li>
              <li>Refund calculation and audit verification takes approximately <strong>5 to 7 business days</strong>.</li>
              <li>Once approved, the refund will be credited back to the <strong>original source of payment</strong> (same bank account or card) within <strong>7 to 14 business days</strong>, subject to intermediary banking clearing cycles.</li>
              <li>MHM Travels issues a formal Credit Note / Refund Statement specifying all deductions and net refund calculations.</li>
            </ul>
          </div>

          {/* Section 6: Force Majeure */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <ShieldAlert size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">6. Unforeseen Events & Force Majeure</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              In cases where travel cannot occur due to events beyond human control (such as acts of God, extreme weather, volcanic eruptions, armed conflicts, civil unrest, airline insolvencies, pandemic border closures, or government travel bans):
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li>MHM Travels will actively coordinate with airlines and hotel partners to secure date alterations, credit shells, or travel vouchers for future use wherever possible.</li>
              <li>Direct cash refunds will be subject solely to actual cash recoverability from our third-party airline and overseas ground suppliers, after deducting reasonable operational overheads.</li>
            </ul>
          </div>

          {/* Section 7: Billing Contact */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-yellow-400" />
              Billing & Refund Inquiries
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              For any clarification regarding your payment invoice, milestone receipts, or cancellation requests, reach out directly to our accounts team:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Email Accounts</span>
                  <a href="mailto:info.mhmtravels@gmail.com" className="text-white text-sm font-semibold hover:text-yellow-400 transition-colors">
                    info.mhmtravels@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Billing Helpline</span>
                  <a href="tel:+918437770006" className="text-white text-sm font-semibold hover:text-yellow-400 transition-colors">
                    +91 84377 70006
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Office</span>
                  <p className="text-white text-sm font-semibold">Mohali, Punjab, India</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

