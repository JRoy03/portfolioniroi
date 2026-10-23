# Portfolio contact form

The contact form uses the Vercel serverless endpoint in `api/contact.js` and the Resend email API. The recipient is fixed to `jdaulong03@gmail.com`; replies go to the visitor's submitted email address.

If the endpoint is unavailable, the contact form offers links to create a prefilled draft in Gmail or the visitor's default email app. The visitor must review and send that draft themselves.

## Configure email delivery

1. Deploy this site to Vercel.
2. In the Resend dashboard, create an API key and verify a sending domain.
3. Add these environment variables in the Vercel project settings:
   - `RESEND_API_KEY`: the Resend API key.
   - `CONTACT_FROM_EMAIL`: a sender address on the verified domain, such as `Portfolio <contact@example.com>`.
4. Redeploy after adding or changing environment variables.

Keep these values in Vercel's server-side environment settings. Do not put them in `index.html`, `openapi.yaml`, or any other browser-delivered file. The OpenAPI document describes the public contact endpoint; it does not contain the Resend credential.
