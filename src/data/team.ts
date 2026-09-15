export type Doctor = {
  name: string;
  credentials: string;
  education: string;
  bio: string[];
  photo: string;
  initials: string;
  note?: string;
};

export const doctors: Doctor[] = [
  {
    name: 'Dr. Melissa Wong',
    credentials: 'General Dentist',
    education: 'DDS, University of Alberta, 2004',
    bio: [
      'Born and raised in Edmonton, Dr. Wong became interested in the dental field during her elementary years. After earning a Bachelor of Science in Biological Sciences with a minor in Psychology with distinction from the University of Alberta in 2000, she went on to graduate with a Doctor of Dental Surgery degree from the University of Alberta in 2004. Dr. Wong has been an associate dentist at West End Dental Centre since her graduating year and is committed to gentle and patient-centred dental care.',
      'Dr. Wong has had the privilege of taking part in the Belize Mission Project — a Christ-centred ministry focused on providing dental services to those in rural Belize.',
      'In her free time, she enjoys hiking, skiing, travelling and spending time with her husband, daughter and son.',
    ],
    photo: '/images/team/dr-melissa-wong.png',
    initials: 'MW',
  },
  {
    name: 'Dr. Denis Redmond',
    credentials: 'General Dentist',
    education: 'BSc and DDS, University of Alberta',
    bio: [
      "Born in Charlottetown, PEI, Dr. Redmond's home has been in Edmonton since the 1970s. He studied at the University of Alberta, where he received his BSc and DDS degrees.",
      'Dr. Redmond has been practicing for over 40 years and enjoys the practice of general dentistry as well as cosmetic procedures such as veneer crowns and Invisalign treatment.',
      'He feels his most significant accomplishment has been raising 6 wonderful children with an amazing spouse. Outside of dentistry, he loves playing sports and spending time with his family and friends.',
      'Dr. Denis Redmond looks forward to meeting you and your family at West End Dental Centre. He is now accepting new patients and is available to help provide for your oral health and dental needs.',
    ],
    photo: '/images/team/dr-denis-redmond.png',
    initials: 'DR',
  },
  {
    name: 'Dr. Kenneth Chan',
    credentials: 'General Dentist',
    education: 'University of Melbourne, 2019',
    bio: [
      'Dr. Kenneth Chan was born in a small town near Vancouver and pursued his undergraduate studies in the United States before travelling to Australia for dental school. He graduated from the University of Melbourne in 2019, where he gained valuable experience serving patients in rural communities across Australia.',
      'Prior to joining West End Dental Centre, Dr. Chan proudly served the Blairmore community, where he built a strong foundation in patient-centered care.',
      'Dr. Chan is passionate about providing personalized dental care and takes pride in helping patients achieve and maintain healthy, confident smiles. He is excited to begin this next chapter in Edmonton and looks forward to establishing himself within the West Edmonton community.',
    ],
    photo: '/images/team/dr-kenneth-chan.png',
    initials: 'KC',
    note: 'Now accepting new patients. His schedule will open after April 27, 2026.',
  },
];
