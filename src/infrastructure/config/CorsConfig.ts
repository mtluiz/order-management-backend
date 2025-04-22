import * as env from 'env-var';

export class CorsConfig {
  static get ORIGIN(): string | boolean {
    return env.get('CORS_ORIGIN').default('*').asString();
  }

  static get METHODS(): string {
    return env.get('CORS_METHODS').default('GET,HEAD,PUT,PATCH,POST,DELETE').asString();
  }

  static get CREDENTIALS(): boolean {
    return env.get('CORS_CREDENTIALS').default('true').asBool();
  }
} 