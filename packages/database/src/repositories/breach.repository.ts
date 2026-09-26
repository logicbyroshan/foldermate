import { IDatabase } from "../connection.js";

export interface DataBreachIncident {
  id: string;
  incident_number: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  nature_and_scope: string;
  affected_data_categories: string; // JSON array of strings
  estimated_affected_principals: number;
  status: "detected" | "triaged" | "contained" | "remediated" | "closed";
  containment_actions?: string | null;
  dpbi_notified: number;
  dpbi_notified_at?: string | null;
  principals_notified: number;
  principals_notified_at?: string | null;
  remediation_notes?: string | null;
  detected_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBreachParams {
  id?: string;
  incidentNumber?: string;
  title: string;
  severity?: "low" | "medium" | "high" | "critical";
  natureAndScope: string;
  affectedDataCategories?: string[];
  estimatedAffectedPrincipals?: number;
  status?: "detected" | "triaged" | "contained" | "remediated" | "closed";
  containmentActions?: string;
}

export class BreachRepository {
  constructor(private db: IDatabase) {}

  public create(params: CreateBreachParams): DataBreachIncident {
    const id = params.id || crypto.randomUUID();
    const count = (this.db.prepare(`SELECT COUNT(*) as c FROM data_breach_incidents;`).get() as any).c + 1;
    const year = new Date().getFullYear();
    const incidentNumber = params.incidentNumber || `INC-${year}-${String(count).padStart(4, "0")}`;
    const now = new Date().toISOString();
    const categoriesJson = JSON.stringify(params.affectedDataCategories || []);

    const stmt = this.db.prepare(`
      INSERT INTO data_breach_incidents (
        id, incident_number, title, severity, nature_and_scope,
        affected_data_categories, estimated_affected_principals, status,
        containment_actions, detected_at, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?
      )
    `);

    stmt.run(
      id,
      incidentNumber,
      params.title,
      params.severity || "medium",
      params.natureAndScope,
      categoriesJson,
      params.estimatedAffectedPrincipals || 0,
      params.status || "detected",
      params.containmentActions || null,
      now,
      now,
      now
    );

    return this.getById(id)!;
  }

  public getById(id: string): DataBreachIncident | null {
    const stmt = this.db.prepare(`SELECT * FROM data_breach_incidents WHERE id = ?;`);
    const row = stmt.get(id) as DataBreachIncident | undefined;
    return row || null;
  }

  public getByNumber(incidentNumber: string): DataBreachIncident | null {
    const stmt = this.db.prepare(`SELECT * FROM data_breach_incidents WHERE incident_number = ?;`);
    const row = stmt.get(incidentNumber) as DataBreachIncident | undefined;
    return row || null;
  }

  public listAll(filter?: { status?: string; severity?: string }): DataBreachIncident[] {
    let sql = `SELECT * FROM data_breach_incidents WHERE 1=1`;
    const params: any[] = [];

    if (filter?.status) {
      sql += ` AND status = ?`;
      params.push(filter.status);
    }
    if (filter?.severity) {
      sql += ` AND severity = ?`;
      params.push(filter.severity);
    }

    sql += ` ORDER BY created_at DESC;`;
    return this.db.prepare(sql).all(...params) as DataBreachIncident[];
  }

  public updateStatus(
    id: string,
    status: DataBreachIncident["status"],
    notes?: { containmentActions?: string; remediationNotes?: string }
  ): DataBreachIncident | null {
    const now = new Date().toISOString();
    const existing = this.getById(id);
    if (!existing) return null;

    const containment = notes?.containmentActions ?? existing.containment_actions;
    const remediation = notes?.remediationNotes ?? existing.remediation_notes;

    this.db.prepare(`
      UPDATE data_breach_incidents
      SET status = ?,
          containment_actions = ?,
          remediation_notes = ?,
          updated_at = ?
      WHERE id = ?;
    `).run(status, containment, remediation, now, id);

    return this.getById(id);
  }

  public markNotified(id: string, target: "dpbi" | "principals"): DataBreachIncident | null {
    const now = new Date().toISOString();
    if (target === "dpbi") {
      this.db.prepare(`
        UPDATE data_breach_incidents
        SET dpbi_notified = 1, dpbi_notified_at = ?, updated_at = ?
        WHERE id = ?;
      `).run(now, now, id);
    } else {
      this.db.prepare(`
        UPDATE data_breach_incidents
        SET principals_notified = 1, principals_notified_at = ?, updated_at = ?
        WHERE id = ?;
      `).run(now, now, id);
    }
    return this.getById(id);
  }
}
