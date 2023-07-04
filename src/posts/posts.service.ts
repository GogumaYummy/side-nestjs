import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async createPost(title: string, content: string): Promise<Post> {
    const post = new Post();

    post.title = title;
    post.content = content;

    return await this.postsRepository.save(post);
  }

  async getPosts(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async getPostById(postId: number): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ postId });

    if (!post) throw new Error('게시글을 찾을 수 없습니다');

    return post;
  }

  async updatePost(
    postId: number,
    title: string,
    content: string,
  ): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ postId });

    if (!post) throw new Error('게시글을 찾을 수 없습니다');

    post.title = title;
    post.content = content;

    return await this.postsRepository.save(post);
  }

  async deletePost(postId): Promise<void> {
    const post = await this.postsRepository.findOneBy({ postId });

    if (!post) throw new Error('게시글을 찾을 수 없습니다');

    await this.postsRepository.delete(post);
  }
}
