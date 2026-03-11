/**
 * REAL ORGANIZATIONAL HIERARCHY - from Calendário Jan+Fev'26
 * Based on actual Heineken organizational structure
 */

export enum RoleLevel {
  EXECUTIVO_UF = 1,
  GERENTE_REGIONAL = 2,
  DIRETOR_DIRETORIA = 3,
  ADMIN = 99,
}

export interface OrgNode {
  id: string;
  name: string;
  email: string;
  role: keyof typeof RoleLevel;
  roleLevel: RoleLevel;
  scope: string;
  parentId: string | null;
  children: string[];
}

// Real Diretorias from Calendário
export const DIRETORIAS = ["NE/RJ/CO/NO", "C-STORE", "SUL/SUD/MG"];

// Real Regionais from Calendário
export const REGIONAIS = ["CO", "C-STORE", "MG", "NE I", "NE II", "PR", "RJ+ES", "RS", "SC", "SPC", "SPI"];

// Real UFs from Calendário
export const UFS = ["GO", "MT", "DF", "TO", "RJ", "PR", "SP", "RS", "MG", "BA", "AL", "PE", "SE", "PI", "MA", "ES", "SC", "MS"];

// Full hierarchy based on real data
export const ORG_HIERARCHY: OrgNode[] = [
  // ============ ADMIN (Nacional) ============
  {
    id: "admin-nacional",
    name: "Admin Nacional",
    email: "admin@heineken.com",
    role: "ADMIN",
    roleLevel: RoleLevel.ADMIN,
    scope: "Nacional",
    parentId: null,
    children: ["dir-nerjcono", "dir-cstore", "dir-sulsudmg"],
  },

  // ============ DIRETORIA NE/RJ/CO/NO ============
  {
    id: "dir-nerjcono",
    name: "Diretor NE/RJ/CO/NO",
    email: "diretor.nerjcono@heineken.com",
    role: "DIRETOR_DIRETORIA",
    roleLevel: RoleLevel.DIRETOR_DIRETORIA,
    scope: "NE/RJ/CO/NO",
    parentId: "admin-nacional",
    children: ["reg-co", "reg-nei", "reg-neii", "reg-rjes"],
  },
  // Gerentes Regionais NE/RJ/CO/NO
  {
    id: "reg-co",
    name: "Gerente Regional CO",
    email: "gerente.co@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "CO",
    parentId: "dir-nerjcono",
    children: ["exec-go", "exec-mt", "exec-df", "exec-to", "exec-ms"],
  },
  {
    id: "reg-nei",
    name: "Gerente Regional NE I",
    email: "gerente.nei@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "NE I",
    parentId: "dir-nerjcono",
    children: ["exec-ba", "exec-se"],
  },
  {
    id: "reg-neii",
    name: "Gerente Regional NE II",
    email: "gerente.neii@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "NE II",
    parentId: "dir-nerjcono",
    children: ["exec-al", "exec-pe", "exec-pi", "exec-ma"],
  },
  {
    id: "reg-rjes",
    name: "Gerente Regional RJ+ES",
    email: "gerente.rjes@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "RJ+ES",
    parentId: "dir-nerjcono",
    children: ["exec-rj", "exec-es"],
  },

  // ============ DIRETORIA C-STORE ============
  {
    id: "dir-cstore",
    name: "Diretor C-STORE",
    email: "diretor.cstore@heineken.com",
    role: "DIRETOR_DIRETORIA",
    roleLevel: RoleLevel.DIRETOR_DIRETORIA,
    scope: "C-STORE",
    parentId: "admin-nacional",
    children: ["reg-cstore"],
  },
  {
    id: "reg-cstore",
    name: "Gerente C-STORE Nacional",
    email: "gerente.cstore@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "C-STORE",
    parentId: "dir-cstore",
    children: ["exec-cstore-sp", "exec-cstore-rj"],
  },

  // ============ DIRETORIA SUL/SUD/MG ============
  {
    id: "dir-sulsudmg",
    name: "Diretor SUL/SUD/MG",
    email: "diretor.sulsudmg@heineken.com",
    role: "DIRETOR_DIRETORIA",
    roleLevel: RoleLevel.DIRETOR_DIRETORIA,
    scope: "SUL/SUD/MG",
    parentId: "admin-nacional",
    children: ["reg-mg", "reg-pr", "reg-rs", "reg-sc", "reg-spc", "reg-spi"],
  },
  {
    id: "reg-mg",
    name: "Gerente Regional MG",
    email: "gerente.mg@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "MG",
    parentId: "dir-sulsudmg",
    children: ["exec-mg"],
  },
  {
    id: "reg-pr",
    name: "Gerente Regional PR",
    email: "gerente.pr@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "PR",
    parentId: "dir-sulsudmg",
    children: ["exec-ariadne", "exec-camila", "exec-emerson", "exec-fabiana", "exec-victorhugo", "exec-victorv"],
  },
  {
    id: "reg-rs",
    name: "Gerente Regional RS",
    email: "gerente.rs@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "RS",
    parentId: "dir-sulsudmg",
    children: ["exec-rs"],
  },
  {
    id: "reg-sc",
    name: "Gerente Regional SC",
    email: "gerente.sc@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "SC",
    parentId: "dir-sulsudmg",
    children: ["exec-sc"],
  },
  {
    id: "reg-spc",
    name: "Gerente Regional SP Capital",
    email: "gerente.spc@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "SPC",
    parentId: "dir-sulsudmg",
    children: ["exec-sp-capital"],
  },
  {
    id: "reg-spi",
    name: "Gerente Regional SP Interior",
    email: "gerente.spi@heineken.com",
    role: "GERENTE_REGIONAL",
    roleLevel: RoleLevel.GERENTE_REGIONAL,
    scope: "SPI",
    parentId: "dir-sulsudmg",
    children: ["exec-sp-interior"],
  },

  // ============ EXECUTIVOS UF (Level 1) ============
  // CO
  { id: "exec-go", name: "Executivo GO", email: "exec.go@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "GO", parentId: "reg-co", children: [] },
  { id: "exec-mt", name: "Executivo MT", email: "exec.mt@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "MT", parentId: "reg-co", children: [] },
  { id: "exec-df", name: "Executivo DF", email: "exec.df@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "DF", parentId: "reg-co", children: [] },
  { id: "exec-to", name: "Executivo TO", email: "exec.to@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "TO", parentId: "reg-co", children: [] },
  { id: "exec-ms", name: "Executivo MS", email: "exec.ms@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "MS", parentId: "reg-co", children: [] },
  // NE I
  { id: "exec-ba", name: "Executivo BA", email: "exec.ba@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "BA", parentId: "reg-nei", children: [] },
  { id: "exec-se", name: "Executivo SE", email: "exec.se@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "SE", parentId: "reg-nei", children: [] },
  // NE II
  { id: "exec-al", name: "Executivo AL", email: "exec.al@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "AL", parentId: "reg-neii", children: [] },
  { id: "exec-pe", name: "Executivo PE", email: "exec.pe@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "PE", parentId: "reg-neii", children: [] },
  { id: "exec-pi", name: "Executivo PI", email: "exec.pi@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "PI", parentId: "reg-neii", children: [] },
  { id: "exec-ma", name: "Executivo MA", email: "exec.ma@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "MA", parentId: "reg-neii", children: [] },
  // RJ+ES
  { id: "exec-rj", name: "Executivo RJ", email: "exec.rj@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "RJ", parentId: "reg-rjes", children: [] },
  { id: "exec-es", name: "Executivo ES", email: "exec.es@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "ES", parentId: "reg-rjes", children: [] },
  // C-STORE
  { id: "exec-cstore-sp", name: "Executivo C-STORE SP", email: "exec.cstore.sp@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "SP C-Store", parentId: "reg-cstore", children: [] },
  { id: "exec-cstore-rj", name: "Executivo C-STORE RJ", email: "exec.cstore.rj@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "RJ C-Store", parentId: "reg-cstore", children: [] },
  // SUL/SUD/MG
  { id: "exec-mg", name: "Executivo MG", email: "exec.mg@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "MG", parentId: "reg-mg", children: [] },
  // Real PR Executivos from Conta Corrente
  { id: "exec-ariadne", name: "Ariadne Garcia", email: "ariadne.garcia@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "PR - Curitiba", parentId: "reg-pr", children: [] },
  { id: "exec-camila", name: "Camila Vieira", email: "camila.vieira@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "PR - Londrina", parentId: "reg-pr", children: [] },
  { id: "exec-emerson", name: "Emerson Taubenhein Frey", email: "emerson.frey@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "PR - Maringá", parentId: "reg-pr", children: [] },
  { id: "exec-fabiana", name: "Fabiana Bollis", email: "fabiana.bollis@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "PR - Cascavel", parentId: "reg-pr", children: [] },
  { id: "exec-victorhugo", name: "Victor Hugo", email: "victor.hugo@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "PR - Ponta Grossa", parentId: "reg-pr", children: [] },
  { id: "exec-victorv", name: "Victor Vaqueiro", email: "victor.vaqueiro@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "PR - Litoral", parentId: "reg-pr", children: [] },
  { id: "exec-rs", name: "Executivo RS", email: "exec.rs@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "RS", parentId: "reg-rs", children: [] },
  { id: "exec-sc", name: "Executivo SC", email: "exec.sc@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "SC", parentId: "reg-sc", children: [] },
  { id: "exec-sp-capital", name: "Executivo SP Capital", email: "exec.spc@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "SP Capital", parentId: "reg-spc", children: [] },
  { id: "exec-sp-interior", name: "Executivo SP Interior", email: "exec.spi@heineken.com", role: "EXECUTIVO_UF", roleLevel: RoleLevel.EXECUTIVO_UF, scope: "SP Interior", parentId: "reg-spi", children: [] },
];

// =============== HELPER FUNCTIONS ===============

export function getUserById(id: string): OrgNode | undefined {
  return ORG_HIERARCHY.find(u => u.id === id);
}

export function getUserByEmail(email: string): OrgNode | undefined {
  return ORG_HIERARCHY.find(u => u.email === email);
}

export function getDescendantIds(userId: string): string[] {
  const user = getUserById(userId);
  if (!user) return [];

  const descendants: string[] = [];
  function collect(nodeId: string) {
    const node = getUserById(nodeId);
    if (!node) return;
    for (const childId of node.children) {
      descendants.push(childId);
      collect(childId);
    }
  }
  collect(userId);
  return descendants;
}

export function getVisibleUserIds(userId: string): string[] {
  return [userId, ...getDescendantIds(userId)];
}

export function canSeeUser(viewerId: string, targetId: string): boolean {
  if (viewerId === targetId) return true;
  return getDescendantIds(viewerId).includes(targetId);
}

export function getHierarchyPath(userId: string): OrgNode[] {
  const path: OrgNode[] = [];
  let current = getUserById(userId);
  while (current) {
    path.unshift(current);
    current = current.parentId ? getUserById(current.parentId) : undefined;
  }
  return path;
}

export function getRoleDisplayName(role: keyof typeof RoleLevel): string {
  const names: Record<keyof typeof RoleLevel, string> = {
    EXECUTIVO_UF: "Executivo de UF",
    GERENTE_REGIONAL: "Gerente Regional",
    DIRETOR_DIRETORIA: "Diretor de Diretoria",
    ADMIN: "Administrador Nacional",
  };
  return names[role] || role;
}

// Get users by role level
export function getUsersByRole(role: keyof typeof RoleLevel): OrgNode[] {
  return ORG_HIERARCHY.filter(u => u.role === role);
}

// Get visible UFs for filtering data
export function getVisibleUFs(userId: string): string[] {
  const visibleUsers = getVisibleUserIds(userId);
  return visibleUsers
    .map(id => getUserById(id))
    .filter(u => u && u.role === "EXECUTIVO_UF")
    .map(u => u!.scope);
}
