export interface Item {
  id: string;
  name: string;
  quantity: number;
  room: string | null;
  category: string | null;
  notes: string | null;
  purchase_price: number | null;
  purchase_date: string | null;
  photo_path: string | null;
  created_at: string;
}

export type ItemInput = Omit<Item, "id" | "created_at">;
