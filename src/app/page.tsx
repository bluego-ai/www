"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const conversation: Message[] = [
  { role: "user", text: "Theodore, give me a report on today's operations" },
  {
    role: "assistant",
    text: `**BOTV Operations Report – Feb 9, 2026**

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
  {
    role: "user",
    text: "Nice. Schedule a call with Setoudeh for Thursday at 2pm",
  },
  {
    role: "assistant",
    text: "Done. ✅ Setoudeh confirmed for Thursday Feb 13 @ 2:00 PM. Calendar invite sent to both parties.",
  },
];

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
  // Bold **text**
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

function AnimatedChat() {
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

      // Typing indicator duration
      const typingDelay = msg.role === "assistant" ? 1500 : 800;
      await sleep(typingDelay);
      if (cancelled) return;

      setIsTyping(false);

      // Character-by-character typing for user, chunk for assistant
      if (msg.role === "user") {
        for (let i = 0; i <= msg.text.length; i++) {
          if (cancelled) return;
          setCurrentText(msg.text.slice(0, i));
          await sleep(30);
        }
        await sleep(200);
        setCurrentText("");
        setVisibleMessages((prev) => [...prev, msg]);
      } else {
        // Assistant types in chunks (lines)
        const lines = msg.text.split("\n");
        let accumulated = "";
        for (let i = 0; i < lines.length; i++) {
          if (cancelled) return;
          accumulated += (i > 0 ? "\n" : "") + lines[i];
          setCurrentText(accumulated);
          await sleep(80);
        }
        await sleep(300);
        setCurrentText("");
        setVisibleMessages((prev) => [...prev, msg]);
      }

      await sleep(500);
    }

    async function runConversation() {
      while (!cancelled) {
        setVisibleMessages([]);
        setCurrentText("");
        setIsTyping(false);
        await sleep(1500);

        for (const msg of conversation) {
          if (cancelled) return;
          await typeMessage(msg);
        }

        // Pause before restarting
        await sleep(4000);
        cycleRef.current++;
      }
    }

    runConversation();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [visibleMessages, currentText, isTyping]);

  return (
    <div
      ref={chatRef}
      className="bg-black/90 px-3 py-4 space-y-3 h-[420px] overflow-y-auto scrollbar-hide"
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

      {/* Currently typing text */}
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

      {/* Typing indicator */}
      {isTyping && <TypingIndicator />}
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] md:w-[340px]">
      {/* Phone frame */}
      <div className="rounded-[3rem] border-[8px] border-slate-700/80 bg-black shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="bg-black px-6 pt-2 pb-1 flex justify-center">
          <div className="w-28 h-6 bg-black rounded-full border border-slate-800/50" />
        </div>

        {/* Chat header */}
        <div className="bg-slate-900/95 backdrop-blur px-4 py-2.5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold">
            🦬
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white">Theodore</div>
            <div className="text-[10px] text-green-400">Online</div>
          </div>
        </div>

        {/* Animated Messages */}
        <AnimatedChat />

        {/* Input bar */}
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

        {/* Home indicator */}
        <div className="bg-black py-2 flex justify-center">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function Badge({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/40 rounded-xl px-4 py-3 flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="text-white font-semibold text-sm">{value}</div>
        <div className="text-slate-400 text-xs">{label}</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto relative z-10">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-blue-400">blue</span>go
          <span className="text-blue-400">.ai</span>
        </div>
        <Link
          href="#contact"
          className="rounded-full bg-blue-500 hover:bg-blue-400 px-5 py-2 text-sm font-semibold transition-colors"
        >
          Book a Call
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative max-w-4xl mx-auto px-6 pt-12 pb-8 text-center z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
          Your AI-Powered
          <br />
          <span className="text-blue-400">Operations Team.</span>
        </h1>
        <p className="mt-5 text-base md:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
          We deploy and manage intelligent AI assistants that handle
          communications, scheduling, lead generation, and operations — so you
          can focus on growing your business.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="#contact"
            className="rounded-full bg-blue-500 hover:bg-blue-400 px-7 py-3 text-sm font-semibold transition-colors"
          >
            Get Started →
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-full border border-slate-600 hover:border-slate-400 px-7 py-3 text-sm font-semibold transition-colors"
          >
            How It Works
          </Link>
        </div>
      </section>

      {/* Phone + Badges + Glow */}
      <section className="relative max-w-5xl mx-auto px-6 pt-8 pb-24">
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

        {/* Badges behind phone */}
        <div className="relative z-0">
          {/* Top left badge */}
          <div className="absolute top-4 left-0 md:left-8 hidden md:block animate-float-slow">
            <Badge icon="💬" label="Automated" value="24/7 Messaging" />
          </div>
          {/* Top right badge */}
          <div className="absolute top-4 right-0 md:right-8 hidden md:block animate-float-slow-reverse">
            <Badge icon="📅" label="Smart Scheduling" value="Zero Back & Forth" />
          </div>
          {/* Mid left badge */}
          <div className="absolute top-48 -left-4 md:left-0 hidden md:block animate-float-slow-reverse">
            <Badge icon="🎯" label="Pipeline Growth" value="Lead Generation" />
          </div>
          {/* Mid right badge */}
          <div className="absolute top-48 -right-4 md:right-0 hidden md:block animate-float-slow">
            <Badge icon="⚙️" label="Crew Management" value="25+ Crews Tracked" />
          </div>
          {/* Bottom left */}
          <div className="absolute bottom-16 left-4 md:left-16 hidden md:block animate-float-slow">
            <Badge icon="📊" label="Real-time" value="Ops Reporting" />
          </div>
          {/* Bottom right */}
          <div className="absolute bottom-16 right-4 md:right-16 hidden md:block animate-float-slow-reverse">
            <Badge icon="🔗" label="Your Tools" value="CRM Integrations" />
          </div>
        </div>

        {/* Phone with 3D tilt */}
        <div className="relative z-10 flex justify-center phone-3d">
          <PhoneMockup />
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
              icon: "⚙️",
              title: "Operations",
              desc: "Crew management, task tracking, and workflow automation tailored to your business.",
            },
            {
              icon: "📊",
              title: "Reporting & Insights",
              desc: "Real-time dashboards and summaries so you always know what's happening across your business.",
            },
            {
              icon: "🔗",
              title: "Integrations",
              desc: "Connects with the tools you already use — CRMs, email, calendars, project management, and more.",
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
