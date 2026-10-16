/**
 * Every term the page renders, in plain English. A term with no entry here
 * renders with no definition, which a reader cannot tell from one that is
 * broken.
 *
 * Split out of a single 885-line `index.js` on 2026-10-16. `index.js` is now a
 * barrel re-exporting every one of these, so every existing
 * `from "../constants"` import is unchanged.
 */

/* One definition, two terms. `Federated` and `Federated learning` are the
   same idea and must not drift into two descriptions of it. */
const FEDERATED = {
  def: "Training a model across many devices without their raw data ever leaving them (privacy-preserving).",
  link: "https://en.wikipedia.org/wiki/Federated_learning",
  full: "Federated learning",
};


export const glossary = {
  RAG: { def: "Retrieval-Augmented Generation, the AI looks things up in real documents before answering, so it cites sources instead of guessing.", link: "https://en.wikipedia.org/wiki/Retrieval-augmented_generation", full: "Retrieval-Augmented Generation" },
  LLM: { def: "Large Language Model, the kind of AI (like ChatGPT) that understands and writes text.", link: "https://en.wikipedia.org/wiki/Large_language_model", full: "Large Language Model" },
  MLOps: { def: "The tooling and process to ship, monitor, and update ML models reliably, DevOps, but for models.", link: "https://en.wikipedia.org/wiki/MLOps", full: "Machine Learning Operations" },
  Kubernetes: { def: "An industry-standard system that runs and scales apps across many servers automatically.", link: "https://kubernetes.io/", full: "Kubernetes container orchestration" },
  FastAPI: { def: "A fast Python framework for building web APIs, the backend that serves the model.", link: "https://fastapi.tiangolo.com/", full: "FastAPI web framework" },
  Vision: { def: "Computer vision: teaching software to understand images and video.", link: "https://en.wikipedia.org/wiki/Computer_vision", full: "Computer vision" },
  Federated: FEDERATED,
  PyTorch: { def: "A popular open-source library for building and training neural networks.", link: "https://pytorch.org/" },
  OpenCV: { def: "A widely-used library for processing images and video.", link: "https://opencv.org/", full: "Open Source Computer Vision Library" },
  Docker: { def: "Packages an app with everything it needs so it runs the same anywhere.", link: "https://www.docker.com/" },
  React: { def: "A popular library for building interactive web interfaces.", link: "https://react.dev/" },
  "Applied ML": { def: "Applied machine learning: using ML to solve a real, practical problem.", link: "https://en.wikipedia.org/wiki/Machine_learning", full: "Applied machine learning" },
  Multimodal: { def: "Works across several data types at once, e.g. video, audio, and text together.", link: "https://huggingface.co/tasks", full: "Multimodal machine learning" },
  Python: { def: "The main programming language for data and AI work.", link: "https://www.python.org/" },
  Product: { def: "A finished, usable app: not a prototype.", link: null },
  Live: { def: "Deployed and running in the real world right now.", link: null },
  // stack tools
  PySpark: { def: "Python for Apache Spark: processing very large datasets across many machines.", link: "https://spark.apache.org/docs/latest/api/python/", full: "Python API for Apache Spark" },
  "ETL pipelines": { def: "Extract, Transform, Load, the plumbing that moves and cleans data between systems.", link: "https://en.wikipedia.org/wiki/Extract,_transform,_load", full: "Extract, Transform, Load" },
  PostgreSQL: { def: "A powerful open-source relational database.", link: "https://www.postgresql.org/" },
  DynamoDB: { def: "Amazon's fully-managed NoSQL database for fast, large-scale apps.", link: "https://aws.amazon.com/dynamodb/", full: "Amazon DynamoDB" },
  S3: { def: "Amazon's cloud object storage: where files and data live.", link: "https://aws.amazon.com/s3/", full: "Amazon Simple Storage Service" },
  SQL: { def: "The standard language for querying databases.", link: "https://en.wikipedia.org/wiki/SQL", full: "Structured Query Language" },
  pandas: { def: "The go-to Python library for working with tables of data.", link: "https://pandas.pydata.org/" },
  NumPy: { def: "The core Python library for fast numerical computing.", link: "https://numpy.org/", full: "Numerical Python" },
  "scikit-learn": { def: "The standard Python library for classical machine learning.", link: "https://scikit-learn.org/" },
  Evaluation: { def: "Measuring how good a model actually is, with real metrics, not vibes.", link: "https://huggingface.co/docs/evaluate/index" },
  "Exploratory analysis": { def: "Digging through data first to understand what's there before modelling.", link: "https://en.wikipedia.org/wiki/Exploratory_data_analysis" },
  LangChain: { def: "A framework for building apps around large language models.", link: "https://www.langchain.com/" },
  LangGraph: { def: "A framework for building AI agents as controllable, stateful graphs.", link: "https://www.langchain.com/langgraph" },
  Ollama: { def: "Runs open large language models locally on your own machine.", link: "https://ollama.com/" },
  Claude: { def: "Anthropic's family of AI assistants (large language models).", link: "https://www.anthropic.com/claude" },
  Pinecone: { def: "A vector database: stores embeddings for fast similarity search (powers RAG).", link: "https://www.pinecone.io/" },
  Embeddings: { def: "Turning text or images into numbers that capture meaning, so similar things sit close together.", link: "https://huggingface.co/blog/getting-started-with-embeddings" },
  YOLOv8: { def: "A fast, popular real-time object-detection model.", link: "https://docs.ultralytics.com/", full: "You Only Look Once, version 8" },
  "Detection & tracking": { def: "Finding objects in each frame and following them across a video.", link: "https://en.wikipedia.org/wiki/Object_detection" },
  "Federated learning": FEDERATED,
  MLflow: { def: "Tracks ML experiments and manages model versions.", link: "https://mlflow.org/", full: "MLflow experiment tracking" },
  "GitHub Actions": { def: "Automation that builds, tests, and deploys code on every change (CI/CD).", link: "https://github.com/features/actions" },
  Helm: { def: "A package manager for deploying apps onto Kubernetes.", link: "https://helm.sh/" },
  "Next.js": { def: "A popular React framework for building fast, production web apps.", link: "https://nextjs.org/" },
  TypeScript: { def: "JavaScript with types: catches bugs before the code runs.", link: "https://www.typescriptlang.org/" },
  Tauri: { def: "Builds small, fast desktop apps from web code.", link: "https://tauri.app/" },
  Neo4j: { def: "A graph database: stores data as nodes and the relationships between them, which makes connected questions cheap to ask.", link: "https://neo4j.com/", full: "Neo4j graph database" },
  Azure: { def: "Microsoft's cloud platform, the servers, storage and managed services an app runs on.", link: "https://azure.microsoft.com/", full: "Microsoft Azure" },
  Databricks: { def: "A platform for large-scale data and ML work, built around Apache Spark.", link: "https://www.databricks.com/", full: "Databricks Lakehouse Platform" },
  Snowflake: { def: "A cloud data warehouse that separates storage from compute, so a query can scale without moving the data.", link: "https://www.snowflake.com/" },
  Databricks: { def: "A lakehouse platform: Spark, notebooks and ML on files in object storage, instead of a separate warehouse.", link: "https://www.databricks.com/" },
  "Unity Catalog": { def: "One place that records what data and models exist, who owns them and who may read them, across workspaces.", link: "https://www.databricks.com/product/unity-catalog" },
  Guardrails: { def: "Checks on what a model may receive and emit — blocked topics, PII, format, grounding — enforced before an answer reaches anyone.", link: "https://www.guardrailsai.com/" },
  LangSmith: { def: "Traces every step an LLM app took and scores the result, so a bad answer can be explained rather than guessed at.", link: "https://www.langchain.com/langsmith" },
  Ragas: { def: "Scores a RAG system on whether its answer is grounded in what it retrieved, not on whether it sounds right.", link: "https://docs.ragas.io/" },
  "IAM & RBAC": { def: "Who may do what, to which resource, written as policy rather than left to whoever created the bucket.", link: "https://en.wikipedia.org/wiki/Identity_management", full: "Identity and access management" },
  "Secrets management": { def: "Keys and tokens held in one audited place, rotated, and never committed to a repository.", link: "https://en.wikipedia.org/wiki/Key_management" },
  "PII & anonymisation": { def: "Finding personal data and masking it before it reaches a model, a log or a notebook.", link: "https://en.wikipedia.org/wiki/Personal_data", full: "Personally identifiable information" },
  /* THE ROLES, and these are the entries that make the cloud view readable.
     Reported: "you are saying Cloud Storage, but it doesn't mean anything
     here." Right — and the fix belongs on the ROLE rather than the service,
     because the role is the part that stays constant across all four columns.
     Thirty-three definitions cover ninety-nine services, and they stay true
     when a vendor renames a product.
     Linked to Wikipedia rather than vendor docs on purpose: the concept
     outlives the product, and the vendors reorganise their docs constantly. */
  "Orchestration": { def: "Runs the steps of a pipeline in order, on a schedule, and tells you which one failed.", link: "https://en.wikipedia.org/wiki/Orchestration_(computing)" },
  "Batch compute": { def: "Chews through a large pile of data all at once, across many machines, rather than row by row.", link: "https://en.wikipedia.org/wiki/Batch_processing" },
  "Managed ETL": { def: "Extract, transform, load — the plumbing that moves and reshapes data between systems, run for you.", link: "https://en.wikipedia.org/wiki/Extract,_transform,_load" },
  "Streaming & events": { def: "Carries events the moment they happen instead of waiting for a nightly batch.", link: "https://en.wikipedia.org/wiki/Event_stream_processing" },
  "Object store": { def: "Where the raw files live: cheap, enormous, and addressed by name rather than by folder.", link: "https://en.wikipedia.org/wiki/Object_storage" },
  "Relational store": { def: "Tables with enforced shape and relationships — the database most applications sit on.", link: "https://en.wikipedia.org/wiki/Relational_database" },
  "Key-value store": { def: "Fetches one record by its key, very fast, at any scale. No joins, no query planner.", link: "https://en.wikipedia.org/wiki/Key%E2%80%93value_database" },
  "Warehouse": { def: "The queryable copy of everything, organised for analysis rather than for the app that produced it.", link: "https://en.wikipedia.org/wiki/Data_warehouse" },
  "Query engine": { def: "Runs SQL over files that are not in a database, without loading them into one first.", link: "https://en.wikipedia.org/wiki/Database_engine" },
  "Catalog & governance": { def: "The index of what data exists, who owns it and who may read it.", link: "https://en.wikipedia.org/wiki/Data_governance" },
  "Notebooks": { def: "Where analysis is actually done: code, charts and notes in one document you can re-run.", link: "https://en.wikipedia.org/wiki/Notebook_interface" },
  "BI & dashboards": { def: "The charts non-engineers read. Usually the only part of a data platform most of a company sees.", link: "https://en.wikipedia.org/wiki/Business_intelligence" },
  "Training jobs": { def: "Running the training itself on machines bigger than a laptop, and stopping when it is done.", link: "https://en.wikipedia.org/wiki/Machine_learning" },
  "Experiment tracking": { def: "Records what each run used and what it scored, so two experiments can be compared rather than remembered.", link: "https://en.wikipedia.org/wiki/MLOps" },
  "Model registry": { def: "The shelf of trained models with versions, so you can say exactly which one is in production.", link: "https://en.wikipedia.org/wiki/MLOps" },
  "ML pipelines": { def: "The training path as repeatable steps, so a model can be rebuilt without anyone remembering how.", link: "https://en.wikipedia.org/wiki/Pipeline_(computing)" },
  "Feature store": { def: "One agreed definition of each input, shared by training and serving, so the two cannot drift apart.", link: "https://en.wikipedia.org/wiki/Feature_engineering" },
  "Vector index": { def: "Stores embeddings and finds the nearest ones fast. This is what makes retrieval work.", link: "https://en.wikipedia.org/wiki/Vector_database" },
  "Managed LLM": { def: "A large language model someone else hosts, called over an API instead of run on your own hardware.", link: "https://en.wikipedia.org/wiki/Large_language_model" },
  "Document & vision AI": { def: "Ready-made models that read documents and images — OCR, detection, classification — without training your own.", link: "https://en.wikipedia.org/wiki/Optical_character_recognition" },
  "Model serving": { def: "Puts a trained model behind an endpoint and keeps it answering under real traffic.", link: "https://en.wikipedia.org/wiki/Inference_engine" },
  "Serverless functions": { def: "A piece of code that runs on demand with no server to keep alive, billed per call.", link: "https://en.wikipedia.org/wiki/Function_as_a_service" },
  "Containers on demand": { def: "Runs a container when there is work and stops when there is not, without managing a cluster.", link: "https://en.wikipedia.org/wiki/Containerization_(computing)" },
  "API gateway": { def: "The front door: routing, auth, rate limits and versioning in front of whatever is behind it.", link: "https://en.wikipedia.org/wiki/API_management" },
  "Queue": { def: "Holds work until something is ready to do it, so a spike does not become an outage.", link: "https://en.wikipedia.org/wiki/Message_queue" },
  "Cache": { def: "Keeps the answer to an expensive question nearby so it is not computed twice.", link: "https://en.wikipedia.org/wiki/Cache_(computing)" },
  "Container runtime": { def: "Runs and scales containers across many machines, replacing ones that die.", link: "https://en.wikipedia.org/wiki/Kubernetes" },
  "Container registry": { def: "Where built images are stored and pulled from, versioned like any other artifact.", link: "https://en.wikipedia.org/wiki/OS-level_virtualization" },
  "CI/CD": { def: "Builds, tests and ships every change the same way, so releasing is boring.", link: "https://en.wikipedia.org/wiki/CI/CD" },
  "Secrets": { def: "Keeps keys and passwords out of the code and out of the repository.", link: "https://en.wikipedia.org/wiki/Key_management" },
  "Identity & access": { def: "Who is allowed to do what. The thing that decides whether a request is permitted at all.", link: "https://en.wikipedia.org/wiki/Identity_management" },
  "Monitoring & logs": { def: "Tells you it broke, and ideally why, before a user does.", link: "https://en.wikipedia.org/wiki/Observability_(software)" },
  "Guardrails & safety": { def: "Stops a model answering with something it should not: blocked topics, leaked PII, ungrounded claims.", link: "https://en.wikipedia.org/wiki/AI_safety" },
  "LLM evaluation": { def: "Scores generated answers against something checkable — grounding, correctness, refusal — rather than a reading of the output.", link: "https://en.wikipedia.org/wiki/Language_model_benchmark" },
  Lakehouse: { def: "Warehouse behaviour over files in object storage: one copy of the data, queried and trained on in place.", link: "https://en.wikipedia.org/wiki/Data_lakehouse" },
  "Data privacy": { def: "Finding and masking personal data before it reaches a model, a log or a dashboard.", link: "https://en.wikipedia.org/wiki/Information_privacy" },
  "Audit & lineage": { def: "Who touched what, and where a number came from. The question every regulated system is eventually asked.", link: "https://en.wikipedia.org/wiki/Data_lineage" },
  "Cost & budgets": { def: "What it costs to run, per team and per service. The thing that decides whether it keeps running.", link: "https://en.wikipedia.org/wiki/FinOps" },
  // Added 2026-10-15. The six groups had drifted behind the work: the LLM area
  // named no model hub and no serving runtime, and the data areas named no
  // notebook and no chart library, which are the tools the day is actually
  // spent in. Every entry here is a thing with a definition a non-specialist
  // can read, same as the rest of this map -- a tool nobody can define is a
  // badge, and this section's own copy argues against badges.
  "Hugging Face": { def: "The main public hub for open models and datasets: where you find, download, and publish them.", link: "https://huggingface.co/", full: "Hugging Face Hub" },
  Transformers: { def: "The model architecture behind nearly every modern AI system, and the Hugging Face library that runs them.", link: "https://huggingface.co/docs/transformers/index" },
  "Fine-tuning": { def: "Taking a general pre-trained model and training it further on your own data so it fits your task.", link: "https://huggingface.co/docs/transformers/training" },
  vLLM: { def: "A serving engine that runs open LLMs fast enough for real traffic.", link: "https://docs.vllm.ai/", full: "vLLM inference engine" },
  Airflow: { def: "Schedules and monitors data pipelines, so each step runs in order and failures are visible.", link: "https://airflow.apache.org/", full: "Apache Airflow" },
  DuckDB: { def: "An in-process analytics database: SQL over local files, no server to run.", link: "https://duckdb.org/" },
  Polars: { def: "A dataframe library like pandas, built for speed on larger-than-memory data.", link: "https://pola.rs/" },
  Jupyter: { def: "The notebook where analysis is actually done: code, charts, and notes in one document.", link: "https://jupyter.org/", full: "Project Jupyter" },
  Plotly: { def: "Builds interactive charts you can zoom and hover, rather than a flat image.", link: "https://plotly.com/python/" },
  "Weights & Biases": { def: "Tracks training runs and their metrics, so two experiments can be compared instead of remembered.", link: "https://wandb.ai/", full: "Weights & Biases" },
  DVC: { def: "Git for datasets and models: versions the large files code alone cannot.", link: "https://dvc.org/", full: "Data Version Control" },
  Pydantic: { def: "Validates incoming data against a declared shape, so bad input fails at the edge instead of deep inside.", link: "https://docs.pydantic.dev/" },
  pytest: { def: "The standard Python testing framework.", link: "https://docs.pytest.org/" },
  Streamlit: { def: "Turns a Python script into a shareable web app, which is how a model gets in front of someone.", link: "https://streamlit.io/" },
};

// Said once per section. The affordance used to be announced on every single
// chip, which put 33 question marks on one screen.

// Said once per section. The affordance used to be announced on every single
// chip, which put 33 question marks on one screen.
export const TERM_HINT = "Dotted terms have a plain-English definition, tap one.";

/**
 * The nav is an index, so every entry says exactly what the section it points
 * at says. Three of them did not.
 *
 * "About" pointed at a section headed "Overview", and "Work" pointed at one
 * headed "Projects" — one section with two names each, which makes a reader
 * check whether they landed in the right place.
 *
 * "Work" was the worse of the two, because it also collided with "Experience":
 * a job is work, so the nav offered two words for the same idea and then used
 * neither of them as the heading. "Projects" is the specific word, and it is
 * what the section has always called itself.
 *
 * "Experience" went the same way afterwards. It is the conventional label and a
 * recruiter scans for it, which is why it survived the first pass — but it is
 * also a word that means everything and therefore nothing, and the section
 * holds four jobs with dates. "Roles" is what they are, it is what the spec
 * band already counts (`04 ROLES`), and the band now points at a section with
 * the same name on it.
 */
