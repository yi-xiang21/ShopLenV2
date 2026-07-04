export type WorkshopImage = {
    image_id?: number;
    image_url: string;
    sort_order: number;
}
export interface voucher {
    type?: string,
    value?: number,
    voucher_id?: number,
    voucher_name?: string,
}
export type WorkshopVariant = {
    variant_id?: number;
    start_date: string;
    start_time: string;
    end_time: string;
    final_price?: string;
    status: "open" | "closed" | "full";
    discount?:voucher,
    sku?: string;
    slug?: string;
    price: string;
    session_name: string;
    total_capacity: number;
    booked_slots?: number;
    available_slots?: number;
    images: WorkshopImage[];
}

export interface Workshop {
    workshop_id?: number;
    product_id?: number;
    title: string;
    description: string;
    location: string;
    category_id: number;
    category_name?: string;
    status: "active" | "inactive";
    sessions: WorkshopVariant[];
}