import { PROFILE_DATA } from "~/data/portfolio.data";

const Seo = () => {
  return (
    <div aria-hidden style={{ display: "none" }}>
      <span itemScope itemType="https://schema.org/Person">
        <span itemProp="name">Amit Chakraborty</span>
        <span itemProp="jobTitle">Principal Mobile Architect</span>
        <span itemProp="url">https://devamit.co.in</span>
        <span itemProp="email">{PROFILE_DATA.email}</span>
        <span itemProp="addressLocality">Kolkata</span>
        <span itemProp="addressCountry">India</span>
      </span>
    </div>
  );
};

export default Seo;
