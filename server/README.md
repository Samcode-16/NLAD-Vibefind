# VibeFind Email Server

## Overview
This Express server provides a fallback email solution for the VibeFind contact form. While EmailJS is the recommended primary method, this server can be used as a backup or alternative solution.

## 📧 Email Configuration Options

### Option 1: EmailJS (Recommended)
EmailJS allows sending emails directly from the client-side without running a server. This is the preferred method for its simplicity and reliability.

### Option 2: Express Server (Alternative)
This server accepts POST requests at `/send-feedback` and forwards them as emails using SMTP.

## 🚀 Server Setup

1. Copy `.env.example` to `.env` and fill in your SMTP settings. For Gmail:
   - Use `SMTP_HOST=smtp.gmail.com`
   - Use `SMTP_PORT=465` and `SMTP_SECURE=true`
   - `SMTP_USER` should be the Gmail address sending the mail
   - `SMTP_PASS` should be an app password (Google no longer allows plain password access in many cases). Create an App Password in your Google Account settings.
   - `FEEDBACK_TO` set to `artappreciating@gmail.com` (already default)

2. Install dependencies and start server:

```powershell
cd server
npm install
npm start
```

3. By default the client attempts to send to http://localhost:3001/send-feedback. If your server runs on a different host/port, set `window.FEEDBACK_ENDPOINT` in a client script before including `js/contact.js`, for example in your HTML:

```html
<script>window.FEEDBACK_ENDPOINT = 'https://your-server.example.com';</script>
<script src="../js/contact.js"></script>
```

Security notes

- Do not commit `.env` with credentials. The `.gitignore` file in the server folder already ignores it.
- For production, consider using a transactional email provider (SendGrid, Mailgun) with API keys and HTTPS, or a serverless email function.

EmailJS (no-server) — alternative
---------------------------------
If you prefer not to run a backend, you can use EmailJS (https://www.emailjs.com/) to send emails directly from the client.

Steps (EmailJS):
1. Sign up at EmailJS and create an email service (e.g., connect Gmail, or use their service).
2. Create an email template that expects variables like `from_name`, `from_email`, `subject`, `message`.
3. Note your `serviceId`, `templateId`, and `publicKey` (also called user ID / public key).
4. In your HTML page (before the `js/contact.js` script), set `window.EMAILJS_CONFIG` with those values. Example:

```html
<script>
   window.EMAILJS_CONFIG = {
      serviceId: 'service_xxx',
      templateId: 'template_xxx',
      publicKey: 'your_public_key'
   };
</script>
<script src="../js/contact.js"></script>
```

The client-side `js/contact.js` will detect `window.EMAILJS_CONFIG` and prefer to send via EmailJS. If EmailJS fails or is not configured, the script falls back to POSTing to the local `/send-feedback` server endpoint.

Security note for EmailJS: Public keys are meant to be used in client-side code; avoid embedding any secret keys in front-end code.
