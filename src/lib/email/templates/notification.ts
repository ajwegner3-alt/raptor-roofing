import { baseTemplate, type BaseTemplateOptions } from "./base";
import { escapeHtml } from "../utils";

export interface NotificationTemplateOptions extends Partial<BaseTemplateOptions> {
  /** Notification title, e.g. "New Contact Form Submission" */
  title: string;
  /** Key-value fields to display in a table */
  fields: Record<string, string | undefined>;
  /** Optional note at the bottom */
  note?: string;
}

/**
 * Internal notification template — for alerting you (the admin) about
 * form submissions, signups, etc.
 */
export function notificationTemplate(options: NotificationTemplateOptions): string {
  const rows = Object.entries(options.fields)
    .map(([key, value], i) => {
      const bg = i % 2 === 0 ? "background-color: #f8fafc;" : "";
      const display = value
        ? (key.toLowerCase() === "email"
            ? `<a href="mailto:${escapeHtml(value)}" style="color: #3b82f6;">${escapeHtml(value)}</a>`
            : escapeHtml(value))
        : '<em style="color:#94a3b8;">Not provided</em>';

      return `
        <tr style="${bg}">
          <td style="padding: 10px 12px; font-weight: 600; width: 140px; color: #475569;">${escapeHtml(key)}</td>
          <td style="padding: 10px 12px;">${display}</td>
        </tr>`;
    })
    .join("");

  const content = `
    <h2 style="color: #0f172a; border-bottom: 2px solid #3b82f6; padding-bottom: 8px; margin: 0 0 16px 0;">
      ${escapeHtml(options.title)}
    </h2>

    <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
      ${rows}
    </table>

    ${options.note ? `<p style="margin-top: 24px; font-size: 13px; color: #94a3b8;">${options.note}</p>` : ""}
  `;

  return baseTemplate({ ...options, content });
}
