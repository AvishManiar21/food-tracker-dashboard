import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET monthly aggregations
export async function GET() {
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

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching monthly aggregations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monthly aggregations' },
      { status: 500 }
    );
  }
}
