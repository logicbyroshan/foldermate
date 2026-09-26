import { IDatabase } from "../connection.js";

export interface PrivacyGrievance {
  id: string;
  ticket_number: string;
  complainant_name: string;
  complainant_contact: string;
  category: "consent_violation" | "unauthorized_processing" | "delayed_dsr" | "child_data_concern" | "security_leak" | "other";
  description: string;
  status: "open" | "under_investigation" | "escalated" | "resolved" | "dismissed";
  grievance_officer: string;
  resolution_notes?: string | null;
  sla_deadline: string;
  resolved_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateGrievanceParams {
  id?: string;
  ticketNumber?: string;
  complainantName: string;
  complainantContact: string;
  category: "consent_violation" | "unauthorized_processing" | "delayed_dsr" | "child_data_concern" | "security_leak" | "other";
  description: string;
  grievanceOfficer?: string;
  slaDays?: number; // Statutory max 90 days under DPDP Rules 2025
}

export class GrievanceRepository {
  constructor(private db: IDatabase) {}

  public create(params: CreateGrievanceParams): PrivacyGrievance {
    const id = params.id || crypto.randomUUID();
    const count = (this.db.prepare(`SELECT COUNT(*) as c FROM privacy_grievances;`).get() as any).c + 1;
    const year = new Date().getFullYear();
    const ticketNumber = params.ticketNumber || `GRV-${year}-${String(count).padStart(4, "0")}`;
    const now = new Date();
    const createdAt = now.toISOString();

    const slaDays = params.slaDays || 90; // Default 90 days per DPDP Rules 2025
    const slaDeadline = new Date(now.getTime() + slaDays * 24 * 60 * 60 * 1000).toISOString();

    const stmt = this.db.prepare(`
      INSERT INTO privacy_grievances (
        id, ticket_number, complainant_name, complainant_contact, category,
        description, status, grievance_officer, sla_deadline, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, 'open', ?, ?, ?, ?
      )
    `);

    stmt.run(
      id,
      ticketNumber,
      params.complainantName,
      params.complainantContact,
      params.category,
      params.description,
      params.grievanceOfficer || "Grievance Redressal Officer",
      slaDeadline,
      createdAt,
      createdAt
    );

    return this.getById(id)!;
  }

  public getById(id: string): PrivacyGrievance | null {
    const stmt = this.db.prepare(`SELECT * FROM privacy_grievances WHERE id = ?;`);
    const row = stmt.get(id) as PrivacyGrievance | undefined;
    return row || null;
  }

  public getByTicket(ticketNumber: string): PrivacyGrievance | null {
    const stmt = this.db.prepare(`SELECT * FROM privacy_grievances WHERE ticket_number = ?;`);
    const row = stmt.get(ticketNumber) as PrivacyGrievance | undefined;
    return row || null;
  }

  public listAll(filter?: { status?: string; category?: string }): PrivacyGrievance[] {
    let sql = `SELECT * FROM privacy_grievances WHERE 1=1`;
    const params: any[] = [];

    if (filter?.status) {
      sql += ` AND status = ?`;
      params.push(filter.status);
    }
    if (filter?.category) {
      sql += ` AND category = ?`;
      params.push(filter.category);
    }

    sql += ` ORDER BY created_at DESC;`;
    return this.db.prepare(sql).all(...params) as PrivacyGrievance[];
  }

  public updateStatus(
    id: string,
    status: PrivacyGrievance["status"],
    resolutionNotes?: string
  ): PrivacyGrievance | null {
    const now = new Date().toISOString();
    const existing = this.getById(id);
    if (!existing) return null;

    const resolvedAt = (status === "resolved" || status === "dismissed") ? now : existing.resolved_at;

    this.db.prepare(`
      UPDATE privacy_grievances
      SET status = ?,
          resolution_notes = COALESCE(?, resolution_notes),
          resolved_at = ?,
          updated_at = ?
      WHERE id = ?;
    `).run(status, resolutionNotes || null, resolvedAt, now, id);

    return this.getById(id);
  }
}
