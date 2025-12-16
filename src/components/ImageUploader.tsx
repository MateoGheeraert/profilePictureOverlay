import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onImageUpload(acceptedFiles[0]);
      }
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
    >
      <input {...getInputProps()} />
      <div className='flex flex-col items-center justify-center gap-2 text-gray-600'>
        <Upload className='w-8 h-8 mb-2' />
        {isDragActive ? (
          <p className='text-blue-500 font-medium'>Laat de foto hier los...</p>
        ) : (
          <>
            <p className='font-medium'>Sleep een foto hierheen</p>
            <p className='text-sm text-gray-400'>of klik om te selecteren</p>
            <p className='text-xs text-gray-400 mt-2'>
              Ondersteunt PNG, JPG, WEBP
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
