/** West End service tree — only treatments listed on westenddentalcentre.com. */
export type ServiceLink = { label: string; href: string };

export type ServiceCategory = {
  title: string;
  href: string;
  blurb: string;
  items: ServiceLink[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    title: 'Emergency Services',
    href: '/services/emergency/',
    blurb: 'Prompt care when a toothache, broken tooth, or other urgent problem cannot wait.',
    items: [],
  },
  {
    title: 'Preventive Dentistry',
    href: '/services/preventive/',
    blurb: 'Hygiene visits and everyday care that help keep small issues from becoming bigger ones.',
    items: [
      { label: 'Dental Hygiene', href: '/services/preventive/cleanings-exams/' },
      { label: 'Fluoride Treatments', href: '/services/preventive/fluoride/' },
      { label: 'Dental Sealants', href: '/services/preventive/sealants/' },
      { label: 'Mouth Guards and Night Guards', href: '/services/preventive/guards/' },
    ],
  },
  {
    title: 'Diagnostic Services',
    href: '/services/diagnostic/',
    blurb: 'Digital imaging that helps us see what is happening below the surface.',
    items: [
      { label: 'Diagnostic Imaging and X-rays', href: '/services/diagnostic/x-rays/' },
    ],
  },
  {
    title: 'Restorative',
    href: '/services/restorative/',
    blurb: 'Repair teeth so they look and work the way they should.',
    items: [
      { label: 'Composite Fillings', href: '/services/restorative/fillings/' },
      { label: 'Dental Crowns', href: '/services/restorative/crowns/' },
      { label: 'Dental Bridges', href: '/services/restorative/bridges/' },
    ],
  },
  {
    title: 'Prosthodontic Care',
    href: '/services/prosthodontics/',
    blurb: 'Replace missing teeth with dentures or porcelain bridges.',
    items: [
      { label: 'Dentures', href: '/services/prosthodontics/dentures/' },
      { label: 'Porcelain Bridges', href: '/services/prosthodontics/porcelain-bridges/' },
    ],
  },
  {
    title: 'Oral Surgery',
    href: '/services/oral-surgery/',
    blurb: 'Extractions and wisdom tooth removal when a tooth cannot be saved.',
    items: [
      { label: 'Extractions and Wisdom Teeth', href: '/services/oral-surgery/extractions/' },
    ],
  },
  {
    title: 'Periodontal (Gum) Care',
    href: '/services/periodontal/',
    blurb: 'Treatment for gum disease so supporting tissues stay healthy.',
    items: [
      { label: 'Gum Disease', href: '/services/periodontal/gum-disease/' },
      { label: 'Periodontal Therapy', href: '/services/periodontal/periodontal-therapy/' },
    ],
  },
  {
    title: 'Endodontic Services',
    href: '/services/endodontics/',
    blurb: 'Root canal therapy to treat infection inside a tooth.',
    items: [
      { label: 'Root Canal Therapy', href: '/services/endodontics/root-canal/' },
    ],
  },
  {
    title: 'Cosmetic Dentistry',
    href: '/services/cosmetic/',
    blurb: 'Whitening, veneers, and bonding to refine how your smile looks.',
    items: [
      { label: 'Teeth Whitening', href: '/services/cosmetic/whitening/' },
      { label: 'Veneers', href: '/services/cosmetic/veneers/' },
      { label: 'Dental Bonding', href: '/services/cosmetic/bonding/' },
    ],
  },
  {
    title: 'Orthodontics',
    href: '/services/orthodontics/',
    blurb: 'Invisalign® clear aligners for a more discreet way to straighten teeth.',
    items: [
      { label: 'Invisalign® Clear Aligners', href: '/services/orthodontics/invisalign/' },
    ],
  },
];

/** Mega-menu columns: 4 stacks, West End categories only. */
export const megaMenuColumns: ServiceCategory[][] = [
  [serviceCategories[0], serviceCategories[1], serviceCategories[2]],
  [serviceCategories[3], serviceCategories[4], serviceCategories[5]],
  [serviceCategories[6], serviceCategories[7]],
  [serviceCategories[8], serviceCategories[9]],
];

export const footerServices: ServiceLink[] = [
  { label: 'Emergency Services', href: '/services/emergency/' },
  { label: 'Preventive Dentistry', href: '/services/preventive/' },
  { label: 'Restorative Dentistry', href: '/services/restorative/' },
  { label: 'Cosmetic Dentistry', href: '/services/cosmetic/' },
  { label: 'Invisalign®', href: '/services/orthodontics/invisalign/' },
  { label: 'Oral Surgery', href: '/services/oral-surgery/' },
];
