# Food Tracker Dashboard

A modern full-stack web application for tracking daily food product quantities across three bucket sizes (Small, Medium, Large) for June and July 2026.

Built with **Next.js 14**, **TypeScript**, **PostgreSQL (Neon)**, and **Recharts**.

🌐 **[Live Demo](#)** | 📊 **[GitHub](https://github.com/AvishManiar21/food-tracker-dashboard)**

---

## ✨ Features

- 📊 **Real-time Data Entry** - Add food quantities with instant database persistence
- 💾 **Cloud PostgreSQL** - Neon serverless database (3GB free)
- 📈 **Interactive Charts** - Three horizontal bar charts comparing June vs July
- 🎯 **59 Products** - Track all food products across three bucket sizes
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Next.js 14 with App Router
- 🔒 **Secure** - Environment variables for sensitive data

---

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts for data visualization

**Backend:**
- Next.js API Routes
- PostgreSQL (Neon serverless)
- pg library

**Deployment:**
- Vercel (Frontend + API)
- Neon (Database)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL account (free)

### 1. Clone the Repository

```bash
git clone https://github.com/AvishManiar21/food-tracker-dashboard.git
cd food-tracker-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Database

**Create a Neon Account:**
1. Go to https://neon.tech
2. Sign up (free, no credit card required)
3. Create a new project
4. Copy the connection string

**Set Up Environment Variables:**

Create `.env.local` in the root directory:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
NODE_ENV=development
```

Replace with your actual Neon connection string.

**Create Database Schema:**

```bash
node scripts/setup-neon-db.js
```

You should see:
```
✓ Connected successfully!
✓ Database schema created successfully!
✓ Neon database is ready to use!
```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📦 Project Structure

```
food-tracker-dashboard/
├── app/
│   ├── api/
│   │   └── entries/
│   │       ├── route.ts          # GET/POST/DELETE entries
│   │       └── monthly/route.ts  # Monthly aggregations
│   ├── components/
│   │   └── FoodTrackerDashboard.tsx  # Main dashboard component
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── lib/
│   ├── db.ts                     # Database connection
│   └── constants.ts              # Products and bucket sizes
├── scripts/
│   ├── setup-neon-db.js          # Database setup script
│   └── test-connection.js        # Connection test
├── database_schema.sql           # SQL schema
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind configuration
└── package.json                  # Dependencies
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

**Full deployment guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Steps:**

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variable:
   - Key: `DATABASE_URL`
   - Value: Your Neon connection string
5. Click Deploy

Your app will be live at: `https://food-tracker-dashboard-[random].vercel.app`

**Auto-Deployment:** Every git push automatically deploys to Vercel.

---

## 📊 API Endpoints

### GET `/api/entries`
Get all food entries for a date range.

**Query Parameters:**
- `startDate` (optional): Start date (default: 2026-06-19)
- `endDate` (optional): End date (default: 2026-07-31)

**Response:**
```json
[
  {
    "id": 1,
    "entry_date": "2026-06-19",
    "product": "PICO",
    "bucket_size": "Small",
    "quantity": 10.5,
    "created_at": "2026-06-18T12:00:00Z",
    "updated_at": "2026-06-18T12:00:00Z"
  }
]
```

### POST `/api/entries`
Add or update a food entry.

**Request Body:**
```json
{
  "entry_date": "2026-06-19",
  "product": "PICO",
  "bucket_size": "Small",
  "quantity": 10.5
}
```

**Response:**
```json
{
  "id": 1,
  "entry_date": "2026-06-19",
  "product": "PICO",
  "bucket_size": "Small",
  "quantity": 10.5,
  "created_at": "2026-06-18T12:00:00Z",
  "updated_at": "2026-06-18T12:00:00Z"
}
```

### GET `/api/entries/monthly`
Get monthly aggregations.

**Response:**
```json
[
  {
    "product": "PICO",
    "bucket_size": "Small",
    "month": "2026-06-01T00:00:00.000Z",
    "total_quantity": "150.5"
  }
]
```

### DELETE `/api/entries`
Clear all entries (use with caution).

---

## 🗄️ Database Schema

**Table:** `food_entries`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| entry_date | DATE | Date of entry (2026-06-19 to 2026-07-31) |
| product | VARCHAR(100) | Product name (one of 59 products) |
| bucket_size | VARCHAR(20) | Small, Medium, or Large |
| quantity | NUMERIC(10,2) | Quantity value |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Constraints:**
- Unique constraint on `(entry_date, product, bucket_size)`
- Check constraint on `bucket_size` (must be Small, Medium, or Large)
- Check constraint on `quantity` (must be >= 0)

**Indexes:**
- `idx_entry_date` on `entry_date`
- `idx_product` on `product`
- `idx_bucket_size` on `bucket_size`
- `idx_date_product` on `(entry_date, product)`

---

## 🧪 Testing

**Test Database Connection:**
```bash
node scripts/test-connection.js
```

**Test API Locally:**
```bash
# Start dev server
npm run dev

# In another terminal, test API
curl http://localhost:3000/api/entries
```

---

## 🔒 Security

- Database credentials stored in environment variables
- `.env.local` excluded from git
- SSL required for database connections
- Input validation on all API endpoints
- CORS enabled only for same-origin requests

---

## 📝 Products List (59 Total)

PICO, CHOPPED TOM, RED ENCH SAUCE, GREEN ENCH SAUCE, DARK RED ENCH SAUSE, MILD (PESTO), BAJA SAUCE, TARTER SAUCE, LETTUCE, CHEESE (SHREDDED), RANCHERO SAUCE, PANCACKE MIX, RED BEEF TAMALE, GREEN CK TAMALE, GREEN CORN TAMALE, RED MENUDO, WHITE MENUDO, COCIDO, ALBONDIGAS, CARNE ASADA, POLO ASADA, PLAIN BEEF, PLAIN CHICKEN, GROUND BEEF, CARNITAS, BEANS, RICE, BEEF TACOS, CK TACOS, BEEF FLAUTAS, CK FLAUTAS, BEEF SUPER TACO, CK SUPER TACO, MACHACA BEEF, MACHACA CK, CHILLI RELLENOS, FISH, CEVICHE, COOCKED SHRIMP, OCTOPUS, RED SALSA, GREEN SALSA, CHUNKY SALSA, GUAC SALSA, ORANGE SALSA, BROWN SALSA, GUACAMOLE, GRAVY MIX, RANCH, PITAS, ROLLED TACOS, BEEF MINI CHIMI, CK MINI CHIMI, BEEF MINI TACO, CK MINI TACO, BEEF MINI FLAUTAS, CK MINI FLAUTAS, AL PASTOR, BIRRIA

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

ISC

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Hosted on [Vercel](https://vercel.com/)
- Database by [Neon](https://neon.tech/)
- Charts by [Recharts](https://recharts.org/)

---

## 📞 Support

- 📧 Email: avishmaniar24@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/AvishManiar21/food-tracker-dashboard/issues)

---

**Made with ❤️ using Claude Code**
