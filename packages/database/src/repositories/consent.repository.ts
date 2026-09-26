import { IDatabase } from "../connection.js";

export interface ConsentRecord {
  id: string;
  principal_id: string;
  principal_type: string;
  principal_name: string;
  principal_contact?: string | null;
  purpose_id: string;
  purpose_description: string;
  status: "granted" | "withdrawn" | "expired";
  notice_version: string;
  lawful_basis: string;
  is_child_data: number;
  parental_consent_verified: number;
  parent_guardian_identifier?: string | null;
  metadata_json?: string | null;
  granted_at: string;
  withdrawn_at?: string | null;
  expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateConsentParams {
  id?: string;
  principalId: string;
  principalType?: string;
  principalName: string;
  principalContact?: string;
  purposeId: string;
  purposeDescription: string;
  status?: "granted" | "withdrawn" | "expired";
  noticeVersion?: string;
  lawfulBasis?: string;
  isChildData?: boolean;
  parentalConsentVerified?: boolean;
  parentGuardianIdentifier?: string;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
}

export class ConsentRepository {
  constructor(private db: IDatabase) {}

  public create(params: CreateConsentParams): ConsentRecord {
    const id = params.id || crypto.randomUUID();
    const now = new Date().toISOString();
    const isChild = params.isChildData ? 1 : 0;
    const parentVerified = params.parentalConsentVerified ? 1 : 0;
    const meta = JSON.stringify(params.metadata || {});

    const stmt = this.db.prepare(`
      INSERT INTO consent_records (
        id, principal_id, principal_type, principal_name, principal_contact,
        purpose_id, purpose_description, status, notice_version, lawful_basis,
        is_child_data, parental_consent_verified, parent_guardian_identifier,
        metadata_json, granted_at, expires_at, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?, ?
      )
    `);

    stmt.run(
      id,
      params.principalId,
      params.principalType || "client",
      params.principalName,
      params.principalContact || null,
      params.purposeId,
      params.purposeDescription,
      params.status || "granted",
      params.noticeVersion || "v1.0",
      params.lawfulBasis || "consent",
      isChild,
      parentVerified,
      params.parentGuardianIdentifier || null,
      meta,
      now,
      params.expiresAt || null,
      now,
      now
    );

    return this.getById(id)!;
  }

  public getById(id: string): ConsentRecord | null {
    const stmt = this.db.prepare(`SELECT * FROM consent_records WHERE id = ?;`);
    const row = stmt.get(id) as ConsentRecord | undefined;
    return row || null;
  }

  public listByPrincipal(principalId: string): ConsentRecord[] {
    const stmt = this.db.prepare(`
      SELECT * FROM consent_records
      WHERE principal_id = ?
      ORDER BY created_at DESC;
    `);
    return stmt.all(principalId) as ConsentRecord[];
  }

  public listAll(filter?: { status?: string; purposeId?: string; isChildData?: boolean; principalId?: string }): ConsentRecord[] {
    let sql = `SELECT * FROM consent_records WHERE 1=1`;
    const params: any[] = [];

    if (filter?.principalId) {
      sql += ` AND principal_id = ?`;
      params.push(filter.principalId);
    }
    if (filter?.status) {
      sql += ` AND status = ?`;
      params.push(filter.status);
    }
    if (filter?.purposeId) {
      sql += ` AND purpose_id = ?`;
      params.push(filter.purposeId);
    }
    if (filter?.isChildData !== undefined) {
      sql += ` AND is_child_data = ?`;
      params.push(filter.isChildData ? 1 : 0);
    }

    sql += ` ORDER BY created_at DESC;`;
    return this.db.prepare(sql).all(...params) as ConsentRecord[];
  }


  public withdraw(id: string, reason?: string): ConsentRecord | null {
    const now = new Date().toISOString();
    const existing = this.getById(id);
    if (!existing) return null;

    let meta: Record<string, unknown> = {};
    try {
      meta = existing.metadata_json ? JSON.parse(existing.metadata_json) : {};
    } catch {}
    if (reason) {
      meta.withdrawalReason = reason;
    }

    this.db.prepare(`
      UPDATE consent_records
      SET status = 'withdrawn',
          withdrawn_at = ?,
          metadata_json = ?,
          updated_at = ?
      WHERE id = ?;
    `).run(now, JSON.stringify(meta), now, id);

    return this.getById(id);
  }

  public withdrawByPrincipalAndPurpose(principalId: string, purposeId: string, reason?: string): number {
    const records = this.listByPrincipal(principalId).filter(
      (r) => r.purpose_id === purposeId && r.status === "granted"
    );
    for (const r of records) {
      this.withdraw(r.id, reason);
    }
    return records.length;
  }
}
