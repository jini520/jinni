export interface Certifications {
  certifications: Certification[];
  awards: Award[];
}

export interface Certification {
  id: string;
  name: string;
  date: string;
  organization: string;
  tier: string;
}

export interface Award {
  id: string;
  name: string;
  date: string;
  organization: string;
  tier: string;
}
