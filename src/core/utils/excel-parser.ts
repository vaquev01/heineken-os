import * as XLSX from 'xlsx';

export interface ParseResult<T> {
    data: T[];
    errors: string[];
}

export class ExcelParser {
    /**
     * Reads a file buffer and returns a workbook object.
     */
    static readWorkbook(buffer: ArrayBuffer): XLSX.WorkBook {
        return XLSX.read(buffer, { type: 'array' });
    }

    /**
     * Finds the header row index by looking for specific keywords (Anchor Columns).
     */
    static findHeaderRow(sheet: XLSX.WorkSheet, anchorKeywords: string[]): number {
        const range = XLSX.utils.decode_range(sheet['!ref'] || "A1:Z100");

        for (let R = range.s.r; R <= Math.min(range.e.r, 50); ++R) { // Search only top 50 rows
            const rowValues: string[] = [];
            for (let C = range.s.c; C <= range.e.c; ++C) {
                const cell = sheet[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell && cell.v) {
                    rowValues.push(String(cell.v).toLowerCase().trim());
                }
            }

            // Check if all anchor keywords are present in this row
            const isHeader = anchorKeywords.every(keyword =>
                rowValues.some(val => val.includes(keyword.toLowerCase()))
            );

            if (isHeader) return R;
        }

        return 0; // Default to first row if not found (fallback)
    }

    /**
     * Generic parser that converts a sheet to JSON starting from a specific header row.
     */
    static parseSheet<T>(sheet: XLSX.WorkSheet, headerRow: number, mapRow: (row: any) => T | null): T[] {
        const jsonData = XLSX.utils.sheet_to_json(sheet, { range: headerRow });
        const results: T[] = [];

        jsonData.forEach((row: any) => {
            try {
                const item = mapRow(row);
                if (item) results.push(item);
            } catch (e) {
                console.warn('Skipping row due to mapping error', e);
            }
        });

        return results;
    }
}
