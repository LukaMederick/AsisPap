import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      ok: true,
      message: 'Backend Nest conectado. Usa /api/* para CRUD.',
    };
  }
}
