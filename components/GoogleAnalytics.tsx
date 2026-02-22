
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

const GoogleAnalytics = ({ trackingId }: { trackingId: string }) => {
  useEffect(() => {
    if (trackingId) {
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      script.async = true;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", trackingId);
    }
  }, [trackingId]);

  return null;
};

export default GoogleAnalytics;