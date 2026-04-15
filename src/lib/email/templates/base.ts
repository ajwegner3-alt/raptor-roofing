export interface BaseTemplateOptions {
  /** Brand name shown in header, e.g. "North Star Integrations" */
  brandName?: string;
  /** Tagline under the brand name */
  tagline?: string;
  /** Dark header background color */
  headerBg?: string;
  /** Header text color */
  headerText?: string;
  /** Accent color for buttons and links */
  accentColor?: string;
  /** Muted text color */
  mutedColor?: string;
  /** Footer text (supports HTML) */
  footerHtml?: string;
  /** The main content HTML (injected into the body area) */
  content: string;
}

const DEFAULTS = {
  brandName: "North Star Integrations",
  tagline: "Web Design &amp; SEO for Local Businesses",
  headerBg: "#1E293B",
  headerText: "#F1F5F9",
  accentColor: "#1e40af",
  mutedColor: "#94a3b8",
  footerHtml: `
    North Star Integrations &mdash; Omaha, NE<br />
    <a href="https://nsintegrations.com" style="color: #94a3b8;">nsintegrations.com</a>
    &nbsp;&bull;&nbsp;
    <a href="tel:+14028073103" style="color: #94a3b8;">(402) 807-3103</a>
    &nbsp;&bull;&nbsp;
    <a href="mailto:communications@nsintegrations.com" style="color: #94a3b8;">communications@nsintegrations.com</a>
  `,
};

/**
 * Base email template. Wraps content in a branded header/footer shell.
 * All brand elements are customizable — use defaults for NSI or override per project.
 */
export function baseTemplate(options: BaseTemplateOptions): string {
  const o = { ...DEFAULTS, ...options };

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 24px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <!-- Header -->
    <div style="background-color: ${o.headerBg}; padding: 24px 32px;">
      <h1 style="color: ${o.headerText}; font-size: 20px; margin: 0; font-weight: 700;">
        ${o.brandName}
      </h1>
      ${o.tagline ? `<p style="color: ${o.mutedColor}; font-size: 13px; margin: 4px 0 0 0;">${o.tagline}</p>` : ""}
    </div>

    <!-- Content -->
    <div style="padding: 32px;">
      ${o.content}
    </div>

    <!-- Footer -->
    <div style="padding: 20px 32px; border-top: 1px solid #e2e8f0;">
      <p style="font-size: 12px; color: ${o.mutedColor}; margin: 0; line-height: 1.6;">
        ${o.footerHtml}
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}
