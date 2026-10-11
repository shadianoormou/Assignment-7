export type ChangeDirection = "up" | "down" | "flat";

export type MarketPrice = {
  market: string;
  division: string;
  min: number;
  max: number;
};

export type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: "kg" | "litre" | "dozen" | "piece";
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: { dir: ChangeDirection; pct: number };
  markets: MarketPrice[];
};

export type Category = {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

export type ProductSummary = Pick<
  Product,
  "id" | "slug" | "nameBn" | "image" | "unit" | "today" | "change"
>;

export type TickerProduct = ProductSummary;
