/**
 * AUDIT LEDGER - Sistema de Rastreabilidade
 * ==========================================
 * Toda alteração no sistema é registrada aqui para garantir
 * "confiabilidade extrema" conforme solicitado.
 */

export enum AuditAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    INGEST = 'INGEST',
    EXPORT = 'EXPORT',
    APPROVE = 'APPROVE',
    REJECT = 'REJECT',
}

export interface AuditEntry {
    id: string;
    timestamp: Date;
    userId: string;
    userName: string;
    action: AuditAction;
    entityType: string; // e.g., 'Proposal', 'Fund', 'CalendarRule'
    entityId: string;
    entityName?: string;
    changes: {
        field: string;
        oldValue: any;
        newValue: any;
    }[];
    metadata?: Record<string, any>;
}

// In-memory store for MVP (will be replaced with DB)
const auditLog: AuditEntry[] = [];

export class AuditService {
    static log(entry: Omit<AuditEntry, 'id' | 'timestamp'>): AuditEntry {
        const fullEntry: AuditEntry = {
            ...entry,
            id: crypto.randomUUID(),
            timestamp: new Date(),
        };

        auditLog.push(fullEntry);
        console.log(`[AUDIT] ${entry.action} on ${entry.entityType}/${entry.entityId} by ${entry.userName}`);

        return fullEntry;
    }

    static getHistory(entityType: string, entityId: string): AuditEntry[] {
        return auditLog.filter(e => e.entityType === entityType && e.entityId === entityId);
    }

    static getAll(): AuditEntry[] {
        return [...auditLog];
    }

    static getByUser(userId: string): AuditEntry[] {
        return auditLog.filter(e => e.userId === userId);
    }

    static clear() {
        auditLog.length = 0;
    }
}
