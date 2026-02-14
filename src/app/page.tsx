"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

type Category = "sales" | "support" | "scheduling" | "operations";

const categories: { key: Category; label: string; headline: string }[] = [
  { key: "sales", label: "Sales", headline: "Sales & Marketing Team" },
  { key: "support", label: "Support", headline: "Customer Support Team" },
  { key: "scheduling", label: "Scheduling", headline: "Scheduling Assistant" },
  { key: "operations", label: "Operations", headline: "Operations Manager" },
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
  const cancelRef = useRef<() => void>(() => {});

  useEffect(() => {
    let cancelled = false;
    cancelRef.current = () => { cancelled = true; };

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
    <div className="relative mx-auto w-[260px] md:w-[340px]">
      <div className="rounded-[3rem] border-[8px] border-slate-700/80 bg-black shadow-2xl overflow-hidden">
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
  );
}

function CategoryTabs({
  active,
  onSelect,
}: {
  active: Category;
  onSelect: (c: Category) => void;
}) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSelect(cat.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            active === cat.key
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
              : "bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-700/70"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Category>("sales");

  const handleConversationEnd = useCallback(() => {
    setActiveCategory((prev) => {
      const idx = categories.findIndex((c) => c.key === prev);
      return categories[(idx + 1) % categories.length].key;
    });
  }, []);

  const handleTabSelect = useCallback((cat: Category) => {
    setActiveCategory(cat);
  }, []);

  const activeHeadline =
    categories.find((c) => c.key === activeCategory)?.headline ?? "Sales & Marketing Team";

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto relative z-10">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-blue-400">blue</span>go
          <span className="text-blue-400">.ai</span>
        </div>
        <div className="flex gap-3">
          <Link
            href="#contact"
            className="rounded-full bg-blue-500 hover:bg-blue-400 px-5 py-2 text-sm font-semibold transition-colors"
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
      </nav>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-2 md:pt-6 pb-2 text-center z-10">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
          Your AI-Powered
          <span className="text-blue-400"> {activeHeadline}</span>
        </h1>
        <p className="mt-2 md:mt-3 text-xs md:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
          AI assistants that handle outreach, follow-ups, scheduling, and lead
          generation — so you can focus on closing deals and growing your business.
        </p>
      </section>

      {/* Phone + Glow */}
      <section className="relative max-w-5xl mx-auto px-6 pt-2 md:pt-4 pb-16 md:pb-20">
        {/* Background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
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
      <section className="border-y border-slate-800 py-8 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
            Built by engineers from
          </p>
          <p className="text-slate-300 text-lg font-medium tracking-wide">
            Stripe · Coinbase · Netflix · Uber · Anduril
          </p>
        </div>
      </section>

      {/* What We Automate */}
      <section className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          What We Automate
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: "💬",
              title: "Communications",
              desc: "Automated responses, follow-ups, and client messaging across email, SMS, and chat — 24/7.",
            },
            {
              icon: "📅",
              title: "Scheduling & Coordination",
              desc: "Smart calendar management, appointment booking, and team coordination without the back-and-forth.",
            },
            {
              icon: "🎯",
              title: "Lead Generation",
              desc: "Proactive outreach, qualification, and pipeline management that runs while you sleep.",
            },
            {
              icon: "📧",
              title: "Email & SMS Campaigns",
              desc: "Personalized drip sequences, cold outreach, and nurture campaigns that convert — all on autopilot.",
            },
            {
              icon: "📊",
              title: "Pipeline & Analytics",
              desc: "Real-time sales dashboards, conversion tracking, and campaign performance so you know what's working.",
            },
            {
              icon: "🔗",
              title: "CRM & Marketing Tools",
              desc: "Connects with HubSpot, Salesforce, Mailchimp, Google Ads, and the tools you already use.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:border-blue-500/30 transition-colors"
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
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-400 text-center mb-16 max-w-2xl mx-auto">
          A fully managed AI assistant for your sales &amp; marketing — no hiring, no overhead.
        </p>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-slate-800/50 border border-blue-500/30 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-8 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2">Standard Plan</h3>
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-blue-400">$500</span>
                <span className="text-slate-400">/week</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">+ $800 one-time setup fee</p>
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Fully managed AI sales & marketing assistant",
                "Email, SMS & chat automation",
                "Lead generation & follow-up sequences",
                "CRM integration & pipeline management",
                "Smart scheduling & appointment booking",
                "Weekly performance reports",
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
            <Link
              href="#contact"
              className="block text-center rounded-full bg-blue-500 hover:bg-blue-400 px-6 py-3 text-sm font-semibold transition-colors"
            >
              Get Started →
            </Link>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Custom Plan</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-300">Let&apos;s Talk</span>
            </div>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Need something more advanced? Multi-channel campaigns, custom integrations,
              dedicated AI agents, or enterprise-scale automation — we&apos;ll build it for you.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Everything in Standard",
                "Custom AI agent development",
                "Advanced integrations & workflows",
                "Multi-channel campaign orchestration",
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
                className="block text-center rounded-full border border-slate-600 hover:border-slate-400 px-6 py-3 text-sm font-semibold transition-colors"
              >
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-800/30 py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Discovery Call",
                desc: "We learn about your business, workflows, and pain points. 30 minutes is all we need.",
              },
              {
                step: "02",
                title: "Custom Deployment",
                desc: "We build and deploy an AI assistant tailored to your specific operations and integrations.",
              },
              {
                step: "03",
                title: "Managed & Optimized",
                desc: "We continuously manage, monitor, and improve your AI assistant. You focus on your business — we handle the tech.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="text-blue-400 text-4xl font-bold font-mono shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section
        id="contact"
        className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to put AI to work for your business?
        </h2>
        <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
          Book a free discovery call. We&apos;ll show you exactly how an AI
          assistant can save you hours every week.
        </p>
        <Link
          href="https://calendly.com"
          className="inline-block rounded-full bg-blue-500 hover:bg-blue-400 px-10 py-4 text-lg font-semibold transition-colors"
        >
          Book Your Free Call →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 relative z-10">
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
