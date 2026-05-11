import { IsEmail, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly address?: string;

  @IsString()
  readonly phoneNumber?: string;

  @IsEmail()
  readonly email?: string;

  @IsString()
  readonly tin?: string;
}
