import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-for-infracare';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { AppModule } = require('./app.module');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');

describe('InfraCare API', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('serves healthcheck', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('InfraCare API');
  });

  it('authenticates demo admin and returns token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@infracare.local', password: 'Admin@123' })
      .expect(201);

    expect(response.body.accessToken).toBeDefined();
    expect(response.body.user.email).toBe('admin@infracare.local');
  });

  it('rejects invalid credentials', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@infracare.local', password: 'wrong-password' })
      .expect(401);
  });
});
