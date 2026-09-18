import DashboardLayout from "./DashboardLayout";
import { ADMIN_NAV } from "../utils/navConfig";

const AdminLayout = () => (
  <DashboardLayout
    navItems={ADMIN_NAV}
    brand="MedWaste Smart"
    roleLabel="Admin"
  />
);

export default AdminLayout;
