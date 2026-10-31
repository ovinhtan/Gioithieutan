export interface BrandingInfo {
  logo: string;
  brandName: string;
  slogan: string;
  branchTitle: string;
  consultant: {
    name: string;
    phone: string;
    phoneRaw: string;
    role: string;
  };
}

export interface NavItem {
  id: string;
  number: string;
  name: string;
  icon: string;
  description: string;
}

export interface FaqStep {
  stepNumber: number;
  text: string;
  image: string;
}

export interface FaqTopic {
  id: string;
  cardTitle: string;
  badge: string;
  videoUrl: string;
  steps: FaqStep[];
}

export interface ProductItem {
  id: string;
  category: string;
  title: string;
  image: string;
  badge: string;
  highlight: string;
  detail: string;
}

export interface BranchItem {
  stt: number;
  name: string;
  isHead: boolean;
  address: string;
  mapUrl: string;
  hours: string;
  image: string;
  phone: string;
  phoneRaw: string;
}

export interface LoanScheduleRow {
  period: number;
  paymentDate: string;
  openingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  closingBalance: number;
}
