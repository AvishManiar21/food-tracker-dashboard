-- Food Tracker Database Schema
-- PostgreSQL 12+

-- Create database (run this separately if needed)
-- CREATE DATABASE food_tracker;

-- Connect to the database
-- \c food_tracker;

-- Drop table if exists (for fresh setup)
DROP TABLE IF EXISTS food_entries;

-- Create food_entries table
CREATE TABLE food_entries (
    id SERIAL PRIMARY KEY,
    entry_date DATE NOT NULL,
    product VARCHAR(100) NOT NULL,
    bucket_size VARCHAR(20) NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_entry UNIQUE (entry_date, product, bucket_size),
    CONSTRAINT check_bucket_size CHECK (bucket_size IN ('Small', 'Medium', 'Large')),
    CONSTRAINT check_quantity CHECK (quantity >= 0)
);

-- Create indexes for faster queries
CREATE INDEX idx_entry_date ON food_entries(entry_date);
CREATE INDEX idx_product ON food_entries(product);
CREATE INDEX idx_bucket_size ON food_entries(bucket_size);
CREATE INDEX idx_date_product ON food_entries(entry_date, product);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_food_entries_updated_at
    BEFORE UPDATE ON food_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data insert (optional - for testing)
-- INSERT INTO food_entries (entry_date, product, bucket_size, quantity)
-- VALUES ('2026-06-19', 'PICO', 'Small', 10.5);

-- Query to get all entries
-- SELECT * FROM food_entries ORDER BY entry_date, product;

-- Query to get monthly aggregations (example)
-- SELECT
--     product,
--     bucket_size,
--     DATE_TRUNC('month', entry_date) as month,
--     SUM(quantity) as total_quantity
-- FROM food_entries
-- GROUP BY product, bucket_size, DATE_TRUNC('month', entry_date)
-- ORDER BY product, bucket_size, month;
