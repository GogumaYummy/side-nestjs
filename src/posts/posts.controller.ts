import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';

import { Post as PostEntity } from './post.entity';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(
    @Body('title') title: string,
    @Body('content') content: string,
  ): Promise<PostEntity> {
    return this.postsService.createPost(title, content);
  }

  @Get()
  getPosts(): Promise<PostEntity[]> {
    return this.postsService.getPosts();
  }

  @Get()
  getPostById(@Body('postId') postId: number): Promise<PostEntity> {
    return this.postsService.getPostById(postId);
  }

  @Put()
  updatePost(
    @Body('postId') postId: number,
    @Body('title') title: string,
    @Body('content') content: string,
  ) {
    return this.postsService.updatePost(postId, title, content);
  }

  @Delete()
  deletePost(@Body('postId') postId: number) {
    return this.postsService.deletePost(postId);
  }
}
