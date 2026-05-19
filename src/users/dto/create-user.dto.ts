import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @Length(3, 120)
  @IsString()
  name: string;

  @MaxLength(120)
  @IsEmail()
  email: string;

  @MaxLength(60)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
