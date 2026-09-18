import { Home, ClipboardList, BarChart3, Search, FileText, Box, User, QrCode, Recycle } from "lucide-react";
import { ROLES } from "../utils/constants";

const baseItem = (label, path, icon) => ({ label, path, icon });

export const STAFF_NAV = [
  baseItem("Dashboard", "/staff/dashboard", Home),
  baseItem("Identify Waste", "/staff/identify-waste", Recycle),
  baseItem("Collection Request", "/staff/collection-request", ClipboardList),
  baseItem("My Requests", "/staff/requests", Box),
  baseItem("Profile", "/staff/profile", User),
];

export const COLLECTOR_NAV = [
  baseItem("Dashboard", "/collector/dashboard", Home),
  baseItem("Scan Bin", "/collector/scan", QrCode),
  baseItem("Profile", "/collector/profile", User),
];

export const ADMIN_NAV = [
  baseItem("Dashboard", "/admin/dashboard", Home),
  baseItem("Bins", "/admin/bins", Box),
  baseItem("Analytics", "/admin/analytics", BarChart3),
  baseItem("Tracking", "/admin/tracking", Search),
  baseItem("Reports", "/admin/reports", FileText),
  baseItem("Profile", "/admin/profile", User),
];

export const ROLE_NAV_MAP = {
  [ROLES.STAFF]: STAFF_NAV,
  [ROLES.COLLECTOR]: COLLECTOR_NAV,
  [ROLES.ADMIN]: ADMIN_NAV,
};
