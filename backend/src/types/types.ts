export interface NewCategory {
  name: string;
  description: string;
  user_id: number;
  system_default: boolean;
}

export interface NewSubcategory {
  name: string;
  description: string;
  user_id: number;
  category_id: number;
  system_default: boolean;
}
