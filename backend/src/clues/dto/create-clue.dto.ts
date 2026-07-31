import { IsNotEmpty, IsString, MaxLength, IsUrl, IsUUID, IsOptional } from 'class-validator';

export class CreateClueDto {
  @IsUUID()
  @IsOptional()
  id?: string; // Опциональный ID для обновления/удаления

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @IsUUID()
  @IsNotEmpty()
  caseId!: string;
}