"use client";

import Navigation from "~/components/home-comonents/layout/Navigation";
import SmoothScroll from "~/components/home-comonents/layout/SmoothScroll";
import AIAssistantWidget from "~/components/home-comonents/AIAssistantWidget";
import PrimaryHome from "~/components/pages/Home";

export default function Page() {
  return (
    <SmoothScroll>
      <Navigation />
      <PrimaryHome />
      <AIAssistantWidget />
    </SmoothScroll>
  );
}
