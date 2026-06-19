import FoodTrackerDashboard from './components/FoodTrackerDashboard';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';

export default function Home() {
  return <FoodTrackerDashboard />;
}
