import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';

import { Post as PostEntity } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './posts.dto';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(
    @Body('createPostDto') createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
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
    @Body('updatePostDto') updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @Delete()
  deletePost(@Body('postId') postId: number) {
    return this.postsService.deletePost(postId);
  }
}
