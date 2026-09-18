// Generate a unique id. Prefers the crypto API so it works without extra deps.
export const generateId = (prefix = "id") => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
};

// Generate a human-friendly collection request id, e.g. MW-2026-001
export const generateRequestId = (year, counter) => {
  const yy = String(year).slice(-2);
  const num = String(counter).padStart(3, "0");
  return `MW-${yy}-${num}`;
};

// Format a Date to a readable time string.
export const formatTime = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "-";
  return `${formatDate(d)} ${formatTime(d)}`;
};

// Relative time, e.g. "2 minutes ago"
export const timeAgo = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sec = Math.round((now - d) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  return `${day}d ago`;
};

// Get ordinal suffix for the day of month
export const getOrdinalSuffix = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = (n % 100) + 1;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};



