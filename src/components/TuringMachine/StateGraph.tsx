import { State } from '@/types/turing-machine';
import { cn } from '@/lib/utils';

interface StateGraphProps {
  currentState: State;
  className?: string;
}

const statePositions: Record<State, { x: number; y: number }> = {
  'q_start': { x: 50, y: 100 },
  'q_verify': { x: 150, y: 100 },
  'q_find_a': { x: 250, y: 100 },
  'q_mark_a': { x: 350, y: 50 },
  'q_find_b': { x: 450, y: 50 },
  'q_mark_b': { x: 550, y: 50 },
  'q_find_c': { x: 450, y: 150 },
  'q_mark_c': { x: 550, y: 150 },
  'q_restore_y': { x: 350, y: 150 },
  'q_check_finish': { x: 250, y: 200 },
  'q_verify_no_c': { x: 350, y: 250 },
  'q_accept': { x: 450, y: 300 },
  'q_reject': { x: 250, y: 300 },
};

const stateLabels: Record<State, string> = {
  'q_start': 'Start',
  'q_verify': 'Verify',
  'q_find_a': 'Find a',
  'q_mark_a': 'Mark a',
  'q_find_b': 'Find b',
  'q_mark_b': 'Mark b',
  'q_find_c': 'Find c',
  'q_mark_c': 'Mark c',
  'q_restore_y': 'Restore',
  'q_check_finish': 'Check',
  'q_verify_no_c': 'Verify c',
  'q_accept': 'Accept',
  'q_reject': 'Reject',
};

export function StateGraph({ currentState, className }: StateGraphProps) {
  return (
    <div className={cn("relative w-full h-[400px] bg-card rounded-lg border p-4", className)}>
      <svg className="w-full h-full" viewBox="0 0 600 350">
        {/* Draw edges (simplified - showing main flow) */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--muted-foreground))" />
          </marker>
        </defs>
        
        {/* Main flow edges */}
        <line x1="90" y1="100" x2="130" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="190" y1="100" x2="230" y2="100" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="270" y1="90" x2="320" y2="60" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="390" y1="50" x2="430" y2="50" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="490" y1="70" x2="470" y2="130" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="430" y1="160" x2="390" y2="160" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="250" y1="180" x2="250" y2="220" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="280" y1="220" x2="330" y2="240" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="390" y1="260" x2="430" y2="290" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        <line x1="310" y1="260" x2="270" y2="290" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrowhead)" />
        
        {/* Draw state nodes */}
        {Object.entries(statePositions).map(([state, pos]) => {
          const isActive = state === currentState;
          const isAccept = state === 'q_accept';
          const isReject = state === 'q_reject';
          
          return (
            <g key={state}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="30"
                className={cn(
                  "transition-all duration-300",
                  isActive && "animate-pulse-glow",
                  isAccept && !isActive && "fill-[hsl(var(--tm-accept)/0.2)] stroke-[hsl(var(--tm-accept))]",
                  isReject && !isActive && "fill-[hsl(var(--tm-reject)/0.2)] stroke-[hsl(var(--tm-reject))]",
                  !isAccept && !isReject && !isActive && "fill-[hsl(var(--tm-state)/0.1)] stroke-[hsl(var(--tm-state))]",
                  !isAccept && !isReject && isActive && "fill-[hsl(var(--tm-state-active)/0.3)] stroke-[hsl(var(--tm-state-active))]"
                )}
                strokeWidth="3"
              />
              {isAccept && (
                <circle cx={pos.x} cy={pos.y} r="24" fill="none" stroke="hsl(var(--tm-accept))" strokeWidth="2" />
              )}
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className="text-xs font-semibold fill-foreground"
              >
                {stateLabels[state as State]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
