import { Module } from '@nestjs/common';
import { TOKEN_PROVIDER } from './configs/provider.config';
import { JwtAdapter } from './adapters/jwt.adapter';

@Module({
  providers: [
    {
      provide: TOKEN_PROVIDER,
      useClass: JwtAdapter,
    },
  ],
  exports: [
    {
      provide: TOKEN_PROVIDER,
      useClass: JwtAdapter,
    },
  ],
})
export class CommonModule {}
