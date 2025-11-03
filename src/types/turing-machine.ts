export type TapeSymbol = 'a' | 'b' | 'c' | 'X' | 'Y' | 'Z' | '_';
export type Direction = 'L' | 'R' | 'S';
export type State = 
  | 'q_start'
  | 'q_verify'
  | 'q_find_a'
  | 'q_mark_a'
  | 'q_find_b'
  | 'q_mark_b'
  | 'q_find_c'
  | 'q_mark_c'
  | 'q_restore_y'
  | 'q_check_finish'
  | 'q_verify_no_c'
  | 'q_accept'
  | 'q_reject';

export interface Transition {
  write: TapeSymbol;
  move: Direction;
  nextState: State;
}

export interface TMTransitions {
  [state: string]: {
    [symbol: string]: Transition;
  };
}

export interface TMStep {
  stepNo: number;
  state: State;
  headIndex: number;
  read: TapeSymbol;
  write: TapeSymbol;
  move: Direction;
  tapeSnapshot: TapeSymbol[];
  comment: string;
}

export interface TMConfig {
  state: State;
  tape: TapeSymbol[];
  headIndex: number;
  originalM: number;
  originalN: number;
  originalP: number;
}

export interface TMResult {
  accepted: boolean;
  steps: TMStep[];
  m: number;
  n: number;
  p: number;
  explanation: string;
}
