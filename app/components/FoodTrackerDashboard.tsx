'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PRODUCTS, BUCKET_SIZES } from '@/lib/constants';

interface Entry {
  id: number;
  entry_date: string;
  product: string;
  bucket_size: string;
  quantity: number;
}

interface MonthlyData {
  name: string;
  'Jun 2026': number;
  'Jul 2026': number;
}

export default function FoodTrackerDashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-06-19');
  const [selectedProduct, setSelectedProduct] = useState(PRODUCTS[0]);
  const [selectedSize, setSelectedSize] = useState(BUCKET_SIZES[0]);
  const [quantity, setQuantity] = useState<string>('0');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries?startDate=2026-06-19&endDate=2026-07-31');
      if (!response.ok) throw new Error('Failed to fetch entries');
      const data = await response.json();
      setEntries(data);
      setIsConnected(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching entries:', error);
      setErrorMessage('Unable to connect to database. Please check server.');
      setShowError(true);
      setIsConnected(false);
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!selectedDate || !selectedProduct || !selectedSize || quantity === '' || parseFloat(quantity) <= 0) {
      setErrorMessage('Please fill in all fields with a valid quantity');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_date: selectedDate,
          product: selectedProduct,
          bucket_size: selectedSize,
          quantity: parseFloat(quantity),
        }),
      });

      if (!response.ok) throw new Error('Failed to add entry');

      await fetchEntries();
      setQuantity('0');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Error adding entry:', error);
      setErrorMessage('Failed to add entry. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const calculateMonthlyData = (bucketSize: string): MonthlyData[] => {
    const monthlyData: Record<string, MonthlyData> = {};

    PRODUCTS.forEach(product => {
      monthlyData[product] = {
        name: product,
        'Jun 2026': 0,
        'Jul 2026': 0,
      };
    });

    entries.forEach(entry => {
      if (entry.bucket_size === bucketSize) {
        const entryDate = new Date(entry.entry_date);
        const month = entryDate.getMonth() + 1;
        const monthKey = month === 6 ? 'Jun 2026' : 'Jul 2026';

        if (monthlyData[entry.product]) {
          monthlyData[entry.product][monthKey] += parseFloat(entry.quantity.toString());
        }
      }
    });

    return Object.values(monthlyData);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Loading data from database...</div>
      </div>
    );
  }

  const smallData = calculateMonthlyData('Small');
  const mediumData = calculateMonthlyData('Medium');
  const largeData = calculateMonthlyData('Large');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Food Tracker Interactive Dashboard
            <span className="ml-3 inline-block bg-green-600 text-white text-xs px-3 py-1 rounded-full">
              PostgreSQL
            </span>
          </h1>
          <p className="text-gray-600 text-sm flex items-center">
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            Track daily food product quantities - June 19 to July 31, 2026
            {isConnected ? ' (Database Connected)' : ' (Database Disconnected)'}
          </p>
        </div>

        {/* Data Entry Form */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Entry</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-blue-800 text-sm">
            Enter your daily food quantities below. Data is saved to PostgreSQL database and charts update in real-time.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min="2026-06-19"
                max="2026-07-31"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {PRODUCTS.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bucket Size</label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {BUCKET_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleAddEntry}
            disabled={!isConnected}
            className={`px-6 py-3 rounded-md font-semibold text-white transition-colors ${
              isConnected
                ? 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {isConnected ? 'Add Entry' : 'Database Disconnected'}
          </button>

          {showSuccess && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
              ✓ Entry saved to database successfully!
            </div>
          )}

          {showError && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              ✗ {errorMessage}
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Comparison Charts</h2>

          {/* Small Bucket Chart */}
          <ChartSection title="Small Bucket - All Products (June vs July 2026)" data={smallData} />

          {/* Medium Bucket Chart */}
          <ChartSection title="Medium Bucket - All Products (June vs July 2026)" data={mediumData} />

          {/* Large Bucket Chart */}
          <ChartSection title="Large Bucket - All Products (June vs July 2026)" data={largeData} />
        </div>
      </div>
    </div>
  );
}

function ChartSection({ title, data }: { title: string; data: MonthlyData[] }) {
  return (
    <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b-2 border-blue-600">
        {title}
      </h3>
      <div className="flex gap-6 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded"></div>
          <span>June 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-green-600 rounded"></div>
          <span>July 2026</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={2200}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={140} interval={0} />
          <Tooltip />
          <Bar dataKey="Jun 2026" fill="#3b82f6" />
          <Bar dataKey="Jul 2026" fill="#059669" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
