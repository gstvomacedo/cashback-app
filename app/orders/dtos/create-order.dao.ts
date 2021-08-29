import { OrderStatus } from "../../resellers/interfaces/order-status.interface";

export interface CreateOrderDto {
  buyerEmail: String,
  resellerCpf: String,
  status: OrderStatus,
  date: Date,
  price: Number,
  cashbackPercentage: Number,
  cashbackAmount: Number,
}