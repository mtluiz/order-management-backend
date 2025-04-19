import * as env from 'env-var';

export class JwtConfig {
  static get SECRET(): string {
    return env.get('JWT_SECRET').default('supersecretkey').asString();
  }

  static get EXPIRES_IN(): string {
    return env.get('JWT_EXPIRES_IN').default('1d').asString();
  }
} 