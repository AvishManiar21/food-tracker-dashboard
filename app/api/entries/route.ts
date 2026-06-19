import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET all entries for date range
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') || '2026-06-19';
    const endDate = searchParams.get('endDate') || '2026-07-31';

    const result = await pool.query(
      'SELECT * FROM food_entries WHERE entry_date >= $1 AND entry_date <= $2 ORDER BY entry_date, product',
      [startDate, endDate]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch entries' },
      { status: 500 }
    );
  }
}

// POST - Add or update an entry
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { entry_date, product, bucket_size, quantity } = body;

    if (!entry_date || !product || !bucket_size || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
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

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding/updating entry:', error);
    return NextResponse.json(
      { error: 'Failed to add/update entry' },
      { status: 500 }
    );
  }
}

// DELETE - Clear all data
export async function DELETE() {
  try {
    await pool.query('DELETE FROM food_entries');
    return NextResponse.json({ message: 'All entries cleared successfully' });
  } catch (error) {
    console.error('Error clearing entries:', error);
    return NextResponse.json(
      { error: 'Failed to clear entries' },
      { status: 500 }
    );
  }
}
