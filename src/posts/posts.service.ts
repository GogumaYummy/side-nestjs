import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const post = new Post();

    post.title = createPostDto.title;
    post.content = createPostDto.content;

    return await this.postsRepository.save(post);
  }

  async getPosts(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async getPostById(postId: number): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ postId });

    if (!post) throw new NotFoundException('게시물을 찾을 수 없습니다');

    return post;
  }

  async updatePost(
    postId: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ postId });

    if (!post) throw new NotFoundException('게시물을 찾을 수 없습니다');

    if (updatePostDto.title) {
      post.title = updatePostDto.title;
    }
    if (updatePostDto.content) {
      post.content = updatePostDto.content;
    }

    return await this.postsRepository.save(post);
  }

  async deletePost(postId: number): Promise<void> {
    const post = await this.postsRepository.findOneBy({ postId });

    if (!post) throw new NotFoundException('게시물을 찾을 수 없습니다');

    await this.postsRepository.delete(post);
  }
}
