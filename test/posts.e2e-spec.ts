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

  describe('GET /posts/:postId', () => {
    it('해당하는 게시물을 성공적으로 불러온 경우', async () => {
      const postIdToFind = 1;
      const expectedPost = {
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet',
      };

      const response = await request(app.getHttpServer())
        .get(`/posts/${postIdToFind}`)
        .expect(HttpStatus.OK);

      const { postId, title, content } = response.body;

      expect(postId).toBe(postIdToFind);
      expect(title).toBe(expectedPost.title);
      expect(content).toBe(expectedPost.content);
    });

    it('잘못된 경로 매개변수와 함께 요청을 받은 경우', async () => {
      const postIdToFind = 'hello';

      await request(app.getHttpServer())
        .get(`/posts/${postIdToFind}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('해당하는 게시물이 없을 경우', async () => {
      const postIdToFind = 2;

      await request(app.getHttpServer())
        .get(`/posts/${postIdToFind}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  describe('PUT /posts/:postId', () => {
    it('해당하는 게시물이 성공적으로 수정된 경우', async () => {
      const postIdToUpdate = 1;
      const updatePostDto = { content: 'Fusce vel dui vitae nisi' };

      const response = await request(app.getHttpServer())
        .put(`/posts/${postIdToUpdate}`)
        .send(updatePostDto)
        .expect(HttpStatus.OK);

      const { postId, content } = response.body;

      expect(postId).toBe(postIdToUpdate);
      expect(content).toBe('Fusce vel dui vitae nisi');
    });

    it('잘못된 경로 매개변수와 함께 요청을 받은 경우', async () => {
      const postIdToUpdate = 'hello';
      const updatePostDto = { content: 'Fusce vel dui vitae nisi' };

      await request(app.getHttpServer())
        .put(`/posts/${postIdToUpdate}`)
        .send(updatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('해당하는 게시물이 없을 경우', async () => {
      const postIdToUpdate = 2;
      const updatePostDto = { content: 'Fusce vel dui vitae nisi' };

      await request(app.getHttpServer())
        .put(`/posts/${postIdToUpdate}`)
        .send(updatePostDto)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('요청 본문이 잘못된 경우', async () => {
      const postIdToUpdate = 1;
      const updatePostDto = { title: 322 };

      await request(app.getHttpServer())
        .put(`/posts/${postIdToUpdate}`)
        .send(updatePostDto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('DELETE /posts/:postId', () => {
    it('해당하는 게시물을 성공적으로 삭제한 경우', async () => {
      const postIdToDelete = 1;

      await request(app.getHttpServer())
        .delete(`/posts/${postIdToDelete}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/posts/${postIdToDelete}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('잘못된 경로 매개변수와 함께 요청을 받은 경우', async () => {
      const postIdToDelete = 'hello';

      await request(app.getHttpServer())
        .delete(`/posts/${postIdToDelete}`)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('해당하는 게시물이 없을 경우', async () => {
      const postIdToDelete = 2;

      await request(app.getHttpServer())
        .delete(`/posts/${postIdToDelete}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });
});
