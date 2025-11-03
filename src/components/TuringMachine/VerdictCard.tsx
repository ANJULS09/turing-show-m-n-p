import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerdictCardProps {
  accepted: boolean;
  m: number;
  n: number;
  p: number;
  explanation: string;
  className?: string;
}

export function VerdictCard({ accepted, m, n, p, explanation, className }: VerdictCardProps) {
  return (
    <div className={cn(
      "p-6 rounded-lg border-2 transition-all duration-500 animate-slide-in",
      accepted 
        ? "bg-[hsl(var(--tm-accept)/0.1)] border-[hsl(var(--tm-accept))]" 
        : "bg-[hsl(var(--tm-reject)/0.1)] border-[hsl(var(--tm-reject))]",
      className
    )}>
      <div className="flex items-center gap-3 mb-4">
        {accepted ? (
          <CheckCircle2 className="w-8 h-8 text-[hsl(var(--tm-accept))]" />
        ) : (
          <XCircle className="w-8 h-8 text-[hsl(var(--tm-reject))]" />
        )}
        <h3 className={cn(
          "text-2xl font-bold",
          accepted ? "text-[hsl(var(--tm-accept))]" : "text-[hsl(var(--tm-reject))]"
        )}>
          {accepted ? 'ACCEPTED' : 'REJECTED'}
        </h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-4 text-lg font-mono">
          <span className="text-muted-foreground">m =</span>
          <span className="font-bold">{m}</span>
          <span className="text-muted-foreground">n =</span>
          <span className="font-bold">{n}</span>
          <span className="text-muted-foreground">p =</span>
          <span className="font-bold">{p}</span>
        </div>
        
        <div className="text-lg font-mono">
          <span className="text-muted-foreground">m × n =</span>
          <span className="font-bold ml-2">{m * n}</span>
          <span className={cn(
            "mx-2 font-bold",
            m * n === p ? "text-[hsl(var(--tm-accept))]" : "text-[hsl(var(--tm-reject))]"
          )}>
            {m * n === p ? '=' : '≠'}
          </span>
          <span className="font-bold">{p}</span>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4">
          {explanation}
        </p>
      </div>
    </div>
  );
}
