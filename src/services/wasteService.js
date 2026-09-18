import { USE_MOCK_DATA } from "./firebase";
import {
  wasteRecordsStore,
  setWasteRecords,
  requestsStore,
  setRequests,
} from "./dataStore";
import { generateId } from "../utils/helpers";

export const fetchWasteRecords = async () => {
  return Promise.resolve(wasteRecordsStore.all() || []);
};

export const createWasteRecord = async (payload) => {
  if (USE_MOCK_DATA) {
    const records = wasteRecordsStore.all() || [];
    const record = {
      id: generateId("wr"),
      staffId: payload.staffId,
      staffName: payload.staffName,
      imageUrl: payload.imageUrl || null,
      detectedType: payload.detectedType,
      category: payload.category,
      confidence: payload.confidence,
      createdAt: new Date().toISOString(),
    };
    records.unshift(record);
    setWasteRecords(records);
    return Promise.resolve(record);
  }
  return Promise.resolve(null);
};

export const fetchWasteStats = async () => {
  const records = wasteRecordsStore.all() || [];
  const byCategory = {};
  records.forEach((r) => {
    byCategory[r.category] = (byCategory[r.category] || 0) + 1;
  });
  return Promise.resolve({ total: records.length, byCategory });
};

// ---- Collection requests ----

export const fetchRequests = async () => Promise.resolve(requestsStore.all() || []);

export const fetchRequest = async (id) => {
  const r = requestsStore.findById(id);
  if (!r) return Promise.reject(new Error("Request not found."));
  return Promise.resolve(r);
};

export const createRequest = async (payload, staffUser) => {
  if (USE_MOCK_DATA) {
    const requests = requestsStore.all() || [];
    const request = {
      id: requestsStore.nextId(),
      staffId: staffUser?.id || payload.staffId || "unknown",
      staffName: staffUser?.name || payload.staffName || "Unknown",
      department: payload.department,
      binId: payload.binId,
      category: payload.category,
      fillLevel: Number(payload.fillLevel) || 0,
      priority: payload.priority,
      quantity: Number(payload.quantity) || 0,
      notes: payload.notes || "",
      status: "pending",
      collectorId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    requests.unshift(request);
    setRequests(requests);
    return Promise.resolve(request);
  }
  return Promise.resolve(null);
};
