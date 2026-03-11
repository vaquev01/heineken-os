/**
 * DATA LINEAGE SERVICE
 * ====================
 * Rastreia a origem de cada número no sistema.
 * "Todo R$ precisa ter uma fonte identificável."
 */

export interface DataSource {
    type: 'CALENDAR' | 'FUND' | 'CONTRACT' | 'MANUAL' | 'INGEST';
    sourceId: string; // ID do arquivo/versão/regra
    sourceName: string;
    ingestBatchId?: string;
    version?: number;
    timestamp: Date;
}

export interface LineageRecord {
    valueId: string; // ID único do valor rastreado
    entityType: string; // Proposal, ProposalItem, etc.
    entityId: string;
    field: string; // Campo específico (e.g., 'verba_gerada')
    value: number;
    sources: DataSource[];
    formula?: string; // Fórmula usada para calcular (opcional)
}

const lineageStore: Map<string, LineageRecord> = new Map();

export class DataLineageService {

    /**
     * Registra a origem de um valor calculado.
     */
    static track(record: Omit<LineageRecord, 'valueId'>): LineageRecord {
        const valueId = `${record.entityType}:${record.entityId}:${record.field}`;
        const fullRecord: LineageRecord = {
            ...record,
            valueId,
        };

        lineageStore.set(valueId, fullRecord);
        return fullRecord;
    }

    /**
     * Recupera a origem de um valor.
     */
    static getLineage(entityType: string, entityId: string, field: string): LineageRecord | undefined {
        const key = `${entityType}:${entityId}:${field}`;
        return lineageStore.get(key);
    }

    /**
     * Explica de onde veio um número (para UI).
     */
    static explain(entityType: string, entityId: string, field: string): string {
        const record = this.getLineage(entityType, entityId, field);

        if (!record) {
            return '⚠️ Origem não rastreada';
        }

        const sourceDescriptions = record.sources.map(s => {
            switch (s.type) {
                case 'CALENDAR':
                    return `📅 Calendário (${s.sourceName}, v${s.version || 1})`;
                case 'FUND':
                    return `💰 Fundo (${s.sourceName})`;
                case 'CONTRACT':
                    return `📄 Contrato (${s.sourceName})`;
                case 'INGEST':
                    return `📥 Ingestão (${s.sourceName})`;
                default:
                    return `✏️ Manual`;
            }
        });

        let explanation = `**Valor:** R$ ${record.value.toLocaleString('pt-BR')}\n`;
        explanation += `**Fontes:** ${sourceDescriptions.join(' + ')}\n`;

        if (record.formula) {
            explanation += `**Fórmula:** \`${record.formula}\``;
        }

        return explanation;
    }
}
