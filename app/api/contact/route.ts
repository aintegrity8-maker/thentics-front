import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"


export async function GET() {
  return NextResponse.json({ ok: true, route: "contact alive" })
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function clean(value: unknown, max = 5000) {
  return String(value ?? "")
    .replace(/\0/g, "")
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const name = clean(body.name, 120)
    const email = clean(body.email, 160)
    const organization = clean(body.organization, 160)
    const message = clean(body.message, 3000)
    const website = clean(body.website, 200)
    const formStartedAt = Number(body.formStartedAt || 0)

    if (website) {
      return NextResponse.json({ ok: true })
    }

    const now = Date.now()
    if (!formStartedAt || now - formStartedAt < 2500) {
      return NextResponse.json(
        { error: "Form submitted too quickly." },
        { status: 400 }
      )
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      )
    }

    const smtpUser = process.env.CONTACT_SMTP_USER
    const smtpPass = process.env.CONTACT_SMTP_PASS
    const contactTo = process.env.CONTACT_TO_EMAIL

    if (!smtpUser || !smtpPass || !contactTo) {
      return NextResponse.json(
        { error: "Server email is not configured." },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const safeOrganization = organization || "Not provided"

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
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>New Thentics contact request</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Organization:</strong> ${escapeHtml(safeOrganization)}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; border: 1px solid #ddd; padding: 12px; border-radius: 8px;">
            ${escapeHtml(message)}
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("CONTACT ROUTE ERROR:", error)
    return NextResponse.json(
      { error: "Unable to send message right now." },
      { status: 500 }
    )
  }
}