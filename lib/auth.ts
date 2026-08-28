import { cookies } from "next/headers";
import { mutate, readDB, verifyPassword as verifyHash, type DBAdminUser } from "./db";
import crypto from "crypto";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7;

export interface AdminUser { id: number; username: string; }

export function verifyPassword(username: string, password: string): AdminUser | null {
  const u = readDB().admin_users.find(x => x.username === username);
  if (!u) return null;
  if (!verifyHash(password, u.password_hash)) return null;
  return { id: u.id, username: u.username };
}

export function createSession(user: AdminUser): string {
  const token = crypto.randomBytes(48).toString("hex");
  const expires = new Date(Date.now() + SESSION_DURATION_MS);
  return mutate<string>(db => {
    db.admin_sessions.push({
      token, user_id: user.id,
      created_at: new Date().toISOString(),
      expires_at: expires.toISOString(),
    });
    return token;
  });
}

export function getSessionUser(): AdminUser | null {
  const token = cookies().get("admin_session")?.value;
  if (!token) return null;
  const s = readDB().admin_sessions.find(x => x.token === token);
  if (!s) return null;
  if (new Date(s.expires_at).getTime() < Date.now()) {
    mutate<void>(db => { db.admin_sessions = db.admin_sessions.filter(x => x.token !== token); });
    return null;
  }
  const u = readDB().admin_users.find(x => x.id === s.user_id);
  if (!u) return null;
  return { id: u.id, username: u.username };
}

export function destroySession() {
  const token = cookies().get("admin_session")?.value;
  if (!token) return;
  mutate<void>(db => { db.admin_sessions = db.admin_sessions.filter(x => x.token !== token); });
}
