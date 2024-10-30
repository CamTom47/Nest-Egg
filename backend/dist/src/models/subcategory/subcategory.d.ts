interface NewSubcategory {
    name: string;
    description: string;
    category_id: number;
    user_id: number;
    system_default: boolean;
}
interface UpdateSubcategory {
    name?: string;
    description?: string;
    category_id?: number;
    user_id?: number;
}
declare class Subcategory {
    /**
     * Find and return all subcategories
     *
     * @param {*} user_id = und
     * @returns [subcategories]
     */
    static findAll(user_id?: number | undefined): Promise<{}>;
    static findById(subcategory_id: number): Promise<{}>;
    static create({ name, description, category_id, user_id, system_default }: NewSubcategory): Promise<{}>;
    static update(id: number, data: UpdateSubcategory): Promise<{}>;
    static delete(id: number): Promise<{}>;
}
export default Subcategory;
