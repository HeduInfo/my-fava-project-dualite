export interface Maintenance {
  id: string;
  date: string;
  odometer: number;
  type: string;
  cost: number;
  notes: string;
  provider?: string;
}

export interface Refueling {
  id: string;
  date: string;
  odometer: number;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fuelType: 'Gasolina' | 'Etanol' | 'Diesel' | 'Elétrico';
}

export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: 'car' | 'motorcycle' | 'truck';
  licensePlate: string;
  odometer: number;
  fuelType: 'Gasolina' | 'Etanol' | 'Diesel' | 'Flex' | 'Elétrico';
  efficiency?: number; // km/L
  costPerKm?: number;
  licensingDate: string;
  insuranceRenewalDate: string;
  image?: string;
  maintenance: Maintenance[];
  refueling: Refueling[];
}
