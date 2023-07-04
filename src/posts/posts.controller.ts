import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

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

  @Get(':postId')
  getPostById(@Param('postId') postId: number): Promise<PostEntity> {
    return this.postsService.getPostById(postId);
  }

  @Put(':postId')
  updatePost(
    @Param('postId') postId: number,
    @Body('updatePostDto') updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @Delete(':postId')
  deletePost(@Param('postId') postId: number) {
    return this.postsService.deletePost(postId);
  }
}
