export function randomOTP(params?: { length: number }) {
  // Return fixed OTP in development environment
  if (process.env.NODE_ENV === "development" || Bun.env.NODE_ENV === "development") {
    return "123456";
  }
  
  const length = params?.length || 6;
  const max = Math.pow(10, length) - 1;
  const randomNum = Math.floor(Math.random() * (max + 1));
  return randomNum.toString().padStart(length, "0");
}

export function formatImages(images: File | File[] | undefined) : File[] {
  if(!images) {
    return [];
  }
  if(Array.isArray(images)) {
    return images;
  }
  return [images];
}
