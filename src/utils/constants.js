// Application-wide constants

export const ROLES = {
  STAFF: "staff",
  COLLECTOR: "collector",
  ADMIN: "admin",
};

export const WASTE_CATEGORIES = {
  YELLOW: "yellow",
  RED: "red",
  WHITE: "white",
  BLUE: "blue",
  GENERAL: "general",
};

export const WASTE_CATEGORY_LABELS = {
  yellow: "Yellow",
  red: "Red",
  white: "Sharps (White / Translucent)",
  blue: "Blue",
  general: "General",
};

export const WASTE_CATEGORY_COLORS = {
  yellow: "bg-yellow-400 text-yellow-900",
  red: "bg-red-500 text-white",
  white: "bg-slate-200 text-slate-800",
  blue: "bg-blue-500 text-white",
  general: "bg-slate-400 text-slate-800",
};

export const WASTE_CATEGORY_CONTAINERS = {
  yellow: "Yellow bag (Infectious waste container)",
  red: "Red bag (Pathological / contaminated waste container)",
  white: "Sharps container / puncture-proof container",
  blue: "Blue container (metallic implants / glassware)",
  general: "General waste bin",
};

export const WASTE_EXAMPLES = {
  yellow: [
    "Human anatomical waste",
    "Soiled waste",
    "Microbiology / biotechnology waste",
  ],
  red: ["Contaminated recyclable waste"],
  white: ["Sharps", "Needles", "Syringes with fixed needles", "Scalpels", "Blades"],
  blue: ["Glassware", "Metallic implants"],
  general: ["Non-biomedical / general waste"],
};

export const WASTE_SAFETY_INSTRUCTIONS = {
  yellow: "Wear gloves and dispose of infectious waste in the designated yellow bag/container.",
  red: "Treat as potentially infectious. Use appropriate PPE and red containment.",
  white: "Handle sharps carefully and dispose of them in the designated sharps container.",
  blue: "Handle glass and metal carefully to avoid breakage and sharps injuries.",
  general: "Segregate from biomedical waste before disposal.",
};

export const DEPARTMENTS = [
  "Emergency Ward",
  "ICU",
  "Operation Theatre",
  "Laboratory",
  "General Ward",
  "Pharmacy",
];

export const DEPARTMENT_CODES = {
  "Emergency Ward": "ER",
  ICU: "ICU",
  "Operation Theatre": "OT",
  Laboratory: "LAB",
  "General Ward": "GW",
  Pharmacy: "RX",
};

export const STATUSES = {
  PENDING: "pending",
  ASSIGNED: "assigned",
  IN_PROGRESS: "in_progress",
  COLLECTED: "collected",
  COMPLETED: "completed",
};

export const STATUS_LABELS = {
  pending: "Pending",
  assigned: "Assigned",
  in_progress: "In Progress",
  collected: "Collected",
  completed: "Completed",
};

export const STATUS_COLORS = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  assigned: "bg-blue-100 text-blue-800 border-blue-200",
  in_progress: "bg-indigo-100 text-indigo-800 border-indigo-200",
  collected: "bg-cyan-100 text-cyan-800 border-cyan-200",
  completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export const PRIORITY_LEVELS = {
  NORMAL: "normal",
  HIGH: "high",
  EMERGENCY: "emergency",
};

export const PRIORITY_LABELS = {
  normal: "Normal",
  high: "High",
  emergency: "Emergency",
};

export const FILL_LEVEL_THRESHOLDS = {
  NORMAL_MAX: 69,
  ALMOST_FULL_MAX: 89,
  // 90-100 => collection required
};

export const BIN_STATUSES = {
  NORMAL: "normal",
  ALMOST_FULL: "almost_full",
  COLLECTION_REQUIRED: "collection_required",
};

export const LOCAL_STORAGE_KEYS = {
  APP_DATA: "medwaste_app_data",
  AUTH: "medwaste_auth",
  NOTIFICATIONS: "medwaste_notifications",
  THEME: "medwaste_theme",
};

export const USE_MOCK_DATA = true; // hackathon default; set false to use Firebase
