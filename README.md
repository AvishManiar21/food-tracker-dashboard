# Food Tracker Dashboard with PostgreSQL

A full-stack interactive web application for tracking daily food product quantities across three bucket sizes (Small, Medium, Large) for June and July 2026. Built with React, Node.js, Express, and PostgreSQL.

## Features

- **Real-time Data Entry**: Add food quantities with instant database persistence
- **PostgreSQL Database**: Reliable, permanent data storage
- **Interactive Charts**: Three horizontal bar charts comparing June vs July data
- **59 Products**: Track all food products across three bucket sizes
- **Monthly Aggregation**: Automatic calculation of monthly totals
- **Professional UI**: Clean, responsive design with visual feedback

## Tech Stack

### Frontend
- React 18 (via CDN)
- Recharts 2.10 for data visualization
- Vanilla JavaScript with Babel for JSX

### Backend
- Node.js
- Express.js
- PostgreSQL (pg library)
- CORS enabled

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

## Installation & Setup

### Step 1: Install PostgreSQL

1. Download and install PostgreSQL from https://www.postgresql.org/download/
2. During installation, remember your postgres user password
3. Make sure PostgreSQL service is running

### Step 2: Create Database

Open PostgreSQL command line (psql) or use pgAdmin and run:

```sql
CREATE DATABASE food_tracker;
```

Or use the command line:

```bash
# Windows (PowerShell or Command Prompt)
psql -U postgres -c "CREATE DATABASE food_tracker"

# macOS/Linux
sudo -u postgres psql -c "CREATE DATABASE food_tracker"
```

### Step 3: Setup Database Schema

Navigate to the project directory and run:

```bash
# Windows
psql -U postgres -d food_tracker -f database_schema.sql

# macOS/Linux
sudo -u postgres psql -d food_tracker -f database_schema.sql
```

This will create the `food_entries` table with all necessary indexes and constraints.

### Step 4: Install Node.js Dependencies

```bash
npm install
```

This installs:
- express
- pg (PostgreSQL client)
- dotenv (environment variables)
- cors (cross-origin requests)
- nodemon (dev dependency)

### Step 5: Configure Environment Variables

1. Copy the example environment file:

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

2. Edit `.env` file with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_tracker
DB_USER=postgres
DB_PASSWORD=your_actual_password_here
PORT=3000
NODE_ENV=development
```

**IMPORTANT**: Replace `your_actual_password_here` with your PostgreSQL password!

### Step 6: Start the Server

```bash
npm start
```

For development with auto-restart on file changes:

```bash
npm run dev
```

You should see:

```
Database connected successfully at: [timestamp]
Server running on http://localhost:3000
```

### Step 7: Open the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

## Usage

1. **Add Entry**:
   - Select a date (June 19 - July 31, 2026)
   - Choose a product from the dropdown
   - Select bucket size (Small, Medium, Large)
   - Enter quantity
   - Click "Add Entry"

2. **View Data**:
   - Charts automatically update after each entry
   - Three charts show monthly comparisons for each bucket size
   - Blue bars = June 2026
   - Green bars = July 2026

3. **Data Persistence**:
   - All data is stored in PostgreSQL database
   - Data survives server restarts
   - Data can be accessed from any computer on the network

## Database Structure

### Table: `food_entries`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key (auto-increment) |
| entry_date | DATE | Date of the entry |
| product | VARCHAR(100) | Product name |
| bucket_size | VARCHAR(20) | Small, Medium, or Large |
| quantity | NUMERIC(10,2) | Quantity value |
| created_at | TIMESTAMP | When record was created |
| updated_at | TIMESTAMP | When record was last updated |

### Unique Constraint
- One entry per (date, product, bucket_size) combination
- Adding to existing entry updates the quantity (adds to existing value)

## API Endpoints

### GET `/api/entries`
Get all food entries

### GET `/api/entries/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`
Get entries for a specific date range

### POST `/api/entries`
Add or update an entry

**Request Body:**
```json
{
  "entry_date": "2026-06-19",
  "product": "PICO",
  "bucket_size": "Small",
  "quantity": 10.5
}
```

### GET `/api/entries/monthly`
Get monthly aggregations

### DELETE `/api/entries/:id`
Delete a specific entry by ID

### DELETE `/api/entries`
Clear all entries (use with caution!)

## File Structure

```
food_tracker/
├── index.html                  # Frontend application
├── server.js                   # Backend Express server
├── database_schema.sql         # Database setup SQL
├── package.json                # Node.js dependencies
├── .env                        # Environment variables (create from .env.example)
├── .env.example                # Environment template
├── README.md                   # This file
└── food_tracker_dashboard.html # Original localStorage version (backup)
```

## Troubleshooting

### Database Connection Failed

**Problem**: "Unable to connect to database"

**Solutions**:
1. Check if PostgreSQL service is running:
   ```bash
   # Windows
   services.msc  # Look for "PostgreSQL"

   # macOS/Linux
   sudo service postgresql status
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

3. Check `.env` file credentials are correct

4. Verify PostgreSQL is listening on port 5432:
   ```bash
   netstat -an | findstr 5432  # Windows
   netstat -an | grep 5432     # macOS/Linux
   ```

### Port Already in Use

**Problem**: "Port 3000 is already in use"

**Solution**: Change the port in `.env`:
```env
PORT=3001
```

### Cannot Create Database

**Problem**: Permission denied when creating database

**Solution**: Use postgres superuser:
```bash
psql -U postgres
CREATE DATABASE food_tracker;
\q
```

### Module Not Found

**Problem**: "Cannot find module 'express'"

**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules  # Delete node_modules folder
npm install
```

## Data Backup

To backup your database:

```bash
# Windows
pg_dump -U postgres food_tracker > backup.sql

# macOS/Linux
sudo -u postgres pg_dump food_tracker > backup.sql
```

To restore from backup:

```bash
# Windows
psql -U postgres food_tracker < backup.sql

# macOS/Linux
sudo -u postgres psql food_tracker < backup.sql
```

## Network Access

To access the application from other computers on your network:

1. Find your IP address:
   ```bash
   # Windows
   ipconfig

   # macOS/Linux
   ifconfig
   ```

2. Update `index.html` API_URL (line 190):
   ```javascript
   const API_URL = 'http://YOUR_IP_ADDRESS:3000/api';
   ```

3. Access from other devices:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```

## Security Notes

- This application is designed for local/internal network use
- Do NOT expose to the internet without proper authentication
- Change default PostgreSQL passwords in production
- Consider adding authentication middleware for production use

## License

ISC

## Support

For issues or questions, please check:
1. PostgreSQL is installed and running
2. Database `food_tracker` exists
3. `.env` file is configured correctly
4. All dependencies are installed (`npm install`)
5. Server is running (`npm start`)
