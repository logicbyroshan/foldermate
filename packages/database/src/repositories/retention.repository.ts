import { IDatabase } from "../connection.js";

export interface RetentionPolicy {
  id: string;
  name: string;
  category: "inbox_staging" | "review_queue" | "organized_files" | "file_versions" | "audit_logs" | "exports";
  retention_days: number;
  action: "delete" | "archive" | "flag_for_review";
  justification: string;
  is_active: number;
  last_run_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRetentionPolicyParams {
  id?: string;
  name: string;
  category: "inbox_staging" | "review_queue" | "organized_files" | "file_versions" | "audit_logs" | "exports";
  retentionDays: number;
  action?: "delete" | "archive" | "flag_for_review";
  justification: string;
  isActive?: boolean;
}

export class RetentionRepository {
  constructor(private db: IDatabase) {}

  public create(params: CreateRetentionPolicyParams): RetentionPolicy {
    const id = params.id || crypto.randomUUID();
    const now = new Date().toISOString();
    const active = params.isActive !== false ? 1 : 0;

    const stmt = this.db.prepare(`
      INSERT INTO retention_policies (
        id, name, category, retention_days, action, justification, is_active, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      params.name,
      params.category,
      params.retentionDays,
      params.action || "delete",
      params.justification,
      active,
      now,
      now
    );

    return this.getById(id)!;
  }

  public getById(id: string): RetentionPolicy | null {
    const stmt = this.db.prepare(`SELECT * FROM retention_policies WHERE id = ?;`);
    const row = stmt.get(id) as RetentionPolicy | undefined;
    return row || null;
  }

  public listAll(activeOnly: boolean = false): RetentionPolicy[] {
    const sql = activeOnly
      ? `SELECT * FROM retention_policies WHERE is_active = 1 ORDER BY created_at ASC;`
      : `SELECT * FROM retention_policies ORDER BY created_at ASC;`;
    return this.db.prepare(sql).all() as RetentionPolicy[];
  }

  public updateLastRun(id: string): void {
    const now = new Date().toISOString();
    this.db.prepare(`
      UPDATE retention_policies
      SET last_run_at = ?, updated_at = ?
      WHERE id = ?;
    `).run(now, now, id);
  }

  public updatePolicy(id: string, params: Partial<CreateRetentionPolicyParams>): RetentionPolicy | null {
    const existing = this.getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const name = params.name ?? existing.name;
    const category = params.category ?? existing.category;
    const days = params.retentionDays ?? existing.retention_days;
    const action = params.action ?? existing.action;
    const just = params.justification ?? existing.justification;
    const active = params.isActive !== undefined ? (params.isActive ? 1 : 0) : existing.is_active;

    this.db.prepare(`
      UPDATE retention_policies
      SET name = ?, category = ?, retention_days = ?, action = ?, justification = ?, is_active = ?, updated_at = ?
      WHERE id = ?;
    `).run(name, category, days, action, just, active, now, id);

    return this.getById(id);
  }
}
