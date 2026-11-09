"use client";

import Link from "next/link";
import { Scale, FileCheck, AlertCircle, Compass, Shield, Users, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsAndConditionsPage() {
  const lastUpdated = "November 2026";

  return (
    <div className="min-h-screen pt-28 pb-20 relative bg-navy-950 text-slate-100">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/5 rounded-full blur-[100px]"></div>
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
            <Scale size={13} className="text-yellow-400" />
            Terms of Service
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
            Terms & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">Conditions</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Effective & Last Updated: <strong className="text-slate-200">{lastUpdated}</strong>
          </p>
          <p className="text-slate-300 text-base mt-4 leading-relaxed">
            Welcome to <strong>MHM Travels</strong> (Make Holidays Memorable). By accessing our website, booking our holiday packages, requesting visa guidance, or confirming travel reservations, you acknowledge and agree to be bound by the following Terms & Conditions. Please read them thoroughly before making any booking deposit.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-10">

          {/* Section 1: Agreement to Terms */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <FileCheck size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">1. Contractual Agreement</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              These Terms & Conditions constitute a legally binding agreement between you ("Traveler", "Client", or "User") and <strong>MHM Travels</strong> ("Company", "we", "us", or "our"). When you submit a booking, pay a token deposit, or request itinerary planning on behalf of yourself or co-travelers, you certify that you possess the legal authority to accept these conditions for all members in your travel party.
            </p>
          </div>

          {/* Section 2: Scope of Services & Role */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Compass size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">2. Scope of Services & Nature of Business</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              MHM Travels curates bespoke luxury tours, group excursions, flight reservations, luxury hotel stays, cruise bookings, and visa facilitation. We act as a tour operator and facilitator contracting with independent third-party suppliers (such as airlines, rail systems, hotels, coach operators, and local guides).
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              While we partner exclusively with verified 4-star and 5-star providers, each supplier maintains its own terms of carriage and property rules. All bookings are subject to the individual tariffs, conditions, and regulations of those third-party providers.
            </p>
          </div>

          {/* Section 3: Traveler Obligations & Passports */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Users size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">3. Traveler Responsibilities & Documentation</h2>
            </div>
            <ul className="space-y-2.5 text-sm text-slate-300 pl-4 list-disc">
              <li>
                <strong className="text-white">Passport Validity:</strong> It is the sole responsibility of the traveler to hold a valid passport with at least <strong>6 months of remaining validity</strong> from the date of return and at least 3 blank visa pages.
              </li>
              <li>
                <strong className="text-white">Accurate Information:</strong> Travelers must furnish legal names matching their official passport precisely. Any ticket reissuance or name corrections mandated by airlines due to client typographical errors will be at the traveler's expense.
              </li>
              <li>
                <strong className="text-white">Visa Approval:</strong> MHM Travels provides professional advisory, documentation compilation, and appointment booking support. However, <strong>visa granting or refusal is the sovereign discretion of foreign embassies and immigration authorities</strong>. MHM Travels does not guarantee visa approvals and cannot be held responsible for immigration delays or rejections.
              </li>
              <li>
                <strong className="text-white">Health & Customs Compliance:</strong> Travelers are responsible for complying with vaccination requirements, health declarations, customs regulations, and destination local laws.
              </li>
            </ul>
          </div>

          {/* Section 4: Pricing, Taxes & Exchange Rate */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Scale size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">4. Prices, Quotations & Currency Revisions</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              All package quotations are based on prevailing exchange rates, fuel tariffs, and hotel prices at the time of quotation.
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li>Quotations remain subject to change until confirmed with the receipt of the booking deposit.</li>
              <li>Government taxes, Goods & Services Tax (GST), and statutory Tax Collected at Source (TCS) on overseas tour packages under Section 206C(1G) of the Indian Income Tax Act will be billed additionally as mandated by law.</li>
              <li>In the event of extraordinary currency devaluation (greater than 2% fluctuation in INR against USD/EUR/GBP/AUD) prior to final payment settlement, MHM Travels reserves the right to adjust final invoiced amounts accordingly.</li>
            </ul>
          </div>

          {/* Section 5: Itinerary Amendments */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <AlertCircle size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">5. Itinerary Adjustments & Program Changes</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              While MHM Travels strives to adhere rigorously to the confirmed daily itinerary schedule, operational circumstances (such as adverse weather, road closures, flight timetable rescheduling, or unforeseen monument closures) may necessitate adjustments to the order of sightseeing.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              In such scenarios, our local tour coordinators will provide equivalent or alternative attractions of equal value. No refunds or price reductions will be granted for missed excursions resulting from flight delays or personal choices.
            </p>
          </div>

          {/* Section 6: Travel Insurance & Health */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Shield size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">6. Travel Insurance & Health Undertakings</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              MHM Travels strongly mandates that every traveler obtain a comprehensive international travel insurance policy covering medical emergencies, hospitalisation, trip cancellation, baggage loss, emergency medical evacuation, and adventure sports coverage.
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Travelers engaging in optional high-adventure activities (including scuba diving, bungy jumping, jet boating, or glacier treks) do so at their own voluntary risk.
            </p>
          </div>

          {/* Section 7: Limitation of Liability */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Scale size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">7. Limitation of Liability</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              MHM Travels and its directors, agents, and employees shall not be liable for:
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li>Any injury, death, property damage, baggage delay, or personal loss caused by any airline, coach operator, hotel, or other independent third party.</li>
              <li>Acts of God, natural catastrophes, war, terror acts, civil rebellion, epidemics, or government travel restrictions.</li>
              <li>Failure by the traveler to carry valid passports, visas, health certificates, or transit permits.</li>
              <li>Any incidental or consequential losses exceeding the total service commission fee paid to MHM Travels for the specific tour package booked.</li>
            </ul>
          </div>

          {/* Section 8: Governing Law & Jurisdiction */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Scale size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">8. Governing Law & Legal Jurisdiction</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              These Terms & Conditions and any disputes arising out of or related to our travel services shall be governed by and construed in accordance with the <strong>laws of the Republic of India</strong>. In the event of any claim, dispute, or legal proceeding, the parties irrevocably agree that the <strong>competent courts situated in Mohali / Chandigarh, Punjab</strong> shall have exclusive jurisdiction.
            </p>
          </div>

          {/* Section 9: Legal Contact */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-yellow-400" />
              Legal & Booking Inquiries
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              For any questions regarding these Terms & Conditions or assistance with custom travel contracts, please reach out to our legal and customer operations desk:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Email Legal Desk</span>
                  <a href="mailto:info.mhmtravels@gmail.com" className="text-white text-sm font-semibold hover:text-yellow-400 transition-colors">
                    info.mhmtravels@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Helpline</span>
                  <a href="tel:+918437770006" className="text-white text-sm font-semibold hover:text-yellow-400 transition-colors">
                    +91 84377 70006
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Head Office</span>
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
