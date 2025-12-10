export interface TokenPayload {
  sub: string;
  email: string;
  name: string;
}

export interface TokenPair {
  session_token: string;
  refresh_token: string;
}

export interface ITokenService {
  generate_session_token(payload: TokenPayload): Promise<string>;
  generate_refresh_token(payload: TokenPayload): Promise<string>;
  generate_token_pair(payload: TokenPayload): Promise<TokenPair>;
  verify_session_token(token: string): Promise<TokenPayload>;
  verify_refresh_token(token: string): Promise<TokenPayload>;
}
