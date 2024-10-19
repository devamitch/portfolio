// components/GoogleAnalytics.tsx
import { useEffect } from "react";

const GoogleAnalytics = ({ trackingId }: { trackingId: string }) => {
  useEffect(() => {
    if (trackingId) {
      // Load Google Analytics script
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      script.async = true;
      document.head.appendChild(script);

      try {
        if (window?.dataLayer) {
          // Initialize Google Analytics
          window.dataLayer = window?.dataLayer || [];
          function gtag(...args: any[]) {
            window?.dataLayer?.push(args);
          }
          gtag("js", new Date());
          gtag("config", trackingId);
        }
      } catch (error) {
        console.log({ error });
      }
    }
  }, [trackingId]);

  return null;
};

export default GoogleAnalytics;
