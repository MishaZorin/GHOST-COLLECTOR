import { IsNotEmpty, IsString, MaxLength, IsUUID, IsOptional, Validate } from 'class-validator';

export class CreateClueDto {
  @IsUUID()
  @IsOptional()
  id?: string; 

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @IsString() // Заменили @IsUrl() на базовую строку
  @IsNotEmpty()
  // Никаких @MaxLength для URL, так как Base64 строка будет очень длинной!
  url!: string;

  @IsUUID()
  @IsNotEmpty()
  caseId!: string;
}
