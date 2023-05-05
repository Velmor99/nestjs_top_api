import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Types, disconnect } from 'mongoose';
import {
  NOT_FOUND_USER_ERROR,
  INCORRECT_PASSWORD_ERROR,
} from '../src/auth/auth.constants';
import { AuthDto } from '../src/auth/dto/auth.dto.ts';

const testDto: AuthDto = {
  email: 'wince@gmail.com',
  password: '12345',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) - fail mail', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'abracadabra', password: '12345' })
      .expect(401, {
        statusCode: 401,
        message: NOT_FOUND_USER_ERROR,
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - fail password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'wince@gmail.com', password: '43215' })
      .expect(401, {
        statusCode: 401,
        message: INCORRECT_PASSWORD_ERROR,
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - success', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(testDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        token = body.access_token;
        expect(token).toBeDefined();
      });
  });

  afterAll(() => {
    disconnect();
  });
});
