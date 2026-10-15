# Stack taxonomy — what is in which box, and why

Written because the placement of a tool is a claim, and a wrong one is the kind
of thing an interviewer notices before anything else on the page. If a reader
who runs these tools daily disagrees with a box here, that is a bug — file it
against this document, not against taste.

**Last reviewed:** 2026-10-15 · 56 tools · 38 platform roles

---

## The rule the boxes follow

The Stack section has two readings of one dataset.

| View | Boxes are | Answers |
|---|---|---|
| **Tool list** | areas of *his* experience | "what does he know" |
| **System diagram** | jobs *a system* has to do | "does he know how they fit" |

The diagram's boxes are therefore **responsibilities, not categories of person**.
Nobody draws a box called "Data engineering" on a whiteboard. That reframing is
the only thing that makes the second view worth having, and it is also what
makes a misplacement obvious: a tool is in the wrong box when it does not do the
job the box names.

Three planes pass work downward; a substrate sits under all of them.

```
Data plane      ingest & orchestrate → store → shape & analyse → visualise
                                   ↓ features & findings
Model plane     vision detect | vision federated | classical |
                language adapt | hosted models | language retrieve
                                   ↓ weights & an index
Serving plane   inference → API → interface
Substrate       language & tests | package & run | deliver | track & evaluate
```

---

## The correction that prompted this document

**`Claude` was in the `Inference` box, with `vLLM` and `Ollama`. That was wrong.**

Those three are not the same kind of thing, and anyone who has deployed an LLM
knows it:

| Tool | What it actually is |
|---|---|
| **vLLM** | an inference *server* you run on your own GPUs |
| **Ollama** | a local *runtime* for running open models on your own machine |
| **Claude** | a *hosted model*, from Anthropic, that you call over an API |

The first two are infrastructure you operate. The third is a service you
consume. Putting them in one box claims they are interchangeable in a way they
are not — the choice between vLLM and Claude is a choice about who runs the
hardware, what the data does, and who the bill goes to.

**Fixed:** the Model plane gained a `Hosted models` box — *"frontier models
called, not run"* — which is where Claude sits. `Inference` now reads *"run a
model on your own hardware"* and contains vLLM and Ollama only. The cloud
matrix's `Managed LLM` role was re-pointed at the same box.

### Still open: coding assistants

Claude Code, Copilot and Cursor are a **fourth** category again — tools that
write the code, not components of what the code runs. They are currently named
**nowhere** on the site, at the owner's earlier instruction.

If they should appear, they need their own block (`Build tooling` or similar)
and must not be mixed into the stack, for exactly the reason above: how a thing
was built and what it is made of are different lists. **This is the owner's
call and has not been made.**

---

## Every tool, and the box it is in

### Data plane

| Tool | Box | Why it is there |
|---|---|---|
| Airflow | Ingest & orchestrate | Schedules and sequences pipeline steps |
| ETL pipelines | Ingest & orchestrate | The concept the orchestrator runs |
| PySpark | Ingest & orchestrate | Distributed compute over the raw pile |
| S3 | Store | Object storage — files addressed by name |
| PostgreSQL | Store | Relational, transactional |
| DynamoDB | Store | Key-value, single-record reads at scale |
| DuckDB | Store | In-process analytics over local files |
| SQL | Store | The language the stores are queried in |
| **Snowflake** | Store | Cloud warehouse; storage and compute separated |
| **Databricks** | Store | Lakehouse — warehouse behaviour over object storage |
| **Unity Catalog** | Store | Governance over what exists and who may read it |
| **PII & anonymisation** | Store | Masking happens *before* data moves on, so it belongs with the data, not with security at the end |
| pandas · Polars · NumPy | Shape & analyse | In-memory reshaping and numerics |
| Exploratory analysis | Shape & analyse | The practice, not a product |
| Jupyter · Plotly · Streamlit | Visualise | Where results are read by a person |

### Model plane — *alternatives, not steps*

| Tool | Box | Why it is there |
|---|---|---|
| PyTorch · YOLOv8 · OpenCV · Detection & tracking | Vision — detect & track | A model over frames |
| Federated learning | Vision — federated | A training *topology* where data may not move — a different problem from detection, not a variant of it |
| scikit-learn | Classical ML | Non-deep models on tabular data |
| Hugging Face · Transformers · Fine-tuning | Language — adapt | Taking a general model and fitting it to a task |
| **Claude** | **Hosted models** | A model someone else runs. **Not** inference infrastructure |
| Embeddings · Pinecone · LangChain · LangGraph | Language — retrieve | Indexing a corpus and grounding answers in it |

### Serving plane

| Tool | Box | Why it is there |
|---|---|---|
| vLLM · Ollama | Inference | Runtimes you operate yourself |
| FastAPI · Pydantic | API | The contract, and input stopped at the edge |
| **Guardrails** | API | Output validation is an *edge contract*, the mirror of Pydantic's input validation. It is not a model and not a runtime |
| Next.js · React · TypeScript · Tauri | Interface | The screen a person uses |

### Substrate — *not a stage; nothing flows in or out*

| Tool | Box | Why it is there |
|---|---|---|
| Python · pytest | Language & tests | What all of it is written and checked in |
| Docker · Kubernetes · Helm | Package & run | Same behaviour on a laptop and a cluster |
| **IAM & RBAC** | Package & run | Access policy is decided with the runtime, and it is **not** a cloud-only concern — data engineering, data science and DevOps all set it |
| **Secrets management** | Package & run | Same reasoning: a runtime concern, not an afterthought |
| GitHub Actions | Deliver | Every change built and shipped the same way |
| MLflow · Weights & Biases · DVC · Evaluation | Track & evaluate | Which run produced which number |
| **LangSmith** | Track & evaluate | Tracing and scoring LLM calls — the same job as MLflow, for a different kind of model |
| **Ragas** | Track & evaluate | Scores *grounding*, so it is evaluation, not retrieval |

---

## Judgement calls worth challenging

These are the placements I would expect a reader to argue with. Each is a
decision, not an oversight.

1. **`PII & anonymisation` is in the Data plane, not the Substrate.** Security
   tooling usually lives with infrastructure, but masking has to happen before
   data moves downstream, and putting it at the end would draw a system where
   personal data reaches the model first.
2. **`Guardrails` is in API, not in the Model plane.** It is tempting to file it
   with the model it constrains. But it runs at the boundary, on the way out,
   next to the other validation — which is also where it is configured.
3. **`Databricks` and `Snowflake` are both in Store.** They are platforms rather
   than stores, and each could justify a box. They are filed by the job they do
   *in this system*: holding queryable data.
4. **`Federated learning` has a box of its own with one entry.** A single-item
   box looks thin until you notice it is a constraint on topology, not a model
   choice — and it is the thing two of the owner's projects are actually about.
5. **`SQL`, `ETL pipelines`, `Exploratory analysis`, `Evaluation` are concepts,
   not products.** They are in the list because the list is what he reaches for,
   and some of what you reach for is a technique. They carry drawn marks rather
   than logos for the same reason.

## Things the owner should verify before this ships

The following were added on request and are **claims about his experience** that
only he can confirm. If any of these is not true, remove the tool from
`stackGroups` in `src/constants/index.js` and the test suite will tell you what
else needs to move:

`Snowflake` · `Databricks` · `Unity Catalog` · `Guardrails` · `LangSmith` ·
`Ragas` · `IAM & RBAC` · `Secrets management` · `PII & anonymisation`

---

## What is *not* a claim about him

The cloud matrix (38 roles × AWS / Google Cloud / Azure) is a mapping, not a
CV. Only the **"What I use"** column says anything about the owner; the other
three say what fills that role on each platform. Ten of the 38 rows carry an em
dash in that column, which means *the slot is real and he is not claiming it*.

`utils/stages.test.mjs` enforces the boundary: the `mine` column may only name
something already in `stackGroups`.

## How this stays true

| Check | What it catches |
|---|---|
| `test_every_listed_tool_appears_in_a_stage` | a tool in the list but in no box |
| `test_every_staged_tool_is_a_listed_tool` | a box naming something he does not list |
| `test_no_tool_is_staged_twice` | one tool drawn in two boxes |
| `test_every_staged_tool_has_a_definition` | a term with no plain-English meaning |
| `test_the_mine_column_only_names_real_tools` | the matrix inventing experience |
| `test_no_node_is_empty` | a box asserting a job nothing fills |

Run them with `npm test`. They are arithmetic over the constants, so they catch
drift but **not** a wrong box — that is what this document is for.
