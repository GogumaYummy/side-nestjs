import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdatePostDto {
  @IsString()
  title?: string;

  @IsString()
  content?: string;
}
