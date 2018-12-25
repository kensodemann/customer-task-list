export interface Customer {
  name: string;
  description: string;
  isActive: boolean;
}

export interface CustomerWithId extends Customer {
  id: string;
}
