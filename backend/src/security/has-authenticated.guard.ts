import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ParamsPayload,
  TokeInterface,
} from '../common/adapters/token.interface';
import { TOKEN_PROVIDER } from '../common/configs/provider.config';
import { RequestWithUserId } from '../common/types/request-with-user-id';

@Injectable()
export class HasAuthenticatedGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_PROVIDER)
    private readonly tokenAdapter: TokeInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: RequestWithUserId = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    let payloadDecoded = await this.tokenAdapter.isValid(token);
    if (!payloadDecoded) {
      return false;
    } else {
      payloadDecoded = payloadDecoded as ParamsPayload;
      request.userId = payloadDecoded.id;
      return true;
    }
  }

  private extractTokenFromHeader(
    request: RequestWithUserId,
  ): string | undefined {
    // @ts-ignore
    const accessToken: string | undefined = request.headers.authorization;
    if (!accessToken) {
      return null;
    }
    return accessToken.replace('Bearer ', '');
  }
}
