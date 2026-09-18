import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  seedStore,
  binsStore,
  requestsStore,
  collectionsStore,
  notificationsStore,
  wasteRecordsStore,
  usersStore,
  setBins,
  setRequests,
  setCollections,
  setNotifications,
  setWasteRecords,
} from "../services/dataStore";
import { getBinStatusFromFill } from "../utils/statusUtils";
import { STATUSES, ROLES } from "../utils/constants";
import { generateId } from "../utils/helpers";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [bins, setBinsState] = useState([]);
  const [requests, setRequestsState] = useState([]);
  const [collections, setCollectionsState] = useState([]);
  const [wasteRecords, setWasteRecordsState] = useState([]);
  const [notifications, setNotificationsState] = useState([]);
  const [users, setUsersState] = useState([]);
  const [requestCounter, setRequestCounter] = useState(0);
  const [version] = useState(0);

  const reloadAll = useCallback(() => {
    seedStore(false);
    setBinsState(
      (binsStore.all() || []).map((b) => ({
        ...b,
        status: b.status || getBinStatusFromFill(b.fillLevel),
      }))
    );
    setRequestsState(requestsStore.all() || []);
    setCollectionsState(collectionsStore.all() || []);
    setWasteRecordsState(wasteRecordsStore.all() || []);
    setNotificationsState(notificationsStore.all() || []);
    setUsersState(usersStore.all() || []);
    setRequestCounter(
      Number(window.localStorage.getItem("medwaste_request_counter")) || 0
    );
  }, []);

  useEffect(() => {
    reloadAll();
    const handler = () => reloadAll();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    // ---- Notifications helper ----
  // Single source of truth: notifications live in React state AND localStorage.
  const addNotification = useCallback(
    (payload) => {
      const created = {
        id: generateId("notif"),
        type: "info",
        read: false,
        createdAt: new Date().toISOString(),
        ...payload,
      };
      setNotificationsState((prev) => [created, ...prev]);
      const persisted = [created, ...(notificationsStore.all() || [])];
      setNotifications(persisted);
      return created;
    },
    []
  );

  const pushNotification = useCallback(async (payload) => {
    return addNotification(payload);
  }, [addNotification]);

  const addSystemNotification = useCallback(
    async ({ role: targetRole, title, message, type, link }) => {
      if (!targetRole) return;
      const targets = users.filter((u) => u.role === targetRole);
      if (targets.length === 0) return;
      await Promise.all(
        targets.map((u) =>
          addNotification({
            userId: u.id,
            title,
            message,
            type,
            link,
          })
        )
      );
    },
    [users, addNotification]
  );

  const getUserById = useCallback((id) => users.find((u) => u.id === id), [users]);

    // ---- Bins ----
  const updateBin = useCallback((id, patch) => {
    const next = bins.map((b) =>
      b.id === id
        ? {
            ...b,
            ...patch,
            status: getBinStatusFromFill(patch.fillLevel ?? b.fillLevel),
          }
        : b
    );
    setBinsState(next);
    setBins(next);
  }, [bins]);

  const addBin = useCallback((payload) => {
    const bin = {
      id: payload.id || `BIN-${generateId().slice(3, 11).toUpperCase()}`,
      department: payload.department,
      category: payload.category,
      capacity: Number(payload.capacity),
      fillLevel: Number(payload.fillLevel) || 0,
      status: getBinStatusFromFill(Number(payload.fillLevel) || 0),
      location: payload.location,
      lastCollection: payload.lastCollection || null,
    };
    const next = [bin, ...bins];
    setBinsState(next);
    setBins(next);
    return bin;
  }, [bins]);

  const removeBin = useCallback((id) => {
    const next = bins.filter((b) => b.id !== id);
    setBinsState(next);
    setBins(next);
  }, [bins]);

  // ---- Waste records ----
  const createWasteRecord = useCallback(async (payload) => {
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
    const next = [record, ...wasteRecords];
    setWasteRecordsState(next);
    setWasteRecords(next);
    return record;
  }, [wasteRecords]);

    // ---- Collection requests ----
  const createCollectionRequest = useCallback(
    async (payload, staffUser) => {
      const counter = requestCounter + 1;
      const year = new Date().getFullYear();
      const reqId = `MW-${String(year).slice(-2)}-${String(counter).padStart(3, "0")}`;
      window.localStorage.setItem("medwaste_request_counter", counter);
      setRequestCounter(counter);

      const request = {
        id: reqId,
        staffId: staffUser?.id || payload.staffId || "unknown",
        staffName: staffUser?.name || payload.staffName || "Unknown",
        department: payload.department,
        binId: payload.binId,
        category: payload.category,
        fillLevel: Number(payload.fillLevel) || 0,
        priority: payload.priority,
        quantity: Number(payload.quantity) || 0,
        notes: payload.notes || "",
        status: STATUSES.PENDING,
        collectorId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const next = [request, ...requests];
      setRequestsState(next);
      setRequests(next);

      await addSystemNotification({
        role: ROLES.COLLECTOR,
        title: "New Collection Request",
        message: `Request ${reqId} from ${request.department} requires your attention.`,
        type: "request",
        link: `/collector/requests/${reqId}`,
      });
      await addSystemNotification({
        role: ROLES.ADMIN,
        title: "New Collection Request",
        message: `Request ${reqId} (${request.priority} priority) submitted.`,
        type: "request",
        link: `/admin/tracking`,
      });

      if (request.priority === "emergency") {
        await pushNotification({
          userId: "broadcast",
          title: "High Priority Request",
          message: `Emergency collection needed: ${reqId}.`,
          type: "urgent",
          link: `/collector/requests/${reqId}`,
        });
      }
      return request;
    },
    [requestCounter, requests, addSystemNotification, pushNotification]
  );

  const updateCollectionRequest = useCallback(
    (id, patch) => {
      const next = requests.map((r) =>
        r.id === id
          ? { ...r, ...patch, updatedAt: new Date().toISOString() }
          : r
      );
      const changed = next.find((r) => r.id === id);
      setRequestsState(next);
      setRequests(next);
      return changed;
    },
    [requests]
  );

    const assignCollector = useCallback(
    async (requestId, collectorId) => {
      const updated = updateCollectionRequest(requestId, {
        status: STATUSES.ASSIGNED,
        collectorId,
      });
      const collector = getUserById(collectorId);
      await pushNotification({
        userId: updated.staffId,
        title: "Collector Assigned",
        message: `${collector?.name || "A collector"} has been assigned to ${requestId}.`,
        type: "update",
        link: `/staff/requests/${requestId}`,
      });
      return updated;
    },
    [updateCollectionRequest, getUserById, pushNotification]
  );

  const startCollection = useCallback(
    async (requestId, collectorId) => {
      const updated = updateCollectionRequest(requestId, {
        status: STATUSES.IN_PROGRESS,
        collectorId,
      });
      await pushNotification({
        userId: updated.staffId,
        title: "Collection Started",
        message: `${requestId} collection has started.`,
        type: "update",
        link: `/staff/requests/${requestId}`,
      });
      return updated;
    },
    [updateCollectionRequest, pushNotification]
  );

  const completeCollection = useCallback(
    async (requestId, binId, collectorName) => {
      const nextRequests = requests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: STATUSES.COLLECTED,
              collectedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : r
      );
      setRequestsState(nextRequests);
      setRequests(nextRequests);

      const collection = {
        id: generateId("col"),
        requestId,
        binId,
        collectorName,
        scannedAt: new Date().toISOString(),
        collectedAt: new Date().toISOString(),
        status: "collected",
      };
      const nextCollections = [collection, ...collections];
      setCollectionsState(nextCollections);
      setCollections(nextCollections);

      if (binId) {
        const nextBins = bins.map((b) =>
          b.id === binId
            ? {
                ...b,
                fillLevel: 0,
                status: getBinStatusFromFill(0),
                lastCollection: new Date().toISOString(),
              }
            : b
        );
        setBinsState(nextBins);
        setBins(nextBins);
      }

      const completed = nextRequests.find((r) => r.id === requestId);
      await pushNotification({
        userId: completed?.staffId,
        title: "Waste Collected",
        message: `${requestId} has been collected.`,
        type: "update",
        link: `/staff/requests/${requestId}`,
      });
      await addSystemNotification({
        role: ROLES.ADMIN,
        title: "Collection Completed",
        message: `${requestId} completed by ${collectorName}.`,
        type: "update",
        link: `/admin/tracking`,
      });

      return { request: completed, collection };
    },
    [requests, collections, bins, pushNotification, addSystemNotification]
  );

      // ---- Notifications (persist + React state) ----
  const markNotificationRead = useCallback((id) => {
    const next = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotificationsState(next);
    setNotifications(next);
  }, [notifications]);

  const markAllNotificationsRead = useCallback(() => {
    const next = notifications.map((n) => ({ ...n, read: true }));
    setNotificationsState(next);
    setNotifications(next);
  }, [notifications]);

  // ---- Derived selectors ----
  const binById = (id) => bins.find((b) => b.id === id);
  const requestById = (id) => requests.find((r) => r.id === id);

  const pendingRequests = requests.filter(
    (r) => !["collected", "completed"].includes(r.status)
  );

  const binsNeedingCollection = bins.filter((b) => b.fillLevel >= 90);

  return (
    <AppDataContext.Provider
      value={{
        bins,
        requests,
        collections,
        wasteRecords,
        notifications,
        users,
        requestCounter,
        version,
        getUserById,
        binById,
        updateBin,
        addBin,
        removeBin,
        createWasteRecord,
        createCollectionRequest,
        updateCollectionRequest,
        assignCollector,
        startCollection,
        completeCollection,
        requestById,
        markNotificationRead,
        markAllNotificationsRead,
        pushNotification,
        pendingRequests,
        binsNeedingCollection,
        reloadAll,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
};

export default AppDataContext;

