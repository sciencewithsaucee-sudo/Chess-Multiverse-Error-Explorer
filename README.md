# Chess Multiverse Error Explorer

![Architecture](https://img.shields.io/badge/Architecture-Single_Page_Application-blue.svg)
[![DuckDB](https://img.shields.io/badge/SQL_Engine-DuckDB_WASM_v1.29.0-yellow.svg)](https://duckdb.org/)
[![Chessboard.js](https://img.shields.io/badge/Chessboard-Chessboard.js_v1.0.0-green.svg)](https://chessboardjs.com/)
![Routing](https://img.shields.io/badge/State_Engine-Hash_Routing-orange.svg)

The **Chess Multiverse Error Explorer** is a high-performance, browser-native analytical platform designed for deep exploratory research into human chess errors.

By embedding **DuckDB WASM** directly inside the browser, the application delivers server-grade relational analytics entirely client-side, enabling researchers to query, filter, aggregate, and visualize nearly **1 million behavioral chess error records** from the **Chess Multiverse Error & Evaluation Dataset (CMEED v1.0)** without requiring any backend infrastructure.

The system operates as a fully static web application while maintaining advanced SQL-powered analytical capabilities traditionally associated with server-hosted research environments.

---

# 🚀 Live Application

Run the production application directly from your browser:

**Live URL:**
`https://YOUR-LIVE-URL-HERE`

---

# 🏗️ Architecture Overview

The platform follows a fully serverless analytical architecture:

```text
Browser
│
├── DuckDB WASM Engine
│
├── Web Worker Thread
│
├── CMEED Parquet Dataset
│
├── Chess.js Validation Engine
│
├── Chessboard.js UI Layer
│
└── MathJax Rendering Engine
```

All data processing occurs locally inside the user's browser session.

No server-side computation is required.

---

# 🛠️ Technology Stack

| Component              | Technology             |
| ---------------------- | ---------------------- |
| Database Engine        | DuckDB WASM (v1.29.0)  |
| Data Format            | Apache Parquet         |
| Chess Rules Engine     | chess.js (v0.10.3)     |
| Board Interface        | chessboard.js (v1.0.0) |
| Mathematical Rendering | MathJax v3             |
| Routing System         | URL Hash Routing       |
| Deployment Model       | Static Hosting         |

---

# 💡 Core Features

## 1. Client-Side Parquet Mounting

Upon launch, the application:

1. Initializes DuckDB WASM.
2. Creates a dedicated background worker.
3. Checks browser cache availability.
4. Downloads the CMEED dataset if required.
5. Registers the Parquet file inside DuckDB's virtual filesystem.
6. Creates queryable analytical views.

This architecture eliminates the need for external database servers while preserving high-performance analytical workloads.

---

## 2. Dynamic Analytical View Construction

A virtual SQL view is generated at runtime.

The transformation layer automatically:

* Parses evaluation fields into numeric formats.
* Determines active player ratings based on color.
* Normalizes metadata fields.
* Creates time-control buckets.
* Builds analytical dimensions for aggregation.

Example logic:

```sql
CREATE VIEW cmeed AS
SELECT
    *,
    CAST(eval_before AS DOUBLE) AS eval_before_num,
    CAST(eval_after AS DOUBLE) AS eval_after_num
FROM source_table;
```

---

## 3. SQL-Based Research Filtering Engine

User-selected filters are translated directly into SQL conditions.

The engine supports:

* Rating thresholds
* Event filtering
* Player filtering
* Opening filtering
* Severity filtering
* Time pressure analysis
* Move number constraints

Example critical-position filter:

```sql
ABS(eval_before) <= 1.25
AND eval_change >= 1.5
```

This enables rapid extraction of cognitively significant mistakes from large-scale datasets.

---

## 4. Shareable Deep-Link Research States

The application synchronizes analytical state with browser URLs.

Researchers can:

* Configure complex filter combinations.
* Copy a generated URL.
* Share exact analytical views.
* Reproduce findings instantly.

State persistence is implemented using:

```javascript
URLSearchParams
window.location.hash
history.replaceState()
```

---

## 5. Research Aggregation Dashboard

The dashboard executes optimized aggregation queries directly inside DuckDB.

Supported analyses include:

### Error Severity Distribution

* Inaccuracy
* Mistake
* Blunder

### Game Phase Analysis

* Opening
* Middlegame
* Endgame

### Rating-Based Trends

* Beginner
* Intermediate
* Advanced
* Master

### Time Pressure Metrics

* Under 30 seconds
* 30–60 seconds
* 1–5 minutes
* Greater than 5 minutes

### Move Number Heatmaps

Behavioral concentration of errors across game progression.

---

## 6. Material Signature Similarity Search

Researchers can identify structurally similar error positions.

The engine:

1. Extracts material composition from FEN strings.
2. Generates material signatures.
3. Queries DuckDB for matching structures.
4. Returns comparable tactical environments.

This enables rapid exploration of recurring cognitive failure patterns.

---

# 📊 Dataset Integration

The application is designed specifically for:

## CMEED v1.0

**Chess Multiverse Error & Evaluation Dataset**

Features:

* ~1 million analyzed errors
* Human behavioral mistakes
* Engine evaluations
* Clock information
* Rating metadata
* Opening classifications
* Tournament metadata

Dataset DOI:

**https://doi.org/10.5281/zenodo.20625716**

---

# 📁 Installation

Because the application relies on:

* WebAssembly
* Web Workers
* Fetch APIs

it cannot be executed through `file://` URLs.

A local web server is required.

## Clone Repository

```bash
git clone https://github.com/sciencewithsaucee-sudo/Chess-Multiverse-Error-Evaluation-Dataset-CMEED-.git

cd Chess-Multiverse-Error-Evaluation-Dataset-CMEED-
```

## Start Local Server

Python:

```bash
python -m http.server 8000
```

## Open Browser

```text
http://localhost:8000
```

---

# 🧮 Mathematical Framework

The application computes behavioral metrics dynamically within the browser.

## Expected Score Function

[
Expect(e)=\frac{1}{1+e^{-e/2.2}}
]

## Expected Score Loss (ESL)

[
ESL=
\max
\left(
0,
Expect(p_{before})
------------------

Expect(p_{after})
\right)
\times100
]

### Notes

* Position evaluations are normalized according to the active player's color.
* White and Black positions are automatically transformed before ESL computation.
* Calculations are performed client-side.

---

# 🔬 Research Applications

The platform can be used for:

* Human error analysis
* Time-pressure research
* Cognitive performance studies
* Opening risk evaluation
* Rating progression studies
* Tournament pressure analysis
* Behavioral chess research
* Reproducible exploratory analytics

---

# 📖 Academic Citation

If this software contributes to your research, please cite both the software platform and the underlying dataset.

## Software Citation

```text
Varshney, S. (2026).

Chess Multiverse Error Explorer (Version 1.0)
[Computer software].

GitHub.

https://github.com/sciencewithsaucee-sudo/Chess-Multiverse-Error-Evaluation-Dataset-CMEED-
```

## Dataset Citation

```text
Varshney, S. (2026).

Chess Multiverse Error & Evaluation Dataset
(CMEED v1.0) [Data set].

Zenodo.

https://doi.org/10.5281/zenodo.20625716
```

---

# 📜 License

This software is distributed under the **MIT License**.

You are free to:

* Use
* Modify
* Redistribute
* Commercialize

the software, provided that the original copyright notice and license terms remain included.

See the `LICENSE` file for complete details.

---

# 👨‍🔬 Author

**Sparsh Varshney**

Founder, Chess Multiverse Lab

Research Areas:

* Computational Chess Analytics
* Human Error Modeling
* Cognitive Performance Analysis
* Open Research Infrastructure

---

# 🌐 Related Resources

* CMEED Dataset
* Chess Multiverse Lab
* DuckDB
* Chess.js
* Chessboard.js
* MathJax

Together, these components create a fully reproducible browser-native research environment for large-scale behavioral chess analysis.
