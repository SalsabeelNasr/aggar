declare module 'libphonenumber-js' {
  export type CountryCode = string;

  export interface PhoneNumber {
    country?: CountryCode;
    isValid: () => boolean;
    formatNational: () => string;
    format: (format: string) => string;
  }

  export function parsePhoneNumberFromString(
    text: string,
    defaultCountry?: CountryCode
  ): PhoneNumber | undefined;
}
