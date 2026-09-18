import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import WasteResult from "../../components/WasteResult";
import WasteUploader from "../../components/WasteUploader";
import WasteCategoryGuide from "../../components/WasteCategoryGuide";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  classifyWasteImage,
  classifyExample as classifyExampleItem,
} from "../../services/ai/wasteClassifier";

const IdentifyWaste = () => {
  const { user } = useAuth();
  const { createWasteRecord } = useAppData();
  const [imageUrl, setImageUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [classifying, setClassifying] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const readFile = (f) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result);
      setFile(f);
      setResult(null);
      setSaved(false);
    };
    reader.readAsDataURL(f);
  };

  const handleFileSelect = (f) => {
    if (f) readFile(f);
  };

  const classify = async () => {
    if (!file) return;
    setClassifying(true);
    try {
      const res = await classifyWasteImage(file);
      setResult({ ...res, imageUrl: imageUrl || res.imageUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setClassifying(false);
    }
  };

  const handleExample = async (exampleId) => {
    setClassifying(true);
    setFile(null);
    try {
      const res = await classifyExampleItem(exampleId);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setClassifying(false);
    }
  };

  const saveRecord = async () => {
    if (!result) return;
    setSaving(true);
    try {
      await createWasteRecord({
        staffId: user?.id,
        staffName: user?.name,
        imageUrl: result.imageUrl,
        detectedType: result.detectedType,
        category: result.category,
        confidence: result.confidence,
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setResult(null);
    setSaved(false);
  };

  return (
    <div>
      <PageHeader
        title="Identify Waste"
        subtitle="Upload a photo or pick an example to classify medical waste."
        backTo="/staff/dashboard"
      />

      {/* Success state */}
      {saved && result && (
        <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-900/40 dark:bg-emerald-900/20">
          <div className="mb-2 text-3xl">✅</div>
          <h3 className="font-semibold text-emerald-800 dark:text-emerald-300">
            Waste record saved!
          </h3>
          <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
            {result.detectedType} → {result.categoryLabel}
          </p>
          <button
            onClick={reset}
            className="mt-3 rounded-lg border border-emerald-300 px-4 py-2 text-sm font-medium text-emerald-800 hover:bg-emerald-100"
          >
            Identify another item
          </button>
        </div>
      )}

      {/* Classifying */}
      {classifying && (
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
          <LoadingSpinner size={40} text="Analyzing image with AI mock…" />
        </div>
      )}

      {/* Result */}
      {result && !saved && !classifying && (
        <div className="mb-6">
          <WasteResult result={result} onSave={saveRecord} saving={saving} />
          <button
            onClick={reset}
            className="mt-4 text-xs text-slate-500 hover:text-slate-700"
          >
            ← Classify something else
          </button>
        </div>
      )}

      {/* Upload + Gallery */}
      {!result && !classifying && !saved && (
        <div className="space-y-8">
          <WasteUploader
            imageUrl={imageUrl}
            file={file}
            classifying={classifying}
            onFileSelect={handleFileSelect}
            onClassify={classify}
            onExampleClick={handleExample}
          />

          {/* Quick-reference category guide */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Waste Category Guide
            </h3>
            <WasteCategoryGuide compact />
          </div>
        </div>
      )}
    </div>
  );
};

export default IdentifyWaste;
