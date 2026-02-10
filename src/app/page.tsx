import Link from "next/link";

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
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
          Your business deserves an
          <br />
          <span className="text-blue-400">AI-powered operations team.</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We deploy and manage intelligent AI assistants that handle your
          communications, scheduling, lead generation, and day-to-day operations
          — so you can focus on growing your business.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#contact"
            className="rounded-full bg-blue-500 hover:bg-blue-400 px-8 py-3.5 text-base font-semibold transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-full border border-slate-600 hover:border-slate-400 px-8 py-3.5 text-base font-semibold transition-colors"
          >
            How It Works
          </Link>
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
