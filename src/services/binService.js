import { USE_MOCK_DATA } from "./firebase";
import { binsStore, setBins } from "./dataStore";
import { getBinStatusFromFill } from "../utils/statusUtils";
import { generateId } from "../utils/helpers";

export const fetchBins = async () => {
  if (USE_MOCK_DATA) {
    const all = binsStore.all() || [];
    return Promise.resolve(
      all.map((b) => ({ ...b, status: b.status || getBinStatusFromFill(b.fillLevel) }))
    );
  }
  // Firebase: collection('bins')
  return Promise.resolve([]);
};

export const fetchBin = async (id) => {
  if (USE_MOCK_DATA) {
    const b = binsStore.findById(id);
    if (!b) return Promise.reject(new Error("Bin not found."));
    return Promise.resolve({
      ...b,
      status: b.status || getBinStatusFromFill(b.fillLevel),
    });
  }
  return Promise.reject(new Error("Bin not found."));
};

export const createBin = async (payload) => {
  if (USE_MOCK_DATA) {
    const bins = binsStore.all() || [];
    const bin = {
      id: payload.id || generateId("BIN"),
      department: payload.department,
      category: payload.category,
      capacity: Number(payload.capacity),
      fillLevel: Number(payload.fillLevel) || 0,
      status: getBinStatusFromFill(payload.fillLevel || 0),
      location: payload.location,
      lastCollection: payload.lastCollection || null,
    };
    bins.unshift(bin);
    setBins(bins);
    return Promise.resolve(bin);
  }
  return Promise.resolve(null);
};

export const updateBin = async (id, patch) => {
  if (USE_MOCK_DATA) {
    const bins = binsStore.all() || [];
    const idx = bins.findIndex((b) => b.id === id);
    if (idx === -1) return Promise.reject(new Error("Bin not found."));
    bins[idx] = {
      ...bins[idx],
      ...patch,
      fillLevel: patch.fillLevel ?? bins[idx].fillLevel,
    };
    bins[idx].status =
      bins[idx].status || getBinStatusFromFill(bins[idx].fillLevel);
    setBins(bins);
    return Promise.resolve(bins[idx]);
  }
  return Promise.resolve(null);
};

export const deleteBin = async (id) => {
  if (USE_MOCK_DATA) {
    const bins = (binsStore.all() || []).filter((b) => b.id !== id);
    setBins(bins);
    return Promise.resolve({ success: true });
  }
  return Promise.resolve({ success: true });
};

export const adjustFillLevel = async (id, delta) => {
  if (USE_MOCK_DATA) {
    const bins = binsStore.all() || [];
    const idx = bins.findIndex((b) => b.id === id);
    if (idx === -1) return Promise.reject(new Error("Bin not found."));
    const fillLevel = Math.max(0, Math.min(100, (bins[idx].fillLevel || 0) + delta));
    bins[idx].fillLevel = fillLevel;
    bins[idx].status = getBinStatusFromFill(fillLevel);
    if (fillLevel === 0) {
      bins[idx].lastCollection = new Date().toISOString();
    }
    setBins(bins);
    return Promise.resolve(bins[idx]);
  }
  return Promise.resolve(null);
};
