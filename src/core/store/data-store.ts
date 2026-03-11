import { create } from 'zustand';
import { Product } from '../data/products';
import { CalendarEntry } from '../data/calendar';
import { PriceEntry } from '../data/price-table';
import { Fundo } from '../data/conta-corrente';
import { Fabrica } from '../data/simulador-assai';

interface DataState {
    products: Product[];
    calendar: CalendarEntry[];
    priceTable: PriceEntry[];
    contaCorrente: {
        funds: Fundo[];
        stats: any;
    };
    simulator: {
        fabricas: Fabrica[];
        investimentos: any[];
        cliente: any;
    };
    isLoading: boolean;
    lastUpdated: Date | null;

    // Actions
    fetchData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set) => ({
    products: [],
    calendar: [],
    priceTable: [],
    contaCorrente: { funds: [], stats: {} },
    simulator: { fabricas: [], investimentos: [], cliente: {} },
    isLoading: true,
    lastUpdated: null,

    fetchData: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch('/api/data');
            const result = await response.json();

            if (result.success) {
                set({
                    products: result.data.products,
                    calendar: result.data.calendar,
                    priceTable: result.data.priceTable,
                    contaCorrente: result.data.contaCorrente,
                    simulator: result.data.simulator,
                    lastUpdated: new Date(),
                    isLoading: false
                });
            } else {
                console.error('Failed to load data:', result.error);
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            set({ isLoading: false });
        }
    }
}));
