import { BadRequestError } from '../../ExpressError';
interface NewBudget {
    name: string;
    description: string;
}
interface UpdateBudget {
    name?: string;
    description?: string;
}
declare class Budget {
    static findAll(): Promise<{}>;
    static findById(budget_id: number): Promise<{}>;
    static create({ name, description }: NewBudget): Promise<any>;
    static update(id: number, data: UpdateBudget): Promise<any>;
    static delete(id: number): Promise<BadRequestError | {
        message: string;
    }>;
}
export default Budget;
