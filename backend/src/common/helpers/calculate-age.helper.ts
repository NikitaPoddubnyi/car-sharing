export function CalculateAge(birthDate: Date) {
  const today = new Date();
  const birthDateAsDate = new Date(birthDate);
  let age = today.getFullYear() - birthDateAsDate.getFullYear();
  const m = today.getMonth() - birthDateAsDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDateAsDate.getDate())) {
    age--;
  }
  return age;
}
