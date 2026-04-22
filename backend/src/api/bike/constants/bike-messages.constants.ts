export const BIKE_MESSAGES = {
  NOT_FOUND: 'Bike not found',
  NO_IMAGES: 'No images uploaded',
  LOCATION_NOT_FOUND: 'Location not found',
  NEW_OWNER_NOT_FOUND: 'New owner not found',
  FORBIDDEN_UPDATE: 'You are not allowed to update this bike',
  FORBIDDEN_DELETE: 'You are not the owner of this bike',
  DUPLICATE_BIKE:
    'You already have a bike with the same brand, model, year and mileage',
  LOCATION_ID_REQUIRED: 'locationId is required',
  INVALID_STATUS: 'Invalid status',
} as const;

export const CLOUDINARY_FOLDERS = {
  BIKES: 'bikes',
} as const;
