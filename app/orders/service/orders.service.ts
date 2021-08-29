import { CreateOrderDto } from "../dtos/create-order.dao";
import ordersDao from "../dao/orders.dao";
import resellerService from "../../resellers/service/reseller.service";
import { OrderStatus } from "../../resellers/interfaces/order-status.interface";

class OrdersService {
  async create(order: CreateOrderDto) {
    order.date = new Date();
    order = this.calculateCashback(order);
    order = await this.tryApproveOrderByResellerReputation(order);
    return ordersDao.addOrder(order);
  }

  private async tryApproveOrderByResellerReputation(order: CreateOrderDto): Promise<CreateOrderDto> {
    const reseller = await resellerService.getResellerByCpf(String(order.resellerCpf));

    if (reseller.topSeller) {
      order.status = OrderStatus.APPROVED
    }

    return order;
  }

  async listOrders() {
    return ordersDao.listOrders();
  }

  async getOrderById(orderId: string) {
    return ordersDao.getOrderById(orderId);
  }

  private calculateCashback(order: CreateOrderDto): CreateOrderDto {
    const cashbackLevels = [
      {
        minimumPrice: 0,
        maximumPrice: 1000,
        cashbackPercentage: 10,
      },
      {
        minimumPrice: 1001,
        maximumPrice: 1500,
        cashbackPercentage: 15,
      },
      {
        minimumPrice: 1501,
        maximumPrice: 999999,
        cashbackPercentage: 20,
      },
    ];

    for (let level = 0; level < cashbackLevels.length; level++) {
      if (order.price >= cashbackLevels[level].minimumPrice && order.price <= cashbackLevels[level].maximumPrice) {
        order.cashbackAmount = ((Number(order.price) / 100) * cashbackLevels[level].cashbackPercentage);
        order.cashbackPercentage = cashbackLevels[level].cashbackPercentage;
        break;
      }
    }

    return order;
  }
}

export default new OrdersService();