import OverviewCards from '../../components/dashboard/OverviewCards';
import CropAdviceCard from '../../components/farmer/CropAdviceCard';

function FarmerDashboardPage() {
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-semibold'>Farmer Dashboard</h1>
      <OverviewCards />
      <CropAdviceCard />
    </div>
  );
}

export default FarmerDashboardPage;
