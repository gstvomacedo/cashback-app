import shortid from "shortid";
import debug from "debug";
import mongooseService from "../../common/services/mongoose.service";
import { OrderStatus } from "../../resellers/interfaces/order-status.interface";
import { CreateOrderDto } from "../dtos/create-order.dao";

const log: debug.IDebugger = debug("app:orders-dao");

class OrdersDao {
  Schema = mongooseService.getMongoose().Schema;

  orderSchema = new this.Schema({
    _id: String,
    buyerEmail: String,
    buyerCpf: String,
    resellerCpf: String,
    status: { type: String, enum: OrderStatus, default: OrderStatus.PENDING },
    date: Date,
    price: Number,
    cashbackAmount: Number,
    cashbackPercentage: Number,
  });

  Orders = mongooseService.getMongoose().model("Orders", this.orderSchema);

  constructor() {
    log("Crated a new instance of OrdersReseller");
  }

  async addOrder(orderFields: CreateOrderDto) {
    const orderId = shortid.generate().toUpperCase();
    const order = new this.Orders({
      _id: orderId,
      ...orderFields
    });

    await order.save();
    return order;
  }

  async listOrders() {
    return this.Orders.find().exec();
  }

  async getOrderById(orderId: string) {
    return this.Orders.findOne({ _id: orderId }).exec();
  }

  async getOrdersByBuyerCpf(buyerCpf: string) {
    return this.Orders.findOne({ buyerCpf }).exec();
  }
}

export default new OrdersDao();