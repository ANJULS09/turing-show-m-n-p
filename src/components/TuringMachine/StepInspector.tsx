import { TMStep } from '@/types/turing-machine';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface StepInspectorProps {
  steps: TMStep[];
  currentStepIndex: number;
  onStepClick: (index: number) => void;
  className?: string;
}

export function StepInspector({ steps, currentStepIndex, onStepClick, className }: StepInspectorProps) {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b bg-card">
        <h3 className="font-semibold text-lg">Step Inspector</h3>
        <p className="text-sm text-muted-foreground">Total steps: {steps.length}</p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => onStepClick(idx)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-all duration-200",
                "hover:bg-accent hover:border-primary",
                idx === currentStepIndex && "bg-primary/10 border-primary shadow-md"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-sm font-bold">Step {step.stepNo}</span>
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  "bg-primary/20 text-primary"
                )}>
                  {step.state}
                </span>
              </div>
              <div className="text-sm space-y-1">
                <div className="flex gap-2 font-mono text-muted-foreground">
                  <span>Read: <span className="text-foreground font-bold">{step.read === '_' ? '␣' : step.read}</span></span>
                  <span>→</span>
                  <span>Write: <span className="text-foreground font-bold">{step.write === '_' ? '␣' : step.write}</span></span>
                  <span>Move: <span className="text-foreground font-bold">{step.move}</span></span>
                </div>
                <div className="text-xs text-muted-foreground">{step.comment}</div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
