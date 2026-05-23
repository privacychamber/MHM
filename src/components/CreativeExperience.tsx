"use client";

import { useEffect, useRef } from "react";
import { Compass, Sparkles, Send, CheckCircle2, Navigation, Compass as CompassIcon, ShieldAlert } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    icon: Compass,
    title: "1. Match Your Travel Vibe",
    description: "Search any country or choose from our theme tags. The satellite globe rotates dynamically to pinpoint your chosen destination instantly.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: Sparkles,
    title: "2. Tailored Bespoke Itinerary",
    description: "Our specialist planners curate customized city stops, elite five-star stays, high-end dining spots, and private guided activities tailored to your pace.",
    color: "from-yellow-400 to-amber-500",
  },
  {
    icon: Send,
    title: "3. Direct WhatsApp Concierge",
    description: "Skip long forms. Connect directly with our concierge team. We handle visa documentation, private flights, and local transfers seamlessly.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: CheckCircle2,
    title: "4. Unleash Unforgettable Memories",
    description: "Embark on your journey with 24/7 local support, dedicated emergency coordination, and premium personalized VIP airport services.",
    color: "from-purple-400 to-pink-500",
  },
];

const signatureExperiences = [
  {
    title: "Swiss Alpine Luxury",
    tag: "Mountain Retreat",
    price: "₹1,89,999",
    image: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?q=80&w=1000&auto=format&fit=crop",
    details: "Helicopter transfers, private chalets, and glacier skiing guided tours.",
  },
  {
    title: "Maldives Yacht Escape",
    tag: "Ocean Sanctuary",
    price: "₹1,49,999",
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=1000&auto=format&fit=crop",
    details: "Sunset cruises, overwater villa dining, and private coral reef diving.",
  },
  {
    title: "Dubai Desert Horizon",
    tag: "Royal Dune Stay",
    price: "₹89,999",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000&auto=format&fit=crop",
    details: "Royal tent stays, desert dune safaris, and fine dining under the stars.",
  },
];

export default function CreativeExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 1. Scroll-driven timeline animations
    const ctx = gsap.context(() => {
      // Animate progress line growth
      gsap.fromTo(
        progressBarRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top 25%",
            end: "bottom 80%",
            scrub: true,
          },
        }
      );

      // Animate timeline steps
      gsap.utils.toArray(".timeline-step").forEach((step: any, idx: number) => {
        gsap.fromTo(
          step,
          { opacity: 0, x: idx % 2 === 0 ? -60 : 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: step,
              start: "top 85%",
              end: "bottom 60%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate signature cards
      gsap.fromTo(
        ".signature-card",
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".signature-section",
            start: "top 75%",
            end: "bottom 40%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Parallax mouse movements for signature cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Smooth rotation tilt and glare placement
    gsap.to(card, {
      rotateY: x * 0.08,
      rotateX: -y * 0.08,
      transformPerspective: 800,
      ease: "power2.out",
      duration: 0.4,
    });

    const glare = card.querySelector(".card-glare") as HTMLDivElement;
    if (glare) {
      const gX = ((e.clientX - rect.left) / rect.width) * 100;
      const gY = ((e.clientY - rect.top) / rect.height) * 100;
      gsap.to(glare, {
        background: `radial-gradient(circle 120px at ${gX}% ${gY}%, rgba(250, 204, 21, 0.15), transparent)`,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = (idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;

    // Reset rotations
    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      ease: "power3.out",
      duration: 0.6,
    });

    const glare = card.querySelector(".card-glare") as HTMLDivElement;
    if (glare) {
      gsap.to(glare, {
        background: "transparent",
        duration: 0.4,
      });
    }
  };

  return (
    <div ref={containerRef} className="bg-navy-950 relative overflow-hidden py-24">
      {/* Dynamic light effects */}
      <div className="absolute top-[20%] left-[-15%] w-[60%] h-[40%] bg-blue-500/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-15%] w-[60%] h-[40%] bg-yellow-500/5 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-sm font-semibold tracking-wider mb-6 backdrop-blur-md uppercase shadow-[0_0_15px_rgba(250,204,21,0.1)]">
            <Navigation className="w-4 h-4 text-yellow-400 animate-pulse" />
            Seamless Travel Planning
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            How We Craft Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 glow-text">Signature Vacation</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            From coordinates search on our NASA satellite globe to checking into luxury villas, follow our high-concept travel layout.
          </p>
        </div>

        {/* 1. Scroll-Driven Interactive Timeline */}
        <div ref={triggerRef} className="relative max-w-4xl mx-auto mb-36">
          {/* Vertical Progress Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-white/10 transform -translate-x-1/2 z-0 hidden md:block">
            <div 
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-400 via-amber-500 to-indigo-500 origin-top transform scale-y-0 shadow-[0_0_15px_rgba(250,204,21,0.5)]"
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="timeline-step relative flex flex-col md:flex-row items-center gap-8 md:gap-16 z-10"
              >
                {/* Left/Right Text Alignment */}
                <div className={`w-full md:w-1/2 flex justify-center md:justify-end ${idx % 2 === 0 ? "md:order-1" : "md:order-3"}`}>
                  <div className={`glass-card p-8 rounded-3xl border border-white/10 max-w-md w-full relative transition-all duration-300 hover:border-white/20 hover:shadow-[0_0_30px_rgba(250,204,21,0.05)]`}>
                    <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${step.color} text-slate-950 font-bold mb-5 shadow-lg`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Center Node Bullet */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-navy-900 border-2 border-white/20 flex items-center justify-center z-20 md:order-2 hidden md:flex">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${step.color} shadow-lg`} />
                </div>

                {/* Empty Filler Half */}
                <div className={`w-full md:w-1/2 hidden md:block ${idx % 2 === 0 ? "md:order-3" : "md:order-1"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Curated Signature Experiences with Parallax & Glare */}
        <div className="signature-section pt-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h3 className="text-3xl font-extrabold text-white tracking-tight">
              MHM Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Curations</span>
            </h3>
            <p className="text-slate-400 text-sm mt-3">
              Hover over cards below to interact with the responsive 3D card tilt & glare physics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {signatureExperiences.map((exp, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                className="signature-card relative glass-card border border-white/10 rounded-3xl overflow-hidden cursor-pointer group select-none shadow-[0_10px_30px_rgba(0,0,0,0.5)] transform-gpu hover:border-yellow-400/30"
              >
                {/* Image Wrap */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent z-10" />
                  <img 
                    src={exp.image} 
                    alt={exp.title}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-yellow-400 tracking-wider uppercase">
                    {exp.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 relative z-20 bg-gradient-to-b from-navy-950/50 to-navy-950">
                  <h4 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-300 tracking-tight">
                    {exp.title}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 h-12 overflow-hidden">
                    {exp.details}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div>
                      <span className="text-xs text-slate-500 uppercase tracking-widest block">Starts From</span>
                      <span className="text-xl font-black text-white">{exp.price}</span>
                    </div>
                    
                    <a 
                      href={`https://wa.me/918437770006?text=Hi%20MHM%20Travels!%20I%20am%20interested%20in%20the%20${encodeURIComponent(exp.title)}%20package.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm tracking-tight transition-all active:scale-95 shadow-md flex items-center gap-1.5"
                    >
                      Enquire
                    </a>
                  </div>
                </div>

                {/* Glare/Highlight overlay effect */}
                <div className="card-glare absolute inset-0 pointer-events-none z-30 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
