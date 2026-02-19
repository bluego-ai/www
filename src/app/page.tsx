"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import RotatingText from "@/components/RotatingText";

interface Message {
  role: "user" | "assistant";
  text: string;
}

type Category = "sales" | "support" | "scheduling" | "operations";

const categories: { key: Category; label: string; headline: string; icon: string }[] = [
  { key: "sales", label: "Sales", headline: "Sales & Marketing Team", icon: "💬" },
  { key: "support", label: "Support", headline: "Customer Support Team", icon: "🛡" },
  { key: "scheduling", label: "Scheduling", headline: "Scheduling Assistant", icon: "📅" },
  { key: "operations", label: "Operations", headline: "Operations Manager", icon: "⚙️" },
];

const conversations: Record<Category, Message[]> = {
  sales: [
    { role: "user", text: "Hey Theodore, any new leads come in today?" },
    {
      role: "assistant",
      text: `Yes! 3 new qualified leads today:

🔥 **Mike Chen** — pool & outdoor kitchen remodel, $45K budget
🔥 **Sarah Walsh** — full backyard renovation, requesting quote
🔥 **DreamScape Builders** — wants to discuss partnership

Mike is the hottest — he filled out the form 20 min ago and has a project start date of March 1.`,
    },
    { role: "user", text: "Nice. Send Mike a follow-up and get him on a call this week" },
    {
      role: "assistant",
      text: "Done ✅ Sent Mike a personalized follow-up email with your availability. He's got slots for Wednesday 10am or Thursday 2pm. I'll confirm as soon as he picks one.",
    },
  ],
  support: [
    { role: "user", text: "Theodore, did we get any complaints today?" },
    {
      role: "assistant",
      text: `One issue flagged:

⚠️ **Janet Reeves** — upset about delayed tile delivery for her bathroom remodel. Shipment was supposed to arrive Monday, still hasn't shown.

I already contacted the supplier — it's arriving tomorrow by noon. Want me to reach out to Janet?`,
    },
    { role: "user", text: "Yeah, apologize and offer a small discount for the trouble" },
    {
      role: "assistant",
      text: "Done ✅ Sent Janet a personal apology with a 10% discount on her next service. Also confirmed the delivery for tomorrow with a tracking link. She replied \"Thank you, I appreciate it!\"",
    },
  ],
  scheduling: [
    { role: "user", text: "Theodore, I need to set up site visits for this week" },
    {
      role: "assistant",
      text: `Here's what I've got queued up:

📅 **Jamil property** — needs site visit before permit filing
📅 **Setoudeh** — pool dimensions need measuring
📅 **Arora** — final walkthrough before project close

I can schedule all three. Want me to cluster them by location to save drive time?`,
    },
    { role: "user", text: "Yes, do that. Morning slots preferred" },
    {
      role: "assistant",
      text: "Done ✅ All three booked:\n\n• Tue 9:00 AM — Arora (Scottsdale)\n• Tue 10:30 AM — Setoudeh (Scottsdale)\n• Tue 1:00 PM — Jamil (Mesa)\n\nCalendar invites sent to everyone. Driving directions queued for Tuesday morning.",
    },
  ],
  operations: [
    { role: "user", text: "Theodore, give me a report on today's operations" },
    {
      role: "assistant",
      text: `**BOTV Operations Report – Feb 14, 2026**

🔥 **Sales (Big Day!)**
• 2 new paid clients signed
• Setoudeh (pool + spa remodel)
• Sooy (decking, pergola, BBQ)

✅ **Loops Closed**
• Leeming aerators — answered
• Viedma showerhead — arrived
• Jamil site visit scheduled Feb 17
• Arora car charger — APPROVED by city

📋 **Crew Status**
• 23 of 25 crews active today
• 2 crews on weather hold
• All jobs on schedule ✓`,
    },
    { role: "user", text: "Nice. Schedule a call with Setoudeh for Thursday at 2pm" },
    {
      role: "assistant",
      text: "Done ✅ Setoudeh confirmed for Thursday Feb 19 @ 2:00 PM. Calendar invite sent to both parties.",
    },
  ],
};

/* ───── Scroll reveal hook ───── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".section-reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ───── Sticky nav hook ───── */
function useStickyNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return scrolled;
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-slate-800 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 items-center">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

function formatMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <span key={i} className="font-semibold text-blue-400">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
}

function AnimatedChat({
  activeCategory,
  onConversationEnd,
}: {
  activeCategory: Category;
  onConversationEnd: () => void;
}) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingRole, setTypingRole] = useState<"user" | "assistant">("user");
  const [currentText, setCurrentText] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function sleep(ms: number) {
      return new Promise((r) => setTimeout(r, ms));
    }

    async function typeMessage(msg: Message) {
      if (cancelled) return;
      setTypingRole(msg.role);
      setIsTyping(true);

      const typingDelay = msg.role === "assistant" ? 2000 : 1200;
      await sleep(typingDelay);
      if (cancelled) return;

      setIsTyping(false);

      if (msg.role === "user") {
        for (let i = 0; i <= msg.text.length; i++) {
          if (cancelled) return;
          setCurrentText(msg.text.slice(0, i));
          await sleep(35);
        }
        await sleep(300);
        setCurrentText("");
        setVisibleMessages((prev) => [...prev, msg]);
      } else {
        const lines = msg.text.split("\n");
        let accumulated = "";
        for (let i = 0; i < lines.length; i++) {
          if (cancelled) return;
          accumulated += (i > 0 ? "\n" : "") + lines[i];
          setCurrentText(accumulated);
          await sleep(100);
        }
        await sleep(400);
        setCurrentText("");
        setVisibleMessages((prev) => [...prev, msg]);
      }

      await sleep(1500);
    }

    async function runConversation() {
      setVisibleMessages([]);
      setCurrentText("");
      setIsTyping(false);
      cycleRef.current++;
      await sleep(800);

      const msgs = conversations[activeCategory];
      for (const msg of msgs) {
        if (cancelled) return;
        await typeMessage(msg);
      }

      if (!cancelled) {
        await sleep(3000);
        if (!cancelled) {
          onConversationEnd();
        }
      }
    }

    runConversation();
    return () => {
      cancelled = true;
    };
  }, [activeCategory, onConversationEnd]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, currentText, isTyping]);

  return (
    <div
      ref={chatRef}
      className="bg-black/90 px-3 py-3 space-y-2.5 h-[340px] md:h-[420px] overflow-y-auto scrollbar-hide"
    >
      {visibleMessages.map((msg, i) => (
        <div
          key={`${cycleRef.current}-${i}`}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
        >
          <div
            className={`text-[13px] rounded-2xl px-4 py-2.5 max-w-[88%] leading-relaxed whitespace-pre-line ${
              msg.role === "user"
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-slate-800 text-slate-100 rounded-bl-md"
            }`}
          >
            {formatMessage(msg.text)}
          </div>
        </div>
      ))}

      {currentText && !isTyping && (
        <div
          className={`flex ${typingRole === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
        >
          <div
            className={`text-[13px] rounded-2xl px-4 py-2.5 max-w-[88%] leading-relaxed whitespace-pre-line ${
              typingRole === "user"
                ? "bg-blue-500 text-white rounded-br-md"
                : "bg-slate-800 text-slate-100 rounded-bl-md"
            }`}
          >
            {formatMessage(currentText)}
            <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse align-middle" />
          </div>
        </div>
      )}

      {isTyping && <TypingIndicator />}
    </div>
  );
}

function PhoneMockup({
  activeCategory,
  onConversationEnd,
}: {
  activeCategory: Category;
  onConversationEnd: () => void;
}) {
  return (
    <div className="relative mx-auto w-[260px] md:w-[340px] phone-reflection">
      {/* Gradient border frame */}
      <div className="rounded-[3rem] p-[2px] bg-gradient-to-b from-slate-500/50 via-slate-700/30 to-slate-500/50 shadow-2xl shadow-blue-500/10">
        <div className="rounded-[2.85rem] bg-black overflow-hidden">
          <div className="bg-black px-6 pt-2 pb-1 flex justify-center">
            <div className="w-28 h-6 bg-black rounded-full border border-slate-800/50" />
          </div>

          <div className="bg-slate-900/95 backdrop-blur px-4 py-2.5 flex items-center gap-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold">
              🦬
            </div>
            <div>
              <div className="text-[13px] font-semibold text-white">Theodore</div>
              <div className="text-[10px] text-green-400">Online</div>
            </div>
          </div>

          <AnimatedChat
            activeCategory={activeCategory}
            onConversationEnd={onConversationEnd}
          />

          <div className="bg-black/90 px-3 py-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-800 rounded-full px-4 py-2 text-[12px] text-slate-500">
                Message Theodore...
              </div>
              <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-black py-2 flex justify-center">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryTabs({
  active,
  onSelect,
}: {
  active: Category;
  onSelect: (c: Category) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector(`[data-active="true"]`) as HTMLElement;
    if (activeBtn) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, []);

  useLayoutEffect(() => {
    updateIndicator();
  }, [active, updateIndicator]);

  useEffect(() => {
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [updateIndicator]);

  return (
    <div className="flex justify-center mt-6">
      <div
        ref={containerRef}
        className="relative inline-flex gap-1 p-1 rounded-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50"
      >
        {/* Sliding indicator */}
        <div
          className="absolute top-1 bottom-1 rounded-xl bg-gradient-to-r from-blue-500/90 to-blue-600/90 shadow-lg shadow-blue-500/25 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: indicator.left, width: indicator.width }}
        />
        {categories.map((cat) => (
          <button
            key={cat.key}
            data-active={active === cat.key ? "true" : "false"}
            onClick={() => onSelect(cat.key)}
            className={`relative z-10 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors duration-200 flex items-center gap-1.5 ${
              active === cat.key
                ? "text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <span className="hidden sm:inline">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("sales");
  const scrolled = useStickyNav();
  useScrollReveal();

  const handleConversationEnd = useCallback(() => {
    setActiveCategory((prev) => {
      const idx = categories.findIndex((c) => c.key === prev);
      return categories[(idx + 1) % categories.length].key;
    });
  }, []);

  const handleTabSelect = useCallback((cat: Category) => {
    setActiveCategory(cat);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden noise-overlay">
      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 nav-glass ${scrolled ? "scrolled" : ""}`}>
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <div className="text-2xl font-bold tracking-tight">
            <span className="text-blue-400">blue</span>go
            <span className="text-blue-400">.ai</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="#contact"
              className="rounded-full bg-blue-500 hover:bg-blue-400 px-5 py-2 text-sm font-semibold transition-colors shadow-lg shadow-blue-500/20"
            >
              Get Started
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-full border border-slate-600 hover:border-slate-400 px-5 py-2 text-sm font-semibold transition-colors hidden sm:inline-block"
            >
              How It Works
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-20 md:pt-24 pb-2 text-center z-10">
        {/* Aurora background */}
        <div className="absolute inset-0 -top-40 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] top-0 left-1/4 bg-blue-500/8 rounded-full blur-[100px] animate-aurora" />
          <div className="absolute w-[500px] h-[500px] top-10 right-1/4 bg-indigo-500/8 rounded-full blur-[100px] animate-aurora2" />
          <div className="absolute w-[400px] h-[400px] top-20 left-1/2 -translate-x-1/2 bg-purple-500/5 rounded-full blur-[120px] animate-aurora" />
        </div>

        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight relative">
          Your AI-Powered
          <RotatingText />
        </h1>
        <p className="mt-2 md:mt-3 text-xs md:text-base text-slate-300 max-w-lg mx-auto leading-relaxed relative">
          AI employees that handle communications, follow-ups, scheduling, and operations — so you can focus on what you do best.
        </p>
      </section>

      {/* Phone + Glow */}
      <section className="relative max-w-5xl mx-auto px-6 pt-2 md:pt-4 pb-16 md:pb-24">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDuration: "4s" }} />
        </div>
        <div className="absolute top-1/4 left-1/4 pointer-events-none">
          <div className="w-[300px] h-[300px] bg-blue-400/5 rounded-full blur-[80px]" />
        </div>
        <div className="absolute top-1/3 right-1/4 pointer-events-none">
          <div className="w-[250px] h-[250px] bg-indigo-500/8 rounded-full blur-[80px]" />
        </div>

        {/* Phone */}
        <div className="relative z-10 flex justify-center phone-3d">
          <PhoneMockup
            activeCategory={activeCategory}
            onConversationEnd={handleConversationEnd}
          />
        </div>

        {/* Category Tabs */}
        <div className="relative z-10">
          <CategoryTabs active={activeCategory} onSelect={handleTabSelect} />
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-slate-800/60 py-8 relative z-10 section-reveal">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-[0.2em] mb-3">
            Built by engineers from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
            {["Stripe", "Coinbase", "Netflix", "Uber", "Anduril"].map((co) => (
              <span key={co} className="text-slate-400 text-lg font-semibold tracking-wide opacity-60 hover:opacity-100 transition-opacity">
                {co}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What We Automate */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 section-reveal">
          What We Automate
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "💬",
              title: "Communications",
              desc: "Responds to clients, crews, and vendors across text, email, and chat — accurately, instantly, 24/7.",
            },
            {
              icon: "📅",
              title: "Scheduling & Dispatch",
              desc: "Books appointments, coordinates teams, and manages calendars without the back-and-forth.",
            },
            {
              icon: "🎯",
              title: "Sales & Lead Follow-Up",
              desc: "Responds to every lead instantly, qualifies prospects, and books calls — even at 11pm on a Saturday.",
            },
            {
              icon: "🛡",
              title: "Customer Support",
              desc: "Handles client questions, project updates, and issue resolution with full context of their history.",
            },
            {
              icon: "📞",
              title: "Phone & Voice",
              desc: "Answers inbound calls, makes outbound follow-ups, and never sends another customer to voicemail.",
            },
            {
              icon: "🔗",
              title: "Your Tools, Connected",
              desc: "Integrates with your CRM, project management, invoicing, and the platforms you already run your business on.",
            },
          ].map((item, idx) => (
            <div
              key={item.title}
              className="glass-card rounded-2xl p-8 section-reveal"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 section-reveal">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto section-reveal">
          From cloud-hosted AI to dedicated hardware — pick the plan that fits your business. No contracts, cancel anytime.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Standard Plan */}
          <div className="glass-card rounded-2xl p-8 flex flex-col section-reveal">
            <h3 className="text-2xl font-bold mb-2">Standard Plan</h3>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-blue-400">$350</span>
                <span className="text-slate-400">/week</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">+ $1,000 one-time setup fee</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Fully managed AI employee",
                "Email, SMS & web chat channels",
                "Sales follow-up & lead response",
                "Customer support & communications",
                "Scheduling & coordination",
                "Integrates with your CRM & tools",
                "Dedicated support & optimization",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mb-6">
              Usage-based fees may apply for AI tokens, phone numbers, and third-party API costs.
            </p>
            <div className="mt-auto">
              <Link
                href="#contact"
                className="block text-center rounded-full bg-blue-500 hover:bg-blue-400 px-6 py-3 text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Get Started →
              </Link>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="glass-card rounded-2xl p-8 relative shimmer-border flex flex-col section-reveal" style={{ transitionDelay: "100ms" }}>
            <div className="absolute -top-3 left-8 bg-gradient-to-r from-blue-500 to-blue-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg shadow-blue-500/30">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-blue-400">$500</span>
                <span className="text-slate-400">/week</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">+ $1,500 one-time setup fee</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Standard, plus:",
                "iMessage & phone call channels",
                "Dedicated phone number for your AI",
                "Real-time group chat with your team",
                "Voice calls — inbound & outbound",
                "Advanced integrations & workflows",
                "Priority support & continuous optimization",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-500 mb-6">
              Usage-based fees may apply for AI tokens, phone numbers, and third-party API costs.
            </p>
            <div className="mt-auto">
              <Link
                href="#contact"
                className="block text-center rounded-full bg-blue-500 hover:bg-blue-400 px-6 py-3 text-sm font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Get Started →
              </Link>
            </div>
          </div>

          {/* Custom Plan */}
          <div className="glass-card rounded-2xl p-8 flex flex-col section-reveal" style={{ transitionDelay: "200ms" }}>
            <h3 className="text-2xl font-bold mb-2">Custom Plan</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-300">Let&apos;s Talk</span>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Premium",
                "Multiple AI employees across departments",
                "Custom integrations & workflows",
                "Enterprise-scale automation",
                "Priority support & SLA",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-blue-400 mt-0.5">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Link
                href="#contact"
                className="block text-center rounded-full border border-slate-600 hover:border-blue-400/50 px-6 py-3 text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-800/20 py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 section-reveal">
            How It Works
          </h2>
          <div className="relative timeline-line">
            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Discovery Call",
                  desc: "We learn about your business, workflows, and pain points. 30 minutes is all we need.",
                },
                {
                  step: "02",
                  title: "Custom Build & Integration",
                  desc: "We build your AI employee — trained on your business, your tone, your rules — and plug it into the tools you already use.",
                },
                {
                  step: "03",
                  title: "Managed Forever",
                  desc: "We continuously manage, monitor, and improve your AI employee. Your business changes, we adapt. You focus on the work — we handle the tech.",
                },
              ].map((item, idx) => (
                <div key={item.step} className="flex gap-6 items-start section-reveal" style={{ transitionDelay: `${idx * 120}ms` }}>
                  <div className="relative z-10 w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-bold font-mono shadow-lg shadow-blue-500/25">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section
        id="contact"
        className="relative max-w-4xl mx-auto px-6 py-24 text-center z-10 section-reveal"
      >
        {/* Animated gradient bg */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl mx-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 animate-gradient-shift" />
          <div className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500/8 rounded-full blur-[100px] animate-aurora" />
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to hire an AI employee?
        </h2>
        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
          Book a free 30-minute call. Tell us where the chaos is — we&apos;ll show you exactly how an AI employee can handle it.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="https://calendly.com"
            className="inline-block rounded-full bg-blue-500 hover:bg-blue-400 px-10 py-4 text-lg font-semibold transition-all shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02]"
          >
            Book Your Free Call →
          </Link>
          <Link
            href="sms:+16023383473&body=DEMO"
            className="inline-block rounded-full border border-blue-500/50 hover:border-blue-400 px-10 py-4 text-lg font-semibold transition-all hover:bg-blue-500/10 hover:scale-[1.02]"
          >
            💬 Text DEMO to (602) 338-3473
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © 2026 bluego.ai — All rights reserved.
          </div>
          <div className="text-sm text-slate-500">Scottsdale, Arizona</div>
        </div>
      </footer>
    </div>
  );
}
