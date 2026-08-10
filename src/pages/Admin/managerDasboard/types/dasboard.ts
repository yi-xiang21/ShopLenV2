export interface revenue {
    today: number;
    this_week: number;
    this_month: number;
    growth_vs_last_week: number;
}
export interface order_count {
    pending: number;
    processing: number;
    shipping: number;
    completed: number;
    cancelled: number;
    growth_vs_last_week: number;
}
export interface usersData {
    active_customers: number;
    active_shippers: number;
    new_this_month: number;
}
export interface inventory_alerts {
    out_of_stock: number;
    low_stock: number;
}
export interface top_selling_products {
    product_name: string;
    total_sold: number;
}
export interface chartData {
    date: string;
    value: number;
}
export interface workshop_stats {
    bookings_today: number;
    upcoming_count: number;
    growth_vs_last_week: number;
    top_workshops: top_workshops[]
}
export interface top_workshops {
    title: string;
    total_bookings: number;
}
export interface top_order {
    order_id:string;
    customer_name:string;
    total_amount:number;
}

export interface financial {
    total_revenue: number;
    total_cost: number;
    total_profit: number;
}

export interface DashboardOverview {
    revenue: revenue,
    financial : financial,
    revenue_chart : chartData[],
    top_orders_today : top_order[],
    orders_count: order_count,
    workshop_stats: workshop_stats,
    users: usersData,
    inventory_alerts: inventory_alerts,
    top_selling_products: top_selling_products[]
  }
