import { useState, useRef, useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, CircleStop } from "lucide-react";

/**
 * QrScanner — wraps html5-qrcode to scan a QR code with the device camera.
 * Calls `onScan(decodedString)` once a code is read.
 */
const QrScanner = ({ onScan, children }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const html5QrCodeRef = useRef(null);

  const stop = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.clear();
      } catch {
        /* already cleared */
      }
    }
    setScanning(false);
  };

  const start = async () => {
    setError("");
    setScanning(true);
    try {
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decoded) => {
          onScan(decoded);
          stop();
        },
        () => {
          /* scan error — non-fatal, keep scanning */
        }
      );
    } catch (err) {
      setError(
        err?.message ||
          "Could not access the camera. Please allow camera permission."
      );
      setScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  if (scanning) {
    return (
      <div className="text-center">
        <div
          id="qr-reader"
          className="mx-auto overflow-hidden rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600"
          style={{ maxWidth: 300 }}
        />
        <button
          onClick={stop}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200"
        >
          <CircleStop size={16} /> Stop scanning
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-center">
        <Camera size={48} className="text-slate-400" />
      </div>
      <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
        Scan a bin QR code to verify and collect.
      </p>
      {children}
      <button
        onClick={start}
        className="mt-2 inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700"
      >
        <Camera size={18} /> Start Scanning
      </button>
      {error && (
        <p className="mt-3 text-xs text-rose-600">{error}</p>
      )}
    </div>
  );
};

export default QrScanner;
