import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: "ONWA <onboard@resend.dev>",
      to: email,
      subject: "Welcome to ONWA",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #131313; font-size: 24px; margin-bottom: 20px;">Welcome to ONWA</h1>
          <p style="color: #666; line-height: 1.6;">
            Dear ${name},
          </p>
          <p style="color: #666; line-height: 1.6;">
            Welcome to ONWA, the African digital museum. We're honored to have you join our collector circle.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Begin exploring our curated collection of African digital artworks, each telling a unique story of heritage and spirituality.
          </p>
          <p style="color: #666; line-height: 1.6;">
            With reverence,<br>
            The ONWA Team
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  artworkTitle: string
) {
  try {
    await resend.emails.send({
      from: "ONWA <onboard@resend.dev>",
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #131313; font-size: 24px; margin-bottom: 20px;">Order Confirmed</h1>
          <p style="color: #666; line-height: 1.6;">
            Your order ${orderNumber} has been confirmed.
          </p>
          <p style="color: #666; line-height: 1.6;">
            Artwork: ${artworkTitle}
          </p>
          <p style="color: #666; line-height: 1.6;">
            You can download your artwork from your Collector Dashboard.
          </p>
          <p style="color: #666; line-height: 1.6;">
            With reverence,<br>
            The ONWA Team
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendDownloadReadyEmail(
  email: string,
  artworkTitle: string,
  downloadUrl: string
) {
  try {
    await resend.emails.send({
      from: "ONWA <onboard@resend.dev>",
      to: email,
      subject: "Your Download is Ready",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #131313; font-size: 24px; margin-bottom: 20px;">Download Ready</h1>
          <p style="color: #666; line-height: 1.6;">
            Your download for "${artworkTitle}" is ready.
          </p>
          <p style="color: #666; line-height: 1.6;">
            <a href="${downloadUrl}" style="color: #131313; text-decoration: underline;">Download Now</a>
          </p>
          <p style="color: #666; line-height: 1.6;">
            This link will expire in 24 hours.
          </p>
          <p style="color: #666; line-height: 1.6;">
            With reverence,<br>
            The ONWA Team
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Failed to send email");
  }
}
