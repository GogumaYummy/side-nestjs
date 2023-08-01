import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('PostsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

      expect(typeof postId).toBe('number');
      expect(Number.isInteger(postId)).toBe(true);
      expect(postId > 0).toBe(true);
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
    beforeAll(async () => {
      const createPostDto = {
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet',
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(HttpStatus.CREATED);
    });

    it('게시물 목록을 성공적으로 불러온 경우', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(HttpStatus.OK);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(({ postId, title, content }) => {
        expect(typeof postId).toBe('number');
        expect(Number.isInteger(postId)).toBe(true);
        expect(postId > 0).toBe(true);
        expect(typeof title).toBe('string');
        expect(typeof content).toBe('string');
      });
    });
  });

  describe('GET /posts/:postId', () => {
    const createPostDto = {
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum dolor sit amet',
    };

    let postId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(HttpStatus.CREATED);

      postId = response.body.postId;
    });

    it('해당하는 게시물을 성공적으로 불러온 경우', async () => {
      const {
        body: { title, content },
      } = await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .expect(HttpStatus.OK);

      expect(title).toBe(createPostDto.title);
      expect(content).toBe(createPostDto.content);
    });

    it('잘못된 경로 매개변수와 함께 요청을 받은 경우', async () => {
      const invalidPostId = 'hello';

      await request(app.getHttpServer())
        .get(`/posts/${invalidPostId}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('해당하는 게시물이 없을 경우', async () => {
      const invalidPostId = 0;

      await request(app.getHttpServer())
        .get(`/posts/${invalidPostId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /posts/:postId', () => {
    const createPostDto = {
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum dolor sit amet',
    };

    let postId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(HttpStatus.CREATED);

      postId = response.body.postId;
    });

    it('해당하는 게시물이 성공적으로 수정된 경우', async () => {
      const updatePostDto = { content: 'Fusce vel dui vitae nisi' };

      const {
        body: { title, content },
      } = await request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .send(updatePostDto)
        .expect(HttpStatus.OK);

      expect(title).toBe(createPostDto.title);
      expect(content).toBe(updatePostDto.content);
    });

    it('잘못된 경로 매개변수와 함께 요청을 받은 경우', async () => {
      const invalidPostId = 'hello';
      const updatePostDto = { content: 'Fusce vel dui vitae nisi' };

      await request(app.getHttpServer())
        .put(`/posts/${invalidPostId}`)
        .send(updatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('해당하는 게시물이 없을 경우', async () => {
      const invalidPostId = 0;
      const updatePostDto = { content: 'Fusce vel dui vitae nisi' };

      await request(app.getHttpServer())
        .put(`/posts/${invalidPostId}`)
        .send(updatePostDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('요청 본문이 잘못된 경우', async () => {
      const updatePostDto = { content: 322 };

      await request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .send(updatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /posts/:postId', () => {
    const createPostDto = {
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum dolor sit amet',
    };

    let postId: number;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(HttpStatus.CREATED);

      postId = response.body.postId;
    });

    it('해당하는 게시물을 성공적으로 삭제한 경우', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${postId}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/posts/${postId}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('잘못된 경로 매개변수와 함께 요청을 받은 경우', async () => {
      const invalidPostId = 'hello';

      await request(app.getHttpServer())
        .delete(`/posts/${invalidPostId}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('해당하는 게시물이 없을 경우', async () => {
      const invalidPostId = 0;

      await request(app.getHttpServer())
        .delete(`/posts/${invalidPostId}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
