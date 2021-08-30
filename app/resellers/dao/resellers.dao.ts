import shortid from "shortid";
import debug from "debug";
import mongooseService from "../../common/services/mongoose.service";
import { CreateResellerDto } from "../dtos/create-reseller.dto";

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
    const resellerId = shortid.generate().toUpperCase();
    const reseller = new this.Resellers({
      _id: resellerId,
      ...resellerFields,
    });

    await reseller.save();
    return reseller;
  }

  async getResellerByCpf(cpf: string) {
    const resellerObj: CreateResellerDto | any = await this.Resellers.findOne({ cpf }).exec();
    return resellerObj;
  }

  async getResellerByEmail(email: string) {
    return this.Resellers.findOne({ email }).exec();
  }

  async getResellerWithPasswordHashByEmail(email: string) {
    const resellerObj: CreateResellerDto | any = await this.Resellers.findOne({ email }, '_id name email cpf password').exec();
    return resellerObj;
  }
}

export default new ResellersDao();