import { TapeSymbol, Direction, State, TMTransitions, TMStep, TMConfig, TMResult } from '@/types/turing-machine';

// Turing Machine transitions for L = { a^m b^n c^p | m * n = p }
export const transitions: TMTransitions = {
  // Start: move to verification
  q_start: {
    'a': { write: 'a', move: 'R', nextState: 'q_verify' },
    '_': { write: '_', move: 'R', nextState: 'q_reject' },
  },
  
  // Verify format: a+ b+ c+
  q_verify: {
    'a': { write: 'a', move: 'R', nextState: 'q_verify' },
    'b': { write: 'b', move: 'R', nextState: 'q_verify' },
    'c': { write: 'c', move: 'R', nextState: 'q_verify' },
    '_': { write: '_', move: 'L', nextState: 'q_find_a' },
  },
  
  // Find leftmost unmarked 'a'
  q_find_a: {
    'a': { write: 'X', move: 'R', nextState: 'q_mark_a' },
    'X': { write: 'X', move: 'R', nextState: 'q_find_a' },
    'b': { write: 'b', move: 'L', nextState: 'q_check_finish' },
    'Y': { write: 'Y', move: 'R', nextState: 'q_find_a' },
    'Z': { write: 'Z', move: 'R', nextState: 'q_find_a' },
    '_': { write: '_', move: 'L', nextState: 'q_check_finish' },
  },
  
  // Marked an 'a' as X, now find first 'b'
  q_mark_a: {
    'X': { write: 'X', move: 'R', nextState: 'q_mark_a' },
    'Y': { write: 'Y', move: 'R', nextState: 'q_mark_a' },
    'b': { write: 'Y', move: 'R', nextState: 'q_find_b' },
    'Z': { write: 'Z', move: 'R', nextState: 'q_mark_a' },
  },
  
  // Continue past Y's and Z's to find next b or go back
  q_find_b: {
    'Y': { write: 'Y', move: 'R', nextState: 'q_find_b' },
    'Z': { write: 'Z', move: 'R', nextState: 'q_find_b' },
    'b': { write: 'Y', move: 'R', nextState: 'q_mark_b' },
    'c': { write: 'c', move: 'L', nextState: 'q_restore_y' },
  },
  
  // Mark a 'c' for this 'b'
  q_mark_b: {
    'Y': { write: 'Y', move: 'R', nextState: 'q_mark_b' },
    'Z': { write: 'Z', move: 'R', nextState: 'q_mark_b' },
    'c': { write: 'Z', move: 'L', nextState: 'q_find_c' },
    '_': { write: '_', move: 'L', nextState: 'q_reject' }, // No c available
  },
  
  // Go back to find next b
  q_find_c: {
    'Y': { write: 'Y', move: 'L', nextState: 'q_find_c' },
    'Z': { write: 'Z', move: 'L', nextState: 'q_find_c' },
    'b': { write: 'Y', move: 'R', nextState: 'q_mark_b' },
    'X': { write: 'X', move: 'L', nextState: 'q_find_c' },
    'a': { write: 'a', move: 'L', nextState: 'q_find_a' },
  },
  
  // Restore Y back to b for next iteration
  q_restore_y: {
    'Y': { write: 'b', move: 'L', nextState: 'q_restore_y' },
    'X': { write: 'X', move: 'L', nextState: 'q_restore_y' },
    'a': { write: 'a', move: 'R', nextState: 'q_find_a' },
    'b': { write: 'b', move: 'L', nextState: 'q_restore_y' },
    '_': { write: '_', move: 'R', nextState: 'q_find_a' },
  },
  
  // Check if finished
  q_check_finish: {
    'X': { write: 'X', move: 'R', nextState: 'q_check_finish' },
    'b': { write: 'b', move: 'R', nextState: 'q_check_finish' },
    'Z': { write: 'Z', move: 'R', nextState: 'q_check_finish' },
    'Y': { write: 'Y', move: 'R', nextState: 'q_check_finish' },
    'c': { write: 'c', move: 'R', nextState: 'q_verify_no_c' },
    '_': { write: '_', move: 'L', nextState: 'q_verify_no_c' },
  },
  
  // Verify no unmarked c's remain
  q_verify_no_c: {
    'Z': { write: 'Z', move: 'R', nextState: 'q_verify_no_c' },
    'c': { write: 'c', move: 'R', nextState: 'q_reject' }, // Extra c found
    '_': { write: '_', move: 'L', nextState: 'q_accept' },
  },
};

export function parseInput(input: string): { valid: boolean; m: number; n: number; p: number; tape: TapeSymbol[] } {
  // Count a's, b's, c's
  let m = 0, n = 0, p = 0;
  let phase = 'a';
  
  for (const char of input) {
    if (char === 'a') {
      if (phase !== 'a') return { valid: false, m: 0, n: 0, p: 0, tape: [] };
      m++;
    } else if (char === 'b') {
      if (phase === 'a') phase = 'b';
      if (phase !== 'b') return { valid: false, m: 0, n: 0, p: 0, tape: [] };
      n++;
    } else if (char === 'c') {
      if (phase === 'a' || phase === 'b') phase = 'c';
      if (phase !== 'c') return { valid: false, m: 0, n: 0, p: 0, tape: [] };
      p++;
    } else {
      return { valid: false, m: 0, n: 0, p: 0, tape: [] };
    }
  }
  
  const tape: TapeSymbol[] = ['_', ...input.split('') as TapeSymbol[], '_', '_', '_'];
  return { valid: true, m, n, p, tape };
}

export function simulateTM(input: string): TMResult {
  const parsed = parseInput(input);
  
  if (!parsed.valid) {
    return {
      accepted: false,
      steps: [],
      m: 0,
      n: 0,
      p: 0,
      explanation: 'Invalid input format. Expected format: a+ b+ c+ (all a\'s, then b\'s, then c\'s)',
    };
  }
  
  const { m, n, p, tape } = parsed;
  const steps: TMStep[] = [];
  
  let config: TMConfig = {
    state: 'q_start',
    tape: [...tape],
    headIndex: 1,
    originalM: m,
    originalN: n,
    originalP: p,
  };
  
  let stepNo = 0;
  const maxSteps = 10000; // Prevent infinite loops
  
  while (config.state !== 'q_accept' && config.state !== 'q_reject' && stepNo < maxSteps) {
    const currentSymbol = config.tape[config.headIndex];
    const transition = transitions[config.state]?.[currentSymbol];
    
    if (!transition) {
      // No transition defined, reject
      config.state = 'q_reject';
      break;
    }
    
    const comment = getStepComment(config.state, currentSymbol, transition.write, transition.nextState);
    
    steps.push({
      stepNo: stepNo++,
      state: config.state,
      headIndex: config.headIndex,
      read: currentSymbol,
      write: transition.write,
      move: transition.move,
      tapeSnapshot: [...config.tape],
      comment,
    });
    
    // Apply transition
    config.tape[config.headIndex] = transition.write;
    
    if (transition.move === 'L') {
      config.headIndex--;
      if (config.headIndex < 0) {
        config.tape.unshift('_');
        config.headIndex = 0;
      }
    } else if (transition.move === 'R') {
      config.headIndex++;
      if (config.headIndex >= config.tape.length) {
        config.tape.push('_');
      }
    }
    
    config.state = transition.nextState;
  }
  
  const accepted = config.state === 'q_accept';
  const explanation = accepted
    ? `ACCEPTED: m=${m}, n=${n}, p=${p}. Since m × n = ${m * n} ${m * n === p ? '=' : '≠'} ${p}, the string is ${m * n === p ? 'accepted' : 'INCORRECTLY accepted (bug in TM)'}.`
    : `REJECTED: m=${m}, n=${n}, p=${p}. Since m × n = ${m * n} ${m * n === p ? '=' : '≠'} ${p}, the string is correctly rejected.`;
  
  return {
    accepted,
    steps,
    m,
    n,
    p,
    explanation,
  };
}

function getStepComment(state: State, read: TapeSymbol, write: TapeSymbol, nextState: State): string {
  const comments: Record<string, string> = {
    'q_start': 'Starting simulation',
    'q_verify': 'Verifying input format',
    'q_find_a': 'Finding unmarked a',
    'q_mark_a': `Marked a → X, finding b's`,
    'q_find_b': 'Finding next b',
    'q_mark_b': `Marked b → Y, finding c`,
    'q_find_c': 'Marked c → Z, continuing',
    'q_restore_y': 'Restoring Y → b for next a',
    'q_check_finish': 'Checking if all a processed',
    'q_verify_no_c': 'Verifying no extra c remains',
  };
  
  return comments[state] || `${state}: ${read} → ${write}`;
}

export function finalVerdict(m: number, n: number, p: number): boolean {
  return m * n === p;
}
