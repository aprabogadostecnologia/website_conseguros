export interface ConsultationRequest {
  id: string;
  email: string;
  timestamp: string;
  status: 'pending' | 'completed';
  riskCategory?: string;
  companySize?: string;
  notes?: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
  partnerLogo: {
    name: string;
    description: string;
  };
}

export interface AdvisoryStep {
  id: string;
  number: string;
  title: string;
  description: string;
  details: string[];
  icon: string;
  badgeBg: string;
  textCol: string;
  accentColor: string;
}

export interface PartnerCompany {
  name: string;
  logoType: 'text' | 'svg' | 'custom';
  additionalClass?: string;
}
