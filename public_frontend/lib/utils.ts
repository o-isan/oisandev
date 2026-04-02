import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrlOfEnvironment(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) {
    return null;
  }

  const debugUrl = process.env.NEXT_PUBLIC_MINIO_URL_DEBUG;
  const prodUrl = process.env.NEXT_PUBLIC_MINIO_URL_PRODUCTION;

  if (process.env.NODE_ENV === "development" && debugUrl) {
    return imageUrl.replace("http://minio:9000", debugUrl);
  }

  if (process.env.NODE_ENV === "production" && prodUrl) {
    return imageUrl.replace("http://minio:9000", prodUrl);
  }

  return imageUrl;
}