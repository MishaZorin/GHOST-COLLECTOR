import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
export class CreateCaseDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    title!: string;
}
