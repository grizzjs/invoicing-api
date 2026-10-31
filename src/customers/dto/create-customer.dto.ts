import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ description: 'Name of the customer' })
  @IsString()
  readonly name: string;

  @ApiProperty({ required: false, description: 'Address of the customer' })
  @IsString()
  readonly address?: string;

  @ApiProperty({ required: false, description: 'Phone number of the customer' })
  @IsString()
  readonly phoneNumber?: string;

  @ApiProperty({ required: false, description: 'Email of the customer' })
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    required: false,
    description: 'Taxpayer Identification Number of the customer',
  })
  @IsString()
  readonly tin?: string;
}
