
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.54f03e1f41b04d49bb18857cbae99aca',
  appName: 'coin-ai-market',
  webDir: 'dist',
  server: {
    url: 'https://54f03e1f-41b0-4d49-bb18-857cbae99aca.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      cameraPermissionText: "This app needs camera access to take pictures of your coins for analysis",
      photosPermissionText: "This app needs photo library access to upload coin images for analysis"
    }
  }
};

export default config;
