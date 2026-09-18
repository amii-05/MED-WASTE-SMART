import { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import ToastContainer from "../components/Toast";

/**
 * DashboardLayout — shared shell for Staff / Collector / Admin roles.
 * Compose with a role's nav items + roleLabel.
 */
const DashboardLayout = ({ navItems, brand = "MedWaste Smart", roleLabel = "" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-screen bg-slate-50 dark:bg-slate-900">
      <NavBar
        onMenuToggle={() => setSidebarOpen(true)}
        roleLabel={roleLabel}
      />
      <Sidebar
        items={navItems}
        brand={brand}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="mt-16 flex-1 overflow-y-auto">
        <div className="p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
