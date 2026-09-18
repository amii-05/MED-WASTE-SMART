// Status utilities for mapping fill level / workflow status to UI state.

import { BIN_STATUSES, STATUSES } from "./constants";

export const getBinStatusFromFill = (fillLevel) => {
  const fill = Number(fillLevel) || 0;
  if (fill >= 90) return BIN_STATUSES.COLLECTION_REQUIRED;
  if (fill >= 70) return BIN_STATUSES.ALMOST_FULL;
  return BIN_STATUSES.NORMAL;
};

export const getBinStatusLabel = (status) => {
  switch (status) {
    case BIN_STATUSES.NORMAL:
      return "Normal";
    case BIN_STATUSES.ALMOST_FULL:
      return "Almost Full";
    case BIN_STATUSES.COLLECTION_REQUIRED:
      return "Collection Required";
    default:
      return "Unknown";
  }
};

export const getBinStatusColor = (status) => {
  switch (status) {
    case BIN_STATUSES.NORMAL:
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case BIN_STATUSES.ALMOST_FULL:
      return "bg-amber-100 text-amber-800 border-amber-200";
    case BIN_STATUSES.COLLECTION_REQUIRED:
      return "bg-rose-100 text-rose-800 border-rose-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
  }
};

export const getBinStatusIcon = (status) => {
  switch (status) {
    case BIN_STATUSES.NORMAL:
      return "CheckCircle";
    case BIN_STATUSES.ALMOST_FULL:
      return "AlertTriangle";
    case BIN_STATUSES.COLLECTION_REQUIRED:
      return "AlertOctagon";
    default:
      return "HelpCircle";
  }
};

export const getFillLevelColor = (fillLevel) => {
  const fill = Number(fillLevel) || 0;
  if (fill >= 90) return "bg-rose-500";
  if (fill >= 70) return "bg-amber-500";
  return "bg-emerald-500";
};

export const getStatusStep = (status) => {
  const order = [
    STATUSES.PENDING,
    STATUSES.ASSIGNED,
    STATUSES.IN_PROGRESS,
    STATUSES.COLLECTED,
    STATUSES.COMPLETED,
  ];
  return order.indexOf(status);
};

export const isTerminalStatus = (status) =>
  status === STATUSES.COMPLETED || status === STATUSES.COLLECTED;

// Determine if a given role can perform an action on a request
export const canCollectorAccept = (status) => status === STATUSES.PENDING;
export const canCollectorStart = (status) =>
  status === STATUSES.ASSIGNED;
export const canCollectorComplete = (status) =>
  status === STATUSES.IN_PROGRESS;

export const collectionStats = (requests, collections, bins, wasteRecords) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const collectionsWeek = collections.filter(
    (c) => c.collectedAt && new Date(c.collectedAt) >= weekAgo
  ).length;
  const avgFill =
    bins.length > 0
      ? Math.round(bins.reduce((s, b) => s + (Number(b.fillLevel) || 0), 0) / bins.length)
      : 0;
  return {
    totalRequests: requests.length,
    collectionsWeek,
    wasteRecords: wasteRecords.length,
    avgFill,
  };
};
