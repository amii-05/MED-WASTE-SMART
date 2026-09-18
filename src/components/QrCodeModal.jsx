import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import QRCode from "qrcode";

/**
 * QrCodeModal — generates and displays a QR code for `value` (e.g. a bin ID).
 * Includes a PNG download link.
 */
const QrCodeModal = ({ value, label, onClose }) => {
  const [dataUrl, setDataUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!value) return;
    setLoading(true);
    QRCode.toDataURL(value, { width: 192, margin: 2 })
      .then((url) => {
        setDataUrl(url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [value]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-80 rounded-xl bg-white p-6 text-center dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            {label}
          </h3>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X size={18} />
          </button>
        </div>
        <div className="my-4 flex justify-center">
          {loading ? (
            <div className="h-48 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          ) : dataUrl ? (
            <img src={dataUrl} alt={`QR for ${value}`} className="h-48 w-48" />
          ) : (
            <p className="text-sm text-rose-600">Failed to generate QR.</p>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{value}</p>
        {dataUrl && (
          <a
            href={dataUrl}
            download={`qr-${value}.png`}
            className="mt-2 flex items-center justify-center gap-1 text-xs text-primary-600 hover:text-primary-700"
          >
            <Download size={14} /> Download PNG
          </a>
        )}
        <p className="mt-2 text-xs text-slate-400">
          Scan this with the collector scan screen.
        </p>
      </div>
    </div>
  );
};

export default QrCodeModal;
