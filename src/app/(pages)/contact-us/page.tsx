import type { Metadata } from "next";

import ContactUs from "@/components/blocks/contact-us/contact-us";

import { SITE_LANGUAGE_TAG, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `Contact - ${SITE_NAME}`,
  description:
    "Contact AI Usage Global for inquiries, corrections, partnerships, or story suggestions about AI water usage, energy consumption, and infrastructure reporting.",
  keywords: [
    "contact AI Usage Global",
    "AI resource usage reporting",
    "AI infrastructure inquiries",
    "data center research contact",
  ],
  alternates: {
    canonical: "/contact-us",
  },
  openGraph: {
    title: `Contact - ${SITE_NAME}`,
    description:
      "Contact AI Usage Global for questions, corrections, partnerships, and support related to AI water, power, and compute cost reporting.",
    type: "website",
    url: `${SITE_URL}/contact-us`,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}#contact`,
      name: `Contact - ${SITE_NAME}`,
      description:
        "Contact AI Usage Global for inquiries, partnerships, feedback, or reporting inaccurate content about AI resource usage.",
      url: `${SITE_URL}/contact-us`,
      inLanguage: SITE_LANGUAGE_TAG,
    },
  ],
};

const ContactPage = () => {
  return (
    <div>
      <ContactUs />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
};

export default ContactPage;