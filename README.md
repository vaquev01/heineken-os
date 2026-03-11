# Heineken OS - Off Trade Sales
*Operating System for Sales Management*

O **Heineken OS** é um sistema centralizado para Executivos de Vendas do canal Auto Serviço (Off Trade). Diferente de dashboards convencionais, ele atua como um verdadeiro sistema operacional, conectando ingestão de dados, acompanhamento visual de metas, e governança financeira na mesma plataforma.

## 🚀 Funcionalidades Principais

1. **Dashboard Executivo (One Page)**
   - Garrafa de atingimento (Real vs Meta)
   - Performance de Marcas (Share of Volume)
   - Lista de Riscos (Hunter/Cockpit) com base em gaps de positivação

2. **Simulador de Negociação (Desktop & iPad)**
   - Conversão em tempo real de Caixas -> HL -> Pallets -> Caminhões.
   - Cálculo automático de Verba Liberada (Sell-in) x Tabela de Preços.
   - Projeção de investimento PFP e Contrato.

3. **Governança de Fundos (Conta Corrente)**
   - Acompanhamento do Budget Total vs Gasto Realizado.
   - Distribuição de verba por cliente (Network).
   - Ranking de eficiência da equipe executiva.

4. **Central de Ingestão de Dados**
   - Upload de planilhas Excel reais (Calendário, Paletização, Tabela de Preços).
   - Parser automático para alimentar o Zustand Data Store.

5. **Interface Premium (OS Feel)**
   - Tema escuro imersivo (Dark Mode).
   - "Command Menu" acessível via `Cmd+K` para busca global (SKUs, Clientes, Módulos).
   - Hierarquia organizacional baseada em visibilidade estrita (Gerentes veem executivos, não vice-versa).

## 💻 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + \`shadcn/ui\`
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Data Parsing:** SheetJS (xlsx)

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 18.17+ 

### Instalação
```bash
# 1. Clone o repositório
git clone https://github.com/vaquev01/heineken-os.git

# 2. Acesse a pasta do projeto
cd heineken-os

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador ou iPad.

## 📱 Dicas de Navegação
- Pressione `Cmd + K` (ou `Ctrl + K` no Windows) em qualquer tela para abrir a busca global.
- No simulador de propostas, teste simular descontos maiores que a "Tabela" e veja o alerta de rentabilidade.
- Na Central de Upload, o sistema já conta com dados mockados de alta fidelidade rodando em tempo real.

---
*Heineken OS V2 - Focus on Self-Service Execs.*
