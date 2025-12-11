import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ScannedInputProps extends React.ComponentProps<typeof Input> {
  isScanned?: boolean;
}

export function ScannedInput({ isScanned, className, ...props }: ScannedInputProps) {
  return (
    <div className="relative">
      <Input
        className={cn(
          isScanned && "border-green-500 bg-green-50/50 pr-10",
          className
        )}
        {...props}
      />
      {isScanned && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Check className="h-4 w-4 text-green-600" />
        </div>
      )}
    </div>
  );
}
