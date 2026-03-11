"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, LogIn, Shield, User, Lock } from "lucide-react";

// Real users from hierarchy and verbas
import { ORG_HIERARCHY, getRoleDisplayName } from "@/core/auth/hierarchy";
import { VERBAS_RAW } from "@/core/data/conta-corrente";

// Get executivos reais from VERBAS_RAW
const EXECUTIVOS_REAIS = VERBAS_RAW
    .filter(v => v['Anos (MÊS)'] !== 'Rótulos de Linha' && v['Anos (MÊS)'] !== 'Total Geral' && typeof v['2025'] === 'number')
    .map(v => ({
        nome: String(v['Anos (MÊS)']),
        verba: v['2025'] as number
    }));

// Real users based on hierarchy + executivos
const REAL_USERS = [
    // Admin
    {
        email: "admin@heineken.com",
        password: "demo123",
        name: "Admin Nacional",
        role: "ADMIN",
        region: "Nacional",
        hierarchyId: "admin-nacional"
    },
    // Diretor
    {
        email: "diretor.nerjcono@heineken.com",
        password: "demo123",
        name: "Diretor NE/RJ/CO/NO",
        role: "DIRETOR_DIRETORIA",
        region: "NE/RJ/CO/NO",
        hierarchyId: "dir-nerjcono"
    },
    // Gerente Regional from real data
    {
        email: "gerente.pr@heineken.com",
        password: "demo123",
        name: "Gerente Regional PR",
        role: "GERENTE_REGIONAL",
        region: "PR",
        hierarchyId: "reg-pr"
    },
    // Executivos Reais do PR (from VERBAS_RAW)
    {
        email: "ariadne.garcia@heineken.com",
        password: "demo123",
        name: "Ariadne Garcia",
        role: "EXECUTIVO_UF",
        region: "PR",
        verba: EXECUTIVOS_REAIS.find(e => e.nome === "Ariadne Garcia")?.verba || 0
    },
    {
        email: "camila.vieira@heineken.com",
        password: "demo123",
        name: "Camila Vieira",
        role: "EXECUTIVO_UF",
        region: "PR",
        verba: EXECUTIVOS_REAIS.find(e => e.nome === "Camila Vieira")?.verba || 0
    },
    {
        email: "victor.vaqueiro@heineken.com",
        password: "demo123",
        name: "Victor Vaqueiro",
        role: "EXECUTIVO_UF",
        region: "PR",
        verba: EXECUTIVOS_REAIS.find(e => e.nome === "Victor Vaqueiro")?.verba || 0
    },
    {
        email: "fabiana.bollis@heineken.com",
        password: "demo123",
        name: "Fabiana Bollis",
        role: "EXECUTIVO_UF",
        region: "PR",
        verba: EXECUTIVOS_REAIS.find(e => e.nome === "Fabiana Bollis")?.verba || 0
    },
];

function formatCurrency(value: number): string {
    if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
    return `R$ ${value.toFixed(0)}`;
}

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedDemo, setSelectedDemo] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleDemoSelect = (value: string) => {
        setSelectedDemo(value);
        const user = REAL_USERS.find(u => u.email === value);
        if (user) {
            setEmail(user.email);
            setPassword(user.password);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        await new Promise(resolve => setTimeout(resolve, 800));

        const user = REAL_USERS.find(u => u.email === email && u.password === password);

        if (user) {
            localStorage.setItem("heineken_user", JSON.stringify({
                email: user.email,
                name: user.name,
                role: user.role,
                region: user.region,
                hierarchyId: user.hierarchyId,
                loggedInAt: new Date().toISOString(),
            }));
            router.push("/");
        } else {
            setError("Email ou senha inválidos");
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
                        <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Heineken OS</h1>
                    <p className="text-slate-400 mt-2">Sistema Operacional Off Trade</p>
                </div>

                {/* Login Card */}
                <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <LogIn className="h-5 w-5" /> Acessar Sistema
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            {REAL_USERS.length} usuários reais • Regional PR
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            {/* Demo User Selector - REAL USERS */}
                            <div className="p-3 bg-green-900/20 border border-green-900 rounded-lg mb-4">
                                <Label className="text-green-300 text-xs">👤 Usuários Reais (Hierarquia + Verbas PR)</Label>
                                <Select value={selectedDemo} onValueChange={handleDemoSelect}>
                                    <SelectTrigger className="mt-2 bg-slate-950 border-slate-700 text-white">
                                        <SelectValue placeholder="Selecione um usuário real..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REAL_USERS.map(user => (
                                            <SelectItem key={user.email} value={user.email}>
                                                <div className="flex items-center gap-2">
                                                    <span>{user.name}</span>
                                                    <span className="text-xs text-slate-500">
                                                        ({user.role === 'EXECUTIVO_UF' && user.verba ? formatCurrency(user.verba) : user.region})
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label className="text-white flex items-center gap-2">
                                    <User className="h-4 w-4" /> Email
                                </Label>
                                <Input
                                    type="email"
                                    placeholder="seu.email@heineken.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label className="text-white flex items-center gap-2">
                                    <Lock className="h-4 w-4" /> Senha
                                </Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-500"
                                    required
                                />
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-3 bg-red-900/20 border border-red-900 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle className="h-4 w-4" />
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                        Autenticando...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <LogIn className="h-4 w-4" /> Entrar
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 text-center text-xs text-slate-500">
                            <p>Executivos reais: Ariadne, Camila, Victor, Fabiana</p>
                            <p className="mt-1">Versão 2.0 • 100% Dados Reais</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
