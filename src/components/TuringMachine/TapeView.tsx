import { TapeSymbol } from '@/types/turing-machine';
import { cn } from '@/lib/utils';

interface TapeViewProps {
  tape: TapeSymbol[];
  headIndex: number;
  highlightIndex?: number;
  className?: string;
}

export function TapeView({ tape, headIndex, highlightIndex, className }: TapeViewProps) {
  const visibleStart = Math.max(0, headIndex - 8);
  const visibleEnd = Math.min(tape.length, headIndex + 9);
  const visibleTape = tape.slice(visibleStart, visibleEnd);
  
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center justify-center gap-1 overflow-x-auto pb-2">
        {visibleTape.map((symbol, idx) => {
          const actualIndex = visibleStart + idx;
          const isHead = actualIndex === headIndex;
          const isHighlight = actualIndex === highlightIndex;
          
          return (
            <div key={actualIndex} className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "w-12 h-12 border-2 rounded-lg flex items-center justify-center font-mono text-lg font-bold transition-all duration-300",
                  isHead && "border-[hsl(var(--tm-head))] shadow-[0_0_15px_hsl(var(--tm-head)/0.5)] scale-110",
                  !isHead && "border-border",
                  isHighlight && "animate-tape-highlight",
                  symbol === '_' ? "bg-card text-muted-foreground" : "bg-[hsl(var(--tm-tape-cell))] text-foreground"
                )}
              >
                {symbol === '_' ? '␣' : symbol}
              </div>
              <div className="text-xs text-muted-foreground font-mono">{actualIndex}</div>
              {isHead && (
                <div className="text-primary text-xl animate-bounce">▼</div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Head at position {headIndex}
      </div>
    </div>
  );
}
