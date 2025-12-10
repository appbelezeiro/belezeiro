import { ITokenService, TokenPair } from '@/application/contracts/services/i-token-service.interface';

class UseCase {
  constructor(private readonly token_service: ITokenService) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const payload = await this.token_service.verify_refresh_token(input.refresh_token);

    const token_pair = await this.token_service.generate_token_pair(payload);

    return token_pair;
  }
}

declare namespace UseCase {
  export type Input = {
    refresh_token: string;
  };

  export type Output = Promise<TokenPair>;
}

export { UseCase as RefreshTokensUseCase };
