/**
 * Mock AI waste classifier.
 *
 * IMPORTANT: This is a PROTOTYPE. It does NOT constitute a medically
 * or clinically validated classification model. It exists to demonstrate
 * the workflow of the platform and provides a clean interface that can be
 * replaced by a real trained model / external API later.
 *
 * Replace `classifyWasteImage` with a real TensorFlow.js model or a call to
 * your trained endpoint in `src/services/ai/wasteClassifier.js`.
 */

import {
  WASTE_CATEGORIES,
  WASTE_CATEGORY_LABELS,
  WASTE_CATEGORY_CONTAINERS,
  WASTE_EXAMPLES,
  WASTE_SAFETY_INSTRUCTIONS,
} from "../../utils/constants";
import { generateId } from "../../utils/helpers";

// Local bundled illustrations for the built-in example cards. Importing these
// through Vite guarantees the files exist and emits base-relative hashed URLs
// that load reliably in dev and production (no external/network dependency).
import exampleSyringeImg from "../../assets/waste/waste-example-syringe.svg";
import exampleGauzeImg from "../../assets/waste/waste-example-gauze.svg";
import examplePlasticImg from "../../assets/waste/waste-example-plastic.svg";
import exampleGlassImg from "../../assets/waste/waste-example-glass.svg";
import exampleGeneralImg from "../../assets/waste/waste-example-general.svg";

// Map each supported category to a set of (image, detectedType) example pairs.
// These give the demo predictable, sensible results.
export const EXAMPLE_WASTE_ITEMS = [
  {
    id: "ex-sharps",
    detectedType: "Used syringe",
    category: WASTE_CATEGORIES.WHITE,
    image: exampleSyringeImg,
  },
  {
    id: "ex-anatomical",
    detectedType: "Gauze and bandages (soiled)",
    category: WASTE_CATEGORIES.YELLOW,
    image: exampleGauzeImg,
  },
  {
    id: "ex-contaminated",
    detectedType: "Contaminated recyclable plastic",
    category: WASTE_CATEGORIES.RED,
    image: examplePlasticImg,
  },
  {
    id: "ex-glass",
    detectedType: "Broken glass vial",
    category: WASTE_CATEGORIES.BLUE,
    image: exampleGlassImg,
  },
  {
    id: "ex-general",
    detectedType: "General refuse (non-clinical)",
    category: WASTE_CATEGORIES.GENERAL,
    image: exampleGeneralImg,
  },
];

// Lightweight deterministic hash of a string for reproducible mock results.
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

// Simulated per-category confidence so results feel realistic but vary.
const confidenceFor = (category, seeded) => {
  const base = {
    [WASTE_CATEGORIES.YELLOW]: 86,
    [WASTE_CATEGORIES.RED]: 90,
    [WASTE_CATEGORIES.WHITE]: 94,
    [WASTE_CATEGORIES.BLUE]: 81,
    [WASTE_CATEGORIES.GENERAL]: 78,
  };
  return Math.min(98, Math.max(60, base[category] + (seeded % 11)));
};

/**
 * Build a full classification result object.
 */
const buildResult = (category, detectedType, imageUrl) => ({
  id: generateId("cls"),
  detectedType,
  category,
  categoryLabel: WASTE_CATEGORY_LABELS[category] || category,
  recommendedContainer: WASTE_CATEGORY_CONTAINERS[category] || "",
  confidence: confidenceFor(category, hashString(detectedType + imageUrl)),
  safetyInstruction: WASTE_SAFETY_INSTRUCTIONS[category] || "",
  examples: WASTE_EXAMPLES[category] || [],
  imageUrl,
  isMock: true,
});

/**
 * Classify an uploaded image file.
 *
 * In the demo the image bytes are hashed to deterministically pick a category
 * so the same image yields the same result. Replace this body with a real
 * model inference call when ready.
 *
 * @param {File|Blob|string} imageSrc - the image File/blob, or a data URL / URL string
 * @returns {Promise<Object>} classification result
 */
export const classifyWasteImage = async (imageSrc) => {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      const dataUrl = typeof imageSrc === "string" ? imageSrc : null;
      const hashBase =
        dataUrl?.slice(-2000) ||
        (imageSrc && imageSrc.name) ||
        "demo-image";
      const idx = hashString(hashBase) % EXAMPLE_WASTE_ITEMS.length;
      const pick = EXAMPLE_WASTE_ITEMS[idx];
      resolve(buildResult(pick.category, pick.detectedType, dataUrl || pick.image));
    }, 1400);

    // If we have an actual File, read its bytes for hashing, then resolve.
    if (imageSrc && typeof imageSrc === "object" && "arrayBuffer" in imageSrc) {
      imageSrc
        .arrayBuffer()
        .then((buf) => {
          const bytes = new Uint8Array(buf);
          const sample = [];
          const step = Math.max(1, Math.floor(bytes.length / 200));
          for (let i = 0; i < bytes.length; i += step) sample.push(bytes[i]);
          const hashStr = String.fromCharCode(...sample);
          const idx = hashString(hashStr) % EXAMPLE_WASTE_ITEMS.length;
          const pick = EXAMPLE_WASTE_ITEMS[idx];
          clearTimeout(timeout);
          resolve(buildResult(pick.category, pick.detectedType, null));
        })
        .catch(() => {
          const idx = hashString(imageSrc.name || "demo") % EXAMPLE_WASTE_ITEMS.length;
          const pick = EXAMPLE_WASTE_ITEMS[idx];
          clearTimeout(timeout);
          resolve(buildResult(pick.category, pick.detectedType, null));
        });
    }
  });
};

/**
 * Convenience: classify a built-in example image directly.
 * @param {string} exampleId
 */
export const classifyExample = async (exampleId) => {
  const example = EXAMPLE_WASTE_ITEMS.find((e) => e.id === exampleId);
  if (!example) {
    return Promise.reject(new Error("Unknown example."));
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(buildResult(example.category, example.detectedType, example.image)), 600);
  });
};

export default {
  classifyWasteImage,
  classifyExample,
  EXAMPLE_WASTE_ITEMS,
  isMock: true,
};
