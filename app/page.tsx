"use client";

import AuraChatWidget from "~/components/SiriOrb/AuraChatWidget";
import Navigation from "~/components/home-comonents/layout/Navigation";
import SmoothScroll from "~/components/home-comonents/layout/SmoothScroll";
import PrimaryHome from "~/components/pages/Home";

export default function Page() {
  return (
    <SmoothScroll>
      <Navigation />
      <PrimaryHome />
      <AuraChatWidget />
    </SmoothScroll>
  );
}
