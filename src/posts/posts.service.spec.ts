import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './posts.dto';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let postsService: PostsService;
  let postsRepository: Repository<Post>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get(PostsService);
    postsRepository = module.get(getRepositoryToken(Post));
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

      jest.spyOn(postsRepository, 'save').mockResolvedValue(savedPost);

      const result = await postsService.createPost(createPostDto);

      expect(postsRepository.save).toHaveBeenCalledWith(expect.any(Post));
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

      jest.spyOn(postsRepository, 'find').mockResolvedValue(posts);

      const result = await postsService.getPosts();

      expect(postsRepository.find).toHaveBeenCalled();
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

      jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue(post);

      const result = await postsService.getPostById(postId);

      expect(postsRepository.findOneBy).toHaveBeenCalledWith({ postId });
      expect(result).toEqual(post);
    });

    it('게시물을 찾을 수 없을 때 예외가 발생해야 함', async () => {
      const postId = 1;

      jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue(undefined);

      await expect(postsService.getPostById(postId)).rejects.toThrow(
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

      jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue(existingPost);
      jest.spyOn(postsRepository, 'save').mockResolvedValue(updatedPost);

      const result = await postsService.updatePost(postId, updatePostDto);

      expect(postsRepository.findOneBy).toHaveBeenCalledWith({ postId });
      expect(postsRepository.save).toHaveBeenCalledWith(updatedPost);
      expect(result).toEqual(updatedPost);
    });

    it('게시물을 찾을 수 없을 때 예외가 발생해야 함', async () => {
      const postId = 1;
      const updatePostDto: UpdatePostDto = {
        title: 'Phasellus Semper',
        content: 'Phasellus semper felis a augue',
      };

      jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue(undefined);

      await expect(
        postsService.updatePost(postId, updatePostDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePost', () => {
    it('게시물이 삭제되어야 함', async () => {
      const postId = 1;
      const existingPost: Post = {
        postId,
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet',
      };

      jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue(existingPost);
      jest.spyOn(postsRepository, 'delete').mockResolvedValue(undefined);

      await postsService.deletePost(postId);

      expect(postsRepository.findOneBy).toHaveBeenCalledWith({ postId });
      expect(postsRepository.delete).toHaveBeenCalledWith(existingPost);
    });

    it('게시물을 찾을 수 없을 때 예외가 발생해야 함', async () => {
      const postId = 1;

      jest.spyOn(postsRepository, 'findOneBy').mockResolvedValue(undefined);

      await expect(postsService.deletePost(postId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
