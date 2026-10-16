import React from 'react';
import { ContactSettings, SiteContent } from '../../data/types.ts';

interface JsonLdProps {
  contacts: ContactSettings;
  content: SiteContent;
}

export const JsonLd: React.FC<JsonLdProps> = ({ contacts, content }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Photographer', 'LocalBusiness'],
    name: 'Robson Brito Fotografia',
    alternateName: 'Robson Brito',
    description: content.metaDescription,
    url: window.location.origin,
    telephone: contacts.phone || contacts.whatsapp,
    email: contacts.email,
    image: content.aboutPhotoUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.address || 'Jardins',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.5615,
      longitude: -46.6668,
    },
    sameAs: [
      contacts.instagram ? `https://instagram.com/${contacts.instagram}` : '',
      contacts.tiktok ? `https://tiktok.com/@${contacts.tiktok}` : '',
      contacts.pinterest ? `https://pinterest.com/${contacts.pinterest}` : '',
      contacts.youtube ? `https://youtube.com/${contacts.youtube}` : '',
    ].filter(Boolean),
    openingHours: 'Mo,Tu,We,Th,Fr,Sa 09:00-19:00',
    priceRange: '$$$',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
