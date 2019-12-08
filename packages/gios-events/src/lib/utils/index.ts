export function getTime(): string {
  return new Date().toISOString()
  .replace(/([0-9]){4}(-[0-9]{2}){2}/, '')
  .replace(/T/, '')
  .replace(/\..+/, '');
}
