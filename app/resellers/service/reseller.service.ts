import { CreateResellerDto } from "../dtos/create.reseller.dto";
import resellersDao from "../dao/resellers.dao";

class ResellersService {
  async create(reseller: CreateResellerDto) {
    return resellersDao.addReseller(reseller);
  }

  async validateExistingReseller(cpf: string) {
    return resellersDao.getResellerByCpf(cpf);
  }

  async validateEmailAlreadyInUse(email: string) {
    return resellersDao.getResellerByEmail(email);
  }

  async getResellerByEmail(email: string) {
    return resellersDao.getResellerByEmail(email);
  }

  async getPasswordHashByEmail(email: string) {
    return resellersDao.getPasswordHashByEmail(email);
  }
}

export default new ResellersService();