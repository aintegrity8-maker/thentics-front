"use client"

import Image from "next/image"
import { useState } from "react"

type AdoptionPoint = { year: number; ai: number; human: number }

function LineAdoptionChart() {
  const data: AdoptionPoint[] = [
  { year: 2022, ai: 10, human: 90 },
  { year: 2023, ai: 50, human: 50 },
  { year: 2024, ai: 60, human: 40 },
  { year: 2025, ai: 85, human: 15 },
]

  const W = 880
  const H = 320
  const PAD = { t: 24, r: 24, b: 36, l: 48 }
  const innerW = W - PAD.l - PAD.r
  const innerH = H - PAD.t - PAD.b

  const xs = (i: number) => PAD.l + (innerW * i) / (data.length - 1)
  const ys = (v: number) => PAD.t + innerH - (v / 100) * innerH

  const toPath = (vals: number[]) =>
    vals.map((v, i) => `${i === 0 ? "M" : "L"} ${xs(i)} ${ys(v)}`).join(" ")

  const pathAI = toPath(data.map((d) => d.ai))
  const pathHuman = toPath(data.map((d) => d.human))
  const years = data.map((d) => d.year)
  const grid = [0, 25, 50, 75, 100]

  return (
    <div className="w-full overflow-hidden rounded-[28px] border border-neutral-300 bg-[#f3f3f1] shadow-sm">
      <div className="flex flex-col gap-3 px-5 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-semibold text-neutral-900 sm:text-base">
          AI adoption in academic submissions (2022–2025)
        </h3>

        <div className="flex gap-4 text-[11px] text-neutral-700 sm:text-xs">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-7 rounded-full bg-neutral-800" />
            AI (edit + generate)
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-7 rounded-full bg-neutral-500" />
            Human-only
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} role="img" className="block w-full">
        <rect x="0" y="0" width={W} height={H} fill="#f3f3f1" />
        {grid.map((t, i) => (
          <g key={i}>
            <line
              x1={PAD.l}
              x2={W - PAD.r}
              y1={ys(t)}
              y2={ys(t)}
              stroke="rgba(0,0,0,.10)"
              strokeDasharray="4 4"
            />
            <text
              x={PAD.l - 10}
              y={ys(t)}
              textAnchor="end"
              alignmentBaseline="middle"
              fontSize="11"
              fill="rgba(0,0,0,.6)"
            >
              {t}%
            </text>
          </g>
        ))}

        {years.map((y, i) => (
          <text
            key={y}
            x={xs(i)}
            y={H - PAD.b + 18}
            textAnchor="middle"
            fontSize="12"
            fill="rgba(0,0,0,.78)"
          >
            {y}
          </text>
        ))}

        <path d={pathAI} fill="none" stroke="rgba(0,0,0,.82)" strokeWidth="3" />
        <path d={pathHuman} fill="none" stroke="rgba(0,0,0,.45)" strokeWidth="3" />

        {data.map((d, i) => (
          <circle key={`ai-${i}`} cx={xs(i)} cy={ys(d.ai)} r="4.5" fill="rgba(0,0,0,.82)" />
        ))}
        {data.map((d, i) => (
          <circle key={`human-${i}`} cx={xs(i)} cy={ys(d.human)} r="4.5" fill="rgba(0,0,0,.45)" />
        ))}
      </svg>
    </div>
  )
}

function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-300 bg-[#efefec]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Image
            src="/thentics-logo.png"
            alt="Thentics logo"
            width={42}
            height={42}
            className="h-10 w-10 rounded-full object-cover"
            priority
          />
          <span className="text-[22px] font-semibold tracking-tight text-neutral-900 sm:text-[24px]">
            Thentics
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-neutral-700 md:flex">
          <a href="#product" className="transition hover:text-neutral-900">
            Product
          </a>
          <a href="#ai-detector" className="transition hover:text-neutral-900">
            AI Detector
          </a>
          <a href="#create-activity" className="transition hover:text-neutral-900">
            Create activity
          </a>
          <a href="#security" className="transition hover:text-neutral-900">
            Security
          </a>
          <a href="#plans" className="transition hover:text-neutral-900">
            Plans
          </a>
          <a
            href="#panel"
            className="rounded-full bg-[#e2e2de] px-4 py-2 font-medium text-neutral-700 transition hover:bg-[#d9d9d4]"
          >
            Thentics Panel
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact-form"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Try free
          </a>
          <button className="rounded-2xl border border-neutral-300 bg-[#f6f6f3] px-4 py-2 text-sm text-neutral-700">
            EN
          </button>
        </div>
      </div>
    </header>
  )
}

function ProductCard({
  icon,
  title,
  description,
  tag,
  href,
  badge,
}: {
  icon: string
  title: string
  description: string
  tag: string
  href: string
  badge?: string
}) {
  return (
    <a
      href={href}
      className="group block rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-6 transition hover:-translate-y-0.5 hover:bg-[#ecece8] hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div className="text-3xl">{icon}</div>
        <div className="flex items-center gap-2">
          {badge ? (
            <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
              {badge}
            </span>
          ) : null}
          <span className="rounded-full border border-neutral-300 bg-[#fafaf8] px-3 py-1 text-xs text-neutral-700">
            {tag}
          </span>
        </div>
      </div>

      <h3 className="mt-6 text-[24px] font-semibold leading-tight text-neutral-900">
        {title}
      </h3>

      <p className="mt-3 text-[14px] leading-7 text-neutral-700">{description}</p>

      <div className="mt-8 flex items-center justify-between text-sm text-neutral-500">
        <span>Open product</span>
        <span className="transition group-hover:translate-x-1">→</span>
      </div>
    </a>
  )
}

function PlansSection() {
  return (
    <section id="plans" className="scroll-mt-24 mt-20">
      <div className="mb-5">
        <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
          Plans
        </h2>
        <p className="mt-2 max-w-3xl text-[16px] leading-8 text-neutral-700">
          Flexible access for individual users, educators, and institutions.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-7">
          <div className="text-sm font-semibold text-neutral-800">Free</div>
          <div className="mt-3 text-4xl font-bold text-neutral-900">US$0</div>
          <p className="mt-4 text-sm leading-7 text-neutral-700">
            Explore the platform and preview core workflows.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-neutral-800">
            <li>• Limited access</li>
            <li>• Product preview</li>
            <li>• Early updates</li>
          </ul>
        </div>

        <div className="rounded-[28px] border border-neutral-900 bg-neutral-900 p-7 text-white shadow-sm">
          <div className="text-sm font-semibold text-white/85">Pro</div>
          <div className="mt-3 text-4xl font-bold">Coming soon</div>
          <p className="mt-4 text-sm leading-7 text-white/70">
            Advanced reporting, product workflows, and higher-volume use.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/85">
            <li>• Full reporting suite</li>
            <li>• AI-aware workflows</li>
            <li>• Advanced usage</li>
          </ul>
        </div>

        <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-7">
          <div className="text-sm font-semibold text-neutral-800">Institution</div>
          <div className="mt-3 text-4xl font-bold text-neutral-900">Custom</div>
          <p className="mt-4 text-sm leading-7 text-neutral-700">
            Designed for universities, departments, and academic review environments.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-neutral-800">
            <li>• Institutional deployment</li>
            <li>• Training & onboarding</li>
            <li>• Custom workflows</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function ContactFormCard() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [organization, setOrganization] = useState("")
  const [message, setMessage] = useState("")
  const [website, setWebsite] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [feedback, setFeedback] = useState("")

  function markFormStart() {
    if (typeof window !== "undefined" && !(window as any).__thenticsFormStartedAt) {
      ;(window as any).__thenticsFormStartedAt = Date.now()
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setStatus("idle")
    setFeedback("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          organization,
          message,
          website,
          formStartedAt: (window as any).__thenticsFormStartedAt || Date.now(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.error || "Could not send message.")
      }

      setStatus("success")
      setFeedback("Your message was sent successfully.")
      setName("")
      setEmail("")
      setOrganization("")
      setMessage("")
      setWebsite("")

      if (typeof window !== "undefined") {
        delete (window as any).__thenticsFormStartedAt
      }
    } catch (err: any) {
      setStatus("error")
      setFeedback(err?.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      id="contact-form"
      className="rounded-[30px] border border-neutral-300 bg-[#f1f1ee] p-6 shadow-sm sm:p-8"
    >
      <div className="mb-6">
        <h3 className="text-[24px] font-semibold tracking-tight text-neutral-900">
          Request demo / early access
        </h3>
        <p className="mt-3 max-w-2xl text-[15px] leading-8 text-neutral-700">
          Send your details and the Thentics team will contact you shortly. Messages are handled
          securely on the server side.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-800">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onFocus={markFormStart}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              className="w-full rounded-2xl border border-neutral-300 bg-[#fafaf8] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-800">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onFocus={markFormStart}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={160}
              className="w-full rounded-2xl border border-neutral-300 bg-[#fafaf8] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-500"
              placeholder="name@university.edu"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="organization"
            className="mb-2 block text-sm font-medium text-neutral-800"
          >
            Institution / Organization
          </label>
          <input
            id="organization"
            type="text"
            value={organization}
            onFocus={markFormStart}
            onChange={(e) => setOrganization(e.target.value)}
            maxLength={160}
            className="w-full rounded-2xl border border-neutral-300 bg-[#fafaf8] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-500"
            placeholder="University, school, department, company"
          />
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-800">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onFocus={markFormStart}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={6}
            maxLength={3000}
            className="w-full rounded-2xl border border-neutral-300 bg-[#fafaf8] px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-500"
            placeholder="Tell us what you are looking for: demo, institution deployment, early access, partnership..."
          />
        </div>

        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center rounded-full bg-black px-7 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Sending..." : "Send request"}
          </button>

          <span className="text-sm text-neutral-500">Anti-spam protections enabled.</span>
        </div>

        {feedback ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              status === "success"
                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            {feedback}
          </div>
        ) : null}
      </form>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e9e9e6] text-neutral-900">
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      <NavBar />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
        <section className="grid gap-14 border-b border-neutral-300 pb-14 lg:grid-cols-[1.02fr_.9fr] lg:items-center">
          <div className="max-w-4xl">
            <div className="mb-7 flex items-center gap-3 text-[13px] text-neutral-800">
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span>Built for academic integrity and AI transparency</span>
            </div>

            <h1 className="max-w-3xl text-[40px] font-semibold leading-[1.02] tracking-tight text-[#030816] sm:text-[52px] lg:text-[60px]">
              Professional-grade AI detection.
              <br />
              Precise. Audited.
              <br />
              Transparent.
            </h1>

            <p className="mt-7 max-w-2xl text-[15px] leading-8 text-neutral-700">
              Thentics combines advanced stylometrics with AI detection to assess authorship,
              estimate editing intensity, and distinguish human writing from LLM-generated content.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#ai-detector"
                className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-[15px] font-semibold text-white transition hover:bg-neutral-800"
              >
                Try the Detector
              </a>
              <span className="text-[14px] text-neutral-500">
                No signup. Product overview and architecture demo.
              </span>
            </div>

            <div className="mt-10">
              <div className="mb-4 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                Designed for
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-neutral-700">
                <span className="rounded-2xl border border-neutral-300 bg-[#f4f4f1] px-3.5 py-1.5">
                  Universities
                </span>
                <span className="rounded-2xl border border-neutral-300 bg-[#f4f4f1] px-3.5 py-1.5">
                  Research institutions
                </span>
                <span className="rounded-2xl border border-neutral-300 bg-[#f4f4f1] px-3.5 py-1.5">
                  Professors
                </span>
                <span className="rounded-2xl border border-neutral-300 bg-[#f4f4f1] px-3.5 py-1.5">
                  Academic integrity teams
                </span>
              </div>

              <p className="mt-4 max-w-xl text-[13px] leading-7 text-neutral-500">
                Thentics is currently in early-stage development, designed for institutions
                seeking transparent, reliable AI authorship analysis.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] border border-neutral-300 bg-[#efefec] p-5 shadow-sm">
            <div className="rounded-[26px] border border-neutral-300 bg-[#e7e7e3] p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-neutral-300 bg-[#f8f8f5] px-3 py-1 text-xs text-neutral-700">
                  Precision-first system
                </span>
                <span className="rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs text-emerald-800">
                  ~0.1% false positives
                </span>
              </div>

              <h3 className="mt-4 text-[18px] font-semibold leading-tight text-neutral-900">
                A more robust approach to authorship verification
              </h3>

              <p className="mt-3 text-[13px] leading-7 text-neutral-700">
                Instead of relying on a single opaque score, Thentics evaluates text through
                multiple layers of evidence.
              </p>

              <div className="mt-6 grid gap-3">
                <div className="rounded-2xl border border-neutral-300 bg-[#f7f7f4] px-4 py-3.5">
                  <div className="text-[13px] font-semibold text-neutral-900">Detection</div>
                  <div className="mt-1 text-[13px] text-neutral-700">
                    Human vs AI-generated vs AI-edited signals
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-300 bg-[#f7f7f4] px-4 py-3.5">
                  <div className="text-[13px] font-semibold text-neutral-900">Auditability</div>
                  <div className="mt-1 text-[13px] text-neutral-700">
                    Reports, evidence, and review-ready outputs
                  </div>
                </div>
                <div className="rounded-2xl border border-neutral-300 bg-[#f7f7f4] px-4 py-3.5">
                  <div className="text-[13px] font-semibold text-neutral-900">Education</div>
                  <div className="mt-1 text-[13px] text-neutral-700">
                    Activities, workflows, and responsible AI integration
                  </div>
                </div>
              </div>

              <a
                href="https://www.youtube.com/watch?v=w4mZTgj7r9M"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-full border border-neutral-300 bg-[#f9f9f7] px-5 py-2.5 text-sm font-medium text-neutral-900 transition hover:bg-[#f1f1ed]"
              >
                Watch 2-minute demo
              </a>
            </div>
          </div>
        </section>

        <section id="product" className="scroll-mt-24 mt-20">
          <div className="mb-5">
            <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
              Why Thentics is different
            </h2>

            <p className="mt-2 text-[14px] font-medium uppercase tracking-[0.14em] text-neutral-500">
              In one word: noble.
            </p>

            <p className="mt-4 max-w-5xl text-[16px] leading-8 text-neutral-700">
              Thentics is built to serve academic institutions first, and indirectly the students
              who choose to preserve the integrity of their own words. Its purpose is not to help
              generated content appear human, but to protect and recognize authentic authorship.
              That is why Thentics will never offer humanizers or tools designed to bypass
              detection. The goal is simple: to become the most reliable AI detection system on
              the market.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            <ProductCard
              icon="🔎"
              title="AI Detector"
              description="AI probability, editing level, and document-level review with a precision-first approach."
              tag="Detection"
              href="#ai-detector"
            />
            <ProductCard
              icon="🧬"
              title="Author stylometric fingerprint"
              description="Authorship consistency and written identity verification across submissions."
              tag="Stylometrics"
              href="#ai-detector"
            />
            <ProductCard
              icon="📁"
              title="Activity generator dashboard"
              description="Assignments with AI controls, course workflows, and student-level tracking."
              tag="Teaching"
              badge="New"
              href="#create-activity"
            />
            <ProductCard
              icon="📊"
              title="Auditable reports & evidence"
              description="Exportable reports, traceability, and review-ready evidence for each analysis."
              tag="Audit"
              href="#security"
            />
          </div>
        </section>

        <section id="ai-detector" className="scroll-mt-24 mt-20 border-t border-neutral-300 pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
                AI Detector
              </h2>
              <p className="mt-4 text-[16px] leading-8 text-neutral-700">
                The core detection product is designed to distinguish human, AI-generated,
                and AI-edited writing using multiple independent signals rather than a single score.
              </p>
              <p className="mt-4 text-[16px] leading-8 text-neutral-700">
                It is built to prioritize reliability in high-stakes environments, with a strong
                focus on minimizing false positives and improving interpretability.
              </p>
            </div>

            <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-7">
              <h3 className="text-lg font-semibold text-neutral-900">Why it matters</h3>
              <p className="mt-4 text-[14px] leading-7 text-neutral-700">
                As AI-assisted writing becomes widespread, institutions need more than black-box
                detectors. They need systems that are transparent, auditable, and dependable.
              </p>
            </div>
          </div>
        </section>

        <section id="create-activity" className="scroll-mt-24 mt-20 border-t border-neutral-300 pt-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_.9fr]">
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
                Create activity
              </h2>
              <p className="mt-4 text-[16px] leading-8 text-neutral-700">
                Thentics will include activity and workflow tools designed for educators who need
                AI-aware assignments, transparent expectations, and clearer review processes.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-6">
                <h3 className="text-base font-semibold text-neutral-900">Assignment design</h3>
                <p className="mt-3 text-[14px] leading-7 text-neutral-700">
                  Create AI-aware academic activities aligned with integrity standards.
                </p>
              </div>
              <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-6">
                <h3 className="text-base font-semibold text-neutral-900">Course workflows</h3>
                <p className="mt-3 text-[14px] leading-7 text-neutral-700">
                  Organize product usage by course, cohort, and review flow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="adoption" className="mt-20">
          <div className="mb-5">
            <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
              Adoption trend
            </h2>
            <p className="mt-2 max-w-5xl text-[16px] leading-8 text-neutral-700">
              Since 2022, adoption has grown rapidly. By 2023, AI-assisted writing had already reached
              50% of academic submissions, climbing to 60% in 2024 and 85% by 2025.
            </p>
          </div>
          <LineAdoptionChart />
        </section>

        <section id="demo" className="scroll-mt-24 mt-20 border-t border-neutral-300 pt-14">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
                Demo
              </h2>
              <p className="mt-3 max-w-2xl text-[16px] leading-8 text-neutral-700">
                A short walkthrough of the Thentics architecture, detection logic, and
                product vision.
              </p>
              <a
                href="https://www.youtube.com/watch?v=w4mZTgj7r9M"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-[15px] font-semibold text-white transition hover:bg-neutral-800"
              >
                Watch full demo
              </a>
            </div>

            <a
              href="https://www.youtube.com/watch?v=w4mZTgj7r9M"
              target="_blank"
              rel="noreferrer"
              className="group relative block overflow-hidden rounded-[28px] border border-neutral-300 bg-[#f1f1ee] shadow-sm"
            >
              <img
                src="https://img.youtube.com/vi/w4mZTgj7r9M/maxresdefault.jpg"
                alt="Thentics demo preview"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/20" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-105">
                  <div className="ml-1 h-0 w-0 border-y-[12px] border-y-transparent border-l-[18px] border-l-black" />
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-6 pt-16">
                <p className="text-sm font-medium text-white/80">2-minute walkthrough</p>
                <h3 className="mt-1 text-xl font-semibold text-white">
                  Thentics system architecture demo
                </h3>
              </div>
            </a>
          </div>
        </section>

        <section id="why" className="scroll-mt-24 mt-20 border-t border-neutral-300 pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
                Why is Thentics different?
              </h2>

              <p className="mt-4 text-[16px] leading-8 text-neutral-700">
                As AI tools rapidly advanced, something important started to disappear: the
                ability to clearly recognize authentic human work.
              </p>

              <p className="mt-4 text-[16px] leading-8 text-neutral-700">
                In academic environments, students gained access to powerful generation tools,
                while educators were left without reliable ways to distinguish genuine thinking
                from AI-assisted content.
              </p>

              <p className="mt-4 text-[16px] leading-8 text-neutral-700">
                Thentics was built to restore that balance — not by restricting AI, but by
                making authenticity visible again.
              </p>
            </div>

            <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-7">
              <h3 className="text-lg font-semibold text-neutral-900">Our principles</h3>

              <p className="mt-4 text-[14px] leading-7 text-neutral-700">
                Thentics is designed to support academic institutions first — and indirectly,
                the students who choose to produce authentic work.
              </p>

              <p className="mt-4 text-[14px] leading-7 text-neutral-700">
                The goal is to ensure that those who maintain integrity in their writing are
                properly recognized and not overshadowed by generated content.
              </p>

              <p className="mt-4 text-[14px] leading-7 text-neutral-700">
                Thentics will never offer tools to bypass detection or “humanize” AI content.
                The system is built with a single objective: to be the most reliable AI detection
                solution on the market.
              </p>

              <p className="mt-4 text-[14px] leading-7 text-neutral-700">
                Reliability, transparency, and trust are the core of the product.
              </p>
            </div>
          </div>
        </section>

        <section id="security" className="scroll-mt-24 mt-20 border-t border-neutral-300 pt-14">
          <div className="mb-8">
            <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
              Security
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-7">
              <h3 className="text-base font-semibold text-neutral-900">Integrity</h3>
              <p className="mt-3 text-[14px] leading-7 text-neutral-700">
                Built to support fair academic evaluation and human-centered review.
              </p>
            </div>
            <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-7">
              <h3 className="text-base font-semibold text-neutral-900">Transparency</h3>
              <p className="mt-3 text-[14px] leading-7 text-neutral-700">
                Designed to provide signals and evidence, not opaque absolute verdicts.
              </p>
            </div>
            <div className="rounded-[28px] border border-neutral-300 bg-[#f1f1ee] p-7">
              <h3 className="text-base font-semibold text-neutral-900">Privacy</h3>
              <p className="mt-3 text-[14px] leading-7 text-neutral-700">
                Prepared for institution-level adaptation under different data policies and deployment
                models.
              </p>
            </div>
          </div>
        </section>

        <div id="panel" className="scroll-mt-24">
          <PlansSection />
        </div>

        <section id="contact" className="scroll-mt-24 mt-20 border-t border-neutral-300 pt-14">
          <div className="mb-8 max-w-3xl">
            <h2 className="text-[32px] font-semibold tracking-tight text-neutral-900 sm:text-[36px]">
              Contact
            </h2>
            <p className="mt-3 text-[16px] leading-8 text-neutral-700">
              Interested in early access, institutional use, partnerships, or product updates?
            </p>
          </div>

          <ContactFormCard />
        </section>
      </main>
    </div>
  )
}