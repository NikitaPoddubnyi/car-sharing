export const VEHICLE_INCLUDE = {
  car: {
    include: {
      location: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
  },
  bike: {
    include: {
      location: true,
      images: { where: { isPrimary: true }, take: 1 },
    },
  },
  pickUpLocation: true,
  dropOffLocation: true,
} as const;
