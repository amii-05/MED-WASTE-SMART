import DashboardLayout from "./DashboardLayout";
import { STAFF_NAV } from "../utils/navConfig";

const StaffLayout = () => (
  <DashboardLayout
    navItems={STAFF_NAV}
    brand="MedWaste Smart"
    roleLabel="Staff"
  />
);

export default StaffLayout;
