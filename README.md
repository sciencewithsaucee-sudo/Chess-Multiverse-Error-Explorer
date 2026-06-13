# Chess Multiverse Error Explorer

![Architecture](https://img.shields.io/badge/Architecture-Single_Page_Application-blue.svg)
![DuckDB](https://img.shields.io/badge/SQL_Engine-DuckDB_WASM_v1.29.0-yellow.svg)
![Chessboard.js](https://img.shields.io/badge/Chessboard-Chessboard.js_v1.0.0-green.svg)
![Tests](https://img.shields.io/badge/Verification-16_Tests_Passing-success.svg)

A browser-native analytical platform for large-scale research into human chess errors, time-pressure collapse, opening instability, and behavioral decision-making.

The **Chess Multiverse Error Explorer** is powered by the **Chess Multiverse Error & Evaluation Dataset (CMEED v1.0)** and uses **DuckDB WASM** to execute analytical SQL workloads entirely inside the browser, eliminating the need for backend infrastructure.

Unlike conventional chess databases that focus primarily on move quality, the Error Explorer focuses on the generation of human error and provides tools for reproducible behavioral chess research.

---

# 🚀 Live Application

**Production Deployment**

https://www.chessmultiverse.org/p/chess-multiverse-error-explorer.html

---

# 🎯 Research Objectives

The platform supports investigations into:

- Human decision errors
- Time-pressure collapse
- Evaluation-loss modeling
- Opening complexity
- Behavioral vulnerability profiling
- Tournament pressure effects
- Elite player error generation
- Computational chess analytics
- Reproducible chess research

---

# 🏗 Architecture

```text
Browser
│
├── UI Layer (Chessboard.js)
├── State Layer (Hash Routing)
├── Analytics Layer (DuckDB WASM)
├── Processing Layer (Web Workers)
├── Dataset Layer (Apache Parquet)
└── Mathematics Layer (MathJax)
```

All analytical computation occurs locally within the user's browser.

No server-side database is required.

---

# ⚙ Technology Stack

| Component | Technology |
|------------|------------|
| Database Engine | DuckDB WASM v1.29.0 |
| Dataset Format | Apache Parquet |
| Chess Engine | chess.js |
| Board Renderer | chessboard.js |
| Mathematics | MathJax v3 |
| Routing | URL Hash Routing |
| Processing | Browser Web Workers |
| Deployment | Static Hosting |

---

# 📊 Dataset

The platform is powered by:

## CMEED v1.0

### Chess Multiverse Error & Evaluation Dataset

### Included Data

- Human error records
- Engine evaluations
- Evaluation deltas
- Clock metadata
- Opening classifications
- Event metadata
- Player metadata
- Position snapshots
- Behavioral indicators

### DOI

https://doi.org/10.5281/zenodo.20625716

---

# 🧩 Research Modules

## Error Explorer

Central analytical environment for error discovery and filtering.

### Features

- Error severity filtering
- Critical-position identification
- Player analysis
- Event analysis
- Opening analysis
- Time-pressure filtering
- SQL-powered sorting
- CSV export
- Markdown export
- Reproducible deep links

### Error Categories

- Inaccuracy
- Mistake
- Blunder

---

## Opening Atlas

Opening-specific behavioral analysis engine.

### Metrics

- Error volume
- Blunder frequency
- Average evaluation loss
- Time-pressure frequency
- Opening Danger Index (ODI)

### Research Questions

- Which openings generate the most blunders?
- Which openings become unstable under time pressure?
- Which ECO families exhibit the highest evaluation loss?

---

## Event Explorer

Tournament-level behavioral analytics.

### Metrics

- Total errors
- Blunder counts
- Average evaluation loss
- Pressure frequency

### Applications

- Tournament comparison
- Broadcast analysis
- Competitive pressure studies

---

## Player Profiles

Behavioral profiling system.

### Metrics

- Error frequency
- Blunder counts
- Average evaluation loss
- Panic Index
- Preferred openings
- Vulnerability patterns

---

## Research Dashboard

Interactive aggregate statistics.

### Included Visualizations

- Phase Distribution
- Severity Distribution
- Time Pressure Analysis
- Color Bias Analysis
- Error Heatmaps

---

## Methodology Framework

Integrated documentation for:

- Expected Score Loss (ESL)
- Opening Danger Index (ODI)
- Panic Index
- Reproducibility workflows
- Validation procedures
- Citation guidance

---

# ⚡ DuckDB-Powered Analytics

The platform dynamically generates SQL from user-selected filters.

### Example

```sql
ABS(eval_before) <= 1.25
AND eval_change >= 1.50
```

Queries execute directly inside DuckDB WASM.

No server communication is required.

---

# 🔗 Reproducible Deep Linking

Analytical state is serialized into URLs.

Researchers can:

- Configure filters
- Share findings
- Preserve exact analytical states
- Reproduce previous analyses

This supports transparent computational research workflows.

---

# ♟ Interactive Position Analysis

Included functionality:

- Interactive chessboard
- Position replay
- FEN export
- Best-move comparison
- Played-move comparison
- Evaluation timeline
- Expected Score Loss calculation
- Lichess integration

---

# 🧮 Mathematical Framework

## Expected Score Function

Winning probability model:

```math
ES(e)=\frac{1}{1+e^{-e/2.2}}
```

Where:

- `e` = engine evaluation
- `2.2` = calibration constant

---

## Expected Score Loss (ESL)

Percentage of winning probability lost through a human decision:

```math
ESL=
\max(0, ES(e_{before}) - ES(e_{after}))
\times100
```

---

## Opening Danger Index (ODI)

Behavioral risk metric for opening families:

```math
ODI=
\left(
\sum_{i=1}^{5}
w_iN_i
\right)
\times100
```

Where:

- `wᵢ` = normalized component weight
- `Nᵢ` = normalized component score

### Components

| Component | Weight |
|------------|--------|
| Error Volume | 0.28 |
| Blunder Density | 0.22 |
| Evaluation Magnitude | 0.24 |
| Player Diversity | 0.14 |
| Time Pressure Frequency | 0.12 |

---

## Panic Index

Average evaluation collapse under severe time pressure:

```math
PI_{<60}
=
\frac{1}{|M_{<60}|}
\sum_{x\in M_{<60}}
\Delta e_x
```

---

# 🔬 Reproducibility Tutorials

## Example Study 1

**Hypothesis**

> Grandmaster blunder rates in Nimzo-Indian structures increase significantly when the clock drops below 30 seconds.

---

## Example Study 2

**Hypothesis**

> Magnus Carlsen exhibits measurable evaluation-loss vulnerability while defending difficult positions under severe time pressure.

*These examples are included for methodological demonstration and hypothesis-testing workflows.*

---

# 📁 Installation

Because the platform relies on WebAssembly, Web Workers, and browser fetch APIs, it cannot be executed through the local `file://` protocol.

A local web server is required.

## Clone Repository

```bash
git clone https://github.com/sciencewithsaucee-sudo/Chess-Multiverse-Error-Evaluation-Dataset-CMEED-.git

cd Chess-Multiverse-Error-Evaluation-Dataset-CMEED-
```

---

## Launch Local Server

### Python

```bash
python3 -m http.server 8000
```

### Node.js

```bash
npx serve
```

### VS Code

Install the **Live Server** extension and click **Go Live**.

---

## Open Application

```text
http://localhost:8000
```

---

# 📤 Export Support

Supported exports:

- CSV
- Markdown Research Briefs
- Shareable URLs
- FEN

---

# 🧪 Automated Verification Framework

Current verification status:

```text
16 Automated Verification Tests
0 Failures
12 Platform Modules Verified
```

### Verification Coverage

1. Parquet Ingestion Layer
2. DuckDB Relational Projections
3. Dynamic SQL Filter Compiler
4. Expected Score Loss Framework
5. Opening Danger Index Framework
6. Panic Index Framework
7. Material Signature Search
8. Reproducibility Layer
9. Export Systems
10. Dashboard Synchronization
11. Position Replay Engine
12. Performance Benchmarks

The verification suite validates analytical correctness, reproducibility workflows, mathematical consistency, and core platform infrastructure.

---

# 📖 Citation

If this software contributes to your research, please cite both the software and the dataset.

## Software

```text
Varshney, S. (2026).

Chess Multiverse Error Explorer
(Version 1.0) [Computer software].

GitHub.
```

## Dataset

```text
Varshney, S. (2026).

Chess Multiverse Error & Evaluation Dataset
(CMEED v1.0) [Data set].

Zenodo.

https://doi.org/10.5281/zenodo.20625716
```

---

# 📜 License

Released under the MIT License.

You may:

- Use
- Modify
- Distribute
- Commercialize

the software provided that the original license and copyright notice remain included.

---

# 👨‍🔬 Author

**Sparsh Varshney**

Founder, Chess Multiverse Lab

**ORCID:** 0009-0004-7835-0673

### Research Interests

- Chess Analytics
- Human Error Research
- Computational Behavioral Science
- Cognitive Performance Modeling
- Open Research Infrastructure

---

# 🌍 Vision

The Chess Multiverse Error Explorer seeks to transform chess databases from repositories of moves into laboratories of human decision-making, enabling researchers to study how expertise, pressure, complexity, and cognition interact in one of the world's most demanding intellectual domains.
