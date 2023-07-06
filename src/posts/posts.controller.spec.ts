import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let postsController: PostsController;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
      ],
    }).compile();

    postsController = module.get<PostsController>(PostsController);
    postsService = module.get<PostsService>(PostsService);
  });

  describe('createPost', () => {
    it('게시물이 작성돼야 함', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet',
      };

      const savedPost: Post = {
        postId: 1,
        ...createPostDto,
      };

      jest.spyOn(postsService, 'createPost').mockResolvedValue(savedPost);

      const result = await postsController.createPost(createPostDto);

      expect(postsService.createPost).toHaveBeenCalledWith(createPostDto);
      expect(result).toEqual(savedPost);
    });
  });

  describe('getPosts', () => {
    it('게시물 목록을 반환해야 함', async () => {
      const posts: Post[] = [
        {
          postId: 1,
          title: 'Lorem Ipsum 1',
          content: 'Lorem ipsum dolor sit amet 1',
        },
        {
          postId: 2,
          title: 'Lorem Ipsum 2',
          content: 'Lorem ipsum dolor sit amet 2',
        },
      ];

      jest.spyOn(postsService, 'getPosts').mockResolvedValue(posts);

      const result = await postsController.getPosts();

      expect(postsService.getPosts).toHaveBeenCalled();
      expect(result).toEqual(posts);
    });
  });

  describe('getPostById', () => {
    it('해당하는 ID의 게시물을 반환해야 함', async () => {
      const postId = 1;
      const post: Post = {
        postId,
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet',
      };

      jest.spyOn(postsService, 'getPostById').mockResolvedValue(post);

      const result = await postsController.getPostById(postId);

      expect(postsService.getPostById).toHaveBeenCalledWith(postId);
      expect(result).toEqual(post);
    });

    it('게시물을 찾을 수 없을 때 예외가 발생해야 함', async () => {
      const postId = 1;

      jest
        .spyOn(postsService, 'getPostById')
        .mockRejectedValue(new NotFoundException('게시물을 찾을 수 없습니다'));

      await expect(postsController.getPostById(postId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updatePost', () => {
    it('게시물이 수정되어야 함', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Phasellus Semper',
        content: 'Phasellus semper felis a augue',
      };
      const existingPost: Post = {
        postId,
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet',
      };
      const updatedPost: Post = {
        ...existingPost,
        ...updatePostDto,
      };

      jest.spyOn(postsService, 'updatePost').mockResolvedValue(updatedPost);

      const result = await postsController.updatePost(postId, updatePostDto);

      expect(postsService.updatePost).toHaveBeenCalledWith(
        postId,
        updatePostDto,
      );
      expect(result).toEqual(updatedPost);
    });

    it('게시물을 찾을 수 없을 때 예외가 발생해야 함', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Phasellus Semper',
        content: 'Phasellus semper felis a augue',
      };

      jest
        .spyOn(postsService, 'updatePost')
        .mockRejectedValue(new NotFoundException('게시물을 찾을 수 없습니다'));

      await expect(
        postsController.updatePost(postId, updatePostDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePost', () => {
    it('게시물이 삭제되어야 함', async () => {
      const postId = 1;

      jest.spyOn(postsService, 'deletePost').mockResolvedValue(undefined);

      await postsController.deletePost(postId);

      expect(postsService.deletePost).toHaveBeenCalledWith(postId);
    });

    it('게시물을 찾을 수 없을 때 예외가 발생해야 함', async () => {
      const postId = 1;

      jest
        .spyOn(postsService, 'deletePost')
        .mockRejectedValue(new NotFoundException('게시물을 찾을 수 없습니다'));

      await expect(postsController.deletePost(postId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
