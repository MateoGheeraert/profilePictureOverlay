import { useState } from "react";
import ImageUploader from "./components/ImageUploader";
import CanvasEditor from "./components/CanvasEditor";
import ExportButton from "./components/ExportButton";
import { readFileAsDataURL } from "./utils/image";
import { exportCanvas } from "./utils/canvas";
import type { CanvasTransform } from "./utils/canvas";
import logo from "./assets/logo.png";
import overlagImage from "./assets/overlay.png";

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [transform, setTransform] = useState<CanvasTransform>({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const OVERLAY_SRC = overlagImage;

  const handleImageUpload = async (file: File) => {
    try {
      const dataUrl = await readFileAsDataURL(file);
      setImageSrc(dataUrl);
    } catch (error) {
      console.error("Failed to load image", error);
      alert("Failed to load image");
    }
  };

  const handleTransformChange = (
    newTransform: CanvasTransform,
    size: { width: number; height: number }
  ) => {
    setTransform(newTransform);
    setContainerSize(size);
  };

  const handleExport = async (
    size: number,
    format: "image/png" | "image/jpeg"
  ) => {
    if (!imageSrc) return;

    setIsExporting(true);
    try {
      const blob = await exportCanvas(
        imageSrc,
        OVERLAY_SRC,
        transform,
        size,
        format,
        containerSize || undefined
      );

      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `profile-overlay.${
          format === "image/png" ? "png" : "jpg"
        }`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Export failed", error);
      alert("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto space-y-8'>
        <div className='text-center'>
          <div className='flex flex-col items-center justify-center gap-4 mb-6'>
            <img src={logo} alt='KLJ Merkem Logo' className='h-24 w-auto' />
            <h1 className='text-3xl font-bold text-gray-900'>
              KLJ Merkem Profielfoto
            </h1>
          </div>
          <p className='text-gray-600 max-w-lg mx-auto text-lg'>
            Verander je profielfoto op Facebook om onze fuif te promoten!
          </p>
        </div>

        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100'>
          <div className='p-6 sm:p-8 space-y-8'>
            {!imageSrc && (
              <div className='max-w-md mx-auto'>
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            )}

            {imageSrc && (
              <div className='grid gap-8 md:grid-cols-[1fr,300px]'>
                <div className='space-y-4'>
                  <h2 className='text-lg font-semibold text-gray-800'>
                    Voorbeeld
                  </h2>
                  <CanvasEditor
                    imageSrc={imageSrc}
                    overlaySrc={OVERLAY_SRC}
                    onTransformChange={handleTransformChange}
                  />
                  <button
                    onClick={() => setImageSrc(null)}
                    className='text-sm text-red-600 hover:text-red-700 font-medium'
                  >
                    Afbeelding verwijderen
                  </button>
                </div>

                <div className='space-y-6'>
                  <ExportButton
                    onExport={handleExport}
                    isExporting={isExporting}
                  />

                  <div className='bg-blue-50 p-4 rounded-lg text-sm text-blue-800'>
                    <h3 className='font-semibold mb-2'>Instructies</h3>
                    <ul className='list-disc list-inside space-y-1 opacity-80'>
                      <li>Sleep om de afbeelding te verplaatsen</li>
                      <li>Scroll of knijp om te zoomen</li>
                      <li>Gebruik de schuifregelaar voor precisie</li>
                      <li>Exporteer als je tevreden bent!</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className='text-center text-sm text-gray-400'>
          <p>
            Alles gebeurt lokaal. Je afbeeldingen verlaten je apparaat nooit.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
