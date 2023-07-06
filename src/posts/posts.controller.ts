import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';

import { Post as PostEntity } from './post.entity';
import { CreatePostDto, UpdatePostDto } from './posts.dto';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(
    @Body(new ValidationPipe()) createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  getPosts(): Promise<PostEntity[]> {
    return this.postsService.getPosts();
  }

  @Get(':postId')
  getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    return this.postsService.getPostById(postId);
  }

  @Put(':postId')
  updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body(new ValidationPipe()) updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @Delete(':postId')
  deletePost(@Param('postId', ParseIntPipe) postId: number): Promise<void> {
    return this.postsService.deletePost(postId);
  }
}
