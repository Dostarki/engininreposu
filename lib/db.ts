import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "megastar.json");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

export interface DBShow {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image: string | null;
  gallery: string;
  video_url: string | null;
  duration: string | null;
  team_count: string | null;
  category: string | null;
  featured: number;
  sort_order: number;
  created_at: string;
}
export interface DBCareer {
  id: number; full_name: string; email: string | null; phone: string | null; position: string | null; message: string | null; read_status: number; created_at: string;
}
export interface DBContact {
  id: number; full_name: string; email: string | null; phone: string | null; subject: string | null; message: string | null; read_status: number; created_at: string;
}
export interface DBAdminUser { id: number; username: string; password_hash: string; }
export interface DBSession { token: string; user_id: number; created_at: string; expires_at: string; }
export interface DBReference {
  id: number;
  name: string;
  logo: string;
  website: string | null;
  category: string | null;
  sort_order: number;
  featured: number;
  created_at: string;
}

export interface DBOrientalReservation {
  id: number;
  full_name: string;
  email: string | null;
  phone: string | null;
  hotel: string | null;
  show_name: string | null;
  event_date: string;
  event_time: string | null;
  custom_time: string | null;
  notes: string | null;
  /** 0: Beklemede (Pending), 1: Onaylandı (Dolu), 2: Reddedildi, 3: Silindi */
  status: number;
  read_status: number;
  created_at: string;
}

export interface Database {
  shows: DBShow[];
  career_applications: DBCareer[];
  contact_messages: DBContact[];
  references: DBReference[];
  oriental_reservations: DBOrientalReservation[];
  settings: Record<string, string>;
  admin_users: DBAdminUser[];
  admin_sessions: DBSession[];
  seq: { shows: number; career: number; contact: number; reference: number; oriental: number; admin: number; };
}

let cache: Database | null = null;
let lastMtime = 0;
let writeLock = false;
const pending: Array<() => void> = [];

const seedRefs: [string, string][] = [
  ["Rixos Downtown Antalya", "5 Yıldızlı Otel"],
  ["Akra Hotel", "5 Yıldızlı Otel"],
  ["Crown Plaza Antalya", "5 Yıldızlı Otel"],
  ["Marriott Antalya", "5 Yıldızlı Otel"],
  ["Concorde De Luxe Resort", "5 Yıldızlı Otel"],
  ["Ramada Plaza Antalya", "5 Yıldızlı Otel"],
  ["Limak Lara De Luxe", "5 Yıldızlı Otel"],
  ["Sherwood Lara", "5 Yıldızlı Otel"],
  ["Alva Donna Resort", "5 Yıldızlı Otel"],
  ["Aska Lara Resort", "5 Yıldızlı Otel"],
  ["Sealife Kemer Resort", "5 Yıldızlı Otel"],
  ["Crystal Sunrise Queen", "5 Yıldızlı Otel"],
  ["Kervansaray Hotel", "5 Yıldızlı Otel"],
  ["Mirada Del Mar", "5 Yıldızlı Otel"],
];

function emptyDB(): Database {
  return {
    shows: [],
    career_applications: [],
    contact_messages: [],
    references: [],
    oriental_reservations: [],
    settings: {},
    admin_users: [],
    admin_sessions: [],
    seq: { shows: 0, career: 0, contact: 0, reference: 0, oriental: 0, admin: 0 },
  };
}

function ensureSchema(db: any): Database {
  if (!Array.isArray(db.shows)) db.shows = [];
  db.shows = db.shows.map((s: any) => ({
    ...s,
    gallery: s.gallery ?? "[]",
    video_url: s.video_url ?? null,
    duration: s.duration ?? null,
    team_count: s.team_count ?? null,
    category: s.category ?? null,
    featured: s.featured ?? 0,
    sort_order: s.sort_order ?? 0,
  }));
  if (!Array.isArray(db.career_applications)) db.career_applications = [];
  if (!Array.isArray(db.contact_messages)) db.contact_messages = [];
  if (!Array.isArray(db.references)) db.references = [];
  if (!Array.isArray(db.oriental_reservations)) db.oriental_reservations = [];
  db.oriental_reservations = db.oriental_reservations.map((r: any) => ({
    ...r,
    full_name: r.full_name ?? "",
    email: r.email ?? null,
    phone: r.phone ?? null,
    hotel: r.hotel ?? null,
    show_name: r.show_name ?? "Oryantal",
    event_date: r.event_date ?? "",
    event_time: r.event_time ?? null,
    custom_time: r.custom_time ?? null,
    notes: r.notes ?? null,
    status: typeof r.status === "number" ? r.status : 0,
    read_status: typeof r.read_status === "number" ? r.read_status : 0,
  }));
  if (!db.settings || typeof db.settings !== "object") db.settings = {};
  if (!Array.isArray(db.admin_users)) db.admin_users = [];
  if (!Array.isArray(db.admin_sessions)) db.admin_sessions = [];
  if (!db.seq || typeof db.seq !== "object") db.seq = {};
  if (typeof db.seq.shows !== "number") db.seq.shows = 0;
  if (typeof db.seq.career !== "number") db.seq.career = 0;
  if (typeof db.seq.contact !== "number") db.seq.contact = 0;
  if (typeof db.seq.reference !== "number") db.seq.reference = 0;
  if (typeof db.seq.oriental !== "number") db.seq.oriental = 0;
  if (typeof db.seq.admin !== "number") db.seq.admin = 0;
  if (db.references.length === 0) {
    seedRefs.forEach(([name, category], i) => {
      db.seq.reference++;
      db.references.push({
        id: db.seq.reference,
        name,
        logo: "",
        website: null,
        category,
        sort_order: i,
        featured: i < 6 ? 1 : 0,
        created_at: new Date().toISOString(),
      });
    });
  }
  if (typeof db.settings.site_logo !== "string" || !db.settings.site_logo) {
    db.settings.site_logo = "/megastar-logo.svg";
  }
  if (typeof db.settings.hero_video_url !== "string") {
    db.settings.hero_video_url = "";
  }
  return db as Database;
}

export function readDB(): Database {
  try {
    const st = fs.statSync(DB_PATH);
    if (!cache || st.mtimeMs !== lastMtime) {
      const raw = fs.readFileSync(DB_PATH, "utf8");
      let parsed: any;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = {};
      }
      cache = ensureSchema(parsed);
      lastMtime = st.mtimeMs;
    }
    return cache!;
  } catch (e: any) {
    if (e.code === "ENOENT") {
      const fresh = initDB();
      writeDB(fresh);
      return readDB();
    }
    throw e;
  }
}

export function writeDB(db: Database) {
  const tmp = DB_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), "utf8");
  fs.renameSync(tmp, DB_PATH);
  lastMtime = fs.statSync(DB_PATH).mtimeMs;
  cache = db;
}

export function mutate<T>(fn: (db: Database) => T): T {
  if (writeLock) {
    // should be very rare in node single-thread
    throw new Error("Concurrent write detected, retry request.");
  }
  writeLock = true;
  try {
    const db = readDB();
    const res = fn(db);
    writeDB(db);
    return res;
  } finally {
    writeLock = false;
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 310000, 64, "sha512").toString("hex");
  return `pbkdf2_sha512$310000$${salt}$${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [, , salt, expected] = stored.split("$");
    const hash = crypto.pbkdf2Sync(password, salt, 310000, 64, "sha512").toString("hex");
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected));
  } catch { return false; }
}

function initDB(): Database {
  const db = emptyDB();
  const seedShows = [
    ["Moğol Akrobasi", "mogol-akrobasi", "Akrobati", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mogul%20acrobatic%20show%20circus%20athletic%20group%20luxury%20event&image_size=landscape_16_9"],
    ["Felix Dance", "felix-dance", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=professional%20dance%20group%20stage%20performance%20colorful%20costumes%20luxury&image_size=landscape_16_9"],
    ["Cengizhan", "cengizhan", "Gösteri", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=genghis%20khan%20turkish%20historical%20warrior%20show%20luxury%20event&image_size=landscape_16_9"],
    ["Ritmo Cuba", "ritmo-cuba", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=cuban%20dance%20rhythm%20salsa%20show%20tropical%20colorful%20luxury&image_size=landscape_16_9"],
    ["COPACOBANA", "copacobana", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=copacabana%20brazilian%20carnival%20dance%20show%20samba%20luxury%20colorful%20feathers&image_size=landscape_16_9"],
    ["COLOMBIA", "colombia", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=colombian%20dance%20show%20latin%20american%20colorful%20traditional%20costumes%20luxury&image_size=landscape_16_9"],
    ["VIVA MEXICO", "viva-mexico", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=mexican%20folklore%20dance%20show%20colorful%20traditional%20luxury%20performance&image_size=landscape_16_9"],
    ["QUELLA URBAN", "quella-urban", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=urban%20street%20dance%20hiphop%20group%20modern%20stage%20luxury%20performance&image_size=landscape_16_9"],
    ["ETOPIA", "etopia", "Gösteri", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=utopia%20futuristic%20led%20performance%20art%20show%20modern%20luxury%20event&image_size=landscape_16_9"],
    ["GINE", "gine", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=guinea%20african%20dance%20show%20traditional%20drums%20colorful%20luxury&image_size=landscape_16_9"],
    ["JONGLOR", "jonglor", "Akrobati", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=juggler%20juggling%20show%20circus%20fire%20balls%20luxury%20event&image_size=landscape_16_9"],
    ["ORYANTAL", "oryantal", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=oriental%20belly%20dance%20show%20turkish%20performance%20luxury%20golden%20costume&image_size=landscape_16_9"],
    ["GO-GO", "go-go", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=gogo%20dancers%20club%20show%20party%20nightlife%20luxury%20stage%20performance&image_size=landscape_16_9"],
    ["MİCHAEL JACKSON", "michael-jackson", "Taklit", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=michael%20jackson%20impersonator%20tribute%20show%20stage%20performance%20luxury&image_size=landscape_16_9"],
    ["TÜRK GECESİ", "turk-gesi", "Konu", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=turkish%20night%20theme%20event%20ottoman%20traditional%20music%20dance%20luxury&image_size=landscape_16_9"],
    ["KENYA", "kenya", "Dans", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=kenyan%20african%20dance%20show%20traditional%20tribal%20luxury%20colorful&image_size=landscape_16_9"],
    ["EXTREME", "extreme", "Akrobati", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=extreme%20sports%20stunt%20parkour%20freestyle%20luxury%20event%20performance&image_size=landscape_16_9"],
    ["MAGIC", "magic", "Gösteri", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=magic%20show%20magician%20illusion%20performance%20luxury%20theater%20stage%20mystery&image_size=landscape_16_9"],
    ["KIDS FEST", "kids-fest", "Çocuk", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=kids%20festival%20children%20party%20show%20colorful%20clowns%20balloons%20luxury%20event&image_size=landscape_16_9"],
    ["HAVUZ OYUNU", "havuz-oyunu", "Eğlence", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=pool%20party%20games%20water%20show%20luxury%20hotel%20summer%20entertainment&image_size=landscape_16_9"],
    ["PARTY", "party", "Eğlence", "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20party%20event%20dj%20dancing%20crowd%20night%20celebration%20organization&image_size=landscape_16_9"],
  ];
  const now = new Date().toISOString();
  seedShows.forEach(([name, slug, cat, img], i) => {
    db.seq.shows++;
    db.shows.push({
      id: db.seq.shows,
      name, slug,
      short_description: `Megastar Organizasyon farkıyla ${name} gösterisi ile etkinliklerinizi unutulmaz kılın.`,
      description: `<p><strong>${name}</strong>, Megastar Organizasyon profesyonel ekibi tarafından sahnelenen eşsiz bir gösteridir. Antalya başta olmak üzere tüm Türkiye'de 5 yıldızlı oteller, özel etkinlikler, düğünler, kurumsal organizasyonlar ve daha birçok mekânda başarıyla sunulmaktadır.</p>
<h3>Gösteri Özellikleri</h3>
<ul>
<li>Profesyonel ve deneyimli kadro</li>
<li>Özgün kostüm ve sahne tasarımı</li>
<li>Yüksek enerjili performans</li>
<li>İzleyici ile etkileşim</li>
<li>Özel isteklerinize göre özelleştirme</li>
</ul>
<h3>Nerelerde Tercih Edilir?</h3>
<p>5 yıldızlı otel eğlenceleri, düğün ve nişan organizasyonları, kurumsal firmalar, yeni yıl partileri, doğum günleri, temalı partiler, çocuk etkinlikleri ve daha özel günlerinizde Megastar Organizasyon güvencesiyle sizlerle.</p>
<p>Hemen bizimle iletişime geçin, etkinliğinizi Megastar kalitesiyle taçlandırın!</p>`,
      image: img,
      gallery: "[]",
      video_url: null,
      duration: null,
      team_count: null,
      category: cat,
      featured: 1, sort_order: i, created_at: now,
    });
  });

  db.settings = {
    whatsapp_number: "905555555555",
    site_title: "Megastar Organizasyon | Antalya Profesyonel Organizasyon Şirketi",
    meta_description: "Megastar Organizasyon - Antalya merkezli profesyonel organizasyon şirketi. Show grupları, sahne gösterileri, dans grupları, çocuk etkinlikleri ve lüks organizasyon çözümleri.",
    meta_keywords: "Antalya organizasyon, Megastar Organizasyon, show grupları, dans gösterisi, çocuk etkinliği, otel eğlencesi, profesyonel organizasyon, Antalya",
    address: "Antalya, Türkiye",
    phone: "+90 555 555 55 55",
    email: "info@megastarorganizasyon.com",
    facebook_url: "#",
    instagram_url: "#",
    youtube_url: "#",
    hero_title: "Antalya'nın Lüks Organizasyon Şirketi",
    hero_subtitle: "Megastar Organizasyon ile etkinliklerinizi unutulmaz kılın. Profesyonel show gruplarımız ve yaratıcı çözümlerimizle fark yaratıyoruz.",
    hero_image: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20hotel%20event%20organization%20stage%20night%20performance%20golden%20elegant%20crowd%20party%20antalya&image_size=landscape_16_9",
    hero_video_url: "",
    about_text: `### Sahne Dünyasının Tanınan Adıyıyız
**Megastar Organizasyon**, Antalya'nın kalbinde doğup Akdeniz'in lüks otellerine on yıldan fazla süredir profesyonel sahne grupları gönderen köklü bir eğlence organizasyon şirketidir. Lara, Kundu, Belek, Side ve Alanya'daki 5 yıldızlı zincir otellerle kurduğumuz uzun vadeli iş birliklerimiz; sahne hakimiyetimiz, sanatçı kadromuzun saha tecrübesi ve detaylara verdiğimiz önemin bir sonucudur.

Her akşam onlarca sahneye sanatçı gönderiyor, sezon süresince binlerce davetliye profesyonel eğlence deneyimi yaşatıyoruz. Dans gruplarından oryantal showlara, LED kostümlü performanslardan çocuk tiyatrolarına, ateş gösterilerinden partilere kadar; oteliniz için uygun olan her konsepte özel ekiple çözüm üretiyoruz.

### Neler Sunuyoruz?
- Özelleştirilebilir dans ve sahne grupları
- Uluslararası standartta solo ve grup performanslar
- Konsept partiler, temalı geceler ve ana gösteri akışları
- Çocuk kulübü şovları, animasyon ve sahne oyunları
- Sahne kurulumu, ışık, ses ve kostüm yönetimi

Sezonluk otel sözleşmelerinizden tek seferlik özel etkinliklerinize kadar her ölçekte proje üretiyoruz. Sizin için sahneyi hazırlıyor, sanatçıları planlıyor ve programı kusursuz yönetiyoruz. Sadece keyif almak size, gerisini Megastar bilir.`,
    site_logo: "/megastar-logo.svg",
  };

  const seedRefs = [
    ["Rixos Downtown Antalya", "5 Yıldızlı Otel"],
    ["Akra Hotel", "5 Yıldızlı Otel"],
    ["Crown Plaza Antalya", "5 Yıldızlı Otel"],
    ["Marriott Antalya", "5 Yıldızlı Otel"],
    ["Concorde De Luxe Resort", "5 Yıldızlı Otel"],
    ["Ramada Plaza Antalya", "5 Yıldızlı Otel"],
    ["Limak Lara Deluxe", "5 Yıldızlı Otel"],
    ["Kervansaray Lara", "5 Yıldızlı Otel"],
    ["Aska Lara Resort", "5 Yıldızlı Otel"],
    ["Sealife Family Resort", "5 Yıldızlı Otel"],
    ["Royal Diwa Tekirova", "5 Yıldızlı Otel"],
    ["Paloma Foresta Resort", "5 Yıldızlı Otel"],
  ];
  seedRefs.forEach(([n, cat], i) => {
    db.seq.reference++;
    db.references.push({
      id: db.seq.reference,
      name: n,
      logo: "",
      website: "#",
      category: cat,
      sort_order: i,
      featured: i < 6 ? 1 : 0,
      created_at: now,
    });
  });

  const username = process.env.ADMIN_USERNAME || "hamdullaherdem";
  const password = process.env.ADMIN_PASSWORD || "h16172325h";
  db.seq.admin++;
  db.admin_users.push({
    id: db.seq.admin,
    username,
    password_hash: hashPassword(password),
  });
  return db;
}

export function getSetting(key: string, def = ""): string {
  return readDB().settings[key] ?? def;
}
export function setSetting(key: string, value: string) {
  return mutate<void>(db => { db.settings[key] = value; });
}
export function getAllSettings(): Record<string, string> {
  return { ...readDB().settings };
}

/* ===== References ===== */
export function getAllReferences(): DBReference[] {
  return [...readDB().references].sort((a, b) => a.sort_order - b.sort_order);
}
export function getFeaturedReferences(): DBReference[] {
  return getAllReferences().filter(r => r.featured === 1);
}
export function getReferenceById(id: number): DBReference | undefined {
  return readDB().references.find(r => r.id === id);
}
export function createReference(data: Omit<DBReference, "id" | "created_at">): DBReference {
  return mutate<DBReference>(db => {
    db.seq.reference++;
    const item: DBReference = {
      id: db.seq.reference,
      ...data,
      created_at: new Date().toISOString(),
    };
    db.references.push(item);
    return item;
  });
}
export function updateReference(id: number, data: Partial<Omit<DBReference, "id" | "created_at">>): boolean {
  return mutate<boolean>(db => {
    const i = db.references.findIndex(r => r.id === id);
    if (i < 0) return false;
    db.references[i] = { ...db.references[i], ...data };
    return true;
  });
}
export function deleteReference(id: number): boolean {
  return mutate<boolean>(db => {
    const i = db.references.findIndex(r => r.id === id);
    if (i < 0) return false;
    db.references.splice(i, 1);
    return true;
  });
}

/* ===== Oriental Rezervasyonlar ===== */
export function getAllOrientalReservations(): DBOrientalReservation[] {
  return [...readDB().oriental_reservations]
    .filter(r => r.status !== 3)
    .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
}
export function getOrientalReservationById(id: number): DBOrientalReservation | undefined {
  return readDB().oriental_reservations.find(r => r.id === id);
}
export function createOrientalReservation(data: Omit<DBOrientalReservation, "id" | "status" | "read_status" | "created_at">): DBOrientalReservation {
  return mutate<DBOrientalReservation>(db => {
    db.seq.oriental++;
    const item: DBOrientalReservation = {
      id: db.seq.oriental,
      ...data,
      status: 0,
      read_status: 0,
      created_at: new Date().toISOString(),
    };
    db.oriental_reservations.push(item);
    return item;
  });
}
export function updateOrientalReservation(id: number, data: Partial<Omit<DBOrientalReservation, "id" | "created_at">>): boolean {
  return mutate<boolean>(db => {
    const i = db.oriental_reservations.findIndex(r => r.id === id);
    if (i < 0) return false;
    db.oriental_reservations[i] = { ...db.oriental_reservations[i], ...data };
    return true;
  });
}
export function deleteOrientalReservation(id: number): boolean {
  return mutate<boolean>(db => {
    const i = db.oriental_reservations.findIndex(r => r.id === id);
    if (i < 0) return false;
    db.oriental_reservations.splice(i, 1);
    return true;
  });
}

/** Onaylanmış (dolu) rezervasyonların tarih-saat çiftlerini döndürür. */
export function getApprovedOrientalSlots(): Array<{ event_date: string; event_time: string | null; custom_time: string | null }> {
  return readDB().oriental_reservations
    .filter(r => r.status === 1)
    .map(r => ({ event_date: r.event_date, event_time: r.event_time, custom_time: r.custom_time }));
}
