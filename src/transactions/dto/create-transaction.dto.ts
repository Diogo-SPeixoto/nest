import { IsInt, IsString, Length } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  value: number;

  @IsString()
  @Length(36)
  payerId: string;

  @IsString()
  @Length(36)
  receiverId: string;
}
