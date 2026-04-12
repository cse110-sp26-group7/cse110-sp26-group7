# CSE110 SP26 — Tech Warm-Up: The One Arm AI Slot Machine Experiment

## Overview

This repository contains all materials for the slot machine generative AI experiment. We are measuring output variation, drift, and quality spread when the same prompt is run 50 times under controlled conditions using Claude Code, then refining the best results through structured prompt reduction.

---

## Team

12 members — 5 runs per member for the baseline phase (with 2 members doing 5 runs each and covering the remaining 2 between them, or as divided by the team).

---

## Coding Assistant & Model

| Field | Value |
|---|---|
| Coding assistant | Claude Code |
| Model name | Claude Haiku 4.5 |
| Model family | Claude 4 |

---

## Clean Session Procedure

Every single run — baseline and refinement — must follow these steps exactly. Deviating from this procedure invalidates your data.

1. Close any existing Claude Code session completely.
2. Open a brand new terminal session.
3. Confirm there is no `CLAUDE.md` file in your working directory or any parent directory.
4. Confirm no MCP servers are configured for this session.
5. Confirm no project memory, skills files, or carried-over context exists.
6. Start Claude Code and verify the model is Claude Haiku 4.5
7. Paste the prompt from `prompts/original-prompt.txt` verbatim — no modifications, no extra whitespace.
8. Record all metrics immediately after the run completes.
9. Commit the output to its candidate folder before starting the next run.

---

## Repository Structure

```
/
├── prompts/
│   ├── original-prompt.txt           # frozen baseline prompt (do not edit)
│   ├── refinement-prompt-step2.txt   # added after phase 3A
│   ├── refinement-prompt-step3.txt   # added after phase 3B
│   ├── refinement-prompt-step4.txt   # added after phase 4
│   └── refinement-prompt-step5.txt   # added after phase 5
│
├── step1/
│   ├── candidate-001/                # generated code only, no edits
│   ├── candidate-002/
│   │   ...
│   ├── candidate-050/
│   └── metrics.csv                   # all 50 run metrics
│
├── step2/                            # top 5 candidates, one refinement each
│   └── candidate-0XX-refinement-1/
│
├── step3/                            # top 3 candidates, one refinement each
├── step4/                            # top 2 candidates, one refinement each
├── step5/                            # final candidate, one last refinement
│
├── README.md
├── RUBRIC.md
├── STEP1-RESULTS.md                  # written after phase 3A
├── STEP2-RESULTS.md                  # written after phase 3B
└── FINAL-REPORT.md                   # written after phase 5
```

---

## Metrics

Collect the following fields for every run and add a row to the relevant `metrics.csv`:

| Field | Notes |
|---|---|
| Run ID | e.g. `candidate-014` |
| Timestamp | ISO 8601 format |
| Model + version string | exactly as reported by Claude Code |
| Input tokens | as reported by the tool |
| Output tokens | as reported by the tool |
| Total tokens | sum of input + output |
| Wall-clock time (s) | measured by stopwatch or tool log |
| Tool-reported time (s) | if different from wall clock |
| Files produced | count and names |
| Lines of code | total across all produced files |
| Runs in browser? | yes / no / partial |
| App quality notes | 1–3 sentences qualitative |
| Code quality notes | 1–3 sentences qualitative |

---

## Ground Rules

- Use the prompt in `prompts/original-prompt.txt` **verbatim** for all 50 baseline runs.
- Use model string Claude Haiku 4.5 for every run, baseline and refinement.
- Each run is a completely fresh session (see Clean Session Procedure above).
- **No hand-editing any generated code.** If it's broken, that is data.
- Each run is committed as its own folder immediately after completion.
- Each refinement prompt must be **200 words or fewer**. No exceptions.
- Refinement prompts may not introduce new technologies.
- Each refinement is a **single turn** — one prompt, no follow-ups.

---

## Experiment Notes

This is not a benchmark of Claude as a model. The sample size is small, the task is narrow, and the frozen-prompt rule deliberately constrains us. Results should be interpreted as a snapshot of one specific interaction pattern, not a general evaluation of AI coding tools.

State any limitations and concerns honestly in `FINAL-REPORT.md`.
