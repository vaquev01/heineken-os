import fs from 'fs/promises';
import path from 'path';

// Import default static data as fallback
import { PRODUCTS } from '../data/products';
import { CALENDAR } from '../data/calendar';
import { PRICE_TABLE_SAMPLE } from '../data/price-table';
import { FUNDOS, CONTA_CORRENTE_STATS } from '../data/conta-corrente';
import { FABRICAS, INVESTIMENTOS, CLIENTE_ASSAI } from '../data/simulador-assai';

const DATA_DIR = path.join(process.cwd(), 'current-data');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

export const StorageKeys = {
    PRODUCTS: 'products.json',
    CALENDAR: 'calendar.json',
    PRICE_TABLE: 'price-table.json',
    FUNDS: 'funds.json',
    SIMULATOR: 'simulator.json'
};

export async function saveData(key: string, data: any) {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, key);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getData(key: string) {
    try {
        await ensureDataDir();
        const filePath = path.join(DATA_DIR, key);
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return null; // Return null if file doesn't exist
    }
}

// Helper to get ALL data (merging static + dynamic)
export async function getAllData() {
    const products = await getData(StorageKeys.PRODUCTS) || PRODUCTS;
    const calendar = await getData(StorageKeys.CALENDAR) || CALENDAR;
    const priceTable = await getData(StorageKeys.PRICE_TABLE) || PRICE_TABLE_SAMPLE;

    // Complex objects
    const fundsData = await getData(StorageKeys.FUNDS);
    const funds = fundsData?.funds || FUNDOS;
    const fundsStats = fundsData?.stats || CONTA_CORRENTE_STATS;

    const simulatorData = await getData(StorageKeys.SIMULATOR);
    const fabricas = simulatorData?.fabricas || FABRICAS;
    const investimentos = simulatorData?.investimentos || INVESTIMENTOS;
    const cliente = simulatorData?.cliente || CLIENTE_ASSAI;

    return {
        products,
        calendar,
        priceTable,
        contaCorrente: {
            funds,
            stats: fundsStats
        },
        simulator: {
            fabricas,
            investimentos,
            cliente
        }
    };
}
