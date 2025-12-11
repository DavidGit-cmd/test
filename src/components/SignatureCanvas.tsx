import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Check } from 'lucide-react';

interface SignatureCanvasProps {
  onSignatureChange: (signatureData: string) => void;
  initialSignature?: string;
  width?: number;
  height?: number;
}

export function SignatureCanvas({ 
  onSignatureChange, 
  initialSignature = '', 
  width = 400, 
  height = 150 
}: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(!!initialSignature);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Load initial signature if provided
    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialSignature;
    }
  }, []);

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setHasSignature(true);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL('image/png');
      onSignatureChange(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange('');
  };

  return (
    <div className="space-y-2">
      <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="w-full touch-none cursor-crosshair"
          style={{ maxWidth: '100%', height: 'auto', aspectRatio: `${width}/${height}` }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-muted-foreground/50 text-sm">Tegn signatur her</span>
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={clearSignature}
          className="text-xs"
        >
          <Eraser className="h-3 w-3 mr-1" />
          Slett signatur
        </Button>
        {hasSignature && (
          <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Signert
          </span>
        )}
      </div>
    </div>
  );
}
