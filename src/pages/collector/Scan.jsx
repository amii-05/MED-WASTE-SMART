import { useState } from "react";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import QrScanner from "../../components/QrScanner";
import ScannedBinView from "../../components/ScannedBinView";

const Scan = () => {
  const [scannedBinId, setScannedBinId] = useState(null);
  const { binById } = useAppData();

  const bin = scannedBinId ? binById(scannedBinId) : null;

  const reset = () => setScannedBinId(null);

  return (
    <div>
      <PageHeader
        title="Scan Bin QR Code"
        subtitle="Scan a bin to verify and act on its collection requests."
        backTo="/collector/dashboard"
      />

      {!scannedBinId ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-700 dark:bg-slate-800">
          <QrScanner onScan={setScannedBinId}>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                            Point the camera at a bin&apos;s QR label.
            </p>
          </QrScanner>

          <div className="mt-6">
            <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
              Or manually enter a bin ID:
            </p>
            <input
              type="text"
              placeholder="e.g. BIN-ICU-001"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  setScannedBinId(e.target.value.trim());
                }
              }}
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900"
            />
          </div>
        </div>
      ) : (
        <ScannedBinView binId={scannedBinId} bin={bin} onReset={reset} />
      )}
    </div>
  );
};

export default Scan;
