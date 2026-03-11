"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Settings,
    User,
    Shield,
    Database,
    Bell,
    Palette,
    Activity,
    Check,
    X,
    Users,
    Key,
    Save,
    ChevronRight,
    ChevronDown,
    Building2,
    MapPin,
    Eye,
    EyeOff
} from "lucide-react";
import {
    ORG_HIERARCHY,
    OrgNode,
    getUserById,
    getDescendantIds,
    getRoleDisplayName,
    RoleLevel
} from "@/core/auth/hierarchy";
import { cn } from "@/lib/utils";

// Recursive component to render org tree
function OrgTreeNode({
    node,
    depth = 0,
    currentUserId,
    expandedNodes,
    toggleExpand
}: {
    node: OrgNode;
    depth?: number;
    currentUserId: string;
    expandedNodes: Set<string>;
    toggleExpand: (id: string) => void;
}) {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const isCurrentUser = node.id === currentUserId;
    const visibleToCurrentUser = getDescendantIds(currentUserId).includes(node.id) || node.id === currentUserId;

    const children = node.children
        .map(childId => getUserById(childId))
        .filter(Boolean) as OrgNode[];

    const roleColors: Record<string, string> = {
        DIRETOR_DIRETORIA: "bg-purple-900 text-purple-300 border-purple-700",
        GERENTE_REGIONAL: "bg-blue-900 text-blue-300 border-blue-700",
        EXECUTIVO_UF: "bg-green-900 text-green-300 border-green-700",
        ADMIN: "bg-red-900 text-red-300 border-red-700",
    };

    return (
        <div className="select-none">
            <div
                className={cn(
                    "flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer",
                    "hover:bg-slate-800/50",
                    isCurrentUser && "bg-green-900/30 border border-green-700",
                    !visibleToCurrentUser && "opacity-40"
                )}
                style={{ marginLeft: `${depth * 24}px` }}
                onClick={() => hasChildren && toggleExpand(node.id)}
            >
                {/* Expand/Collapse Icon */}
                <div className="w-5">
                    {hasChildren && (
                        isExpanded
                            ? <ChevronDown className="h-4 w-4 text-slate-500" />
                            : <ChevronRight className="h-4 w-4 text-slate-500" />
                    )}
                </div>

                {/* User Icon */}
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    node.roleLevel === RoleLevel.DIRETOR_DIRETORIA && "bg-purple-600",
                    node.roleLevel === RoleLevel.GERENTE_REGIONAL && "bg-blue-600",
                    node.roleLevel === RoleLevel.EXECUTIVO_UF && "bg-green-600",
                )}>
                    {node.roleLevel === RoleLevel.DIRETOR_DIRETORIA && <Building2 className="h-4 w-4 text-white" />}
                    {node.roleLevel === RoleLevel.GERENTE_REGIONAL && <MapPin className="h-4 w-4 text-white" />}
                    {node.roleLevel === RoleLevel.EXECUTIVO_UF && <User className="h-4 w-4 text-white" />}
                </div>

                {/* User Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className={cn("font-medium", isCurrentUser ? "text-green-400" : "text-white")}>
                            {node.name}
                        </span>
                        {isCurrentUser && (
                            <Badge className="bg-green-700 text-green-100 text-xs">Você</Badge>
                        )}
                    </div>
                    <div className="text-xs text-slate-500">{node.scope}</div>
                </div>

                {/* Role Badge */}
                <Badge variant="outline" className={cn("text-xs", roleColors[node.role])}>
                    {getRoleDisplayName(node.role)}
                </Badge>

                {/* Visibility Indicator */}
                <div className="w-8 flex justify-center">
                    {visibleToCurrentUser ? (
                        <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                        <EyeOff className="h-4 w-4 text-red-500" />
                    )}
                </div>
            </div>

            {/* Children */}
            {isExpanded && children.length > 0 && (
                <div className="border-l border-slate-800 ml-4">
                    {children.map(child => (
                        <OrgTreeNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            currentUserId={currentUserId}
                            expandedNodes={expandedNodes}
                            toggleExpand={toggleExpand}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("hierarchy");
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [autoBackup, setAutoBackup] = useState(true);

    // Current logged in user (for demo - would come from auth context)
    const [currentUserId, setCurrentUserId] = useState("gerente-sp-001");
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["diretor-001", "gerente-sp-001"]));

    const toggleExpand = (id: string) => {
        setExpandedNodes(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const currentUser = getUserById(currentUserId);
    const visibleUsers = useMemo(() => {
        const descendants = getDescendantIds(currentUserId);
        return [currentUserId, ...descendants];
    }, [currentUserId]);

    // Root node for the tree
    const rootNode = ORG_HIERARCHY.find(n => n.parentId === null);

    const tabs = [
        { id: "hierarchy", label: "Hierarquia", icon: <Users className="h-4 w-4" /> },
        { id: "profile", label: "Perfil", icon: <User className="h-4 w-4" /> },
        { id: "security", label: "Segurança", icon: <Shield className="h-4 w-4" /> },
        { id: "system", label: "Sistema", icon: <Database className="h-4 w-4" /> },
        { id: "notifications", label: "Notificações", icon: <Bell className="h-4 w-4" /> },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Configurações</h2>
                <p className="text-slate-400">Gerencie seu perfil, permissões e preferências do sistema.</p>
            </div>

            <div className="flex gap-6">
                {/* Sidebar Tabs */}
                <div className="w-64 space-y-1">
                    {tabs.map(tab => (
                        <Button
                            key={tab.id}
                            variant={activeTab === tab.id ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-2 ${activeTab === tab.id
                                ? "bg-green-900/50 text-green-400"
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === "hierarchy" && (
                        <div className="space-y-4">
                            {/* Info Banner */}
                            <div className="p-4 bg-blue-900/20 border border-blue-900 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-blue-300">Visibilidade Hierárquica Estrita</p>
                                        <p className="text-sm text-slate-400 mt-1">
                                            Cada usuário vê <strong>apenas seus subordinados diretos e indiretos</strong>.
                                            Não há visibilidade lateral (entre equipes) ou para cima (para gestores de outras áreas).
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Demo User Selector */}
                            <Card className="bg-slate-900/50 border-slate-800">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-white text-sm">🎮 Simular Visão de Usuário</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {ORG_HIERARCHY.map(user => (
                                            <Button
                                                key={user.id}
                                                variant={currentUserId === user.id ? "default" : "outline"}
                                                size="sm"
                                                className={cn(
                                                    currentUserId === user.id
                                                        ? "bg-green-600 text-white"
                                                        : "border-slate-700 text-slate-400 hover:text-white"
                                                )}
                                                onClick={() => setCurrentUserId(user.id)}
                                            >
                                                {user.name} ({user.scope})
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Current User Scope */}
                            <Card className="bg-slate-900/50 border-slate-800">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-white">Organograma & Visibilidade</CardTitle>
                                            <CardDescription className="text-slate-400">
                                                Vendo como: <span className="text-green-400 font-medium">{currentUser?.name}</span> ({currentUser?.scope})
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-400">{visibleUsers.length}</div>
                                            <div className="text-xs text-slate-500">usuários visíveis</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Legend */}
                                    <div className="flex gap-4 mb-4 text-xs">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3 w-3 text-green-500" /> Pode ver
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <EyeOff className="h-3 w-3 text-red-500" /> Não pode ver
                                        </div>
                                    </div>

                                    {/* Org Tree */}
                                    <div className="bg-slate-950 rounded-lg p-4 max-h-[400px] overflow-auto">
                                        {rootNode && (
                                            <OrgTreeNode
                                                node={rootNode}
                                                currentUserId={currentUserId}
                                                expandedNodes={expandedNodes}
                                                toggleExpand={toggleExpand}
                                            />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Visible Users Table */}
                            <Card className="bg-slate-900/50 border-slate-800">
                                <CardHeader>
                                    <CardTitle className="text-white text-sm">Dados Visíveis para {currentUser?.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-slate-800">
                                                <TableHead className="text-white">Usuário</TableHead>
                                                <TableHead className="text-white">Escopo</TableHead>
                                                <TableHead className="text-white">Relação</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visibleUsers.map(userId => {
                                                const user = getUserById(userId);
                                                if (!user) return null;
                                                const relation = userId === currentUserId ? "Próprio" : "Subordinado";
                                                return (
                                                    <TableRow key={userId} className="border-slate-800">
                                                        <TableCell className="text-slate-200 font-medium">{user.name}</TableCell>
                                                        <TableCell className="text-slate-400">{user.scope}</TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline" className={cn(
                                                                relation === "Próprio"
                                                                    ? "border-green-700 text-green-400"
                                                                    : "border-blue-700 text-blue-400"
                                                            )}>
                                                                {relation}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeTab === "profile" && (
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Seu Perfil</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Informações da sua conta e preferências pessoais.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-white">Nome Completo</Label>
                                        <Input defaultValue={currentUser?.name} className="bg-slate-950 border-slate-700 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white">Email</Label>
                                        <Input defaultValue={currentUser?.email} className="bg-slate-950 border-slate-700 text-white" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white">Cargo</Label>
                                        <Input defaultValue={currentUser ? getRoleDisplayName(currentUser.role) : ''} className="bg-slate-950 border-slate-700 text-white" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-white">Região/Escopo</Label>
                                        <Input defaultValue={currentUser?.scope} className="bg-slate-950 border-slate-700 text-white" disabled />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button className="bg-green-600 hover:bg-green-700">
                                        <Save className="mr-2 h-4 w-4" /> Salvar Alterações
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "security" && (
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Segurança</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Configurações de autenticação e controle de acesso.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Key className="h-5 w-5 text-yellow-500" />
                                        <div>
                                            <p className="text-white font-medium">Alterar Senha</p>
                                            <p className="text-slate-400 text-sm">Última alteração há 30 dias</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-700">
                                        Alterar
                                    </Button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="text-white font-medium">Autenticação em 2 Fatores</p>
                                            <p className="text-slate-400 text-sm">Adicione uma camada extra de segurança</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-yellow-900 text-yellow-300">Em breve</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "system" && (
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Preferências do Sistema</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Configurações gerais e aparência.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Palette className="h-5 w-5 text-purple-500" />
                                        <div>
                                            <p className="text-white font-medium">Modo Escuro</p>
                                            <p className="text-slate-400 text-sm">Interface com tema dark</p>
                                        </div>
                                    </div>
                                    <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Database className="h-5 w-5 text-blue-500" />
                                        <div>
                                            <p className="text-white font-medium">Backup Automático</p>
                                            <p className="text-slate-400 text-sm">Salvar dados diariamente</p>
                                        </div>
                                    </div>
                                    <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Activity className="h-5 w-5 text-green-500" />
                                        <div>
                                            <p className="text-white font-medium">Logs de Auditoria</p>
                                            <p className="text-slate-400 text-sm">Registrar todas as ações</p>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-900 text-green-300">Ativo</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "notifications" && (
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white">Notificações</CardTitle>
                                <CardDescription className="text-slate-400">
                                    Configure como deseja receber alertas.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Alertas de Verba</p>
                                        <p className="text-slate-400 text-sm">Notificar quando saldo estiver baixo</p>
                                    </div>
                                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Novos Uploads</p>
                                        <p className="text-slate-400 text-sm">Notificar quando arquivos forem processados</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-medium">Propostas Pendentes</p>
                                        <p className="text-slate-400 text-sm">Lembrar de propostas aguardando aprovação</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
