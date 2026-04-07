const axios = require("axios");

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

async function sendMail({ to, subject, html, text }) {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
      console.warn("[Mailer] BREVO_API_KEY missing");
      console.log(`Fallback email -> ${to}`);
      return { ok: true, fallback: true };
    }

    if (!to) {
      throw new Error("Recipient email is required");
    }

    const APP_NAME = process.env.APP_NAME || "SparkLink";
    const FROM_EMAIL =
      process.env.SMTP_FROM || "no-reply@sparklink.com";

    // ✅ CRITICAL FIX (NEVER EMPTY)
    let textContent = text;

    if (!textContent || textContent.trim() === "") {
      textContent = stripHtml(html);
    }

    // ⚠️ still empty? force fallback
    if (!textContent) {
      textContent = `Message from ${APP_NAME}`;
    }

    // 🚀 API call
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: APP_NAME,
          email: FROM_EMAIL,
        },
        to: [{ email: to }],
        subject: subject || "No Subject",
        htmlContent: html || "",
        textContent: textContent, // 🔥 ALWAYS VALID NOW
      },
      {
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return {
      ok: true,
      messageId: response.data?.messageId || null,
    };
  } catch (err) {
    console.log(
      "[Mailer] Brevo send failed:",
      err.response?.data || err.message
    );
    console.error(
      "[Mailer] Brevo send failed:",
      err.response?.data || err.message
    );

    return {
      ok: false,
      error: err.response?.data || err.message,
    };
  }
}

module.exports = { sendMail };