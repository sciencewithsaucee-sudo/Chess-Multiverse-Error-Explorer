# Contributing to Chess Multiverse Error Explorer

Thank you for your interest in contributing to the **Chess Multiverse Error Explorer**.

This project is part of the broader **Chess Multiverse Lab** initiative and aims to provide reproducible, open research infrastructure for studying human chess errors, decision-making, time-pressure effects, and behavioral analytics.

We welcome contributions from:

* Software developers
* Data scientists
* Chess researchers
* Open-science contributors
* UX/UI designers
* Documentation writers
* Students and independent researchers

---

# Guiding Principles

Contributions should support one or more of the following goals:

* Reproducibility
* Transparency
* Analytical correctness
* Research usability
* Open science
* Long-term maintainability

The project prioritizes research quality over feature quantity.

---

# Ways to Contribute

## Bug Reports

If you discover a bug:

1. Search existing issues first.
2. Create a new issue if none exists.
3. Include:

   * Browser version
   * Operating system
   * Steps to reproduce
   * Expected behavior
   * Actual behavior
   * Screenshots if applicable

---

## Feature Requests

Feature proposals should:

* Clearly describe the problem
* Explain the research value
* Provide a proposed implementation approach
* Consider reproducibility implications

Examples:

* New analytical metrics
* Additional export formats
* Dashboard enhancements
* Query optimization
* Accessibility improvements

---

## Code Contributions

### Workflow

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-improvement
```

3. Commit changes using descriptive messages.

```bash
git commit -m "Add opening volatility metric"
```

4. Push your branch.

```bash
git push origin feature/my-improvement
```

5. Open a Pull Request.

---

# Development Guidelines

## JavaScript

Please follow existing coding conventions:

* Use descriptive variable names.
* Prefer explicit logic over clever shortcuts.
* Keep analytical calculations readable.
* Comment non-obvious mathematical operations.
* Avoid introducing unnecessary dependencies.

---

## SQL

Generated SQL should:

* Remain reproducible.
* Avoid browser-blocking queries.
* Be compatible with DuckDB WASM.
* Prioritize analytical clarity.

---

## User Interface

UI contributions should:

* Remain responsive.
* Support mobile devices.
* Preserve accessibility.
* Avoid unnecessary visual complexity.

---

# Research Metrics

Several metrics implemented in the platform are research constructs.

Examples include:

* Expected Score Loss (ESL)
* Opening Danger Index (ODI)
* Panic Index

Changes affecting these metrics should:

1. Include methodological justification.
2. Include validation examples.
3. Update documentation.
4. Preserve reproducibility.

---

# Testing Requirements

All contributions should pass the automated verification framework.

Current validation coverage includes:

1. Parquet ingestion
2. DuckDB projections
3. SQL filter generation
4. Expected Score Loss calculations
5. Opening Danger Index calculations
6. Panic Index calculations
7. Material-signature search
8. State serialization
9. Export systems
10. Dashboard synchronization
11. Position replay validation
12. Performance benchmarks

Where applicable, new features should include additional tests.

---

# Documentation Contributions

Documentation improvements are highly encouraged.

Examples:

* Correcting inaccuracies
* Improving tutorials
* Expanding methodology explanations
* Enhancing installation instructions
* Adding reproducibility examples

---

# Dataset Contributions

The Chess Multiverse Error Explorer depends on the Chess Multiverse Error & Evaluation Dataset (CMEED).

If contributing dataset improvements:

* Preserve schema compatibility whenever possible.
* Document structural changes.
* Maintain reproducibility.
* Provide migration notes when necessary.

---

# Pull Request Checklist

Before submitting a pull request:

* [ ] Code compiles successfully
* [ ] Existing tests pass
* [ ] Documentation is updated
* [ ] New functionality is explained
* [ ] No unnecessary dependencies added
* [ ] Reproducibility is preserved

---

# Citation

If your contribution results in a publication, please cite:

**Chess Multiverse Error Explorer**

and

**Chess Multiverse Error & Evaluation Dataset (CMEED v1.0)**

as described in the project README.

---

# Questions

For questions, discussions, or research collaboration ideas, please open a GitHub Issue.

Constructive feedback, reproducible research practices, and open collaboration are always welcome.

Thank you for helping improve open chess research infrastructure.
