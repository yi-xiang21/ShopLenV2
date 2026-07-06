export interface status {
    active: "active",
    inactive: "inactive"
}
export interface role {
    customer: "customer"
    admin: "admin"
}
export interface account {
    user_id?: number,
    username: string,
    first_name: string,
    last_name: string,  
    password?: string,
    email: string,
    phone_number: string,
    status?: status,
    role: role,
    loyalty_points?: number,
}

