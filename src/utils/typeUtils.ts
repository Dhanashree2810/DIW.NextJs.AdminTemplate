// Define the Diff utility type
export type Diff<T, U> = T extends U ? never : T;

// Example utility function for type checking
export function checkFields<T>() {
  // Implementation for type checking
  // This function might be used for runtime checks or validations
}
