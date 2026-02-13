import { headers } from "next/headers";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ============================================================================
// 🔒 SECURITY CONFIGURATION
// ============================================================================

// Rate limiting: 3 emails per IP per hour
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

// File upload limits
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 3;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<
  string,
  { count: number; resetTime: number; blocked: boolean }
>();

// ============================================================================
// 🛡️ SECURITY FUNCTIONS
// ============================================================================

/**
 * Rate limiting with progressive blocking
 */
function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  blocked: boolean;
} {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean up old records
  if (record && now > record.resetTime) {
    rateLimitStore.delete(ip);
  }

  const existing = rateLimitStore.get(ip);

  // Check if IP is blocked
  if (existing?.blocked) {
    return { allowed: false, remaining: 0, blocked: true };
  }

  if (!existing) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
      blocked: false,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, blocked: false };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    // Block IP after exceeding limit
    existing.blocked = true;
    console.warn(`⚠️ IP BLOCKED: ${ip} - Exceeded rate limit`);
    return { allowed: false, remaining: 0, blocked: true };
  }

  existing.count++;
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX - existing.count,
    blocked: false,
  };
}

/**
 * Advanced input sanitization
 */
function sanitizeInput(input: string, maxLength: number = 5000): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .replace(/\0/g, "") // Remove null bytes
    .substring(0, maxLength);
}

/**
 * Comprehensive email validation
 */
function validateEmail(email: string): boolean {
  // RFC 5322 compliant regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(email) || email.length > 254) {
    return false;
  }

  // Check for disposable email domains
  const disposableDomains = [
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "mailinator.com",
    "throwaway.email",
    "temp-mail.org",
  ];

  const domain = email.split("@")[1]?.toLowerCase();
  if (disposableDomains.includes(domain)) {
    return false;
  }

  return true;
}

/**
 * Advanced spam detection with ML-like scoring
 */
function detectSpam(
  name: string,
  email: string,
  message: string,
  company?: string,
): { isSpam: boolean; score: number; reason: string } {
  let spamScore = 0;
  const reasons: string[] = [];

  // Spam keywords (weighted)
  const spamKeywords = [
    { words: ["viagra", "casino", "lottery", "prize"], weight: 10 },
    { words: ["click here", "act now", "limited time"], weight: 5 },
    { words: ["free money", "earn money", "make money fast"], weight: 8 },
    {
      words: ["crypto", "bitcoin investment", "cryptocurrency"],
      weight: 6,
    },
    { words: ["weight loss", "enlarge", "pills"], weight: 7 },
    { words: ["nigerian prince", "inheritance"], weight: 10 },
    { words: ["seo", "backlinks", "rank higher"], weight: 4 },
  ];

  const combinedText =
    `${name} ${email} ${message} ${company || ""}`.toLowerCase();

  for (const { words, weight } of spamKeywords) {
    for (const word of words) {
      if (combinedText.includes(word)) {
        spamScore += weight;
        reasons.push(`Spam keyword: "${word}"`);
      }
    }
  }

  // Link detection
  const linkMatches = message.match(/https?:\/\//g);
  const linkCount = linkMatches ? linkMatches.length : 0;
  if (linkCount > 3) {
    spamScore += linkCount * 2;
    reasons.push(`Excessive links: ${linkCount}`);
  }

  // Excessive capitalization
  const caps = message.match(/[A-Z]/g);
  const capsRatio = caps ? caps.length / message.length : 0;
  if (capsRatio > 0.5 && message.length > 20) {
    spamScore += 5;
    reasons.push("Excessive capitalization");
  }

  // Repeated characters
  if (/(.)\1{5,}/.test(message)) {
    spamScore += 4;
    reasons.push("Repeated characters");
  }

  // Short message with links
  if (message.length < 30 && linkCount > 0) {
    spamScore += 6;
    reasons.push("Short message with links");
  }

  // Suspicious email patterns
  if (/\d{5,}@/.test(email)) {
    spamScore += 3;
    reasons.push("Suspicious email pattern");
  }

  // Name same as company (potential bot)
  if (company && name.toLowerCase() === company.toLowerCase()) {
    spamScore += 2;
    reasons.push("Name matches company");
  }

  // All caps name
  if (name === name.toUpperCase() && name.length > 2) {
    spamScore += 3;
    reasons.push("All caps name");
  }

  // Message too short or too long
  if (message.length < 10) {
    spamScore += 4;
    reasons.push("Message too short");
  }
  if (message.length > 4000) {
    spamScore += 3;
    reasons.push("Message too long");
  }

  // Emoji spam
  const emojiCount = (message.match(/[\u{1F600}-\u{1F64F}]/gu) || []).length;
  if (emojiCount > 5) {
    spamScore += 4;
    reasons.push("Excessive emojis");
  }

  return {
    isSpam: spamScore >= 15,
    score: spamScore,
    reason: reasons.join(", "),
  };
}

/**
 * Verify reCAPTCHA v3 token
 */
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("❌ RECAPTCHA_SECRET_KEY not configured");
    return false;
  }

  try {
    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${secretKey}&response=${token}`,
      },
    );

    const data = await response.json();

    // reCAPTCHA v3 returns a score from 0.0 to 1.0
    // 1.0 is very likely a good interaction, 0.0 is very likely a bot
    const isValid = data.success && data.score >= 0.5;

    if (!isValid) {
      console.warn(
        `⚠️ reCAPTCHA failed: Score ${data.score}, Success: ${data.success}`,
      );
    }

    return isValid;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

/**
 * Validate and sanitize file uploads
 */
function validateFile(file: { name: string; type: string; size: number }): {
  valid: boolean;
  error?: string;
} {
  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed: ${file.type}. Allowed types: PDF, images, Word docs, text files.`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check filename for malicious patterns
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.php$/i,
    /\.js$/i,
    /\.jar$/i,
  ];

  if (suspiciousPatterns.some((pattern) => pattern.test(file.name))) {
    return {
      valid: false,
      error: "Suspicious file extension detected",
    };
  }

  return { valid: true };
}

// ============================================================================
// 🎨 EMAIL TEMPLATE - ULTRA MODERN & BEAUTIFUL
// ============================================================================

function generateEmailHTML(
  name: string,
  email: string,
  message: string,
  subject: string,
  company: string,
  role: string,
  timestamp: string,
  files: Array<{ filename: string; size: number }>,
): string {
  const filesList =
    files.length > 0
      ? `
    <div style="margin-top: 24px; padding: 20px; background: rgba(218, 165, 32, 0.08); border-radius: 12px; border: 1px solid rgba(218, 165, 32, 0.2);">
      <div style="font-size: 13px; color: #DAA520; font-weight: 600; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
        📎 Attachments (${files.length})
      </div>
      ${files
        .map(
          (file) => `
        <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 6px;">
          <span style="font-size: 18px;">📄</span>
          <div style="flex: 1;">
            <div style="font-size: 13px; color: #fff; font-weight: 500;">${file.filename}</div>
            <div style="font-size: 11px; color: #888;">${(file.size / 1024).toFixed(1)} KB</div>
          </div>
        </div>
      `,
        )
        .join("")}
    </div>
  `
      : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Contact</title>
</head>
<body style="margin: 0; padding: 0; background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px; margin: 40px auto;">
    <tr>
      <td style="padding: 0 20px;">
        
        <!-- 🎯 HEADER -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px 20px 0 0; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: center; position: relative;">
              
              <!-- Top accent line -->
              <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #DAA520, #FFD700, #DAA520);"></div>
              
              <!-- Animated icon -->
              <div style="width: 90px; height: 90px; margin: 0 auto 24px; background: linear-gradient(135deg, #DAA520, #FFD700); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 30px rgba(218, 165, 32, 0.5); animation: pulse 2s infinite;">
                <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.56 13.72 12.44 13.72 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="#1a1a2e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <!-- Title -->
              <h1 style="margin: 0; font-size: 36px; font-weight: 900; background: linear-gradient(135deg, #DAA520, #FFD700); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; letter-spacing: -0.5px; text-shadow: 0 0 30px rgba(218, 165, 32, 0.3);">
                New Contact Message
              </h1>
              
              <p style="margin: 14px 0 0 0; font-size: 16px; color: #a0aec0; font-weight: 500;">
                🌟 Portfolio Inquiry · devamit.co.in
              </p>
              
              <!-- Timestamp badge -->
              <div style="margin-top: 24px; padding: 14px 28px; background: rgba(218, 165, 32, 0.15); border-radius: 50px; display: inline-block; border: 1px solid rgba(218, 165, 32, 0.3); box-shadow: 0 4px 12px rgba(218, 165, 32, 0.2);">
                <span style="font-size: 13px; color: #DAA520; font-weight: 700; letter-spacing: 0.5px;">
                  ⏰ ${timestamp}
                </span>
              </div>
              
            </td>
          </tr>
        </table>

        <!-- 📧 CONTENT -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #ffffff; box-shadow: 0 20px 60px rgba(0,0,0,0.15);">
          <tr>
            <td style="padding: 0;">
              
              <!-- Sender card -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 40px 40px 0 40px;">
                    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 16px; padding: 32px; border-left: 5px solid #DAA520; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                      
                      <!-- Profile circle -->
                      <div style="width: 70px; height: 70px; margin: 0 0 20px 0; background: linear-gradient(135deg, #DAA520, #FFD700); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(218, 165, 32, 0.3);">
                        <span style="font-size: 32px; font-weight: 900; color: #1a1a2e;">
                          ${name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <!-- Name -->
                      <div style="margin-bottom: 24px;">
                        <div style="font-size: 13px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          👤 Sender
                        </div>
                        <div style="font-size: 26px; color: #1a202c; font-weight: 800; letter-spacing: -0.5px;">
                          ${name}
                        </div>
                      </div>

                      <!-- Email -->
                      <div style="margin-bottom: 24px;">
                        <div style="font-size: 13px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          ✉️ Email Address
                        </div>
                        <a href="mailto:${email}" style="font-size: 16px; color: #DAA520; font-weight: 600; text-decoration: none; display: inline-block; padding: 10px 18px; background: rgba(218, 165, 32, 0.12); border-radius: 8px; transition: all 0.3s;">
                          ${email}
                        </a>
                      </div>

                      ${
                        company
                          ? `
                      <!-- Company -->
                      <div style="margin-bottom: 24px;">
                        <div style="font-size: 13px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          🏢 Company
                        </div>
                        <div style="font-size: 17px; color: #2d3748; font-weight: 600;">
                          ${company}
                        </div>
                      </div>
                      `
                          : ""
                      }

                      ${
                        role
                          ? `
                      <!-- Role -->
                      <div style="margin-bottom: 24px;">
                        <div style="font-size: 13px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          💼 Role / Position
                        </div>
                        <div style="font-size: 17px; color: #2d3748; font-weight: 600;">
                          ${role}
                        </div>
                      </div>
                      `
                          : ""
                      }

                      <!-- Subject -->
                      <div>
                        <div style="font-size: 13px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                          📝 Subject
                        </div>
                        <div style="font-size: 17px; color: #2d3748; font-weight: 600;">
                          ${subject || "General Inquiry"}
                        </div>
                      </div>
                      
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Message -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 30px 40px;">
                    
                    <div style="margin-bottom: 16px;">
                      <span style="font-size: 13px; color: #718096; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">💬 Message</span>
                    </div>
                    
                    <div style="background: #ffffff; border: 2px solid #e2e8f0; border-radius: 12px; padding: 32px; font-size: 15px; line-height: 1.8; color: #2d3748; white-space: pre-wrap; box-shadow: 0 2px 8px rgba(0,0,0,0.05); min-height: 100px;">
                      ${message}
                    </div>

                    ${filesList}
                    
                  </td>
                </tr>
              </table>

              <!-- Action buttons -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 0 40px 40px 40px;">
                    
                    <div style="text-align: center; margin-top: 24px;">
                      <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || "Your message")}" style="display: inline-block; padding: 18px 44px; background: linear-gradient(135deg, #DAA520, #FFD700); color: #1a1a2e; font-size: 16px; font-weight: 800; text-decoration: none; border-radius: 50px; box-shadow: 0 8px 24px rgba(218, 165, 32, 0.4); transition: all 0.3s; letter-spacing: 0.5px; text-transform: uppercase;">
                        ↩️ Reply to ${name.split(" ")[0]}
                      </a>
                    </div>
                    
                    <!-- Quick actions -->
                    <div style="display: flex; gap: 12px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
                      <a href="mailto:${email}" style="display: inline-block; padding: 12px 20px; border: 2px solid #e2e8f0; color: #4a5568; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px; transition: all 0.3s;">
                        📧 Send Email
                      </a>
                      <a href="https://www.linkedin.com/in/devamitch/" style="display: inline-block; padding: 12px 20px; border: 2px solid #e2e8f0; color: #4a5568; font-size: 13px; font-weight: 600; text-decoration: none; border-radius: 8px; transition: all 0.3s;">
                        💼 LinkedIn
                      </a>
                    </div>
                    
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>

        <!-- 🔒 FOOTER -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: #1a1a2e; border-radius: 0 0 20px 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
          <tr>
            <td style="padding: 32px 40px; text-align: center;">
              
              <!-- Security badge -->
              <div style="margin-bottom: 20px; display: inline-block; padding: 10px 20px; background: rgba(76, 175, 80, 0.15); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 8px;">
                <span style="font-size: 13px; color: #4CAF50; font-weight: 600;">
                  ✓ Verified · Spam-Protected · Secure Transmission
                </span>
              </div>
              
              <div style="margin-bottom: 18px;">
                <span style="font-size: 13px; color: #a0aec0; font-weight: 500;">
                  🔒 This message was securely transmitted via your portfolio contact form
                </span>
              </div>
              
              <div style="height: 1px; background: rgba(160, 174, 192, 0.2); margin: 24px 0;"></div>
              
              <div style="font-size: 13px; color: #718096;">
                <strong style="color: #DAA520;">devamit.co.in</strong> · Portfolio Contact System
              </div>
              
              <div style="margin-top: 16px; font-size: 12px; color: #4a5568;">
                © ${new Date().getFullYear()} Amit Chakraborty · All Rights Reserved
              </div>
              
              <!-- Tech badge -->
              <div style="margin-top: 20px; font-size: 10px; color: #4a5568; opacity: 0.7;">
                Powered by Next.js · Nodemailer · reCAPTCHA v3
              </div>
              
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

  <style>
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  </style>

</body>
</html>
  `;
}

// ============================================================================
// 🚀 API ROUTE HANDLER
// ============================================================================

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // Get IP address
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ip = forwardedFor?.split(",")[0] || realIp || "unknown";

    console.log(`📨 Contact form submission from IP: ${ip}`);

    // 1️⃣ RATE LIMITING
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      console.warn(
        `⚠️ Rate limit exceeded for IP: ${ip} (Blocked: ${rateLimit.blocked})`,
      );
      return NextResponse.json(
        {
          error: rateLimit.blocked
            ? "Your IP has been temporarily blocked due to excessive requests. Please try again in 1 hour."
            : "Too many requests. Please wait before sending another message.",
          rateLimitExceeded: true,
          blocked: rateLimit.blocked,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT_MAX.toString(),
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "Retry-After": "3600",
          },
        },
      );
    }

    // 2️⃣ PARSE REQUEST
    const body = await req.json();
    const {
      name,
      email,
      message,
      subject,
      company,
      role,
      recaptchaToken,
      files,
    } = body;

    // 3️⃣ VERIFY reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: "reCAPTCHA verification required" },
        { status: 400 },
      );
    }

    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      console.warn(`⚠️ reCAPTCHA failed for IP: ${ip}`);
      return NextResponse.json(
        {
          error:
            "reCAPTCHA verification failed. Please refresh the page and try again.",
        },
        { status: 400 },
      );
    }

    // 4️⃣ VALIDATE REQUIRED FIELDS
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          error:
            "Missing required fields. Please provide name, email, and message.",
        },
        { status: 400 },
      );
    }

    // 5️⃣ SANITIZE INPUTS
    const sanitizedName = sanitizeInput(name, 100);
    const sanitizedEmail = sanitizeInput(email, 254);
    const sanitizedMessage = sanitizeInput(message, 5000);
    const sanitizedSubject = subject ? sanitizeInput(subject, 200) : "";
    const sanitizedCompany = company ? sanitizeInput(company, 150) : "";
    const sanitizedRole = role ? sanitizeInput(role, 100) : "";

    // 6️⃣ VALIDATE NAME
    if (sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 },
      );
    }

    // 7️⃣ VALIDATE EMAIL
    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address or disposable email detected" },
        { status: 400 },
      );
    }

    // 8️⃣ VALIDATE MESSAGE
    if (sanitizedMessage.length < 10 || sanitizedMessage.length > 5000) {
      return NextResponse.json(
        { error: "Message must be between 10 and 5000 characters" },
        { status: 400 },
      );
    }

    // 9️⃣ SPAM DETECTION
    const spamCheck = detectSpam(
      sanitizedName,
      sanitizedEmail,
      sanitizedMessage,
      sanitizedCompany,
    );

    if (spamCheck.isSpam) {
      console.warn(
        `⚠️ SPAM DETECTED from ${sanitizedEmail} (${ip}): Score ${spamCheck.score} - ${spamCheck.reason}`,
      );
      return NextResponse.json(
        {
          error:
            "Your message was flagged as spam. If this is a mistake, please contact us directly at amit98ch@gmail.com",
          spamScore: spamCheck.score,
        },
        { status: 400 },
      );
    }

    // 🔟 VALIDATE FILES
    const validatedFiles: Array<{
      filename: string;
      size: number;
      data: string;
    }> = [];
    if (files && Array.isArray(files)) {
      if (files.length > MAX_FILES) {
        return NextResponse.json(
          { error: `Maximum ${MAX_FILES} files allowed` },
          { status: 400 },
        );
      }

      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error },
            { status: 400 },
          );
        }
        validatedFiles.push({
          filename: sanitizeInput(file.name, 255),
          size: file.size,
          data: file.data, // base64 data
        });
      }
    }

    // 1️⃣1️⃣ VERIFY ENVIRONMENT VARIABLES
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("❌ Missing email configuration");
      return NextResponse.json(
        {
          error:
            "Email service not configured. Please contact the administrator.",
        },
        { status: 500 },
      );
    }

    // 1️⃣2️⃣ CREATE TRANSPORTER
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Verify transporter
    try {
      await transporter.verify();
    } catch (verifyError) {
      console.error("❌ Email transporter verification failed:", verifyError);
      return NextResponse.json(
        {
          error:
            "Email service is currently unavailable. Please try again later.",
        },
        { status: 500 },
      );
    }

    // 1️⃣3️⃣ GENERATE TIMESTAMP
    const timestamp = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });

    // 1️⃣4️⃣ PREPARE ATTACHMENTS
    const attachments = validatedFiles.map((file) => ({
      filename: file.filename,
      content: file.data.split(",")[1], // Remove data:image/png;base64, prefix
      encoding: "base64",
    }));

    // 1️⃣5️⃣ SEND EMAIL
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.GMAIL_USER}>`,
      to: "amit98ch@gmail.com",
      replyTo: sanitizedEmail,
      subject:
        sanitizedSubject ||
        `New Portfolio Contact: ${sanitizedName}${sanitizedCompany ? ` (${sanitizedCompany})` : ""}`,
      html: generateEmailHTML(
        sanitizedName,
        sanitizedEmail,
        sanitizedMessage,
        sanitizedSubject,
        sanitizedCompany,
        sanitizedRole,
        timestamp,
        validatedFiles.map((f) => ({ filename: f.filename, size: f.size })),
      ),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    await transporter.sendMail(mailOptions);

    const processingTime = Date.now() - startTime;
    console.log(
      `✅ Email sent successfully to amit98ch@gmail.com from ${sanitizedEmail} (${processingTime}ms)`,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
        processingTime,
        spamScore: spamCheck.score,
        filesAttached: validatedFiles.length,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT_MAX.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      },
    );
  } catch (error) {
    console.error("❌ Contact form error:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "operational",
    service: "Portfolio Contact API",
    version: "2.0.0",
    features: [
      "reCAPTCHA v3",
      "Rate Limiting",
      "Spam Detection",
      "File Uploads",
      "Email Validation",
    ],
    timestamp: new Date().toISOString(),
  });
}
