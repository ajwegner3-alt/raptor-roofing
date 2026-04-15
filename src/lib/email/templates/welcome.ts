import { baseTemplate, type BaseTemplateOptions } from "./base";
import { escapeHtml } from "../utils";

export interface WelcomeTemplateOptions extends Partial<BaseTemplateOptions> {
  /** Recipient's name (optional) */
  recipientName?: string;
  /** Headline */
  headline?: string;
  /** Body paragraphs */
  body: string[];
  /** CTA URL */
  ctaUrl?: string;
  /** CTA button text */
  ctaText?: string;
  /** Accent color */
  accentColor?: string;
}

/**
 * Welcome / confirmation email template.
 * Use for: newsletter confirmations, onboarding, thank-you emails.
 */
export function welcomeTemplate(options: WelcomeTemplateOptions): string {
  const accent = options.accentColor || "#1e40af";
  const name = options.recipientName ? escapeHtml(options.recipientName) : null;
  const headline = options.headline || (name ? `Welcome, ${name}!` : "Welcome!");

  const bodyHtml = options.body
    .map(
      (p) =>
        `<p style="font-size: 15px; line-height: 1.7; color: #334155; margin: 0 0 16px 0;">${p}</p>`
    )
    .join("");

  const ctaHtml = options.ctaUrl
    ? `
    <div style="text-align: center; margin: 28px 0;">
      <a
        href="${escapeHtml(options.ctaUrl)}"
        style="display: inline-block; background-color: ${accent}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;"
      >
        ${escapeHtml(options.ctaText || "Get Started")}
      </a>
    </div>`
    : "";

  const content = `
    <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 20px 0;">
      ${escapeHtml(headline)}
    </h2>
    ${bodyHtml}
    ${ctaHtml}
  `;

  return baseTemplate({ ...options, content });
}
