import { mutate, readDB, type DBCareer, type DBContact, type DBOrientalReservation } from "./db";

export type CareerApplication = DBCareer;
export type ContactMessage = DBContact;

export function createCareerApplication(data: Omit<DBCareer, "id" | "read_status" | "created_at">) {
  return mutate<void>(db => {
    db.seq.career++;
    db.career_applications.unshift({
      id: db.seq.career, read_status: 0, created_at: new Date().toISOString(), ...data,
    });
  });
}

export function createContactMessage(data: Omit<DBContact, "id" | "read_status" | "created_at">) {
  return mutate<void>(db => {
    db.seq.contact++;
    db.contact_messages.unshift({
      id: db.seq.contact, read_status: 0, created_at: new Date().toISOString(), ...data,
    });
  });
}

export function getAllCareerApplications(unreadOnly = false): CareerApplication[] {
  let list = [...readDB().career_applications];
  if (unreadOnly) list = list.filter(x => !x.read_status);
  return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getAllContactMessages(unreadOnly = false): ContactMessage[] {
  let list = [...readDB().contact_messages];
  if (unreadOnly) list = list.filter(x => !x.read_status);
  return list.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function markCareerRead(id: number) {
  return mutate<void>(db => {
    const i = db.career_applications.findIndex(x => x.id === id);
    if (i >= 0) db.career_applications[i].read_status = 1;
  });
}

export function markContactRead(id: number) {
  return mutate<void>(db => {
    const i = db.contact_messages.findIndex(x => x.id === id);
    if (i >= 0) db.contact_messages[i].read_status = 1;
  });
}

export function deleteCareerApplication(id: number) {
  return mutate<void>(db => {
    db.career_applications = db.career_applications.filter(x => x.id !== id);
  });
}

export function deleteContactMessage(id: number) {
  return mutate<void>(db => {
    db.contact_messages = db.contact_messages.filter(x => x.id !== id);
  });
}

export type OrientalReservation = DBOrientalReservation;

export function markOrientalRead(id: number) {
  return mutate<void>(db => {
    const i = db.oriental_reservations.findIndex(x => x.id === id);
    if (i >= 0) db.oriental_reservations[i].read_status = 1;
  });
}

export function unreadCounts() {
  const db = readDB();
  return {
    career: db.career_applications.filter(x => !x.read_status).length,
    contact: db.contact_messages.filter(x => !x.read_status).length,
    oriental: db.oriental_reservations.filter(x => !x.read_status && x.status !== 3).length,
    orientalPending: db.oriental_reservations.filter(x => x.status === 0).length,
  };
}
