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

export interface NewBudget {
  name: string;
  description: string;
  user_id: number;
}

export interface UpdateBudget {
  name?: string;
  description?: string;
  user_id?: number;
}

