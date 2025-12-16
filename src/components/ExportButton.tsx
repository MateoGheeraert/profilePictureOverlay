import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportButtonProps {
  onExport: (size: number, format: "image/png" | "image/jpeg") => Promise<void>;
  isExporting: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({
  onExport,
  isExporting,
}) => {
  const [size, setSize] = useState(1024);
  const [format, setFormat] = useState<"image/png" | "image/jpeg">("image/png");

  const handleExport = () => {
    onExport(size, format);
  };

  return (
    <div className='flex flex-col gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200'>
      <h3 className='font-semibold text-gray-700'>Export Instellingen</h3>

      <div className='flex gap-4'>
        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-600 mb-1'>
            Resolutie
          </label>
          <select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className='w-full p-2 border border-gray-300 rounded-md text-sm'
          >
            <option value={1024}>1024 x 1024</option>
            <option value={2048}>2048 x 2048</option>
            <option value={4096}>4096 x 4096</option>
          </select>
        </div>

        <div className='flex-1'>
          <label className='block text-sm font-medium text-gray-600 mb-1'>
            Formaat
          </label>
          <select
            value={format}
            onChange={(e) =>
              setFormat(e.target.value as "image/png" | "image/jpeg")
            }
            className='w-full p-2 border border-gray-300 rounded-md text-sm'
          >
            <option value='image/png'>PNG (Transparant)</option>
            <option value='image/jpeg'>JPG (Witte achtergrond)</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={isExporting}
        className='flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isExporting ? (
          <Loader2 className='w-4 h-4 animate-spin' />
        ) : (
          <Download className='w-4 h-4' />
        )}
        {isExporting ? "Bezig met exporteren..." : "Download Afbeelding"}
      </button>
    </div>
  );
};

export default ExportButton;
