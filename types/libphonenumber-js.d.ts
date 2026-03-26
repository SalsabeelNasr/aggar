declare module 'libphonenumber-js' {
  export type CountryCode = string;
  export function parsePhoneNumberFromString(
    text: string,
    defaultCountry?: CountryCode
  ): { isValid: () => boolean } | undefined;
}
