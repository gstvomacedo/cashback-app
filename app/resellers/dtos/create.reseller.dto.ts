export interface CreateResellerDto {
  name: String,
  cpf: String,
  email: String,
  password: String,
  top_seller?: Boolean,
}