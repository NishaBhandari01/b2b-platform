import { createUser } from "./user.factory.js";
import { login } from "./auth.helper.js";
export async function createBuyerToken() {
  const user = await createUser({
    role: "buyer",
    password: "buyer123",
  });

  return await login(user.email, user.password);
}

export async function createSupplierToken() {
  const user = await createUser({
    role: "supplier",
    password: "supplier123",
  });

  return await login(user.email, user.password);
}

export async function createAdminToken() {
  const user = await createUser({
    role: "admin",
    password: "admin123",
  });

  return await login(user.email, user.password);
}
