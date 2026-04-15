import { baseTemplate, type BaseTemplateOptions } from "./base";
import { escapeHtml } from "../utils";

export interface LeadMagnetTemplateOptions extends Partial<BaseTemplateOptions> {
  /** Name of the resource, e.g. "Contractor SEO Checklist" */
  resourceName: string;
  /** File name of the attachment, e.g. "Contractor-SEO-Checklist.pdf" */
  attachmentFileName: string;
  /** CTA URL, e.g. "https://nsintegrations.com/audit" */
  ctaUrl?: string;
  /** CTA button text */
  ctaText?: string;
  /** Accent color for the CTA button */
  accentColor?: string;
}

/**
 * Lead magnet delivery email template.
 * Shows: thanks message, attachment note, CTA for further engagement.
 */
export function leadMagnetTemplate(options: LeadMagnetTemplateOptions): string {
  const accent = options.accentColor || "#1e40af";
  const ctaUrl = options.ctaUrl || "https://nsintegrations.com/audit";
  const ctaText = options.ctaText || "Get Your Free Website Audit";

  const content = `
    <h2 style="color: #0f172a; font-size: 22px; margin: 0 0 16px 0;">
      Here's your ${escapeHtml(options.resourceName)}
    </h2>

    <p style="font-size: 15px; line-height: 1.7; color: #334155; margin: 0 0 24px 0;">
      Thanks for requesting this resource. Your PDF is attached to this email &mdash;
      save it for future reference.
    </p>

    <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 0 0 28px 0;">
      <p style="font-size: 14px; color: #475569; margin: 0 0 4px 0; font-weight: 600;">
        &#128206; Attached: ${escapeHtml(options.attachmentFileName)}
      </p>
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        Check your attachments or downloads folder if you don't see it.
      </p>
    </div>

    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 28px 0;" />

    <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 8px 0;">
      Want to know how your website stacks up?
    </h3>
    <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
      We offer a free website audit &mdash; no strings attached.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <a
        href="${escapeHtml(ctaUrl)}"
        style="display: inline-block; background-color: ${accent}; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;"
      >
        ${escapeHtml(ctaText)}
      </a>
    </div>
  `;

  return baseTemplate({ ...options, content });
}
