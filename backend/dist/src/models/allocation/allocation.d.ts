interface NewAllocation {
    amount: number;
    subcategory_id: number;
    budget_id: number;
}
interface UpdateAllocation {
    amount?: number;
    subcategory_id?: number;
    budget_id?: number;
}
declare class Allocation {
    /**
     * Find and return all subcategories
     *
     * @param {*} user_id = und
     * @returns [subcategories]
     */
    static findAll(budget_id?: number | undefined): Promise<{}>;
    static findById(allocation_id: number): Promise<{}>;
    static create({ amount, subcategory_id, budget_id }: NewAllocation): Promise<{}>;
    static update(id: number, data: UpdateAllocation): Promise<{}>;
    static delete(id?: number): Promise<{}>;
}
export default Allocation;
