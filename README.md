# AcumenSpace – SaaS LMS (Learning Management System)

## 🚀 Overview

AcumenSpace is SaaS platform designed to transform knowledge into thriving businesses. It empowers creators to launch and monetize their own online courses and communities, featuring custom domains, affiliate programs, and multi-vendor functionality, making it a complete Learning Management System (LMS) solution.
AcumenSpace is a scalable, user-friendly SaaS platform that empowers creators to launch and monetize their own online courses and communities. It includes support for custom domains, affiliate programs, and multi-vendor functionality, making it a complete Learning Management System (LMS) solution.

## 🏗️ Tech Stack

- **Frontend:** Next.js 15
- **Backend:** Supabase
- **Authentication:** Clerk
- **Storage & Media:** Uploadcare
- **Hosting & Deployment:** Cloudways
- **Payments & Subscriptions:** Stripe

## 🎯 Key Achievements

- \*\*Boosted user retention through a smoother and more intuitive onboarding experience.
- **Eliminated video hosting costs ($0)** by optimizing storage and delivery, saving thousands while maintaining high performance.
- **Enhanced engagement** with real-time chat, an event calendar, and a Notion-style editor, making learning and content creation seamless.
- **Developed an advanced analytics dashboard** to track revenue, user growth, and key metrics while ensuring 99.9% uptime.

## ✨ Features

- 🎥 **Create and host course modules with $0 video hosting**
- 📃 **Custom about pages for groups**
- ✍️ **Node-based text editor like Notion**
- 📱 **Create posts, like, and comment on posts**
- 🎨 **Beautiful and improved custom UI**
- ⚙️ **Production-ready setup with Husky, linters, and more**
- 📅 **Calendar and events for groups**
- 💬 **Real-time chat for groups (if time allows)**
- - 💰 **Custom single-line Stripe component with animations**
- 🏝️ **New pricing model:** 1 group for **$9/m**
- 🎁 **Free and paid groups**
- 🏆 **Custom onboarding to increase conversions**
- 🧑‍💼 **Multi-vendor support**
- ✍️ **Custom Clerk sign-in & sign-out system**
- 🤝 **Affiliate marketing system for groups and platform-wide**
- 💥 **Custom domain hosting with white-labeling using name servers**
- 📄 **Beautiful landing page for the app**
- 🗺️ **Explore page listing all groups**
- 🔍 **Performant search functionality**
- 🛝 **Custom infinite carousels with infinite scroll**
- 🔢 **Pagination with infinite scroll**
- 📊 **Dashboard to track group metrics**
- 🟣 **And much more...**

## 🔧 Installation

To run AcumenSpace locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/your-username/acumenspace.git
cd acumenspace

# Install dependencies
npm install

# Set up environment variables (.env file required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_api_key
NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY=your_uploadcare_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Start the development server
npm run dev
```

## 🏗️ Usage

- **Sign Up/Login:** Users can register using Clerk authentication.
- **Create a Group:** Set up a community with a custom domain.
- **Upload Courses:** Use Uploadcare for seamless media storage.
- **Monetization:** Use Stripe to manage subscriptions and payments.
- **Engagement:** Leverage real-time chat, events, and posts.
