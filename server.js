const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'food_tracker',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Database connected successfully at:', res.rows[0].now);
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API Routes

// Get all entries
app.get('/api/entries', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM food_entries ORDER BY entry_date, product'
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching entries:', err);
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

// Get entries for a specific date range
app.get('/api/entries/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const result = await pool.query(
            'SELECT * FROM food_entries WHERE entry_date >= $1 AND entry_date <= $2 ORDER BY entry_date, product',
            [startDate || '2026-06-19', endDate || '2026-07-31']
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching entries by range:', err);
        res.status(500).json({ error: 'Failed to fetch entries' });
    }
});

// Add or update an entry
app.post('/api/entries', async (req, res) => {
    try {
        const { entry_date, product, bucket_size, quantity } = req.body;

        if (!entry_date || !product || !bucket_size || quantity === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if entry exists
        const existing = await pool.query(
            'SELECT * FROM food_entries WHERE entry_date = $1 AND product = $2 AND bucket_size = $3',
            [entry_date, product, bucket_size]
        );

        let result;
        if (existing.rows.length > 0) {
            // Update existing entry by adding to current quantity
            const newQuantity = parseFloat(existing.rows[0].quantity) + parseFloat(quantity);
            result = await pool.query(
                'UPDATE food_entries SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE entry_date = $2 AND product = $3 AND bucket_size = $4 RETURNING *',
                [newQuantity, entry_date, product, bucket_size]
            );
        } else {
            // Insert new entry
            result = await pool.query(
                'INSERT INTO food_entries (entry_date, product, bucket_size, quantity) VALUES ($1, $2, $3, $4) RETURNING *',
                [entry_date, product, bucket_size, quantity]
            );
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error adding/updating entry:', err);
        res.status(500).json({ error: 'Failed to add/update entry' });
    }
});

// Get monthly aggregations
app.get('/api/entries/monthly', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                product,
                bucket_size,
                DATE_TRUNC('month', entry_date) as month,
                SUM(quantity) as total_quantity
            FROM food_entries
            GROUP BY product, bucket_size, DATE_TRUNC('month', entry_date)
            ORDER BY product, bucket_size, month
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching monthly aggregations:', err);
        res.status(500).json({ error: 'Failed to fetch monthly aggregations' });
    }
});

// Delete an entry
app.delete('/api/entries/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM food_entries WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Entry not found' });
        }

        res.json({ message: 'Entry deleted successfully', entry: result.rows[0] });
    } catch (err) {
        console.error('Error deleting entry:', err);
        res.status(500).json({ error: 'Failed to delete entry' });
    }
});

// Clear all data (for testing)
app.delete('/api/entries', async (req, res) => {
    try {
        await pool.query('DELETE FROM food_entries');
        res.json({ message: 'All entries cleared successfully' });
    } catch (err) {
        console.error('Error clearing entries:', err);
        res.status(500).json({ error: 'Failed to clear entries' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    pool.end();
    process.exit(0);
});
