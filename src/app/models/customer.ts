export interface Customer {
  name: string;
  description: string;
}

export interface CustomerWithId extends Customer {
  id: string;
}
