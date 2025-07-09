import * as countriesAndTimezones from "countries-and-timezones";
import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";

// Initialize the PhoneNumberUtil instance
const phoneUtil = PhoneNumberUtil.getInstance();

/**
 * Checks if a phone number is valid.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number is valid, false otherwise.
 */
export const isPhoneValid = (phone: string) => {
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone);
    return phoneUtil.isValidNumber(number);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return false;
  }
};

/**
 * Extracts details from a phone number.
 * @param {string} phoneNumber - The phone number to extract details from.
 * @param {string} defaultRegion - The default region code (e.g., "US").
 * @returns {object|null} - Returns an object with countryCode, nationalNumber, and formattedNumber or null if invalid.
 */
export function extractPhoneNumberDetails(
  phoneNumber: string,
  defaultRegion: string
) {
  try {
    // Parse the phone number with a default region
    const number = phoneUtil.parse(phoneNumber, defaultRegion);

    // Check if the number is valid
    if (phoneUtil.isValidNumber(number)) {
      // Get the country code
      const countryCode = number.getCountryCode();

      // Get the national number
      const nationalNumber = number.getNationalNumber();

      // Format the number as an international number
      const formattedNumber = phoneUtil.format(
        number,
        PhoneNumberFormat.INTERNATIONAL
      );

      return {
        countryCode,
        nationalNumber,
        formattedNumber,
      };
    } else {
      throw new Error("Invalid phone number");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}

/**
 * Gets the default region based on the user's timezone.
 * @returns {string} - Returns the default region code in lowercase (e.g., "us").
 */
export const getDefaultRegion = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneInfo = countriesAndTimezones.getTimezone(timezone);
  return timezoneInfo?.countries?.[0]?.toLocaleLowerCase() ?? "us";
};

/**
 * Gets the default country code based on the user's timezone.
 * @returns {string} - Returns the default country code in lowercase (e.g., "us").
 */
export const getDefaultCountryCode = () => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const timezoneInfo = countriesAndTimezones.getTimezone(timezone);
  return timezoneInfo?.countries?.[0]?.toLocaleLowerCase();
};
