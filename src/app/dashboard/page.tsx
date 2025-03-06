import LeadDashboard from '@/components/LeadDashboard';

export const metadata = {
  title: 'Lead Dashboard | Claim Connectors',
  description: 'Track and manage leads from the Claim Connectors platform.',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <LeadDashboard />
    </main>
  );
} 