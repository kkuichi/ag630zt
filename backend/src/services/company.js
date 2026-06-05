import bcrypt from "bcrypt";
import pool from "../db/index.js";
import { insertCompany, insertCompanyOnly, updateCompanyManagerWithClient } from "../models/company.js";
import { insertUserWithClient } from "../models/user.js";
import { generatePID, generatePassword } from "./user.js";

export async function createCompanyWithManager(companyData, managerData) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const company = await insertCompany(client, companyData.name, companyData.address, companyData.ico);

    const password = generatePassword();
    const hashed = await bcrypt.hash(password, 10);
    const pid = generatePID(managerData.fullname, managerData.email, "manažér");

    const manager = await insertUserWithClient(client, managerData.fullname, pid, managerData.email, hashed, "manažér", company.id);

    await updateCompanyManagerWithClient(client, company.id, manager.id);

    await client.query("COMMIT");

    return { company, manager, plainPassword: password };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function createCompanyOnly(companyData) {
  const company = await insertCompanyOnly(companyData.name, companyData.address, companyData.ico);
  return { company };
}
