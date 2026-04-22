export function getPublicId(imageUrl: string) {
  return imageUrl.split('/').slice(-2).join('/').split('.')[0];
}
