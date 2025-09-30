import type { ExpoConfig } from '@expo/config';
import { config as loadEnv } from 'dotenv';
import path from 'path';

// Load env from .env.local first (gitignored), then .env
loadEnv({ path: path.resolve(__dirname, '.env.local') });
loadEnv({ path: path.resolve(__dirname, '.env') });

const config: ExpoConfig = {
  name: 'artifact',
  slug: 'artifact',
  scheme: 'artifact',
  extra: {
    // Access via Constants.expoConfig?.extra if needed
  },
};

export default config;


