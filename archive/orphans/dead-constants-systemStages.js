/*
 * DEAD EXPORTS, removed from portfolio/src/constants/index.js on 2026-10-16.
 *
 * `systemStages` and `systemFloor` were the Stack diagram's first filing:
 * five stages in a row. They were superseded by `systemPlanes` and
 * `systemSubstrate` (three planes and a substrate, 17 nodes) when the diagram
 * was relayered, and the replacement landed without these being removed.
 *
 * Verified dead before removal: nothing in src/ imported either name. The
 * only remaining mention was a stale docstring in StackDiagram.jsx, fixed in
 * the same commit.
 *
 * Kept rather than deleted so the earlier shape is recoverable.
 */

/**
 * `out` is what LEAVES a stage, and it is the point of drawing this at all.
 *
 * A bare arrow between two boxes is decoration; it says "and then". A labelled
 * arrow says what the next stage receives, which is the one thing a tool list
 * structurally cannot express no matter how it is arranged.
 */
export const systemStages = [
  {
    id: "ingest",
    title: "Ingest & store",
    role: "Raw data in, addressable",
    tint: "--c-cat-data",
    items: ["Airflow", "ETL pipelines", "PySpark", "S3", "PostgreSQL", "DynamoDB", "DuckDB", "SQL"],
    out: "tables",
  },
  {
    id: "prepare",
    title: "Explore & prepare",
    role: "What the data supports",
    tint: "--c-cat-science",
    items: ["pandas", "Polars", "NumPy", "scikit-learn", "Jupyter", "Plotly", "Exploratory analysis"],
    out: "features",
  },
  // The fork. Both of these read the same prepared data and both feed Serve,
  // which is the structural claim the six-column list cannot make.
  {
    id: "vision",
    title: "Vision models",
    role: "Detect and track on footage",
    tint: "--c-cat-vision",
    parallel: true,
    items: ["PyTorch", "YOLOv8", "OpenCV", "Detection & tracking", "Federated learning"],
  },
  {
    id: "language",
    title: "Language models & retrieval",
    role: "Answers, grounded in sources",
    tint: "--c-cat-llm",
    parallel: true,
    items: ["Hugging Face", "Transformers", "Fine-tuning", "Embeddings", "Pinecone", "LangChain", "LangGraph", "Claude", "Ollama"],
    out: "weights + index",
  },
  {
    id: "serve",
    title: "Serve & interface",
    role: "Behind an API and a screen",
    tint: "--c-cat-backend",
    items: ["vLLM", "FastAPI", "Pydantic", "Streamlit", "Next.js", "React", "TypeScript", "Tauri"],
  },
];

/* Not a stage: nothing flows into it and nothing flows out. It is the floor
   every stage above stands on, which is why it is drawn as a band rather than
   as a sixth box in the chain. */

export const systemFloor = {
  title: "Ship & observe",
  role: "Everything above runs on this",
  tint: "--c-cat-mlops",
  items: ["Python", "Docker", "Kubernetes", "Helm", "GitHub Actions", "pytest", "MLflow", "Weights & Biases", "DVC", "Evaluation"],
};

/**
 * WHY THE STACK IS ALSO DRAWN AS A SYSTEM, in the reader's words rather than
 * the code's. Opened from a `?` beside the diagram, the same affordance the
 * hero field uses -- a visualisation that needs explaining should carry its
 * own explanation rather than assuming the reader shares the author's mental
 * model.
 */
