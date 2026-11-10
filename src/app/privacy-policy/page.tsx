"use client";

import Link from "next/link";
import { Shield, Lock, Eye, FileText, Database, UserCheck, Bell, Mail, Phone, MapPin, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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
            <Shield size={13} className="text-yellow-400" />
            Legal & Data Protection
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-4 tracking-tight leading-tight">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600">Policy</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Effective & Last Updated: <strong className="text-slate-200">{lastUpdated}</strong>
          </p>
          <p className="text-slate-300 text-base mt-4 leading-relaxed">
            At <strong>MHM Travels</strong> (Make Holidays Memorable), we are committed to safeguarding your privacy and protecting the confidentiality of your personal, travel, and financial information. This Privacy Policy details how we collect, use, disclose, and secure your personal data in accordance with applicable data protection regulations including the Information Technology Act, 2000 and the Digital Personal Data Protection Act (DPDP).
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="space-y-10">
          
          {/* Section 1 */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Database size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">1. Information We Collect</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              To provide personalized holiday packages, airline bookings, hotel reservations, and visa processing, we collect the following categories of information:
            </p>
            <ul className="space-y-2.5 text-sm text-slate-300 pl-4 list-disc">
              <li>
                <strong className="text-white">Personal Identification:</strong> Full legal name (as per passport), date of birth, gender, nationality, passport number, date of issue/expiry, and passport photo copies necessary for international travel ticketing and embassy visa submissions.
              </li>
              <li>
                <strong className="text-white">Contact Details:</strong> Email address, mobile telephone number, WhatsApp contact, billing address, and home/business address.
              </li>
              <li>
                <strong className="text-white">Travel Details & Preferences:</strong> Travel dates, flight itineraries, room preferences, dietary requirements, co-traveler/family details, and emergency contact details.
              </li>
              <li>
                <strong className="text-white">Payment & Billing Details:</strong> Transaction references, billing address, and payment method information. We utilize PCI-DSS certified third-party payment gateways; MHM Travels never stores complete credit/debit card numbers or CVV codes on our servers.
              </li>
              <li>
                <strong className="text-white">Technical & Usage Data:</strong> IP address, device type, operating system, browser type, and anonymous site engagement metrics to enhance your browsing experience.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Eye size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">2. How We Use Your Information</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              MHM Travels uses your personal information strictly for legitimate commercial and travel operational purposes, including:
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li>Facilitating flight ticket reservations, hotel check-ins, cruise bookings, and rail passes.</li>
              <li>Managing visa consultations, appointments, and documentation with foreign embassies, consulates, and authorized visa application centers (e.g. VFS Global).</li>
              <li>Issuing travel insurance policies, invoices, booking vouchers, and confirmation letters.</li>
              <li>Providing 24/7 client support, emergency travel assistance, and flight status updates.</li>
              <li>Complying with aviation security, customs, immigration, and international border control legal regulations.</li>
              <li>Sending customized promotional offers, travel alerts, and seasonal deals (which you can opt out of at any time).</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Lock size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">3. Data Sharing & Third Parties</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-white">We do not sell, rent, or trade your personal data to any marketing third parties.</strong> We only share necessary personal information with trusted service providers to complete your travel arrangements:
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li><strong className="text-white">Travel Suppliers:</strong> Airlines, hotel partners, ground transport operators, local tour guides, and cruise liners.</li>
              <li><strong className="text-white">Embassies & Consulates:</strong> Diplomatic missions, immigration authorities, and visa processing agencies for lawful visa issuance.</li>
              <li><strong className="text-white">Payment Processors:</strong> Licensed banks, payment gateways, and fraud prevention entities.</li>
              <li><strong className="text-white">Legal & Regulatory Authorities:</strong> Government bodies or law enforcement agencies when mandated by court orders or applicable statutory laws.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <FileText size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">4. Data Security & Storage</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              We employ strict industry-standard technical, administrative, and physical security measures to safeguard your information against unauthorized access, loss, misuse, or alteration:
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li>All web communication is encrypted using 256-bit Secure Sockets Layer (SSL/TLS) encryption.</li>
              <li>Access to client files and passport records is strictly restricted on a need-to-know basis to authorized travel consultants.</li>
              <li>Digital records are stored in secure, backed-up servers with enterprise firewalls.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <UserCheck size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">5. Your Privacy Rights</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              Subject to applicable laws and verification of identity, you have the right to:
            </p>
            <ul className="space-y-2 text-sm text-slate-300 pl-4 list-disc">
              <li>Request access to the personal data we hold about you.</li>
              <li>Request correction or updates to inaccurate or incomplete information.</li>
              <li>Request deletion of your personal data where it is no longer required for travel fulfillment, accounting, or legal compliance.</li>
              <li>Opt-out of receiving promotional email and SMS notifications at any time.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-white/10 bg-navy-900/60 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 font-bold shrink-0">
                <Bell size={20} />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">6. Updates to This Policy</h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              MHM Travels reserves the right to amend or update this Privacy Policy from time to time to reflect evolving regulatory frameworks or changes in our operational procedures. Any updates will be published on this page with an updated effective date. Continued use of our booking services constitutes acceptance of the revised terms.
            </p>
          </div>

          {/* Section 7: Contact */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Mail size={18} className="text-yellow-400" />
              Grievance & Privacy Queries
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              If you have any questions, feedback, or data privacy requests concerning this Privacy Policy, please contact our designated Data Grievance Officer:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Email</span>
                  <a href="mailto:info.mhmtravels@gmail.com" className="text-white text-sm font-semibold hover:text-yellow-400 transition-colors">
                    info.mhmtravels@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Phone</span>
                  <a href="tel:+918437770006" className="text-white text-sm font-semibold hover:text-yellow-400 transition-colors">
                    +91 84377 70006
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-400 block font-bold">Address</span>
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

