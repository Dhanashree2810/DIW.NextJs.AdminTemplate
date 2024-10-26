import { fetchGetDashboardData } from "@/services/dashboard";
import { verifySession } from "../lib/session";
import AdvancedCard from "../pages/DashBoard";
import fetchDashboardData from "../actions/dashboard";


export default async function page() {
  const currentDate = new Date().toISOString().split('T')[0];
  const tokendata = await verifySession();
  const dashboardData = await fetchGetDashboardData(currentDate, tokendata);

  const graphData = await fetchDashboardData();

  return (
    <div>
      <AdvancedCard dashboardData={dashboardData} graphData={graphData} />
    </div>
  );
}

