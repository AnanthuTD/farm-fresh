import { Bebas_Neue } from 'next/font/google';

// Define the Bebas Neue font
export const bebasNeue = Bebas_Neue({
  weight: '400', // Only specify the weight you need
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas-neue',
});

// Add more font configurations here as needed
// Example for adding another font:
// export const anotherFont = Inter({
//   subsets: ['latin'],
//   variable: '--font-another',
// });

// Export a type for font variables
export type FontVariables = {
  [key: string]: string;
};

// Export a function to get font variables
export function getFontVariables(): FontVariables {
  return {
    '--font-bebas-neue': bebasNeue.variable,
    // Add more font variables here when you add more fonts
  };
}

// Export a function to get font class names
export function getFontClassNames(): string {
  return [
    bebasNeue.variable,
    // Add more font variables here when you add more fonts
  ].join(' ');
}
