# Fixing Contact Form 500 Error on Vercel

## Problem
The contact form is returning a 500 Internal Server Error because the email service is not configured in your Vercel deployment.

## Solution

### Step 1: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already enabled)
3. Scroll down to **App passwords**
4. Select app: **Mail**
5. Select device: **Other (Custom name)** → Enter "Portfolio Contact Form"
6. Click **Generate**
7. Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Add Environment Variables to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project: **abdirashid-portfolio**
3. Click **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Example |
|--------------|-------|---------|
| `SMTP_HOST` | `smtp.gmail.com` | smtp.gmail.com |
| `SMTP_PORT` | `587` | 587 |
| `SMTP_USER` | Your Gmail address | your-email@gmail.com |
| `SMTP_PASS` | The app password from Step 1 | abcdefghijklmnop |
| `EMAIL_FROM` | Your Gmail address | your-email@gmail.com |
| `ADMIN_EMAIL` | Email to receive contact form submissions | your-email@gmail.com |
| `MONGO_URI` | Your MongoDB connection string | (already configured?) |
| `JWT_SECRET` | Your JWT secret | (already configured?) |
| `JWT_REFRESH_SECRET` | Your JWT refresh secret | (already configured?) |

5. Make sure to select **Production**, **Preview**, and **Development** for each variable
6. Click **Save**

### Step 3: Redeploy

Option 1: **Automatic Redeploy**
- Push any change to your GitHub repository
- Vercel will automatically redeploy

Option 2: **Manual Redeploy**
1. Go to **Deployments** tab in Vercel
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Confirm

### Step 4: Test

1. Visit your deployed site: https://abdirashid-portfolio.vercel.app
2. Navigate to the Contact page
3. Fill out and submit the form
4. You should receive:
   - A success message
   - An email to your admin email
   - The sender should receive an auto-reply

## Alternative: Use Resend (Recommended for Production)

Instead of Gmail SMTP (which has daily limits), you can use **Resend** - a modern email service designed for developers:

1. Sign up at https://resend.com (free tier: 3,000 emails/month)
2. Get your API key
3. I can help you update the code to use Resend instead

Let me know if you'd like to switch to Resend!

## Troubleshooting

### Still getting 500 error?
- Check Vercel logs: Go to **Deployments** → Click on latest deployment → **Function Logs**
- Look for the error: "❌ Missing email environment variables"

### Gmail blocking sign-ins?
- Make sure 2-factor authentication is enabled
- Use an App Password, not your regular password
- Check "Less secure app access" is OFF (you should use App Passwords instead)

### Not receiving emails?
- Check your spam folder
- Verify `ADMIN_EMAIL` is correct
- Check Vercel function logs for errors
