import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { PostsModule } from '../src/posts/posts.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        PostsModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /posts', () => {
    it('게시물이 성공적으로 작성된 경우', async () => {
      const createPostDto = {
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet',
      };

      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(HttpStatus.CREATED);

      const { postId, title, content } = response.body;

      expect(postId).toBe(1);
      expect(title).toBe(createPostDto.title);
      expect(content).toBe(createPostDto.content);
    });

    it('요청 본문이 잘못된 경우', async () => {
      const createPostDto = {};

      await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('GET /posts', () => {
    it('게시물 목록을 성공적으로 불러온 경우', async () => {
      const expectedPost = {
        postId: 1,
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet',
      };

      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(HttpStatus.OK);

      expect(response.body[0]).toEqual(expectedPost);
    });
  });
});
