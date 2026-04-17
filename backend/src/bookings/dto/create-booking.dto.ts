import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  IsIn,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}:\d{2}$/, { message: 'time must be in HH:MM format' })
  time: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  addOns?: string[];

  @IsString()
  @IsNotEmpty()
  customerName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/, { message: 'customerPhone must be a valid 10-digit Indian mobile number' })
  customerPhone: string;

  @IsString()
  @IsNotEmpty()
  carMake: string;

  @IsString()
  @IsNotEmpty()
  carModel: string;

  @IsInt()
  @Min(1980)
  @Max(2030)
  @Type(() => Number)
  carYear: number;

  @IsString()
  @IsNotEmpty()
  carColour: string;

  @IsString()
  @IsNotEmpty()
  registrationNumber: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['petrol', 'diesel', 'electric', 'hybrid', 'cng'], {
    message: 'fuelType must be one of: petrol, diesel, electric, hybrid, cng',
  })
  fuelType: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['studio', 'pickup'], { message: 'deliveryType must be either studio or pickup' })
  deliveryType: string;

  @IsString()
  @IsOptional()
  pickupAddress?: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  totalAmountPaise: number;
}
