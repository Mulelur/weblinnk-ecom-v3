/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInDays, isBefore, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string): string {
  const baseUrl =
    import.meta.env.NEXT_PUBLIC_SITE_URL || // use for frontend/client
    import.meta.env.VITE_PUBLIC_SITE_URL || // use for backend
    "http://localhost:3000"; // fallback default

  // Ensure no duplicate slashes
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export function createOrderDate() {
  const date = new Date();
  return date.toISOString();
}
export const moneyFormatter = Intl.NumberFormat("en-ES", {
  currency: "ZAR",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
  minimumIntegerDigits: 1,
  // minimumSignificantDigits: 1,
  // maximumSignificantDigits: 10,
});

export const postData = async (data: any) => {
  try {
    const response = await fetch("https://api.shiplogic.com/v2/rates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 8f06803d71bc4d9e921ac7cd589139da", // Replace with your actual API token
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getDeliveryDateDuration = (
  deliveryDateFrom: string,
  deliveryDateTo: string,
  collectionCutOffTime: string
) => {
  const fromDate = parseISO(deliveryDateFrom);
  const toDate = parseISO(deliveryDateTo);
  const cutOffTime = parseISO(collectionCutOffTime);

  // Calculate the difference in days
  const differenceDays = differenceInDays(toDate, fromDate);

  // Assuming the minimum delivery time is 2 days
  const minDays = 2;
  const maxDays = differenceDays + minDays;

  // Check if minDays is equal to maxDays and the time is before collection cut off time
  if (minDays === maxDays) {
    if (isBefore(new Date(), cutOffTime)) {
      return "Delivery: Today";
    } else {
      return "Delivery: Tomorrow";
    }
  }

  return `Delivery: ${minDays}-${maxDays} Days`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertToSnakeCase(input: any) {
  return input.toLowerCase().replace(/\s+/g, "_");
}

export function limitText(text: string, maxLength: number = 20) {
  if (text.length <= maxLength) {
    return text;
  } else {
    return text.slice(0, maxLength - 3) + "...";
  }
}
