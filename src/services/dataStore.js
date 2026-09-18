import {
  demoUsers,
  demoBins,
  demoWasteRecords,
  demoCollectionRequests,
  demoCollections,
  demoNotifications,
  emptyRequestTemplate,
} from "../data/demoData";
import { generateId, generateRequestId } from "../utils/helpers";
import { STATUSES } from "../utils/constants";
import { getBinStatusFromFill } from "../utils/statusUtils";
import { ROLES } from "../utils/constants";

export const LOCAL_KEYS = {
  auth: "medwaste_auth",
  users: "medwaste_users",
  bins: "medwaste_bins",
  wasteRecords: "medwaste_waste_records",
  requests: "medwaste_requests",
  collections: "medwaste_collections",
  notifications: "medwaste_notifications",
  requestCounter: "medwaste_request_counter",
  seeded: "medwaste_seeded",
};

const isBrowser = typeof window !== "undefined" && window.localStorage;

export const storage = {
  get(key, fallback) {
    if (!isBrowser) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null || raw === undefined) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("storage read error", key, e);
      return fallback;
    }
  },
  set(key, value) {
    if (!isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("storage write error", key, e);
    }
  },
  remove(key) {
    if (!isBrowser) return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn("storage remove error", key, e);
    }
  },
  clear() {
    if (!isBrowser) return;
    try {
      window.localStorage.clear();
    } catch (e) {
      console.warn("storage clear error", e);
    }
  },
};

// Seed the localStorage on first load / reset
export const seedStore = (force = false) => {
  const seeded = storage.get(LOCAL_KEYS.seeded, false);
  const bins = storage.get(LOCAL_KEYS.bins, null);
  if (force || seeded === false || bins === null) {
    storage.set(LOCAL_KEYS.users, JSON.parse(JSON.stringify(demoUsers)));
    storage.set(LOCAL_KEYS.bins, JSON.parse(JSON.stringify(demoBins)));
    storage.set(LOCAL_KEYS.wasteRecords, JSON.parse(JSON.stringify(demoWasteRecords)));
    storage.set(
      LOCAL_KEYS.requests,
      JSON.parse(JSON.stringify(demoCollectionRequests))
    );
    storage.set(LOCAL_KEYS.collections, JSON.parse(JSON.stringify(demoCollections)));
    storage.set(
      LOCAL_KEYS.notifications,
      JSON.parse(JSON.stringify(demoNotifications))
    );
    storage.set(LOCAL_KEYS.requestCounter, demoCollectionRequests.length);
    storage.set(LOCAL_KEYS.seeded, true);
  }
};

// Ensure seed exists whenever store is first touched.
seedStore(false);

export const usersStore = {
  all: () => storage.get(LOCAL_KEYS.users, []),
  findById: (id) => (usersStore.all() || []).find((u) => u.id === id),
  findByEmail: (email) =>
    (usersStore.all() || []).find((u) => u.email === email),
};

export const binsStore = {
  all: () => storage.get(LOCAL_KEYS.bins, []),
  findById: (id) => (binsStore.all() || []).find((b) => b.id === id),
};

export const requestsStore = {
  all: () => storage.get(LOCAL_KEYS.requests, []),
  findById: (id) => (requestsStore.all() || []).find((r) => r.id === id),
  nextCounter: () => {
    const c = storage.get(LOCAL_KEYS.requestCounter, 0) + 1;
    storage.set(LOCAL_KEYS.requestCounter, c);
    return c;
  },
  nextId: () => generateRequestId(new Date().getFullYear(), requestsStore.nextCounter()),
};

export const collectionsStore = {
  all: () => storage.get(LOCAL_KEYS.collections, []),
  findById: (id) => (collectionsStore.all() || []).find((c) => c.id === id),
  nextId: () => generateId("col"),
};

export const notificationsStore = {
  all: () => storage.get(LOCAL_KEYS.notifications, []),
  unread: (userId) =>
    (notificationsStore.all() || []).filter(
      (n) => !n.read && n.userId === userId
    ),
};

export const wasteRecordsStore = {
  all: () => storage.get(LOCAL_KEYS.wasteRecords, []),
  nextId: () => generateId("wr"),
};

// ---- Mutation helpers (persist arrays back to localStorage) ----

export const setBins = (bins) => {
  const normalized = (bins || []).map((b) => ({
    ...b,
    status: b.status || getBinStatusFromFill(b.fillLevel),
  }));
  storage.set(LOCAL_KEYS.bins, normalized);
  return normalized;
};

export const setRequests = (requests) => {
  storage.set(LOCAL_KEYS.requests, requests || []);
  return requests || [];
};

export const setCollections = (collections) => {
  storage.set(LOCAL_KEYS.collections, collections || []);
  return collections || [];
};

export const setNotifications = (notifications) => {
  storage.set(LOCAL_KEYS.notifications, notifications || []);
  return notifications || [];
};

export const setWasteRecords = (records) => {
  storage.set(LOCAL_KEYS.wasteRecords, records || []);
  return records || [];
};

export const setUsers = (users) => {
  storage.set(LOCAL_KEYS.users, users || []);
  return users || [];
};

export { emptyRequestTemplate, STATUSES, ROLES };
