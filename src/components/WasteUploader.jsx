import { Camera } from "lucide-react";
import { EXAMPLE_WASTE_ITEMS } from "../services/ai/wasteClassifier";

/**
 * WasteUploader — drag-and-drop image upload area + example image gallery.
 * Communicates with the parent via callbacks only (it stays stateless).
 */
const WasteUploader = ({
  imageUrl,
  file,
  classifying,
  onFileSelect,
  onClassify,
  onExampleClick,
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) onFileSelect(f);
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="space-y-8">
      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-colors hover:border-primary-400 dark:border-slate-600 dark:bg-slate-800"
      >
        <Camera size={40} className="mb-3 text-slate-400" />
        <p className="mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">
          Drag &amp; drop an image, or click to browse
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          PNG, JPG, GIF up to 5 MB
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileSelect(e.target.files?.[0])}
          className="mt-3 text-sm text-primary-600 file:rounded-lg file:border-0 file:bg-primary-100 file:px-4 file:py-2 file:font-medium file:text-primary-700 hover:file:bg-primary-200"
        />
        {imageUrl && file && !classifying && (
          <div className="mt-4">
            <img
              src={imageUrl}
              alt="preview"
              className="h-20 w-20 rounded-lg object-cover"
            />
            <button
              onClick={onClassify}
              className="mt-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
            >
              Classify this image
            </button>
          </div>
        )}
      </div>

      {/* Example gallery */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
          Or try a built-in example
        </h3>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {EXAMPLE_WASTE_ITEMS.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onExampleClick(ex.id)}
              className="group relative rounded-lg border border-slate-200 bg-slate-100 p-1 transition-transform hover:scale-105 dark:border-slate-700"
            >
              <img
                src={ex.image}
                alt={ex.detectedType}
                className="h-16 w-full rounded object-cover"
              />
              <span className="mt-1 block text-xs text-slate-600 group-hover:text-slate-900 dark:text-slate-400">
                {ex.detectedType}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WasteUploader;
