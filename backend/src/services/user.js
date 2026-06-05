import crypto from "crypto";
import bcrypt from "bcrypt";
import { insertUser } from "../models/user.js";

const roleLetters = {
  admin: "A",
  manažér: "M",
  zamestnanec: "Z",
  študent: "S",
};

function generatePID(fullname, email, role) {
  const seed = `${fullname}${email}`;
  const hash = crypto.createHash("sha256").update(seed).digest("hex");
  const roleLetter = roleLetters[role];
  const pid = parseInt(hash, 16) % 1000000;
  return `${roleLetter}${pid}`;
}

function generatePassword() {
  // return crypto.randomBytes(6).toString("base64");
  return "123456"; // for development
}

async function createUser(fullname, email, companyId, role) {
  const pid = generatePID(fullname, email, role);
  const password = generatePassword();
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await insertUser(fullname, pid, email, hashedPassword, role, companyId);

  return { user, plainPassword: password };
}

export { generatePID, generatePassword, createUser };
