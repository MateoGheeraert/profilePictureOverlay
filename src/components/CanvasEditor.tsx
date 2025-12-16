import React, { useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import type { CanvasTransform } from "../utils/canvas";
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Move } from "lucide-react";

interface CanvasEditorProps {
  imageSrc: string | null;
  overlaySrc: string;
  onTransformChange: (
    transform: CanvasTransform,
    containerSize: { width: number; height: number }
  ) => void;
  initialScale?: number;
}

const CanvasEditor: React.FC<CanvasEditorProps> = ({
  imageSrc,
  overlaySrc,
  onTransformChange,
  initialScale = 1,
}) => {
  const transformComponentRef = useRef<ReactZoomPanPinchRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);

  // Update transform when it changes
  const handleTransform = (ref: ReactZoomPanPinchRef) => {
    const { state } = ref;
    setScale(state.scale);

    if (containerRef.current) {
      onTransformChange(
        {
          x: state.positionX,
          y: state.positionY,
          scale: state.scale,
        },
        {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        }
      );
    }
  };

  const handleZoomIn = () => transformComponentRef.current?.zoomIn();
  const handleZoomOut = () => transformComponentRef.current?.zoomOut();
  const handleReset = () => transformComponentRef.current?.resetTransform();
  const handleCenter = () => transformComponentRef.current?.centerView();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newScale = Number(e.target.value);
    const { positionX, positionY } = transformComponentRef.current?.state || {
      positionX: 0,
      positionY: 0,
    };
    transformComponentRef.current?.setTransform(positionX, positionY, newScale);
  };

  return (
    <div className='flex flex-col gap-4 w-full max-w-[500px] mx-auto'>
      <div
        ref={containerRef}
        className='relative w-full aspect-square bg-gray-100 overflow-hidden border border-gray-300 shadow-lg rounded-lg'
      >
        {imageSrc ? (
          <TransformWrapper
            ref={transformComponentRef}
            initialScale={initialScale}
            minScale={0.1}
            maxScale={5}
            centerOnInit={true}
            onTransformed={handleTransform}
            onInit={handleTransform}
            wheel={{ step: 0.1 }}
          >
            <TransformComponent
              wrapperStyle={{ width: "100%", height: "100%" }}
              contentStyle={{ width: "100%", height: "100%" }}
            >
              <img
                src={imageSrc}
                alt='Uploaded'
                className='w-full h-full object-contain pointer-events-none'
                style={{ width: "100%", height: "100%" }}
              />
            </TransformComponent>
          </TransformWrapper>
        ) : (
          <div className='flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50'>
            <Move className='w-12 h-12 mb-2 opacity-20' />
            <p>Upload een foto om te beginnen</p>
          </div>
        )}

        {/* Overlay */}
        <div className='absolute inset-0 pointer-events-none z-10'>
          <img
            src={overlaySrc}
            alt='Overlay'
            className='w-full h-full object-cover'
          />
        </div>
      </div>

      {/* Controls */}
      <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
        <div className='flex items-center gap-4 mb-4'>
          <button
            onClick={handleZoomOut}
            disabled={!imageSrc}
            className='text-gray-500 hover:text-gray-700 disabled:opacity-50'
          >
            <ZoomOut className='w-4 h-4' />
          </button>
          <input
            type='range'
            min='0.1'
            max='5'
            step='0.1'
            value={scale}
            onChange={handleSliderChange}
            disabled={!imageSrc}
            className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600'
          />
          <button
            onClick={handleZoomIn}
            disabled={!imageSrc}
            className='text-gray-500 hover:text-gray-700 disabled:opacity-50'
          >
            <ZoomIn className='w-4 h-4' />
          </button>
        </div>

        <div className='flex justify-between gap-2'>
          <button
            onClick={handleReset}
            disabled={!imageSrc}
            className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50'
            title='Transformatie resetten'
          >
            <RotateCcw className='w-4 h-4' />
            Reset
          </button>

          <div className='flex gap-2'>
            <button
              onClick={handleCenter}
              disabled={!imageSrc}
              className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50'
              title='Afbeelding centreren'
            >
              <Move className='w-4 h-4' />
              Centreren
            </button>
            <button
              onClick={() => {
                const { positionX, positionY } = transformComponentRef.current
                  ?.state || { positionX: 0, positionY: 0 };
                transformComponentRef.current?.setTransform(
                  positionX,
                  positionY,
                  1
                );
              }}
              disabled={!imageSrc}
              className='flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50'
              title='Passend maken'
            >
              <Maximize className='w-4 h-4' />
              Passend maken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasEditor;
