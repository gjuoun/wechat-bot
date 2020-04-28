export interface ExchangeRate {
  amount: string;
  from: "USD" | "CAD" | "CNY";
  to: "USD" | "CAD" | "CNY";
  timestamp: number;
  value: number;
}


export interface CovidNewsNS{
  id: string,
  title: string,
  timestamp: string,
  summary: string,
}


export interface GasStation {
  station_id: string;
  station_brand: string;
  station_address: string;
  fuels: Fuel[];
}

export interface Fuel {
  id: number;
  fuelType: string;
  stationId: number;
  prices: GasPrice[];
}

export interface GasPrice {
  isCash: boolean;
  price: number;
  reportedBy: string,
  postedTime: string,
}
