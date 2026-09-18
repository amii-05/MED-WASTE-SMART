import DashboardLayout from "./DashboardLayout";
import { COLLECTOR_NAV } from "../utils/navConfig";

const CollectorLayout = () => (
  <DashboardLayout
    navItems={COLLECTOR_NAV}
    brand="MedWaste Smart"
    roleLabel="Collector"
  />
);

export default CollectorLayout;
