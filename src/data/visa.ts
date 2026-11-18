export type VisaRequirementStatus = 
  | "Visa Required" 
  | "Visa-Free" 
  | "Visa on Arrival" 
  | "eVisa / ETA" 
  | "Other";

export type TravelPurpose = "Tourism" | "Business" | "Transit" | "Other";

export interface VisaRecord {
  id: string;
  destinationCountry: string;
  destinationCountryCode: string; // ISO 2-letter, e.g. "JP"
  passportNationality: string;
  passportCountryCode: string; // ISO 2-letter, e.g. "IN"
  travelPurpose: TravelPurpose;
  visaCategory: string; // e.g. "Short-Term Tourist eVisa"
  entryRequirementStatus: VisaRequirementStatus;
  validity?: string; // e.g. "90 Days from issuance"
  maxStay?: string; // e.g. "Up to 30 Days"
  entries?: "Single Entry" | "Double Entry" | "Multiple Entry";
  processingTime?: string; // e.g. "5 - 7 Working Days"
  fees?: string; // e.g. "₹3,500 (approx. $42 USD)"
  currency?: string; // e.g. "INR"
  applicationMethod?: "Online (eVisa)" | "Embassy / VFS Biometrics" | "On Arrival at Port of Entry" | "Visa Exempt / No Application";
  officialUrl?: string; // Official government/immigration URL
  documents: string[]; // Document checklist items
  procedure?: string[]; // Application steps
  restrictions?: string[]; // Important notes & restrictions
  notes?: string;
  verifiedDate?: string; // YYYY-MM-DD
  published: boolean;
}

export const POPULAR_NATIONALITIES = [
  { name: "India", code: "IN", flag: "🇮🇳" },
  { name: "United States", code: "US", flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
  { name: "Canada", code: "CA", flag: "🇨🇦" },
  { name: "Australia", code: "AU", flag: "🇦🇺" },
  { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
  { name: "Singapore", code: "SG", flag: "🇸🇬" },
  { name: "Germany", code: "DE", flag: "🇩🇪" },
  { name: "France", code: "FR", flag: "🇫🇷" }
];

export const defaultVisaRecords: VisaRecord[] = [
  {
    id: "visa-in-jp-tour",
    destinationCountry: "Japan",
    destinationCountryCode: "JP",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Short-Term Tourist eVisa (JAPAN eVISA)",
    entryRequirementStatus: "eVisa / ETA",
    validity: "90 Days from issue",
    maxStay: "Up to 15 or 30 Days",
    entries: "Single Entry",
    processingTime: "5 - 7 Working Days",
    fees: "₹500 visa fee + VFS processing charges",
    currency: "INR",
    applicationMethod: "Online (eVisa)",
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/visaonline.html",
    documents: [
      "Original Indian passport with at least 6 months validity & 2 blank pages",
      "Digital passport photograph (45mm x 35mm with plain white background, taken within 6 months)",
      "Confirmed roundtrip flight bookings to and from Japan",
      "Comprehensive day-by-day travel itinerary with accommodation contacts",
      "Bank account statements for the past 6 months (certified with official bank seal)",
      "Income Tax Returns (ITR-V) or Form 16 for the latest assessment year"
    ],
    procedure: [
      "Create an account on the official JAPAN eVISA portal",
      "Complete the online application form and upload clear scanned copies of documents",
      "Await preliminary screening notification from the Embassy / Consulate",
      "Pay required processing fees at designated VFS Global centre if prompted",
      "Receive digital 'Visa Issuance Notice' PDF with verifiable QR code to display upon check-in"
    ],
    restrictions: [
      "Electronic visas are strictly non-extendable and intended solely for tourism or leisure",
      "Must show digital Visa Issuance Notice on an internet-connected smartphone during boarding; PDF printouts alone are not accepted by airlines",
      "Travelers must possess minimum funds to sustain their stay without working"
    ],
    notes: "Japan has streamlined tourist visa processing for Indian leisure travelers through the online portal, drastically cutting processing time compared to traditional paper stamping.",
    verifiedDate: "2026-10-15",
    published: true
  },
  {
    id: "visa-in-ch-tour",
    destinationCountry: "Switzerland",
    destinationCountryCode: "CH",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Schengen Short-Stay Tourist Visa (Type C)",
    entryRequirementStatus: "Visa Required",
    validity: "Up to 90 Days within any 180-Day period",
    maxStay: "As per approved itinerary (max 90 days)",
    entries: "Single Entry",
    processingTime: "15 - 20 Calendar Days",
    fees: "€90 for Adults / €45 for Children (6-12 yrs) + VFS fee",
    currency: "EUR",
    applicationMethod: "Embassy / VFS Biometrics",
    officialUrl: "https://www.eda.admin.ch/eda/en/fdfa/entry-switzerland-residence/visa-requirements-application-form.html",
    documents: [
      "Original passport issued within the last 10 years, valid 3 months beyond departure with 2 blank pages",
      "Completed and signed Swiss Schengen visa application form",
      "Two recent biometric passport photographs adhering strictly to Schengen specifications",
      "Personal cover letter detailing travel dates, purpose, and detailed daily itinerary",
      "Confirmed roundtrip flight reservations and hotel booking vouchers across Switzerland/Schengen",
      "Employment letter / No Objection Certificate (NOC) from employer or business registration",
      "Personal bank statements for the last 6 months with original bank stamp",
      "Income Tax Returns (ITR) for the last 3 financial years",
      "Travel medical insurance covering the entire Schengen area with minimum coverage of €30,000 for emergency medical and repatriation"
    ],
    procedure: [
      "Complete the online application through the Swiss Federal Department of Foreign Affairs portal",
      "Schedule a mandatory biometric appointment at the nearest VFS Global centre",
      "Attend the appointment in person for biometric fingerprints, photograph, and document submission",
      "Track your application online and collect your passport with Schengen visa vignette sticker"
    ],
    restrictions: [
      "Apply at least 4 to 6 weeks before planned departure date due to high appointment demand",
      "Switzerland must be your main destination (longest stay duration) or the first point of entry into the Schengen zone"
    ],
    notes: "A Schengen visa issued by Switzerland allows unrestricted travel throughout all 29 member countries of the Schengen Area for the duration of the visa.",
    verifiedDate: "2026-10-20",
    published: true
  },
  {
    id: "visa-in-ae-tour",
    destinationCountry: "Dubai",
    destinationCountryCode: "AE",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Tourist E-Visa (30 Days / 60 Days)",
    entryRequirementStatus: "eVisa / ETA",
    validity: "60 Days from issuance",
    maxStay: "30 or 60 Consecutive Days",
    entries: "Single Entry",
    processingTime: "24 - 72 Hours (Express available in 12h)",
    fees: "₹6,800 (30 Days) / ₹13,500 (60 Days)",
    currency: "INR",
    applicationMethod: "Online (eVisa)",
    officialUrl: "https://gdrfad.gov.ae/en",
    documents: [
      "High-resolution color scan of the first and last bio-pages of the passport (min 6 months validity)",
      "Recent passport-style photograph with white background (JPEG format)",
      "Confirmed return or onward flight booking with Emirates, Flydubai, or other airline",
      "Hotel booking confirmation voucher in Dubai or address of host sponsor",
      "Valid US / UK / Schengen visa or Green Card copy (for instant 14-day Visa on Arrival eligibility at Dubai Airport)"
    ],
    procedure: [
      "Submit clear scanned copies of your passport bio-pages and photograph to MHM Travels",
      "MHM Travels submits the application through the official GDRFA / ICP immigration channel",
      "Immigration reviews and issues the electronic tourist entry permit",
      "Download your approved e-Visa PDF and present it at airline check-in and Dubai e-gates"
    ],
    restrictions: [
      "Passport must have a minimum of 6 months validity from the planned date of arrival",
      "Overstaying beyond the permitted visa duration incurs a penalty fine per day"
    ],
    notes: "Indian citizens holding a normal passport with a valid US visa, US Green Card, UK residence permit, or EU residence permit valid for at least 6 months can obtain a 14-day Visa on Arrival at all UAE ports.",
    verifiedDate: "2026-10-25",
    published: true
  },
  {
    id: "visa-in-mv-tour",
    destinationCountry: "Maldives",
    destinationCountryCode: "MV",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Free Tourist Visa on Arrival",
    entryRequirementStatus: "Visa on Arrival",
    validity: "30 Days upon arrival",
    maxStay: "Up to 30 Days (extendable up to 90 days locally)",
    entries: "Single Entry",
    processingTime: "Instant upon immigration arrival",
    fees: "Completely Free of charge",
    currency: "USD",
    applicationMethod: "On Arrival at Port of Entry",
    officialUrl: "https://immigration.gov.mv/tourist-visa/",
    documents: [
      "Machine-readable passport valid for at least 1 month from date of arrival",
      "Prepaid hotel/resort booking voucher for the duration of stay",
      "Confirmed return flight ticket departing Maldives within 30 days",
      "Proof of sufficient funds (USD 100 + USD 50 per day or confirmed resort package)",
      "Mandatory online IMUGA Traveler Declaration Form filled within 96 hours before flight arrival"
    ],
    procedure: [
      "Book your holiday resort, guesthouse, or liveaboard package",
      "Fill out the mandatory online IMUGA Traveler Declaration Form on the official Maldives Immigration portal within 96 hours before departure",
      "Save the generated QR code on your mobile device",
      "Present passport, return ticket, and resort confirmation to the immigration officer at Velana International Airport (Malé) to receive your 30-day visa stamp"
    ],
    restrictions: [
      "Employment is strictly prohibited under a tourist visa",
      "Visitors staying at local islands (guesthouses) must ensure their accommodation is formally registered with the Ministry of Tourism"
    ],
    notes: "The Maldives provides free tourist visas on arrival to travellers of all nationalities, provided basic entry criteria and resort bookings are met.",
    verifiedDate: "2026-11-01",
    published: true
  },
  {
    id: "visa-in-th-tour",
    destinationCountry: "Thailand",
    destinationCountryCode: "TH",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Visa Exemption Scheme for Indian Citizens",
    entryRequirementStatus: "Visa-Free",
    validity: "Immediate entry",
    maxStay: "Up to 60 Days per visit",
    entries: "Single Entry",
    processingTime: "Instant at Immigration Checkpoint",
    fees: "Free (No visa fees required)",
    currency: "THB",
    applicationMethod: "Visa Exempt / No Application",
    officialUrl: "https://www.thaiembassy.com/thailand-visa/thailand-visa-exemption",
    documents: [
      "Passport with at least 6 months validity from entry date and 2 blank pages",
      "Confirmed return or onward flight ticket departing Thailand within 60 days",
      "Proof of confirmed accommodation (hotel vouchers or host invitation)",
      "Proof of adequate funds (minimum 10,000 THB per person or 20,000 THB per family in cash or card equivalent)"
    ],
    procedure: [
      "Arrive at any international airport in Thailand (e.g. Suvarnabhumi BKK, Don Mueang DMK, Phuket HKT)",
      "Proceed directly to the standard passport control immigration counters",
      "Present passport and boarding pass to receive the 60-day visa exemption entry stamp",
      "Clear customs and begin your holiday"
    ],
    restrictions: [
      "Land border entries under visa exemption are limited to a maximum of 2 times per calendar year",
      "Visa exemption is solely for tourism purposes and cannot be converted into employment"
    ],
    notes: "The Royal Thai Government has granted bilateral visa-free access to Indian passport holders for stays up to 60 days, extendable for an additional 30 days at local Thai immigration offices.",
    verifiedDate: "2026-11-05",
    published: true
  },
  {
    id: "visa-in-sg-tour",
    destinationCountry: "Singapore",
    destinationCountryCode: "SG",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Singapore Entry Visa (Sub-class via Authorized Agents)",
    entryRequirementStatus: "eVisa / ETA",
    validity: "Up to 2 Years Multiple Entry",
    maxStay: "Up to 30 Days per entry",
    entries: "Multiple Entry",
    processingTime: "3 - 5 Working Days",
    fees: "SGD 30 + Authorized agent processing fee (approx. ₹2,800 total)",
    currency: "SGD",
    applicationMethod: "Online (eVisa)",
    officialUrl: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements",
    documents: [
      "Original Indian passport with at least 6 months validity",
      "Completed and signed Form 14A",
      "Two recent color photographs (35mm x 45mm, matte finish, semi-glossy, 80% face view, plain white background)",
      "Confirmed onward or return flight itinerary",
      "Covering letter from the applicant stating travel purpose and dates",
      "Mandatory SG Arrival Card (SGAC) with electronic health declaration completed online within 3 days prior to arrival"
    ],
    procedure: [
      "Submit Form 14A and supporting documents to an authorized Singapore visa agent (such as MHM Travels)",
      "Agent logs into the Singapore Immigration & Checkpoints Authority (ICA) SAVE system",
      "ICA processes and approves the electronic visa",
      "Receive the official electronic e-Visa copy (PDF with barcode) which must be printed on A4 paper",
      "Submit electronic SG Arrival Card (SGAC) 3 days prior to flying"
    ],
    restrictions: [
      "Singapore does not accept individual direct walk-in applications at the High Commission; applications must be routed through authorized visa agents",
      "Passports must have at least 6 months validity upon date of arrival in Singapore"
    ],
    notes: "Singapore frequently grants long-term multiple-entry visas (valid for up to 2 years) to Indian frequent travelers with strong documentation.",
    verifiedDate: "2026-10-18",
    published: true
  },
  {
    id: "visa-in-id-tour",
    destinationCountry: "Bali",
    destinationCountryCode: "ID",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Electronic Visa on Arrival (e-VOA) / VOA",
    entryRequirementStatus: "Visa on Arrival",
    validity: "90 Days from issuance",
    maxStay: "30 Days (Extendable once for 30 more days)",
    entries: "Single Entry",
    processingTime: "Instant online / Instant at Airport arrival",
    fees: "IDR 500,000 (approx. ₹2,700 / $35 USD)",
    currency: "IDR",
    applicationMethod: "On Arrival at Port of Entry",
    officialUrl: "https://molina.imigrasi.go.id/",
    documents: [
      "Passport valid for at least 6 months from entry date with blank pages",
      "Confirmed return or onward flight ticket",
      "Electronic Customs Declaration (e-CD) QR code completed online within 3 days prior to arrival",
      "Payment card or cash (IDR, USD, EUR, AUD) for on-arrival payment counter"
    ],
    procedure: [
      "Option A (Recommended): Apply online for e-VOA through the official Molina portal before flight, pay via credit card, and receive digital PDF",
      "Option B (On Arrival): Proceed to the 'Visa on Arrival' payment counter at Denpasar (DPS) Airport, pay IDR 500,000, and receive the sticker in your passport",
      "Pass through biometric immigration inspection desks",
      "Scan your customs declaration QR code at the customs checkpoint"
    ],
    restrictions: [
      "VOA is strictly limited to tourism and social visits; employment or commercial activities are unlawful",
      "Single entry only; leaving Indonesia immediately voids the visa"
    ],
    notes: "Applying online for e-VOA via the official Molina website enables travelers to use automated e-gates at Bali Ngurah Rai International Airport, bypassing all arrival queues.",
    verifiedDate: "2026-10-22",
    published: true
  },
  {
    id: "visa-in-nz-tour",
    destinationCountry: "New Zealand",
    destinationCountryCode: "NZ",
    passportNationality: "India",
    passportCountryCode: "IN",
    travelPurpose: "Tourism",
    visaCategory: "Visitor Visa (Subclass Online Application)",
    entryRequirementStatus: "Visa Required",
    validity: "Up to 9 Months",
    maxStay: "Up to 3 Months per stay",
    entries: "Multiple Entry",
    processingTime: "20 - 30 Working Days",
    fees: "NZD 341 (includes International Visitor Conservation and Tourism Levy - IVL)",
    currency: "NZD",
    applicationMethod: "Online (eVisa)",
    officialUrl: "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/visitor-visa",
    documents: [
      "Current valid passport (scan of bio pages)",
      "Digital passport photograph meeting Immigration New Zealand criteria",
      "Evidence of funds: bank statements showing at least NZD 1,000 per month of stay (or NZD 400/month if accommodation is prepaid)",
      "Comprehensive travel itinerary, tour bookings, and confirmed roundtrip flight reservations",
      "Proof of employment, leave approval letter, or business ownership documents in India",
      "Income tax returns for the past 2 years"
    ],
    procedure: [
      "Create a RealMe identity account on the official Immigration New Zealand website",
      "Fill out the online Visitor Visa application and upload all certified supporting documents",
      "Pay the application fee and IVL levy via credit card",
      "Receive electronic eVisa approval letter via email (no physical passport stamping needed)"
    ],
    restrictions: [
      "Apply at least 6 to 8 weeks before anticipated travel date during peak Southern Hemisphere summer (Nov-Feb)",
      "Visitors must not undertake paid employment while in New Zealand on a visitor visa"
    ],
    notes: "New Zealand visitor visas are issued electronically (eVisa). Travelers simply print their eVisa approval document and carry it alongside their passport.",
    verifiedDate: "2026-10-12",
    published: true
  },
  {
    id: "visa-us-jp-tour",
    destinationCountry: "Japan",
    destinationCountryCode: "JP",
    passportNationality: "United States",
    passportCountryCode: "US",
    travelPurpose: "Tourism",
    visaCategory: "Short-Term Stay Visa Exemption",
    entryRequirementStatus: "Visa-Free",
    validity: "Exempt",
    maxStay: "Up to 90 Days",
    entries: "Multiple Entry",
    processingTime: "Instant at port of entry",
    fees: "Free",
    currency: "USD",
    applicationMethod: "Visa Exempt / No Application",
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/short/novisa.html",
    documents: [
      "Valid US passport with validity covering the intended period of stay",
      "Return or onward international flight ticket departing Japan within 90 days",
      "Completed Visit Japan Web electronic customs and immigration QR code (optional but recommended)"
    ],
    procedure: [
      "Board your flight to Japan with your valid US passport",
      "Present passport to immigration upon arrival to receive a 90-day 'Temporary Visitor' landing permission stamp"
    ],
    restrictions: [
      "Strictly prohibited from engaging in any remunerative activity in Japan"
    ],
    notes: "US citizens traveling to Japan for tourism, business meetings, or visiting acquaintances do not require a visa for stays of 90 days or less.",
    verifiedDate: "2026-10-15",
    published: true
  },
  {
    id: "visa-us-ch-tour",
    destinationCountry: "Switzerland",
    destinationCountryCode: "CH",
    passportNationality: "United States",
    passportCountryCode: "US",
    travelPurpose: "Tourism",
    visaCategory: "Schengen 90/180-Day Visa Exemption",
    entryRequirementStatus: "Visa-Free",
    validity: "90 Days within any 180-Day window",
    maxStay: "Up to 90 Days",
    entries: "Multiple Entry",
    processingTime: "Instant at border entry",
    fees: "Free (ETIAS pre-screening fee will apply once launched)",
    currency: "USD",
    applicationMethod: "Visa Exempt / No Application",
    officialUrl: "https://travel-europe.europa.eu/etias_en",
    documents: [
      "Valid US passport with at least 3 months validity beyond intended date of departure from the Schengen area",
      "Passport issued within the previous 10 years",
      "Return flight ticket and proof of sufficient funds"
    ],
    procedure: [
      "Fly to Switzerland or any Schengen entry airport",
      "Present US passport to border police for passport entry stamping"
    ],
    restrictions: [
      "Stay must not exceed 90 days in any 180-day cumulative period across the entire Schengen Area"
    ],
    notes: "When the European Travel Information and Authorisation System (ETIAS) launches, US passport holders will register online for a small fee before departure.",
    verifiedDate: "2026-10-20",
    published: true
  },
  {
    id: "visa-gb-ae-tour",
    destinationCountry: "Dubai",
    destinationCountryCode: "AE",
    passportNationality: "United Kingdom",
    passportCountryCode: "GB",
    travelPurpose: "Tourism",
    visaCategory: "Free 30-Day Visa on Arrival",
    entryRequirementStatus: "Visa on Arrival",
    validity: "30 Days from date of arrival",
    maxStay: "30 Days (plus 10 days grace period)",
    entries: "Single Entry",
    processingTime: "Instant upon arrival",
    fees: "Free of charge",
    currency: "GBP",
    applicationMethod: "On Arrival at Port of Entry",
    officialUrl: "https://u.ae/en/information-and-services/visa-and-emirates-id/do-you-need-an-entry-permit-or-a-visa-to-enter-the-uae",
    documents: [
      "British Citizen passport valid for at least 6 months from date of entry",
      "Return or onward flight ticket"
    ],
    procedure: [
      "Fly to Dubai or any UAE international airport",
      "Proceed to passport control / smart gates to receive free 30-day visit stamp"
    ],
    restrictions: [
      "Applies only to full British Citizens; British Overseas Citizens or British Protected Persons require prior visa"
    ],
    notes: "UK passport holders receive a complimentary 30-day tourist entry stamp upon arrival at Dubai International Airport.",
    verifiedDate: "2026-10-25",
    published: true
  }
];

