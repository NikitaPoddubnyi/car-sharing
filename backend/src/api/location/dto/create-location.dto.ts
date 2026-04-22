import { Decimal } from '@prisma/client/runtime/library';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  lng?: number;
}

// model Location {
//   id        String      @id @default(cuid())
//   name      String    @unique
//   city      String
//   lat       Float?
//   lng       Float?

//   cars      Car[]     @relation("cars_location")
//   bikes     Bike[]     @relation("bikes_location")

//   pickUpBookings  Booking[] @relation("PickUpLocation")
//   dropOffBookings Booking[] @relation("DropOffLocation")

//   @@map("locations")
// }
