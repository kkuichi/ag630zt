import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByPID } from "../models/auth.js";

export async function login(pid, password) {
  const user = await findUserByPID(pid);
  if (!user) throw new Error("Nesprávny PID alebo heslo.");

  const passMatch = await bcrypt.compare(password, user.password);
  if (!passMatch) throw new Error("Nesprávny PID alebo heslo.");

  const token = jwt.sign(
    { userId: user.id, pid: user.pid, role: user.role, fullName: user.full_name, companyId: user.company_id },
    process.env.JWT_SECRET,
    { expiresIn: "2h" },
  );

  return { token, role: user.role };
}
