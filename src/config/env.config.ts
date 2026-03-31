/**
 * Type-safe environment configuration service.
 * Ensures all required environment variables are present and correctly typed.
 */

interface EnvConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  cloudinaryCloudName: string;
  cloudinaryFolder: string;
  geminiApiKey: string;
  isDev: boolean;
}

const getEnvVar = (key: string, required = true): string => {
  const value = import.meta.env[key];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
};

export const envConfig: EnvConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', false),
  cloudinaryCloudName: getEnvVar('VITE_CLOUDINARY_CLOUD_NAME'),
  cloudinaryFolder: getEnvVar('VITE_CLOUDINARY_FOLDER', false) || 'sam_b_tech_uploads',
  geminiApiKey: getEnvVar('VITE_GEMINI_API_KEY'),
  isDev: import.meta.env.DEV,
};

export default envConfig;
