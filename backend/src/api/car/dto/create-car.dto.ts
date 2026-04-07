import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, IsOptional, IsUUID } from "class-validator";
import { BodyType, FuelType, Transmission, DriveTrain } from "@prisma/client";
import { Transform, Type } from "class-transformer";

export class CreateCarDto {
    @IsString() @IsNotEmpty()
    brand: string;

    @IsString() @IsNotEmpty()
    model: string;

    @Type(() => Number)
    @IsNumber() @IsNotEmpty()
    year: number;

    @IsEnum(BodyType) @IsNotEmpty()
    bodyType: BodyType;

    @Type(() => Number)
    @IsNumber() @IsNotEmpty()
    seats: number;

    @Type(() => Number)
    @IsNumber() @IsNotEmpty()
    doors: number;

    @Type(() => Number)
    @IsNumber() @IsNotEmpty()
    luggage: number;

    @IsEnum(Transmission) @IsNotEmpty()
    transmission: Transmission;

    @IsEnum(DriveTrain) @IsNotEmpty()
    driveTrain: DriveTrain;

    @IsEnum(FuelType) @IsNotEmpty()
    fuelType: FuelType;

    @Type(() => Number)
    @IsNumber() @IsNotEmpty()
    engineSize: number;

    @Type(() => Number)
    @IsNumber() @IsNotEmpty()
    mileage: number;

    @Type(() => Number)
    @IsNotEmpty() 
    pricePerDay: number;

    @Type(() => Number)
    @IsNotEmpty()
    pricePerHour: number;

    @IsString() @IsNotEmpty()
    locationId: string; 

    @IsString() @IsOptional()
    @MinLength(10, { message: 'Description should be at least 10 characters' })
	@MaxLength(1000, { message: 'Description should not exceed 1000 characters' })
    description?: string;

    @IsBoolean() @IsOptional()
    @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
    })
    isAvailable?: boolean;
}

//   id        String      @id @default(cuid())
//   brand         String   
//   model         String   
//   year          Int     
  
//   bodyType      BodyType @default(SEDAN)
//   seats         Int      // 2
//   doors         Int      // 2
//   luggage       Int      // Объем багажника (150)
//   transmission  Transmission  @default(AUTOMATIC) 
//   driveTrain    DriveTrain    @default(FWD)
//   mileage       Int      // Пробег
//   fuelType      FuelType      @default(PETROL)
//   engineSize    Int      

//   pricePerDay   Decimal  @db.Decimal(10, 2) 
//   pricePerHour  Decimal  @db.Decimal(10, 2)

//   location      Location @relation("cars_location", fields: [locationId], references: [id], onDelete: Restrict)
//   locationId    String      @map("location_id")

//   isAvailable   Boolean  @default(true)      
  
//   description   String?  @db.Text           

//   images        CarImage[]                  
//   bookings      Booking[]  @relation("booking_car")                 

//   createdAt     DateTime @default(now()) @map("created_at")
//   updatedAt     DateTime @updatedAt @map("updated_at")

// model CarImage {
//   id        String      @id @default(cuid())
//   url       String
//   car       Car    @relation(fields: [carId], references: [id], onDelete: Cascade)
//   carId     String    @map("car_id")
//   isPrimary Boolean @default(false)

//   @@map("car_images")
// }

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