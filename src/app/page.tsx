import Link from "next/link";

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[320px] md:w-[360px]">
      {/* Phone frame */}
      <div className="rounded-[3rem] border-[8px] border-slate-700 bg-black shadow-2xl shadow-blue-500/20 overflow-hidden">
        {/* Status bar */}
        <div className="bg-black px-6 pt-3 pb-1 flex justify-between items-center text-[11px] text-white/70">
          <span>9:41</span>
          <div className="w-28 h-7 bg-black rounded-full mx-auto" />
          <span className="flex gap-1 items-center">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M2 22h20V2z" opacity=".3"/><path d="M12 7V2L2 22h20z"/></svg>
            100%
          </span>
        </div>

        {/* Chat header */}
        <div className="bg-slate-900/95 backdrop-blur px-4 py-3 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-sm font-bold">
            🦬
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Theodore</div>
            <div className="text-[11px] text-green-400">Online</div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-black px-3 py-4 space-y-3 min-h-[420px]">
          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white text-[13px] rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] leading-relaxed">
              Theodore, give me a report on today&apos;s operations
            </div>
          </div>

          {/* Delivered */}
          <div className="text-right text-[10px] text-slate-500 -mt-1 pr-1">
            Delivered
          </div>

          {/* Assistant message */}
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-100 text-[13px] rounded-2xl rounded-bl-md px-4 py-3 max-w-[90%] leading-relaxed space-y-2">
              <p className="font-semibold text-blue-400">BOTV Operations Report – Feb 9, 2026</p>

              <p className="font-semibold text-sm">🔥 Sales</p>
              <p>• 2 new paid clients signed today<br/>
              • Setoudeh (pool + spa remodel)<br/>
              • Sooy (decking, pergola, BBQ)</p>

              <p className="font-semibold text-sm">✅ Loops Closed</p>
              <p>• Leeming aerators — answered<br/>
              • Viedma showerhead — arrived<br/>
              • Jamil site visit scheduled Feb 17<br/>
              • Arora car charger — APPROVED</p>

              <p className="font-semibold text-sm">📋 Crew Status</p>
              <p>• 23 of 25 crews active today<br/>
              • 2 crews on weather hold<br/>
              • All jobs on schedule ✓</p>
            </div>
          </div>

          {/* User follow-up */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white text-[13px] rounded-2xl rounded-br-md px-4 py-2.5 max-w-[85%] leading-relaxed">
              Nice. Schedule a call with Setoudeh for Thursday at 2pm
            </div>
          </div>

          {/* Assistant reply */}
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-100 text-[13px] rounded-2xl rounded-bl-md px-4 py-2.5 max-w-[85%] leading-relaxed">
              Done. ✅ Setoudeh confirmed for Thursday Feb 13 @ 2:00 PM. Calendar invite sent to both parties.
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="bg-black px-3 py-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-800 rounded-full px-4 py-2 text-[13px] text-slate-500">
              Message Theodore...
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Home indicator */}
        <div className="bg-black py-2 flex justify-center">
          <div className="w-32 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="text-2xl font-bold tracking-tight">
          <span className="text-blue-400">blue</span>go<span className="text-blue-400">.ai</span>
        </div>
        <Link
          href="#contact"
          className="rounded-full bg-blue-500 hover:bg-blue-400 px-5 py-2 text-sm font-semibold transition-colors"
        >
          Book a Call
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Your business deserves an
              <span className="text-blue-400"> AI-powered operations team.</span>
            </h1>
            <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-lg">
              We deploy and manage intelligent AI assistants that handle your
              communications, scheduling, lead generation, and day-to-day operations
              — so you can focus on growing your business.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="#contact"
                className="rounded-full bg-blue-500 hover:bg-blue-400 px-8 py-3.5 text-base font-semibold transition-colors text-center"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="rounded-full border border-slate-600 hover:border-slate-400 px-8 py-3.5 text-base font-semibold transition-colors text-center"
              >
                How It Works
              </Link>
            </div>
          </div>

          {/* Right: Floating Phone */}
          <div className="flex justify-center md:justify-end">
            <div className="animate-float">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-slate-800 py-8">
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
      <section className="max-w-6xl mx-auto px-6 py-24">
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
      <section id="how-it-works" className="bg-slate-800/30 py-24">
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
      <section id="contact" className="max-w-4xl mx-auto px-6 py-24 text-center">
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
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            © 2026 bluego.ai — All rights reserved.
          </div>
          <div className="text-sm text-slate-500">
            Scottsdale, Arizona
          </div>
        </div>
      </footer>
    </div>
  );
}
