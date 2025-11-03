import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  RotateCcw,
  Video,
  StopCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlsProps {
  isPlaying: boolean;
  isRecording: boolean;
  speed: number;
  currentStep: number;
  totalSteps: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  className?: string;
}

export function Controls({
  isPlaying,
  isRecording,
  speed,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  onSpeedChange,
  onStartRecording,
  onStopRecording,
  className,
}: ControlsProps) {
  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-card border rounded-lg", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={isPlaying || isRecording}
            title="Reset (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onStepBack}
            disabled={currentStep === 0 || isPlaying || isRecording}
            title="Step Back (←)"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={isPlaying ? onPause : onPlay}
            disabled={isRecording || currentStep >= totalSteps}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={onStepForward}
            disabled={currentStep >= totalSteps || isPlaying || isRecording}
            title="Step Forward (→)"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground min-w-[80px]">
            {currentStep} / {totalSteps}
          </span>
        </div>
        
        <Button
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? onStopRecording : onStartRecording}
          disabled={isPlaying}
          title={isRecording ? "Stop Recording (V)" : "Start Recording (V)"}
        >
          {isRecording ? (
            <>
              <StopCircle className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Video className="h-4 w-4 mr-2" />
              Record Video
            </>
          )}
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium min-w-[60px]">Speed:</span>
        <Slider
          value={[speed]}
          onValueChange={(values) => onSpeedChange(values[0])}
          min={0.5}
          max={2}
          step={0.5}
          className="flex-1"
          disabled={isRecording}
        />
        <span className="text-sm text-muted-foreground min-w-[40px]">{speed}x</span>
      </div>
    </div>
  );
}
