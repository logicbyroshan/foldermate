import { IDatabase } from "../connection.js";

export interface DSRRequest {
  id: string;
  request_number: string;
  principal_id: string;
  principal_name: string;
  principal_contact: string;
  request_type: "access" | "correction" | "erasure" | "grievance" | "nomination";
  status: "received" | "identity_verified" | "in_progress" | "completed" | "rejected";
  details: string;
  correction_payload_json?: string | null;
  nominee_payload_json?: string | null;
  resolution_summary?: string | null;
  rejection_reason?: string | null;
  assigned_to: string;
  due_date: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDSRParams {
  id?: string;
  requestNumber?: string;
  principalId: string;
  principalName: string;
  principalContact: string;
  requestType: "access" | "correction" | "erasure" | "grievance" | "nomination";
  details: string;
  correctionPayload?: Record<string, unknown>;
  nomineePayload?: Record<string, unknown>;
  assignedTo?: string;
  daysToResolve?: number;
}

export class DSRRepository {
  constructor(private db: IDatabase) {}

  public create(params: CreateDSRParams): DSRRequest {
    const id = params.id || crypto.randomUUID();
    const count = (this.db.prepare(`SELECT COUNT(*) as c FROM dsr_requests;`).get() as any).c + 1;
    const year = new Date().getFullYear();
    const requestNumber = params.requestNumber || `DSR-${year}-${String(count).padStart(4, "0")}`;
    const now = new Date();
    const createdAt = now.toISOString();

    const days = params.daysToResolve || (params.requestType === "grievance" ? 90 : 30);
    const dueDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();

    const corrJson = params.correctionPayload ? JSON.stringify(params.correctionPayload) : null;
    const nomJson = params.nomineePayload ? JSON.stringify(params.nomineePayload) : null;

    const stmt = this.db.prepare(`
      INSERT INTO dsr_requests (
        id, request_number, principal_id, principal_name, principal_contact,
        request_type, status, details, correction_payload_json, nominee_payload_json,
        assigned_to, due_date, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, 'received', ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    stmt.run(
      id,
      requestNumber,
      params.principalId,
      params.principalName,
      params.principalContact,
      params.requestType,
      params.details,
      corrJson,
      nomJson,
      params.assignedTo || "Privacy Officer",
      dueDate,
      createdAt,
      createdAt
    );

    return this.getById(id)!;
  }

  public getById(id: string): DSRRequest | null {
    const stmt = this.db.prepare(`SELECT * FROM dsr_requests WHERE id = ?;`);
    const row = stmt.get(id) as DSRRequest | undefined;
    return row || null;
  }

  public getByNumber(requestNumber: string): DSRRequest | null {
    const stmt = this.db.prepare(`SELECT * FROM dsr_requests WHERE request_number = ?;`);
    const row = stmt.get(requestNumber) as DSRRequest | undefined;
    return row || null;
  }

  public listAll(filter?: { status?: string; requestType?: string; principalId?: string }): DSRRequest[] {
    let sql = `SELECT * FROM dsr_requests WHERE 1=1`;
    const params: any[] = [];

    if (filter?.status) {
      sql += ` AND status = ?`;
      params.push(filter.status);
    }
    if (filter?.requestType) {
      sql += ` AND request_type = ?`;
      params.push(filter.requestType);
    }
    if (filter?.principalId) {
      sql += ` AND principal_id = ?`;
      params.push(filter.principalId);
    }

    sql += ` ORDER BY created_at DESC;`;
    return this.db.prepare(sql).all(...params) as DSRRequest[];
  }

  public updateStatus(
    id: string,
    status: DSRRequest["status"],
    summaryOrReason?: string
  ): DSRRequest | null {
    const now = new Date().toISOString();
    const existing = this.getById(id);
    if (!existing) return null;

    let resSummary = existing.resolution_summary;
    let rejReason = existing.rejection_reason;
    let completedAt = existing.completed_at;

    if (status === "completed") {
      resSummary = summaryOrReason || "Request completed successfully.";
      completedAt = now;
    } else if (status === "rejected") {
      rejReason = summaryOrReason || "Request rejected.";
      completedAt = now;
    }

    this.db.prepare(`
      UPDATE dsr_requests
      SET status = ?,
          resolution_summary = ?,
          rejection_reason = ?,
          completed_at = ?,
          updated_at = ?
      WHERE id = ?;
    `).run(status, resSummary, rejReason, completedAt, now, id);

    return this.getById(id);
  }
}
