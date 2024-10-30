interface NewCategory {
    user_id: number;
    name: string;
    description: string;
    system_default: boolean;
}
interface UpdateCategory {
    name?: string;
    description?: string;
}
declare class Category {
    /**
     * Find and return all categories
     *
     * @param {*} user_id = und
     * @returns [categories]
     */
    static findAll(user_id?: number | undefined): Promise<{}>;
    static findById(category_id: number): Promise<{}>;
    static create({ name, description, system_default }: NewCategory): Promise<{}>;
    static update(id: number, data: UpdateCategory): Promise<{}>;
    static delete(id: number): Promise<{}>;
}
export default Category;
