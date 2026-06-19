# Deployment Guide - Food Tracker Dashboard

## 🚀 Deploy to Vercel (Free)

### Prerequisites
- ✅ Neon PostgreSQL database already set up
- ✅ Database schema already created
- ✅ Code pushed to GitHub

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository

1. After signing in, click **Add New** → **Project**
2. Find `food-tracker-dashboard` in your repository list
3. Click **Import**

### Step 3: Configure Environment Variables

In the deployment settings, add this environment variable:

**Key:** `DATABASE_URL`
**Value:** `<YOUR_NEON_CONNECTION_STRING_HERE>`

(Get this from your Neon dashboard at https://console.neon.tech)
It should look like: `postgresql://user:password@ep-xxx-xxx.aws.neon.tech/neondb?sslmode=require`

### Step 4: Deploy

1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://food-tracker-dashboard-[random].vercel.app`

### Step 5: Get Your Live URL

After deployment, Vercel will give you a URL like:
```
https://food-tracker-dashboard-xyz123.vercel.app
```

You can:
- Share this URL with anyone
- Add a custom domain (optional)
- Enable automatic deployments (already enabled)

---

## 🔄 Auto-Deployment

Every time you push to GitHub, Vercel automatically:
1. Detects the changes
2. Builds your app
3. Deploys the new version
4. Updates your live URL

---

## 🗄️ Database Management

Your Neon database:
- **Dashboard:** https://console.neon.tech
- **Connection String:** Already configured in Vercel
- **Free Tier:** 3GB storage (more than enough)

---

## 📊 Monitor Your App

In Vercel Dashboard, you can:
- View deployment logs
- Monitor performance
- Check visitor analytics
- Set up custom domains

---

## 🔒 Security Note

⚠️ **Important:** Your database credentials are stored securely in Vercel environment variables.
Never commit `.env.local` to GitHub (it's already in .gitignore).

---

## ✅ Verification Checklist

After deployment:
- [ ] App loads at Vercel URL
- [ ] Can add entries via form
- [ ] Charts display data correctly
- [ ] Data persists after page refresh
- [ ] Database connection indicator shows green

---

## 🆘 Troubleshooting

**Issue: Database connection failed**
- Check DATABASE_URL in Vercel environment variables
- Verify Neon database is active at console.neon.tech

**Issue: Build failed**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json

**Issue: Charts not showing**
- Clear browser cache (Ctrl + F5)
- Check browser console for errors

---

## 📱 Share Your App

Your deployed URL works on:
- ✅ Desktop browsers
- ✅ Mobile devices
- ✅ Tablets
- ✅ Any device with internet

Just share the Vercel URL!

---

## 🎯 Next Steps (Optional)

1. **Add Custom Domain:** Settings → Domains in Vercel
2. **Enable Analytics:** Built-in Vercel Analytics
3. **Add Authentication:** Protect your dashboard
4. **Export Data:** Add CSV export feature

---

**Ready to deploy? Follow Step 1 above!** 🚀
