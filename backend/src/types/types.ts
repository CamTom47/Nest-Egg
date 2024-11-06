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

export interface NewUser {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  is_admin: boolean;
}
export interface UpdateUser {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  password?: string;
  is_admin?: boolean;
}
export interface NewAllocation {
  amount: number;
  subcategory_id: number;
  budget_id: number;
}
export interface UpdateAllocation {
  amount?: number;
  subcategory_id?: number;
  budget_id?: number;
}

