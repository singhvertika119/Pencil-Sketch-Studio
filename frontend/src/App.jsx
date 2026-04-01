import { useMemo, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { Download, ImageUp, LoaderCircle, Sparkles } from "lucide-react";
import { Button } from "./components/ui/button";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
const ACCEPTED_TYPES = {
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
};

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function App() {
  const [originalImage, setOriginalImage] = useState("");
  const [sketchImage, setSketchImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = async (acceptedFiles, rejectedFiles) => {
    setError("");
    setSketchImage("");

    if (rejectedFiles.length > 0) {
      setError("Only PNG, JPG, and JPEG files are allowed.");
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setFileName(file.name.replace(/\.[^/.]+$/, ""));
      const preview = await fileToDataURL(file);
      setOriginalImage(preview);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API_BASE}/convert`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      setSketchImage(`data:image/png;base64,${response.data.image}`);
    } catch (apiError) {
      const message =
        apiError?.response?.data?.detail ||
        "Conversion failed. Please try another image.";
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: ACCEPTED_TYPES,
    maxFiles: 1,
  });

  const downloadName = useMemo(() => {
    return fileName ? `${fileName}-sketch.png` : "sketch.png";
  }, [fileName]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 px-4 py-10 text-zinc-100 sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Pencil Sketch Studio
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-zinc-300 sm:text-base">
            Upload an image and turn it into a professional pencil sketch in seconds.
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl sm:p-8"
        >
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition sm:p-14 ${
              isDragActive
                ? "border-sky-400 bg-sky-400/10"
                : "border-zinc-700 bg-zinc-900/40 hover:border-zinc-500"
            }`}
          >
            <input {...getInputProps()} />
            <ImageUp className="mx-auto mb-4 h-10 w-10 text-sky-300" />
            <p className="text-base font-medium sm:text-lg">
              {isDragActive ? "Drop image to convert" : "Drag & drop an image here"}
            </p>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              PNG, JPG, JPEG only
            </p>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <AnimatePresence mode="wait">
            {originalImage ? (
              <motion.div
                key={originalImage}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-6"
              >
                {isProcessing ? (
                  <div className="shimmer-box flex min-h-[280px] items-center justify-center rounded-2xl border border-white/10 bg-zinc-900/50">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <LoaderCircle className="h-5 w-5 animate-spin" />
                      Processing sketch...
                    </div>
                  </div>
                ) : null}

                {!isProcessing && sketchImage ? (
                  <>
                    <div className="overflow-hidden rounded-2xl border border-white/10">
                      <ReactCompareSlider
                        itemOne={<ReactCompareSliderImage src={originalImage} alt="Original image" />}
                        itemTwo={<ReactCompareSliderImage src={sketchImage} alt="Sketch image" />}
                      />
                    </div>
                    <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                      <Button
                        variant="primary"
                        className="w-full sm:w-auto"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = sketchImage;
                          link.download = downloadName;
                          link.click();
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Download Sketch
                      </Button>
                      <div className="flex items-center gap-2 text-sm text-zinc-400">
                        <Sparkles className="h-4 w-4 text-sky-300" />
                        Slide to compare before and after.
                      </div>
                    </div>
                  </>
                ) : null}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </section>
    </main>
  );
}
