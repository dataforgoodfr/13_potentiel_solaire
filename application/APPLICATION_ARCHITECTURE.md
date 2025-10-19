# 🧭 Application Architecture

This document explains how the **Application** part of the project is structured — its components, content dependencies, and reusable patterns.

## 💡 Key Architecture Insights

> **Summary:** These insights highlight the key relationships and design principles behind the application's structure.

### 🧱 Component Hierarchy
- `layout.tsx` wraps everything with `NavBar`, `Footer`, and `Providers`
- `MapWithFiches` combines the map and fiche displays
- `Fiches` manages multiple fiche types (`Commune`, `Departement`, `Region`, `Etablissement`)
- Shared fiche components (`fiches/shared/`) ensure UI consistency

### 🗂️ Content Dependencies
- Static pages (`a-propos`, `comment-agir`, `methodologie`) reuse `StaticPage`
- `/content/` centralises text and configuration
- `actions` content is reused across fiche accordions and the “Comment agir” page
- Navigation and footer content are defined in dedicated config files

### 🔄 Data Flow
- API routes provide geographic data endpoints
- Fetcher functions wrap API calls with error handling
- TypeScript models ensure type safety
- Map components fetch and render GeoJSON layers

### ♻️ Reusable Patterns
- Shared fiche components promote consistency
- Centralised content improves maintainability
- Standardised fetcher pattern simplifies API integration
- Model-based typing prevents data mismatches

## 🧩 Component, Content & Model Relationships

```mermaid
graph LR

%% ========= Pages =========
subgraph Pages["📁 Pages"]
  P1["page.tsx<br/>• Home page with MapWithFiches"]
  P2["a-propos/page.tsx<br/>• About page using StaticPage"]
  P3["comment-agir/page.tsx<br/>• Action page using StaticPage"]
  P4["methodologie/page.tsx<br/>• Methodology page using StaticPage"]
  P5["etablissements/[id]/route.ts<br/>• Dynamic etablissement page"]
end

%% ========= Main Layout =========
subgraph Layout["🏗️ Root Layout"]
  L1["layout.tsx<br/>• Root layout with NavBar, Footer, Providers"]
  L2["Providers.tsx<br/>• Context providers wrapper"]
  L3["StaticPage.tsx<br/>• Reusable static page component"]
end

%% ========= Core Components =========
subgraph CoreComponents["🎯 Core Components"]
  C1["MapWithFiches<br/>• Main map + fiche container"]
  C2["FranceMap<br/>• Interactive map with layers"]
  C3["Fiches<br/>• Fiche container with tabs"]
  C4["NavBar<br/>• Navigation with search"]
  C5["Footer<br/>• Site footer with links"]
  C6["HomeOverlay<br/>• Home page overlay"]
  C7["SearchBar<br/>• Search functionality"]
  C8["ContacterMairie<br/>• Contact mairie component"]
end

%% ========= Fiche Components =========
subgraph FicheComponents["📋 Fiche Components"]
  F1["FicheCommune<br/>• Commune-level data display"]
  F2["FicheDepartement<br/>• Department-level data display"]
  F3["FicheRegion<br/>• Region-level data display"]
  F4["FicheEtablissement<br/>• School-level data display"]
end

%% ========= Shared Fiche Components =========
subgraph SharedFiche["🔧 Shared Fiche Components"]
  S1["ActionButtons<br/>• Print & share actions"]
  S2["AccordionCard<br/>• Collapsible action cards"]
  S3["CollectiviteHeaderCard<br/>• Location header"]
  S4["PotentielSolaireCard<br/>• Solar potential display"]
  S5["RepartitionPotentielSolaire<br/>• Potential distribution"]
  S6["ResponsabiliteMessage<br/>• Responsibility message"]
  S7["Tabs<br/>• Tab navigation"]
  S8["TopCard<br/>• Top establishments card"]
  S9["PopUp<br/>• Contact popup modal"]
  S10["NbEtablissements<br/>• School count display"]
end

%% ========= Map Components =========
subgraph MapComponents["🗺️ Map Components"]
  M1["MenuDrom<br/>• DROM/Hexagone switcher"]
  M2["BackButton<br/>• Navigation back button"]
  M3["CurrentLevel<br/>• Current zoom level display"]
  M4["Legend<br/>• Map legend"]
  M5["useLayers<br/>• Layer management hook"]
  M6["useMenuDrom<br/>• DROM menu hook"]
end

%% ========= Content Files =========
subgraph Content["📄 Content Files"]
  CT1["a-propos.tsx<br/>• About page content"]
  CT2["comment-agir.tsx<br/>• Action page content"]
  CT3["methodologie.tsx<br/>• Methodology content"]
  CT4["accordion-actions.tsx<br/>• Action accordion content"]
  CT5["actions.ts<br/>• Action links & CTAs"]
  CT6["navBar.ts<br/>• Navigation links"]
  CT7["footer.ts<br/>• Footer links & partners"]
  CT8["seo.ts<br/>• SEO metadata"]
end

%% ========= Data Models =========
subgraph Models["📊 Data Models"]
  MD1["Commune<br/>• Commune data structure"]
  MD2["Departement<br/>• Department data structure"]
  MD3["Region<br/>• Region data structure"]
  MD4["Etablissement<br/>• School data structure"]
  MD5["ContactMairie<br/>• Mairie contact data"]
  MD6["SearchResult<br/>• Search result types"]
  MD7["NiveauPotentiel<br/>• Solar potential levels"]
end

%% ========= API Routes =========
subgraph API["🔌 API Routes"]
  A1["/api/search<br/>• Search functionality"]
  A2["/api/communes<br/>• Commune data"]
  A3["/api/departements<br/>• Department data"]
  A4["/api/regions<br/>• Region data"]
  A5["/api/etablissements<br/>• School data"]
  A6["/api/contact-mairie<br/>• Mairie contact"]
  A7["/api/geolocate<br/>• Geolocation"]
end

%% ========= Data Fetchers =========
subgraph Fetchers["📡 Data Fetchers"]
  FT1["fetchSearchResults<br/>• Search API calls"]
  FT2["fetchCommune<br/>• Commune data fetching"]
  FT3["fetchDepartement<br/>• Department data fetching"]
  FT4["fetchRegion<br/>• Region data fetching"]
  FT5["fetchEtablissement<br/>• School data fetching"]
  FT6["fetchContactMairie<br/>• Mairie contact fetching"]
  FT7["fetch*GeoJSON<br/>• GeoJSON data fetching"]
end

%% ========= Page Relationships =========
P1 --> C1
P2 --> L3
P3 --> L3
P4 --> L3
P5 --> C1

%% ========= Layout Relationships =========
L1 --> C4
L1 --> C5
L1 --> L2
L2 --> C1

%% ========= Core Component Relationships =========
C1 --> C2
C1 --> C3
C1 --> C6
C2 --> M1
C2 --> M2
C2 --> M3
C2 --> M4
C2 --> M5
C3 --> F1
C3 --> F2
C3 --> F3
C3 --> F4
C3 --> F5
C3 --> S2
C4 --> C7

%% ========= Fiche Component Relationships =========
F1 --> S1
F1 --> S3
F1 --> S4
F1 --> S5
F1 --> S6
F1 --> S7
F1 --> S8
F2 --> S1
F2 --> S3
F2 --> S4
F2 --> S5
F2 --> S6
F2 --> S7
F2 --> S8
F3 --> S1
F3 --> S3
F3 --> S4
F3 --> S5
F3 --> S6
F3 --> S7
F3 --> S8
F4 --> S1
F4 --> S3
F4 --> S4
F4 --> S5
F4 --> S6
F4 --> S7
F4 --> S8
C8 --> S9
F1 --> S10
F2 --> S10
F3 --> S10
S5 --> S10

%% ========= Content Dependencies =========
P2 --> CT1
P3 --> CT2
P4 --> CT3
C4 --> CT6
C5 --> CT7
L1 --> CT8
S2 --> CT4
CT4 --> CT5

%% ========= Data Flow =========
C7 --> FT1
C2 --> FT7
F1 --> FT2
F2 --> FT3
F3 --> FT4
F4 --> FT5
C8 --> FT6
FT1 --> A1
FT2 --> A2
FT3 --> A3
FT4 --> A4
FT5 --> A5
FT6 --> A6

%% ========= Model Usage =========
F1 --> MD1
F2 --> MD2
F3 --> MD3
F4 --> MD4
C8 --> MD5
C7 --> MD6
S4 --> MD7

%% ========= Styling =========
classDef page fill:#f6d6d6,stroke:#e26a6a,stroke-width:2px;
classDef layout fill:#e6f3ff,stroke:#4a90e2,stroke-width:2px;
classDef core fill:#d6e8f6,stroke:#4a90e2,stroke-width:1px;
classDef fiche fill:#d4edda,stroke:#28a745,stroke-width:1px;
classDef shared fill:#fff3cd,stroke:#ffc107,stroke-width:1px;
classDef map fill:#e2e3e5,stroke:#6c757d,stroke-width:1px;
classDef content fill:#e8f6d6,stroke:#7bc043,stroke-width:1px;
classDef model fill:#f5e6d6,stroke:#e2a04a,stroke-width:1px;
classDef api fill:#f8d7da,stroke:#dc3545,stroke-width:1px;
classDef fetcher fill:#d1ecf1,stroke:#17a2b8,stroke-width:1px;

class P1,P2,P3,P4,P5 page
class L1,L2,L3 layout
class C1,C2,C3,C4,C5,C6,C7,C8 core
class F1,F2,F3,F4 fiche
class S1,S2,S3,S4,S5,S6,S7,S8,S9,S10 shared
class M1,M2,M3,M4,M5,M6 map
class CT1,CT2,CT3,CT4,CT5,CT6,CT7,CT8 content
class MD1,MD2,MD3,MD4,MD5,MD6,MD7 model
class A1,A2,A3,A4,A5,A6,A7 api
class FT1,FT2,FT3,FT4,FT5,FT6,FT7 fetcher
```
