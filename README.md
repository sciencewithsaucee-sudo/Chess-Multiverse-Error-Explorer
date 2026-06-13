# Chess Multiverse Error Explorer

[![Architecture](https://img.shields.io/badge/Architecture-Single_Page_Application-blue.svg)]()
[![DuckDB](https://img.shields.io/badge/SQL_Engine-DuckDB_WASM_v1.29.0-yellow.svg)](https://duckdb.org/)
[![Chessboard.js](https://img.shields.io/badge/Chessboard-Chessboard.js_v1.0.0-green.svg)](https://chessboardjs.com/)
[![Routing](https://img.shields.io/badge/State_Engine-Hash_Routing-orange.svg)]()

A browser-native research platform for large-scale analysis of human chess errors, cognitive collapse under time pressure, opening complexity, and behavioral decision-making patterns.

The **Chess Multiverse Error Explorer** is built on top of the **Chess Multiverse Error & Evaluation Dataset (CMEED v1.0)** and utilizes **DuckDB WASM** to perform server-grade analytical queries directly inside the user's browser without requiring any backend infrastructure.

Unlike traditional chess databases that focus primarily on move quality, the Error Explorer focuses on **why strong players fail**, enabling reproducible research into human error generation across elite chess.

---

## 🚀 Live Application

Launch the production application:

**Live URL:**
www.chessmultiverse.org/p/chess-multiverse-error-explorer.html

---

## 🎯 Research Objectives

The platform is designed to support research into:

* Human decision errors
* Cognitive degradation under pressure
* Time-management failures
* Opening complexity analysis
* Evaluation-loss modeling
* Player vulnerability profiling
* Tournament pressure studies
* Behavioral chess analytics
* Reproducible computational research

---

# 🏗 Architecture

The application follows a fully client-side analytical architecture.

```text
Browser
│
├── DuckDB WASM
│
├── Web Worker Thread
│
├── CMEED Parquet Dataset
│
├── Chess.js Engine
│
├── Chessboard.js Interface
│
├── MathJax Renderer
│
└── Hash-Based State Routing
```

All computation occurs locally within the browser.

No server-side database is required.

---

# 🛠 Technology Stack

| Layer              | Technology           |
| ------------------ | -------------------- |
| Database Engine    | DuckDB WASM v1.29.0  |
| Dataset Format     | Apache Parquet       |
| Chess Rules Engine | chess.js v0.10.3     |
| Board Renderer     | chessboard.js v1.0.0 |
| Mathematics        | MathJax v3           |
| State Management   | URL Hash Routing     |
| Deployment         | Static Hosting       |
| Analytics Layer    | SQL Query Engine     |
| Data Processing    | Browser Web Workers  |

---

## 📁 Repository Structure

```text.
├── src
│   ├── css
│   │   └── style.css
│   └── js
│       └── app.js
├── index.html
├── README.md
└── LICENSE

```

### File Overview

| File                | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `index.html`        | Main application entry point                                                   |
| `src/css/style.css` | Application styling and responsive layout                                      |
| `src/js/app.js`     | Core analytical engine, DuckDB integration, filtering, dashboards, and routing |
| `README.md`         | Project documentation                                                          |
| `LICENSE`           | MIT License                                                                    |

---
# 📊 Dataset

The software is powered by:

## CMEED v1.0

**Chess Multiverse Error & Evaluation Dataset**

Features:

* Nearly 1 million human errors
* Engine evaluation changes
* Clock metadata
* Opening classifications
* Event metadata
* Player metadata
* Behavioral metrics
* Position snapshots

Dataset DOI:

https://doi.org/10.5281/zenodo.20625716

---

# 🧩 Research Modules

## 1. Error Explorer

The central analytical environment of the platform.

### Capabilities

* Severity filtering
* Critical moment detection
* Rating-based analysis
* Player filtering
* Event filtering
* Opening filtering
* Time-pressure analysis
* Phase analysis
* SQL-driven sorting
* CSV export
* Markdown export

### Supported Error Types

* Inaccuracy
* Mistake
* Blunder

### Advanced Features

* Critical position extraction
* Evaluation-drop thresholds
* Deep-link reproducibility
* Interactive position inspection
* Similar-error exploration

---

## 2. Opening Atlas

Opening-specific behavioral analysis engine.

### Metrics

* Error volume
* Blunder percentage
* Average evaluation loss
* Pressure frequency
* Opening Danger Index (ODI)

### Research Questions

Examples:

* Which openings generate the most blunders?
* Which openings become unstable under time pressure?
* Which ECO families produce the highest evaluation loss?

---

## 3. Event Explorer

Tournament-level analytical environment.

### Metrics

* Total errors
* Blunder rates
* Average evaluation loss
* Time-pressure frequency

### Applications

* Broadcast analysis
* Tournament comparison
* Event pressure studies
* Competitive environment research

---

## 4. Player Profiles

Behavioral profiling system for individual players.

### Metrics

* Error frequency
* Blunder counts
* Average evaluation loss
* Panic Index
* Preferred openings
* Vulnerability patterns

### Applications

* Elite player studies
* Comparative behavioral analysis
* Individual weakness identification

---

## 5. Research Dashboard

Interactive statistical aggregation module.

### Included Visualizations

#### Error Phase Distribution

* Opening
* Middlegame
* Endgame

#### Severity Distribution

* Inaccuracy
* Mistake
* Blunder

#### Time Pressure Analysis

Relationship between:

* Clock remaining
* Evaluation loss

#### Color Bias Analysis

Comparison of:

* White-side errors
* Black-side errors

#### Move Heatmap

Distribution of errors across move numbers.

---

## 6. Methodology Framework

The application includes a complete research methodology layer.

### Included Topics

* Expected Score Loss (ESL)
* Opening Danger Index (ODI)
* Panic Index
* Metric derivations
* Reproducibility tutorials
* Validation workflows
* Citation guidance

---

# ⚡ DuckDB-Powered Analytics

The application dynamically generates SQL from user-selected filters.

Example:

```sql
ABS(eval_before) <= 1.25
AND eval_change >= 1.50
```

Queries are executed directly inside DuckDB WASM.

No server communication is required.

---

# 🔗 Reproducible Deep Linking

The platform maintains analytical state through URL serialization.

Researchers can:

1. Configure filters
2. Copy URL
3. Share findings
4. Reproduce exact views

This supports transparent and reproducible computational research.

---

# ♟ Interactive Position Analysis

The platform contains a dedicated position-inspection environment.

Features include:

* Interactive chessboard
* Move replay
* FEN export
* Best-move comparison
* Played-move comparison
* Evaluation timeline
* Expected Score Loss display
* Lichess integration

---

# 🧮 Mathematical Framework

## Expected Score Function

[
ES(e)=\frac{1}{1+e^{-e/2.2}}
]

Where:

* (e) represents engine evaluation
* 2.2 is the calibration constant

---

## Expected Score Loss (ESL)

[
ESL=
\max
\left(
0,
ES(e_{before})
--------------

ES(e_{after})
\right)
\times100
]

ESL measures the percentage of winning probability lost through a single human decision.

---

## Opening Danger Index (ODI)

[
ODI=
\left(
\sum_{i=1}^{5}
w_iN_i
\right)
\times100
]

Components:

| Variable                | Weight |
| ----------------------- | ------ |
| Error Volume            | 0.28   |
| Blunder Density         | 0.22   |
| Evaluation Magnitude    | 0.24   |
| Player Diversity        | 0.14   |
| Time Pressure Frequency | 0.12   |

ODI quantifies the behavioral risk associated with specific opening families.

---

## Panic Index

For moves played under severe time pressure:

[
PI_{<60}
========

\frac{1}{|M_{<60}|}
\sum_{x\in M_{<60}}
\Delta e_x
]

This metric measures evaluation collapse when less than 60 seconds remain on the clock.

---

# 🔬 Reproducibility Tutorials

The platform contains built-in case studies demonstrating hypothesis validation.

### Example Study 1

Hypothesis:

> Grandmaster blunder rates in hypermodern openings increase significantly when the clock drops below 30 seconds.

### Example Study 2

Hypothesis:

> Magnus Carlsen exhibits measurable evaluation loss vulnerability while defending difficult positions under severe time pressure.

Researchers can automatically generate validation subsets and export datasets for independent verification.

---

# 📁 Installation

Because the application depends on:

* WebAssembly
* Web Workers
* Browser Fetch APIs

it cannot be executed using:

```text
file://
```

A local web server is required.

---

## Clone Repository

```bash
git clone https://github.com/sciencewithsaucee-sudo/Chess-Multiverse-Error-Evaluation-Dataset-CMEED-.git

cd Chess-Multiverse-Error-Evaluation-Dataset-CMEED-
```

---

## Start Local Server

Python:

```bash
python -m http.server 8000
```

---

## Open Application

```text
http://localhost:8000
```

---

# 📤 Export Support

The application supports:

* CSV Export
* Markdown Brief Export
* Shareable URLs
* FEN Export

---
# 🧪 Automated Verification Framework

The Chess Multiverse Error Explorer includes a dedicated automated regression and validation framework designed to verify analytical correctness, reproducibility, and computational stability across the platform.

Current status:

```text
16 Tests Passing
0 Failures
12 Core System Layers Verified
```

### Validation Coverage

#### Module 1: Parquet Ingestion Layer

* Dataset loading verification
* Binary fetch validation
* Schema integrity checks

#### Module 2: DuckDB Relational Projections

* Runtime view construction
* Clock bucket classification
* Numeric evaluation casting

#### Module 3: Dynamic SQL Filter Compiler

* Complex filter generation
* Multi-variable query validation
* Analytical protocol enforcement

#### Module 4: Expected Score Loss (ESL)

* Probability transformation validation
* Evaluation-loss calculations
* Edge-case handling

#### Module 5: Opening Danger Index (ODI)

* Composite risk-score calculations
* Weight consistency verification
* Numerical stability testing

#### Module 6: Panic Index Framework

* Time-pressure aggregation logic
* Evaluation variance calculations
* Threshold validation

#### Module 7: Material Signature Search

* Structural position matching
* Material isomorphism validation
* False-positive prevention

#### Module 8: Reproducibility Layer

* URL state serialization
* State deserialization
* Deep-link integrity checks

#### Module 9: Export Systems

* CSV generation
* UTF-8 validation
* Record-alignment verification

#### Module 10: Dashboard Synchronization

* UI aggregation validation
* Database consistency checks
* Reactive state verification

#### Module 11: Position Replay Engine

* FEN reconstruction
* Chess.js legality verification
* Move replay validation

#### Module 12: Performance Benchmarks

* DuckDB query latency testing
* Asynchronous execution validation
* Runtime stability checks

### Benchmark Results

| Metric               | Result |
| -------------------- | ------ |
| Total Tests          | 16     |
| Failures             | 0      |
| Verification Layers  | 12     |
| Benchmark Query Time | 88 ms  |

The verification framework provides continuous validation of both research-oriented analytical metrics and software infrastructure components, supporting reproducibility and reliability across all major platform subsystems.

---

# 📖 Citation

If this software contributes to your research, please cite both the software and the underlying dataset.

## Software Citation

```text
Varshney, S. (2026).

Chess Multiverse Error Explorer
[Computer software].

GitHub.

https://github.com/sciencewithsaucee-sudo/Chess-Multiverse-Error-Evaluation-Dataset-CMEED-
```

---

## Dataset Citation

```text
Varshney, S. (2026).

Chess Multiverse Error & Evaluation Dataset (CMEED v1.0)
[Data set].

Zenodo.

https://doi.org/10.5281/zenodo.20625716
```

---

# 📜 License

This project is released under the MIT License.

You are free to:

* Use
* Modify
* Distribute
* Commercialize

the software provided that the original license and copyright notice remain included.

See the LICENSE file for details.

---

# 👨‍🔬 Author

**Sparsh Varshney**

Founder, Chess Multiverse Lab

ORCID: 0009-0004-7835-0673

Research Interests:

* Chess Analytics
* Cognitive Performance Modeling
* Human Error Research
* Computational Behavioral Science
* Open Research Infrastructure

---

# 🌍 Vision

The Chess Multiverse Error Explorer seeks to transform chess databases from repositories of moves into laboratories of human decision-making, enabling researchers to study how expertise, pressure, complexity, and cognition interact in one of the world's most demanding intellectual domains.
