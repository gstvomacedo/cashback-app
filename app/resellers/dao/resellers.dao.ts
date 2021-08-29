import shortid from "shortid";
import debug from "debug";
import mongooseService from "../../common/services/mongoose.service";
import { CreateResellerDto } from "../dtos/create.reseller.dto";

const log: debug.IDebugger = debug("app:resellers-dao");

class ResellersDao {
  Schema = mongooseService.getMongoose().Schema;

  resellerSchema = new this.Schema({
    _id: String,
    name: String,
    cpf: String,
    email: String,
    password: { type: String, select: false },
    topSeller: { type: Boolean, default: false },
  });

  Resellers = mongooseService.getMongoose().model("Resellers", this.resellerSchema);

  constructor() {
    log("Created a new instance of ResellerDao");
  }

  async addReseller(resellerFields: CreateResellerDto) {
    const resellerId = shortid.generate();
    log(resellerFields);
    const reseller = new this.Resellers({
      _id: resellerId,
      ...resellerFields,
    });

    await reseller.save();
    return reseller;
  }

  async getResellerByCpf(cpf: string) {
    return this.Resellers.findOne({ cpf }).exec();
  }

  async getResellerByEmail(email: string) {
    return this.Resellers.findOne({ email }).exec();
  }

  async getPasswordHashByEmail(email: string) {
    const resellerObj: CreateResellerDto | any = await this.Resellers.findOne({ email }, 'password').exec();
    return resellerObj.password;
  }
}

export default new ResellersDao();