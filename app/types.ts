export interface TokenType {
  id: string;
  name: string;
  count: number;
}

export interface ResultsType {
  tokenResults: TokenType[];
  totalTokens: number;
}

export interface FormState {
  ocelotPrideCount: number;
  permanentsCount: number;
  triggerDoublers: number;
  tokenDoublers: number;
  tokens: TokenType[];
}
