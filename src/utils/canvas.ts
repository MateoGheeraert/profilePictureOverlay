import { loadImage } from "./image";

export interface CanvasTransform {
  scale: number;
  x: number;
  y: number;
}

export const drawCanvas = (
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | null,
  overlay: HTMLImageElement | null,
  width: number,
  height: number,
  transform: CanvasTransform
) => {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Draw background (white)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  if (image) {
    ctx.save();

    // Apply user transform (relative to top-left)
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    // Calculate scale to fit image in canvas (object-contain)
    const scaleX = width / image.width;
    const scaleY = height / image.height;
    const baseScale = Math.min(scaleX, scaleY);

    const drawWidth = image.width * baseScale;
    const drawHeight = image.height * baseScale;

    // Calculate position to center image in the canvas (base state)
    const drawX = (width - drawWidth) / 2;
    const drawY = (height - drawHeight) / 2;

    // Draw image centered in the base canvas area
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

    ctx.restore();
  }

  if (overlay) {
    ctx.drawImage(overlay, 0, 0, width, height);
  }
};

export const exportCanvas = async (
  imageSrc: string,
  overlaySrc: string,
  transform: CanvasTransform,
  size: number,
  format: "image/png" | "image/jpeg" = "image/png",
  previewSize?: { width: number; height: number }
): Promise<Blob | null> => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const [img, overlay] = await Promise.all([
    imageSrc ? loadImage(imageSrc) : Promise.resolve(null),
    overlaySrc ? loadImage(overlaySrc) : Promise.resolve(null),
  ]);

  const finalTransform = { ...transform };

  if (previewSize) {
    // Scale the transform based on the ratio between export size and preview size
    const ratio = size / previewSize.width;
    finalTransform.x = transform.x * ratio;
    finalTransform.y = transform.y * ratio;
  }

  drawCanvas(ctx, img, overlay, size, size, finalTransform);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), format, 0.9);
  });
};
