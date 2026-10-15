# Cinegobetti — Arquitetura de UX/UI, Design Apple & Engenharia de Animações

**Status: Concluído & Verificado**

Planejamento técnico e de design para elevar o Cinegobetti ao padrão de excelência de um aplicativo nativo da Apple (Apple TV+ e iOS 18 HIG) e Letterboxd, eliminando cortes secos com transições contínuas, padronizando a iconografia com Lucide (sem emojis), reformulando a tela inicial com atmosfera de cinema e consolidando a estrutura de perfis e dados reais.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões Confirmadas com o Usuário:**
> 1. **Tela de Início Cinemática (Substituição do Vidro Líquido)**: Abertura imersiva com *Poster Wall* sutil em profundidade e iluminação ambiente (luz de projeção cinematográfica suave), no lugar do shader abstrato de vidro líquido, conectando imediatamente o usuário à essência do cinema.
> 2. **Transições Contínuas sem Cortes Secos (Shared Element / Hero Flight)**: Uso do `motion` (`layoutId` e física de molas Apple) para que o avatar do perfil "decole" da tela de abertura e pouse suavemente no chip da topbar, e os cards de filme se expandam de forma orgânica ao abrir a ficha técnica.
> 3. **Erradicação Completa de Emojis**: Toda a interface utilizará exclusivamente a biblioteca **Lucide React** calibrada com traço uniforme de `1.75px` e SVGs oficiais otimizados para provedores de streaming (Netflix, Prime, Max, Disney+, Apple TV+, Globoplay, MUBI, Paramount+).
> 4. **Preservação Rígida dos Perfis Oficiais**:
>    - Perfil **Manu**: Base pré-carregada com 47 filmes concluídos, notas detalhadas e resenha autêntica *"Mediano"* em "O Menu".
>    - Perfil **Gio**: Lista própria e notas independentes.
>    - Perfil **Geral**: Catálogo neutro para consulta conjunta.
> 5. **Calibração Visual da Marca**: Header com altura de `h-16` (64px) e logo dimensionada com precisão em `h-[46px] sm:h-[50px] md:h-[54px]`, com proteção de área segura.
> 6. **Blueprint de Sincronização em Nuvem (Vercel Blob / API)**: Estruturação dos métodos `persistLocally()` e `syncToCloud()` com debounce e merge inteligente para fácil conexão futura aos endpoints `/api/sync`.

---

## 1. Overview & Core Concept

- **O que é**: O Cinegobetti é um cinema particular compartilhado para cinéfilos, familiares e amigos. Uma experiência digital com fluidez tátil e sofisticação visual de alto padrão Apple, onde cada integrante possui um universo de cinema sob medida.
- **Diferencial de Valor**:
  - Eliminação de atrito com transições visuais fluidas e orgânicas.
  - Curadoria cinematográfica precisa com dados de onde assistir no Brasil, notas públicas (IMDb, Rotten Tomatoes, Letterboxd) e notas sociais compartilhadas entre os perfis locais.
  - Sensação de produto final polido, livre de elementos genéricos ou improvisados.

---

## 2. User Experience & Visual Design

### A. Fluxos Principais do Usuário

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Jornada Fluida do Usuário                       │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 1. Tela de Abertura: Cinema Theater Atmosphere          │
       │    • Poster wall sutil em fade escuro (#07080C)         │
       │    • Luz de projeção ambiental e tipografia Apple       │
       │    • Cards de perfil com efeito Parallax 3D / Sheen     │
       └─────────────────────────────────────────────────────────┘
                                    │
                         (Toque em um Perfil)
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 2. Hero Flight Transition (Zero Cortes Secos)           │
       │    • Avatar decola via motion layoutId com spring       │
       │    • Fundo esmaece suavemente enquanto o app se revela │
       │    • Avatar pousa perfeitamente no chip da Topbar       │
       └─────────────────────────────────────────────────────────┘
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 3. Feed Principal: Carrosséis Temáticos & Descoberta    │
       │    • Hero Banner dinâmico com iluminação ambiental      │
       │    • Linhas: Em Alta, Filmes, Séries, Kids & Família    │
       │    • Alternador suave para Grade Geral Completa         │
       └─────────────────────────────────────────────────────────┘
                                    │
                        (Toque em um Filme/Série)
                                    │
                                    ▼
       ┌─────────────────────────────────────────────────────────┐
       │ 4. Ficha Técnica Imersiva (Apple & Letterboxd)          │
       │    • Expansão orgânica do pôster (Shared Element)       │
       │    • Trailer oficial em mini-player sob demanda         │
       │    • Elenco com retratos circulares e papéis            │
       │    • "Amigos que Assistiram": notas e quotes de amigos  │
       │    • Seletor de status com 4 estados e estrelas 0.5-5.0 │
       └─────────────────────────────────────────────────────────┘
```

### B. Sistema Visual & Anti-Slop (Diretrizes Estéticas)

1. **Paleta de Cores e Atmosfera**:
   - Fundo base: `#07080C` (Preto cinematográfico ultra-profundo, calibrado para painéis OLED).
   - Superfícies secundárias: `#0D0F17` com bordas ultrafinas `border-white/[0.08]`.
   - Painéis de vidro: `backdrop-blur-2xl bg-[#090A0F]/80` com efeito de profundidade.
   - Acentos de alta intenção: Violeta Real (`#8B5CF6`) e Âmbar Ouro (`#F59E0B`).

2. **Tipografia & Numerais Tabulares**:
   - Títulos e interface: **Plus Jakarta Sans** (pesos 500, 600, 700, 800) com kerning ótico refinado.
   - Métricas, contadores e duração: `tabular-nums` com alinhamento vertical estrito.

3. **Iconografia Padronizada (Zero Emojis)**:
   - Substituição de todos os emojis em abas, categorias, estados e filtros por ícones vetoriais da biblioteca **Lucide React**, fixados com traço elegante de `1.75px` (`strokeWidth={1.75}`).
   - Provedores de streaming estilizados com vetores oficiais em SVG limpo (Netflix, Prime, Max, Disney+, Apple TV+, Globoplay, MUBI, Paramount+).

4. **Microinterações e Física de Molas (Springs)**:
   - Resposta tátil ao toque no mobile: `active:scale-[0.96]` com curva `cubic-bezier(0.16, 1, 0.3, 1)`.
   - Abertura de gavetas e modais: entrada suave de baixo para cima com amortecimento crítico (sem oscilações exageradas).

---

## 3. Key Product Decisions & Trade-Offs

- **Atmosfera de Cinema vs Shader de Vidro Líquido**:
  - *Decisão*: Substituir o shader de refração fluida por uma composição de *Cinema Theater Atmosphere* composta por grid sutil de pôsteres com vinheta profunda, feixe de luz de projetor difuso e pedestais táteis de perfil.
  - *Por que*: O vidro líquido causava ruído conceitual com a premissa de cinema e streaming. A nova abertura evoca a experiência de entrar em uma sala VIP de cinema.
- **Animações com `motion` e `layoutId` vs Transições CSS Padrão**:
  - *Decisão*: Utilizar `AnimatePresence` e `motion.div` com `layoutId` compartilhado entre o avatar selecionado na tela inicial e o chip na barra superior (`TopBar`).
  - *Por que*: Elimina os cortes secos que o usuário apontou, criando uma continuidade visual de aplicativo nativo iOS/macOS.
- **Isolamento Rígido de Perfis com Sincronização Desacoplada**:
  - *Decisão*: Manter as listas dos perfis (`manu`, `gio`, `geral`) em estruturas de dicionário puras e imutáveis, com wrappers de persistência `persistLocally()` e `syncToCloud()`.
  - *Por que*: Garante que a lista de 47 títulos da Manu permaneça intacta e prepara o terreno para plugar o endpoint `/api/sync` sem refatoração de código.

---

## 4. Technical Architecture & Data Strategy

### Diagrama de Componentes e Fluxo de Dados

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Cinegobetti Architecture                        │
└────────────────────────────────────────────────────────────────────────┘
                                    │
             ┌──────────────────────┴──────────────────────┐
             ▼                                             ▼
┌─────────────────────────┐                   ┌─────────────────────────┐
│ LocalStorage (Offline)  │                   │ Cloud Sync Adapter      │
│  • cinegobetti_profiles │ ◄───────────────► │  • GET  /api/sync       │
│  • cinegobetti_active_id│                   │  • POST /api/sync (Blob)│
└─────────────────────────┘                   └─────────────────────────┘
             │
             ▼
┌───────────────────────────────────────────────────────────────────────┐
│                          App Controller State                         │
│   • activeProfile (Manu | Gio | Geral)                                │
│   • activeView ('welcome' | 'main')                                   │
│   • selectedMovie (Modal Detail) & isTrailerOpen                      │
│   • filters (Search, Categories, Streamings, Sort)                    │
└───────────────────────────────────────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│ CinemaWelcomeScreen  │  │ TopBar (h-16)        │  │ BottomNav (Floating) │
│  • Poster Wall Depth │  │  • Calibrated Logo   │  │  • Explorar          │
│  • 3D Parallax Tilt  │  │  • Search Bar        │  │  • Minha Lista       │
│  • Hero Flight Motion│  │  • Target Flight Chip│  │  • Descobrir         │
│  • iOS PIN Keypad    │  └──────────────────────┘  │  • Filtros (Badge)   │
└──────────────────────┘             │              └──────────────────────┘
                                     ▼
                       ┌───────────────────────────┐
                       │ ExploreView & Carousels   │
                       │  • Hero Spotlight         │
                       │  • Trending Rail          │
                       │  • Movies Rail            │
                       │  • Series Rail            │
                       │  • Kids & Family Rail     │
                       └───────────────────────────┘
                                     │
                                     ▼
                       ┌───────────────────────────┐
                       │ MovieModal (Shared Element│
                       │  • YouTube Trailer Embed  │
                       │  • Full Cast Roster       │
                       │  • Social Friends Ratings │
                       │  • Similar Titles         │
                       └───────────────────────────┘
```

### Estrutura de Dados dos Perfis Canônicos
```typescript
interface CanonicalProfileData {
  id: 'manu' | 'gio' | 'geral';
  name: string;
  avatarUrl: string;
  accentColor: string;
  isPinProtected: boolean;
  pin?: string;
  list: Record<string, UserMovieData>;
}
```
- **Perfil Manu**: Inicializado com os 47 filmes concluídos (incluindo "O Menu" com nota e resenha "Mediano", "Duna 2", "Oppenheimer", "Ruptura", etc.).
- **Perfil Gio**: Inicializado com suas avaliações específicas e filmes em andamento.
- **Perfil Geral**: Espaço neutro para sessões compartilhadas.

---

## Fases de Execução

1. **Fase 1: Motor de Ícones & Design Tokens**:
   - Padronizar toda a iconografia do app com a biblioteca `lucide-react` (espessura `1.75px`).
   - Criar componente de ícones oficiais de streaming em SVG de alta fidelidade (Netflix, Prime, Max, Disney+, Apple TV+, Globoplay, MUBI, Paramount+).
2. **Fase 2: Nova Tela de Abertura Cinemática & Transição Hero Flight**:
   - Substituir o canvas de vidro líquido por uma tela com atmosfera de cinema (mosaico de pôsteres em vinheta escura, iluminação de feixe suave e cards de perfil com efeito Parallax 3D / Sheen).
   - Implementar a transição contínua via `motion` (`layoutId`), animando o avatar da tela inicial até o chip da barra superior.
3. **Fase 3: Calibração da Topbar & Navegação**:
   - Ajustar o header para altura exata `h-16` com a logo em `h-[46px] sm:h-[50px] md:h-[54px]`.
   - Polir a barra inferior flutuante em vidro fosco translúcido `backdrop-blur-2xl`.
4. **Fase 4: Consolidação dos Perfis Canônicos (Manu, Gio, Geral)**:
   - Configurar o catálogo enriquecido com os 47 filmes concluídos da Manu (destacando "O Menu" com a anotação "Mediano").
   - Garantir isolamento estrito de listas e preparar a camada de sincronização em nuvem (`persistLocally()` e hook de sync).
5. **Fase 5: Carrosséis Temáticos & Ficha Técnica Fluida**:
   - Refinar os carrosséis temáticos (Em Alta, Filmes, Séries, Kids) e a transição elástica de abertura da ficha técnica do filme.
   - Validar player de trailer leve, elenco completo e as notas dos amigos.
6. **Fase 6: Verificação & Testes Unitários**:
   - Executar testes automatizados via `node:test` e testes visuais no navegador com Playwright (desktop e mobile).
