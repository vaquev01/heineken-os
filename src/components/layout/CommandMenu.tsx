"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
    Search,
    LayoutDashboard,
    UploadCloud,
    FileText,
    Wallet,
    Settings,
    Building2,
    Users,
    Package
} from "lucide-react";
import { useDataStore } from "@/core/store/data-store";
import { ORG_HIERARCHY } from "@/core/auth/hierarchy";

export function CommandMenu() {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { products, priceTable } = useDataStore();

    // Redes únicas (clientes)
    const redes = Array.from(new Set(priceTable.map(p => p.rede))).sort().slice(0, 10); // max 10 for demo

    // SKUs únicos 
    const skus = Array.from(new Set(products.map(p => p.descricao))).sort().slice(0, 10);

    // Toggle the menu when ⌘K is pressed
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            {/* Background overlay click to close */}
            <div className="fixed inset-0" onClick={() => setOpen(false)} />

            <Command
                className="relative z-50 w-full max-w-[600px] overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-200"
                shouldFilter={true}
            >
                <div className="flex items-center border-b border-slate-800 px-3">
                    <Search className="mr-2 h-5 w-5 shrink-0 opacity-50 text-slate-400" />
                    <Command.Input
                        autoFocus
                        placeholder="Buscar SKUs, clientes, ou digitar um comando..."
                        className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
                    <Command.Empty className="py-6 text-center text-sm text-slate-500">
                        Nenhum resultado encontrado.
                    </Command.Empty>

                    <Command.Group heading="Módulos do Sistema" className="p-1 px-2 text-xs font-medium text-slate-500">
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/"))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-green-600 aria-selected:text-white data-[selected='true']:bg-green-600 data-[selected='true']:text-white text-slate-200 group transition-colors"
                        >
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard Executivo
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/negotiation"))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-green-600 aria-selected:text-white data-[selected='true']:bg-green-600 data-[selected='true']:text-white text-slate-200 group transition-colors"
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Simulador de Negociação
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/funds"))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-cyan-600 aria-selected:text-white data-[selected='true']:bg-cyan-600 data-[selected='true']:text-white text-slate-200 group transition-colors"
                        >
                            <Wallet className="mr-2 h-4 w-4" />
                            Governança de Fundos
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/upload"))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-purple-600 aria-selected:text-white data-[selected='true']:bg-purple-600 data-[selected='true']:text-white text-slate-200 group transition-colors"
                        >
                            <UploadCloud className="mr-2 h-4 w-4" />
                            Central de Upload
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/settings"))}
                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2.5 text-sm outline-none aria-selected:bg-slate-700 aria-selected:text-white data-[selected='true']:bg-slate-700 data-[selected='true']:text-white text-slate-200 group transition-colors"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Configurações & Hierarquia
                        </Command.Item>
                    </Command.Group>

                    {redes.length > 0 && (
                        <>
                            <div className="h-px bg-slate-800 my-1 mx-2" />
                            <Command.Group heading="Clientes (Redes)" className="p-1 px-2 text-xs font-medium text-amber-500/70">
                                {redes.map((rede) => (
                                    <Command.Item
                                        key={rede}
                                        onSelect={() => runCommand(() => router.push(`/negotiation`))} // Simplification for demo
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-slate-800 aria-selected:text-white data-[selected='true']:bg-slate-800 data-[selected='true']:text-white text-slate-300"
                                    >
                                        <Building2 className="mr-2 h-3.5 w-3.5 text-amber-500/70" />
                                        {rede}
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        </>
                    )}

                    {skus.length > 0 && (
                        <>
                            <div className="h-px bg-slate-800 my-1 mx-2" />
                            <Command.Group heading="Produtos (SKUs)" className="p-1 px-2 text-xs font-medium text-emerald-500/70">
                                {skus.map((sku) => (
                                    <Command.Item
                                        key={sku}
                                        onSelect={() => runCommand(() => router.push(`/negotiation`))} // Simplification for demo
                                        className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-slate-800 aria-selected:text-white data-[selected='true']:bg-slate-800 data-[selected='true']:text-white text-slate-300"
                                    >
                                        <Package className="mr-2 h-3.5 w-3.5 text-emerald-500/70" />
                                        {sku}
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        </>
                    )}

                    <div className="h-px bg-slate-800 my-1 mx-2" />
                    <Command.Group heading="Equipe" className="p-1 px-2 text-xs font-medium text-blue-500/70">
                        {ORG_HIERARCHY.map((user) => (
                            <Command.Item
                                key={user.id}
                                onSelect={() => runCommand(() => router.push("/settings"))}
                                className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-slate-800 aria-selected:text-white data-[selected='true']:bg-slate-800 data-[selected='true']:text-white text-slate-300"
                            >
                                <Users className="mr-2 h-3.5 w-3.5 text-blue-500/70" />
                                {user.name} ({user.scope})
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>
            </Command>
        </div>
    );
}
