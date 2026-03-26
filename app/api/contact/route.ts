import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

type RateEntry = {
  count: number
  resetAt: number
}

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000 // 10 min
const RATE_LIMIT_MAX_REQUESTS = 5
const MIN_FORM_FILL_MS = 2500

const rateLimitStore = new Map<string, RateEntry>()

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function clean(value: unknown, max = 5000) {
  return String(value ?? "")
    .replace(/\0/g, "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, max)
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown"
  }

  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp.trim()

  return "unknown"
}

function checkRateLimit(ip: string) {
  const now = Date.now()
  const existing = rateLimitStore.get(ip)

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(ip, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    })
    return { limited: false, remaining: RATE_LIMIT_MAX_REQUESTS - 1 }
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { limited: true, remaining: 0 }
  }

  existing.count += 1
  rateLimitStore.set(ip, existing)

  return {
    limited: false,
    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - existing.count),
  }
}

function cleanupRateLimitStore() {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}

function isAllowedOrigin(req: NextRequest) {
  const origin = req.headers.get("origin")
  if (!origin) return true

  const allowedOrigins = [
    "https://thentics.com",
    "https://www.thentics.com",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ]

  return allowedOrigins.includes(origin)
}

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
  extraHeaders?: Record<string, string>
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
  })
}

export async function GET() {
  cleanupRateLimitStore()
  return jsonResponse({ ok: true, route: "contact alive" })
}

export async function POST(req: NextRequest) {
  cleanupRateLimitStore()

  const ip = getClientIp(req)

  try {
    if (!isAllowedOrigin(req)) {
      console.warn("[CONTACT] Blocked origin", {
        ip,
        origin: req.headers.get("origin"),
      })

      return jsonResponse({ error: "Origin not allowed." }, 403)
    }

    const rate = checkRateLimit(ip)

    if (rate.limited) {
      console.warn("[CONTACT] Rate limited", { ip })

      return jsonResponse(
        { error: "Too many requests. Please try again later." },
        429,
        { "Retry-After": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)) }
      )
    }

    const body = await req.json()

    const name = clean(body.name, 120)
    const email = clean(body.email, 160)
    const organization = clean(body.organization, 160)
    const message = clean(body.message, 3000)
    const website = clean(body.website, 200)
    const formStartedAt = Number(body.formStartedAt || 0)

    // Honeypot: responder OK para no dar pistas a bots
    if (website) {
      console.warn("[CONTACT] Honeypot triggered", { ip })
      return jsonResponse({ ok: true })
    }

    const now = Date.now()
    if (!formStartedAt || now - formStartedAt < MIN_FORM_FILL_MS) {
      return jsonResponse({ error: "Form submitted too quickly." }, 400)
    }

    if (!name || !email || !message) {
      return jsonResponse(
        { error: "Name, email, and message are required." },
        400
      )
    }

    if (!isValidEmail(email)) {
      return jsonResponse({ error: "Invalid email address." }, 400)
    }

    if (message.length < 10) {
      return jsonResponse({ error: "Message is too short." }, 400)
    }

    const smtpUser = process.env.CONTACT_SMTP_USER
    const smtpPass = process.env.CONTACT_SMTP_PASS
    const contactTo = process.env.CONTACT_TO_EMAIL

    if (!smtpUser || !smtpPass || !contactTo) {
      console.error("[CONTACT] Missing email environment variables")
      return jsonResponse({ error: "Server email is not configured." }, 500)
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const safeOrganization = organization || "Not provided"
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeOrganizationHtml = escapeHtml(safeOrganization)
    const safeMessage = escapeHtml(message)

    await transporter.sendMail({
      from: `"Thentics Website" <${smtpUser}>`,
      to: contactTo,
      replyTo: email,
      subject: `New Thentics contact request from ${name}`,
      text: [
        "New Thentics contact request",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Organization: ${safeOrganization}`,
        `IP: ${ip}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>New Thentics contact request</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Organization:</strong> ${safeOrganizationHtml}</p>
          <p><strong>IP:</strong> ${escapeHtml(ip)}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; border: 1px solid #ddd; padding: 12px; border-radius: 8px;">
            ${safeMessage}
          </div>
        </div>
      `,
    })

    console.info("[CONTACT] Message sent", {
      ip,
      email,
      organization: safeOrganization,
    })

    return jsonResponse({ ok: true })
  } catch (error) {
    console.error("[CONTACT] Route error", { ip, error })
    return jsonResponse(
      { error: "Unable to send message right now." },
      500
    )
  }
}