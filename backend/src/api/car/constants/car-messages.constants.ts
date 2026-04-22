export const CAR_MESSAGES = {
  NOT_FOUND: 'Car not found',
  NO_IMAGES: 'No images uploaded',
  LOCATION_NOT_FOUND: 'Location not found',
  NEW_OWNER_NOT_FOUND: 'New owner not found',
  FORBIDDEN_UPDATE: 'You are not allowed to update this car',
  FORBIDDEN_DELETE: 'You are not the owner of this car',
  DUPLICATE_CAR:
    'You already have a car with the same brand, model, year and mileage',
  LOCATION_ID_REQUIRED: 'locationId is required',
  INVALID_STATUS: 'Invalid status',
} as const;

export const CLOUDINARY_FOLDERS = {
  CARS: 'cars',
} as const;
