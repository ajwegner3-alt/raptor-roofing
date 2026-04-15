// Types
export type {
  EmailOptions,
  EmailResult,
  EmailAttachment,
  EmailClient,
  EmailClientConfig,
  EmailProvider,
} from "./types";

// Providers
import { createResendClient } from "./providers/resend";
import { createGmailClient } from "./providers/gmail";
import type { EmailClient, EmailClientConfig, EmailOptions, EmailResult, EmailProvider } from "./types";

// Templates
import { baseTemplate } from "./templates/base";
import { leadMagnetTemplate } from "./templates/lead-magnet";
import { notificationTemplate } from "./templates/notification";
import { welcomeTemplate } from "./templates/welcome";

export type { BaseTemplateOptions } from "./templates/base";
export type { LeadMagnetTemplateOptions } from "./templates/lead-magnet";
export type { NotificationTemplateOptions } from "./templates/notification";
export type { WelcomeTemplateOptions } from "./templates/welcome";

// Utilities
export { escapeHtml, stripHtml } from "./utils";

// ---------------------------------------------------------------------------
// Template bundle
// ---------------------------------------------------------------------------

export const templates = {
  base: baseTemplate,
  leadMagnet: leadMagnetTemplate,
  notification: notificationTemplate,
  welcome: welcomeTemplate,
};

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------

/**
 * Create an email client with explicit configuration.
 *
 * ```ts
 * const client = createEmailClient({
 *   provider: 'resend',
 *   apiKey: 're_xxx',
 *   defaultFrom: 'Name <email@domain.com>',
 * });
 * ```
 */
export function createEmailClient(config: EmailClientConfig): EmailClient {
  switch (config.provider) {
    case "resend":
      return createResendClient(config);
    case "gmail":
      return createGmailClient(config);
    default:
      throw new Error(
        `[email-sender] Unknown provider: "${config.provider}". Use "resend" or "gmail".`
      );
  }
}

// ---------------------------------------------------------------------------
// Quick send — auto-detects provider from env vars
// ---------------------------------------------------------------------------

let _defaultClient: EmailClient | null = null;

function getDefaultClient(): EmailClient {
  if (_defaultClient) return _defaultClient;

  const provider = (process.env.EMAIL_PROVIDER || "resend") as EmailProvider;

  if (provider === "resend") {
    _defaultClient = createEmailClient({
      provider: "resend",
      apiKey: process.env.RESEND_API_KEY,
      defaultFrom: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    });
  } else if (provider === "gmail") {
    _defaultClient = createEmailClient({
      provider: "gmail",
      user: process.env.GMAIL_USER,
      appPassword: process.env.GMAIL_APP_PASSWORD,
      fromName: process.env.GMAIL_FROM_NAME || "Notification",
    });
  } else {
    throw new Error(
      `[email-sender] EMAIL_PROVIDER="${provider}" is not supported. Use "resend" or "gmail".`
    );
  }

  return _defaultClient;
}

/**
 * Quick-send an email using the default provider (auto-detected from env vars).
 *
 * ```ts
 * const result = await sendEmail({
 *   to: 'customer@example.com',
 *   subject: 'Hello',
 *   html: '<h1>Hi there</h1>',
 * });
 * ```
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
  try {
    const client = getDefaultClient();
    return client.send(options);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: msg };
  }
}
