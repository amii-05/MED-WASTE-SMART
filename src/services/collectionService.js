import { USE_MOCK_DATA } from "./firebase";
import {
  requestsStore,
  setRequests,
  collectionsStore,
  setCollections,
  binsStore,
  setBins,
} from "./dataStore";
import { generateId } from "../utils/helpers";
import { getBinStatusFromFill } from "../utils/statusUtils";
import { STATUSES } from "../utils/constants";

export const fetchRequests = async () => Promise.resolve(requestsStore.all() || []);

export const fetchRequest = async (id) => {
  const r = requestsStore.findById(id);
  if (!r) return Promise.reject(new Error("Request not found."));
  return Promise.resolve(r);
};

export const updateRequestStatus = async (requestId, status, collectorId = null) => {
  if (USE_MOCK_DATA) {
    const requests = requestsStore.all() || [];
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) return Promise.reject(new Error("Request not found."));
    requests[idx].status = status;
    if (collectorId) requests[idx].collectorId = collectorId;
    requests[idx].updatedAt = new Date().toISOString();
    setRequests(requests);
    return Promise.resolve(requests[idx]);
  }
  return Promise.resolve(null);
};

export const assignCollector = async (requestId, collectorId) => {
  return updateRequestStatus(requestId, STATUSES.ASSIGNED, collectorId);
};

export const startCollection = async (requestId, collectorId) => {
  return updateRequestStatus(requestId, STATUSES.IN_PROGRESS, collectorId);
};

export const completeCollection = async (requestId, collectorId, binId) => {
  if (USE_MOCK_DATA) {
    const requests = requestsStore.all() || [];
    const idx = requests.findIndex((r) => r.id === requestId);
    if (idx === -1) return Promise.reject(new Error("Request not found."));

    // Mark request as collected then completed.
    requests[idx].status = STATUSES.COLLECTED;
    requests[idx].collectorId = collectorId;
    requests[idx].collectedAt = new Date().toISOString();
    requests[idx].updatedAt = new Date().toISOString();
    setRequests(requests);

    // Create collection record.
    const collections = collectionsStore.all() || [];
    const coll = {
      id: generateId("col"),
      requestId,
      collectorId,
      binId,
      scannedAt: new Date().toISOString(),
      collectedAt: new Date().toISOString(),
      status: "collected",
    };
    collections.unshift(coll);
    setCollections(collections);

    // Update bin: empty it and record collection time.
    if (binId) {
      const bins = binsStore.all() || [];
      const bIdx = bins.findIndex((b) => b.id === binId);
      if (bIdx !== -1) {
        bins[bIdx].fillLevel = 0;
        bins[bIdx].status = getBinStatusFromFill(0);
        bins[bIdx].lastCollection = new Date().toISOString();
        setBins(bins);
      }
    }

    return Promise.resolve({ request: requests[idx], collection: coll });
  }
  return Promise.resolve(null);
};

export const fetchCollections = async () =>
  Promise.resolve(collectionsStore.all() || []);

export const fetchCollection = async (id) => {
  const c = collectionsStore.findById(id);
  if (!c) return Promise.reject(new Error("Collection not found."));
  return Promise.resolve(c);
};
