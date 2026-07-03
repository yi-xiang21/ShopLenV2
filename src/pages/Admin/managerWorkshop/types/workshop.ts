export type WorkshopImage = {
    image_id?: number;
    image_url: string;
    sort_order: number;
}
export type WorkshopVariant = {
    variant_id?: number;
    start_date: string;
    end_date: string;
    status: "open" | "closed" | "full";
    sku?: string;
    slug?: string;
    price: string;
    session_name: string;
    capacity: number;
    images: WorkshopImage[];
}
export interface Workshop {
    workshop_id?: number;
    product_id?: number;
    title: string;
    description: string;
    location: string;
    category_id: number;
    status: "active" | "inactive";
    overall_status?: "open" | "closed";
    sessions: WorkshopVariant[];
}