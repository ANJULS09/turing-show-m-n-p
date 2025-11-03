import { useState, useEffect, useCallback, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { TapeView } from '@/components/TuringMachine/TapeView';
import { StateGraph } from '@/components/TuringMachine/StateGraph';
import { StepInspector } from '@/components/TuringMachine/StepInspector';
import { Controls } from '@/components/TuringMachine/Controls';
import { VerdictCard } from '@/components/TuringMachine/VerdictCard';
import { simulateTM, finalVerdict } from '@/lib/turing-machine';
import { TMResult } from '@/types/turing-machine';

const EXAMPLES = [
  { label: 'aabcc (ACCEPT)', value: 'aabcc' },
  { label: 'aabbcc (REJECT)', value: 'aabbcc' },
];

const Index = () => {
  const [input, setInput] = useState('aabcc');
  const [result, setResult] = useState<TMResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showVerdict, setShowVerdict] = useState(false);
  
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleSimulate = useCallback(() => {
    if (!input.trim()) {
      toast.error('Please enter a string');
      return;
    }
    
    const simResult = simulateTM(input);
    setResult(simResult);
    setCurrentStep(0);
    setShowVerdict(false);
    setIsPlaying(false);
    
    if (simResult.steps.length === 0) {
      toast.error(simResult.explanation);
    } else {
      toast.success(`Simulation complete: ${simResult.steps.length} steps`);
    }
  }, [input]);

  const handlePlay = useCallback(() => {
    if (!result || currentStep >= result.steps.length) return;
    setIsPlaying(true);
  }, [result, currentStep]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleStepForward = useCallback(() => {
    if (!result) return;
    if (currentStep < result.steps.length) {
      setCurrentStep(prev => prev + 1);
    }
    if (currentStep + 1 >= result.steps.length) {
      setShowVerdict(true);
    }
  }, [result, currentStep]);

  const handleStepBack = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
    setShowVerdict(false);
  }, []);

  const handleReset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
    setShowVerdict(false);
  }, []);

  const handleStepClick = useCallback((index: number) => {
    setCurrentStep(index);
    setShowVerdict(index >= (result?.steps.length || 0));
  }, [result]);

  const handleStartRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });
      
      recordedChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tm-simulation-${input}-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        stream.getTracks().forEach(track => track.stop());
        toast.success('Video saved successfully!');
      };
      
      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Failed to start recording');
      console.error(error);
    }
  }, [input]);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  }, [isRecording]);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && result) {
      const delay = 700 / speed;
      playIntervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= result.steps.length) {
            setIsPlaying(false);
            setShowVerdict(true);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    }
    
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, result, speed]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          isPlaying ? handlePause() : handlePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleStepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleStepBack();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleReset();
          break;
        case 'v':
        case 'V':
          e.preventDefault();
          isRecording ? handleStopRecording() : handleStartRecording();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isRecording, handlePlay, handlePause, handleStepForward, handleStepBack, handleReset, handleStartRecording, handleStopRecording]);

  const currentStepData = result?.steps[currentStep];
  const currentState = currentStepData?.state || 'q_start';
  const currentTape = currentStepData?.tapeSnapshot || (result?.steps[0]?.tapeSnapshot || []);
  const currentHeadIndex = currentStepData?.headIndex || 1;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Turing Machine Video Explainer
          </h1>
          <p className="text-lg text-muted-foreground">
            Visualize the computation for L = {'{ aᵐ bⁿ cᵖ | m × n = p }'}
          </p>
        </header>

        {/* Input Section */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Input String</label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter string (e.g., aabcc)"
                className="font-mono text-lg"
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {EXAMPLES.map((example) => (
                <Button
                  key={example.value}
                  variant="outline"
                  onClick={() => setInput(example.value)}
                >
                  {example.label}
                </Button>
              ))}
              <Button onClick={handleSimulate} className="min-w-[120px]">
                Run Simulation
              </Button>
            </div>
          </div>
        </Card>

        {result && (
          <>
            {/* Main Visualization Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left: State Graph */}
              <Card className="p-4">
                <h2 className="text-xl font-semibold mb-4">State Machine</h2>
                <StateGraph currentState={currentState} />
              </Card>

              {/* Center: Tape View */}
              <Card className="p-4 xl:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Tape</h2>
                <TapeView
                  tape={currentTape}
                  headIndex={currentHeadIndex}
                  highlightIndex={currentStepData?.headIndex}
                />
              </Card>
            </div>

            {/* Controls */}
            <Controls
              isPlaying={isPlaying}
              isRecording={isRecording}
              speed={speed}
              currentStep={currentStep}
              totalSteps={result.steps.length}
              onPlay={handlePlay}
              onPause={handlePause}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />

            {/* Bottom Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Step Inspector */}
              <Card className="lg:col-span-2 h-[500px]">
                <StepInspector
                  steps={result.steps}
                  currentStepIndex={currentStep}
                  onStepClick={handleStepClick}
                />
              </Card>

              {/* Verdict */}
              <div className="space-y-4">
                {showVerdict ? (
                  <VerdictCard
                    accepted={finalVerdict(result.m, result.n, result.p)}
                    m={result.m}
                    n={result.n}
                    p={result.p}
                    explanation={result.explanation}
                  />
                ) : (
                  <Card className="p-6 text-center text-muted-foreground">
                    <p>Run the simulation to see the final verdict</p>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {/* Instructions */}
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div><kbd className="px-2 py-1 bg-muted rounded">Space</kbd> Play/Pause</div>
            <div><kbd className="px-2 py-1 bg-muted rounded">→</kbd> Step Forward</div>
            <div><kbd className="px-2 py-1 bg-muted rounded">←</kbd> Step Back</div>
            <div><kbd className="px-2 py-1 bg-muted rounded">R</kbd> Reset</div>
            <div><kbd className="px-2 py-1 bg-muted rounded">V</kbd> Record</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
