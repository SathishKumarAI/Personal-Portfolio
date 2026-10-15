const GH = "https://github.com/SathishKumarAI";

// This site's own repository. Linked from the Collaborate band, which invites
// people into it, so it points at the repo root rather than at a file path:
// a deep link to CONTRIBUTING.md on a branch would 404 until that branch merges.
export const SITE_REPO = `${GH}/Personal-Portfolio`;

export const contact = {
  email: "sathishkumar786.ml@gmail.com",
  github: "SathishKumarAI",
  // Canonical slug is lowercase, it appears 72 times in his own saved
  // profile page, and the mixed-case form appears zero times.
  linkedin: "in/sathishkumarai",
  substack: "https://sathishkumarai.substack.com/",
  availability: "Open to roles",
  timezone: "US Central time",
};

// Portrait. Source is HeadShot.jpg at the repo root (1920x2879, kept out of
// git); this is a top-anchored 4:5 crop of it, resized to 600x750 and stripped
// of metadata. Regenerate with:
//   magick HeadShot.jpg -auto-orient -strip -crop 1920x2400+0+0 +repage //     -resize 600x750 -quality 82 -interlace Plane 3d_portfolio/public/headshot.jpg
export const profile = {
  photo: "/headshot.jpg",
  alt: "Sathish Kumar",
};

/**
 * The five reading themes.
 *
 * `scheme` is the second axis and it drives the structural CSS — the glass
 * shadows, the bloom and the grain all key off `data-scheme`, because
 * "everything that is not dark" stops being a usable selector once there is a
 * third palette.
 *
 * `note` is what the picker shows under the name. It says who a palette suits,
 * NOT what they will be shown: the content is identical in all five. A
 * portfolio that shows a recruiter different claims than it shows a professor
 * is not a theme, it is a lie with a switch on it.
 *
 * `bar` is the mobile browser-chrome colour, which has to match the ground or
 * the phone draws a seam across the top of the page. It doubles as the swatch's
 * ground, because it IS the ground.
 *
 * `accent` is here for the swatch and nowhere else. The palettes are
 * `:root[data-theme=...]` rules, so an element nested inside the page cannot
 * opt into another theme by carrying the attribute — the selector only ever
 * matches the document root. The swatch therefore paints from these two values
 * directly rather than inheriting.
 */
export const themes = [
  { id: "dark", label: "Slate", scheme: "dark", bar: "#0F2228", accent: "#FF4E3A",
    note: "Deep navy, easy on a long scroll." },
  { id: "ink", label: "Ink", scheme: "dark", bar: "#0B0D10", accent: "#FF5A42",
    note: "Near-black and cool, the highest contrast here. For a dark desktop." },
  { id: "light", label: "Paper", scheme: "light", bar: "#FFFFFF", accent: "#FF3621",
    note: "The default. Warm white, and what a first-time reader gets." },
  { id: "sepia", label: "Manuscript", scheme: "light", bar: "#F7F2E8", accent: "#BD4426",
    note: "Warm, low blue, gentle. Built for reading rather than scanning." },
  { id: "clean", label: "Clarity", scheme: "light", bar: "#FFFFFF", accent: "#D62D19",
    note: "Neutral and high contrast, accent pulled back. For reading fast." },
  { id: "paper", label: "Preprint", scheme: "light", bar: "#FFFFFF", accent: "#B31B1B",
    note: "An arXiv or IEEE page: white, near-black, Cornell red." },
];

export const themeById = (id) => themes.find((t) => t.id === id) || themes[0];

// Employment status. Verified from the LinkedIn profile header saved
// 2026-09-11: employer, headline, country and the on-site/hybrid/remote
// preference are his own published words, not inferred.
export const status = {
  company: "AdvanSoft International, Inc",
  // Confirmed by the owner: "AI Engineer" is the title. The LinkedIn header
  // reads "Machine Learning Engineer | LLMs | MLOps", but that is a headline,
  // not a job title, the two disagreed on the same page until this was settled.
  role: "AI Engineer",
  openTo: "AI engineering roles",
  // Was one string, "United States: on-site, hybrid or remote". Two fields now,
  // so the card can give the country and the arrangement a line each instead of
  // wrapping the sentence mid-phrase — it broke as "hybrid or / remote" at
  // 390px. The words are his, unchanged; only the punctuation between them is
  // gone, and the layout supplies what the colon used to.
  country: "United States",
  arrangement: "on-site, hybrid or remote",
};

// Roles, newest first. `start`/`end` are ISO "YYYY-MM" or null when not yet
// supplied; an entry renders whatever it has and nothing it does not, so a role
// with no dates shows no date range rather than an invented one.
export const experience = [
  {
    company: "AdvanSoft International, Inc",
    title: "AI Engineer",
    // drives the diagram in the margin; see CareerTrack.jsx GLYPHS
    glyph: "graph",
    location: "United States",
    start: "2024-12",
    end: null,
    current: true,
    points: [
      "Shipped a production RAG application over a Neo4j knowledge graph, with Cypher and embedding similarity driving retrieval for LLM-backed search and Q&A.",
      "Built the graph on Azure from retail product and catalog data, so analytics, ML features and RAG all read one source of truth.",
      "Owned the Data Factory pipelines feeding it.",
    ],
    stack: ["Neo4j", "RAG", "Azure", "Databricks", "PySpark", "Python"],
  },
  {
    company: "Integer IT Solutions",
    title: "Machine Learning Engineer",
    // drives the diagram in the margin; see CareerTrack.jsx GLYPHS
    glyph: "triage",
    location: "United States",
    start: "2024-05",
    end: "2024-12",
    current: false,
    points: [
      "Built Python NLP workflows that classify intent, score sentiment and extract entities from customer-support feedback, automating request triage.",
      "Trained and shipped the models with Azure ML and MLflow, served from FastAPI behind Docker on AKS.",
      "Added retraining, drift and evaluation checks, so accuracy could not slip unnoticed.",
    ],
    stack: ["Azure", "MLflow", "Docker", "Kubernetes", "FastAPI", "Python"],
  },
  {
    company: "Southern Illinois University",
    title: "Research Engineer",
    // drives the diagram in the margin; see CareerTrack.jsx GLYPHS
    glyph: "vision",
    location: "Carbondale, IL",
    start: "2022-01",
    end: "2023-12",
    current: false,
    points: [
      "Built and compared predictive models on behavioural and cognitive research data.",
      "Ran computer-vision work with CNNs and YOLOv5 for object detection.",
      "Trialled federated learning to train across separate datasets without moving them, which the project's privacy rules required, the same constraint behind the federated detection project below.",
    ],
    stack: ["PyTorch", "scikit-learn", "Federated learning", "OpenCV", "Docker"],
  },
  {
    company: "DotIn Solutions",
    title: "Software Engineer",
    // drives the diagram in the margin; see CareerTrack.jsx GLYPHS
    glyph: "pipeline",
    location: "India",
    start: "2020-01",
    end: "2021-12",
    current: false,
    points: [
      "Provisioned AWS infrastructure with Terraform and kept it consistent with Ansible.",
      "Built the Jenkins CI/CD pipelines that tested, packaged and deployed containerised apps.",
      "Ran them on EKS with Helm, using blue-green and canary rollouts.",
      "Stood up the monitoring stack, ELK, Grafana and CloudWatch, with alerting.",
    ],
    stack: ["S3", "Docker", "Kubernetes", "Helm", "GitHub Actions"],
  },
];

// Degrees, newest first. Same contract as `experience`: `start`/`end` are ISO
// "YYYY-MM" or null, and any field left null simply does not render.
export const education = [
  {
    school: "Southern Illinois University",
    degree: "M.S. Computer Science",
    location: "Carbondale, IL",
    start: null,
    end: "2024-05",
    current: false,
    summary: null,
    focus: [],
  },
  {
    school: "Anurag Group of Institutions",
    degree: "B.Tech Computer Science",
    location: "Hyderabad, India",
    start: null,
    end: "2021-05",
    current: false,
    summary: null,
    focus: [],
  },
];

export const quotes = [
  {
    text: "If you can't explain it simply, you don't understand it well enough.",
    author: "Albert Einstein",
  },
  {
    text: "An equation for me has no meaning unless it expresses a thought of God.",
    author: "Srinivasa Ramanujan",
  },
  {
    text: "Dream is not what you see in sleep; dream is the thing which does not let you sleep.",
    author: "A. P. J. Abdul Kalam",
  },
];

// plain-English definitions + a "learn more" link (curated: Wikipedia for
// concepts, official site for tools, Hugging Face for model/task terms).
// Any term without a link falls back to a Google search of the term.
/**
 * One concept, two chips: a project tag says "Federated", a stack item says
 * "Federated learning". They used to be two glossary entries with two
 * hand-written definitions, and they had already drifted — one carried
 * "(privacy-preserving)" and the other did not, so the same term explained
 * itself differently depending on which chip you hovered. Two keys, one object,
 * no way to drift. `full` is safe on both: TagTerm skips it when it equals the
 * chip's own name.
 */
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
export const navLinks = [
  { id: "about", title: "About" },
  { id: "roles", title: "Roles" },
  { id: "stack", title: "Stack" },
  { id: "projects", title: "Projects" },
  { id: "contact", title: "Contact" },
];

// `services` lived here: six "focus areas" rendered as cards in About. Deleted
// with the cards, not orphaned, because the six `stackGroups` below already
// partition the same skills and do it with named tools instead of adjectives.
// Two taxonomies of one person is one too many; the specific one won.

// Grouped stack, six areas across the data-to-AI path.
/**
 * Each group carries its own scan-aid dot class and its own primary tools.
 * `dot` is a full Tailwind class, not a token fragment, because Tailwind scans
 * for literal class strings: `bg-${g.dot}` built from "cat-data" would be
 * purged, while the literal "bg-cat-data" sitting here is found.
 * `tint` is the SAME colour as a raw variable name, because the card's glow
 * and the pipeline rail need `rgb(var(--c-cat-data) / 0.2)` and a Tailwind
 * class cannot be taken apart back into its token. Two fields for one colour
 * is the price of Tailwind's literal-string scan; they are declared adjacent
 * so they cannot drift apart unnoticed.
 * `primary` marks the tools that get the filled chip. Everything else stays
 * outline. Two per group is the ceiling on purpose: mark four and nothing is
 * marked.
 */
export const stackGroups = [
  {
    title: "Data engineering",
    note: "Moving and shaping data so the rest can trust it.",
    dot: "bg-cat-data",
    tint: "--c-cat-data",
    primary: ["PySpark", "SQL"],
    items: ["PySpark", "Airflow", "ETL pipelines", "PostgreSQL", "DynamoDB", "DuckDB", "S3", "SQL"],
  },
  {
    title: "Data science",
    note: "Finding what the data actually supports.",
    dot: "bg-cat-science",
    tint: "--c-cat-science",
    primary: ["pandas", "scikit-learn"],
    items: ["pandas", "Polars", "NumPy", "scikit-learn", "Jupyter", "Plotly", "Evaluation", "Exploratory analysis"],
  },
  {
    title: "LLM / RAG",
    note: "Grounded answers with citations, offline-first.",
    dot: "bg-cat-llm",
    tint: "--c-cat-llm",
    primary: ["Hugging Face", "LangChain"],
    items: ["Hugging Face", "Transformers", "LangChain", "LangGraph", "Fine-tuning", "vLLM", "Ollama", "Claude", "Pinecone", "Embeddings"],
  },
  {
    title: "Computer vision",
    note: "Detection and tracking on real footage.",
    dot: "bg-cat-vision",
    tint: "--c-cat-vision",
    primary: ["YOLOv8", "PyTorch"],
    items: ["YOLOv8", "OpenCV", "Detection & tracking", "Federated learning", "PyTorch"],
  },
  {
    title: "MLOps & infra",
    note: "Shipping models like software: reproducible, deployable.",
    dot: "bg-cat-mlops",
    tint: "--c-cat-mlops",
    primary: ["MLflow", "Docker"],
    items: ["MLflow", "Weights & Biases", "DVC", "Docker", "GitHub Actions", "Kubernetes", "Helm"],
  },
  {
    title: "Backend & apps",
    note: "The interface a person actually uses.",
    dot: "bg-cat-backend",
    tint: "--c-cat-backend",
    primary: ["Python", "FastAPI"],
    items: ["Python", "FastAPI", "Pydantic", "pytest", "Streamlit", "Next.js", "React", "TypeScript", "Tauri"],
  },
];

export const projects = [
  {
    name: "rag-pipeline-langchain",
    cover: "retrieval",
    outcome: "Production RAG on AWS with a measured retrieval loop and GitOps deploys.",
    stages: ["ingest", "embed", "retrieve", "generate"],
    description:
      "LangChain and LangGraph drive retrieval over a Pinecone store, MLflow tracks every evaluation run, and releases ship through a GitOps path on Kubernetes and Helm.",
    tags: ["RAG", "MLOps", "Kubernetes"],
    source_code_link: `${GH}/rag-pipeline-langchain`,
    live_link: null,
  },
  {
    name: "ai-due-diligence-copilot",
    cover: "citation",
    outcome: "Document Q&A that cites the exact source passage behind every answer.",
    stages: ["docs", "index", "ask", "cite"],
    description:
      "Due-diligence reading over pitch decks, 10-Ks and term sheets. Defaults to a local Ollama model with no account or key; one environment variable switches it to Claude. FastAPI behind a Next.js front end.",
    tags: ["LLM", "RAG", "FastAPI"],
    source_code_link: `${GH}/ai-due-diligence-copilot`,
    live_link: null,
  },
  {
    name: "federated-yolov8-object-detection",
    cover: "federated",
    outcome: "YOLOv8 detection trained federated: raw data never leaves the client.",
    stages: ["clients", "local train", "aggregate", "detect"],
    description:
      "Training is distributed across clients with Flower, only model updates cross the network, never the images. The privacy constraint shapes the architecture rather than sitting on top of it.",
    tags: ["Vision", "Federated", "PyTorch"],
    source_code_link: `${GH}/federated-yolov8-object-detection`,
    live_link: null,
  },
  {
    name: "instagram-reels-extractor",
    cover: "frames",
    outcome: "Turns video into structured, searchable text via transcript, OCR, and vision.",
    stages: ["video", "transcribe", "index", "search"],
    description:
      "Caption, transcript, OCR and structured vision are merged into one document, rendered as a PDF and a linked docs site, with semantic search that runs entirely on your own machine.",
    tags: ["Applied ML", "Multimodal", "Python"],
    source_code_link: `${GH}/instagram-reels-extractor`,
    live_link: null,
  },
  {
    name: "pickleball-vision-llm",
    cover: "tracking",
    outcome: "Detection + tracking over match footage, split into modular layers.",
    stages: ["video", "vision", "api", "ui"],
    description:
      "Four layers that move independently: vision, ML, API, front end, so the detection model can be replaced without touching the interface that shows its output.",
    tags: ["Vision", "OpenCV", "Docker"],
    source_code_link: `${GH}/pickleball-vision-llm`,
    live_link: null,
  },
  {
    name: "pb-card-deck",
    cover: "scorecard",
    outcome: "Live mobile-first scorekeeper: no login, works offline after first load.",
    stages: ["load", "cache", "play", "score"],
    description:
      "A deck of 1,729 twist cards drawn mid-match, alongside side-out scoring. Local-first PWA: no account, no backend, nothing to install.",
    tags: ["Product", "Live", "React"],
    source_code_link: `${GH}/pb-card-deck`,
    live_link: "https://pb-card-deck.vercel.app/",
  },
];

/* ---------------------------------------------------------------------------
   THE SAME 47 TOOLS, AS A LAYERED ARCHITECTURE.

   `stackGroups` above answers "what does he know" and its boxes are areas of
   HIS experience. This answers "how does it fit together", and its boxes are
   the jobs a system has to do.

   WHY PLANES AND NOT ONE CHAIN. The first version of this was five stages in a
   row, and a single chain cannot say the thing that actually matters about an
   ML system: some of it is a FLOW and some of it is a SUBSTRATE. Airflow runs
   before pandas runs before FastAPI — that is a flow. Python, Docker and
   MLflow do not sit anywhere in that order; everything above stands on them.
   Drawing all of it as one left-to-right sequence made the second kind look
   like the first.

   It also collapsed work that is genuinely separate. "Computer vision" as one
   box hides that detection and federated training are different problems with
   different constraints — one is a model on a frame, the other is a training
   topology where the data is not allowed to move. Same for language: adapting
   a model and indexing a corpus for retrieval are not one activity.

   So: three planes that pass work downward, and a substrate underneath them
   that everything runs on. Within a plane, `parallel` says whether the nodes
   are a sequence or alternatives running side by side.

   EVERY TOOL IN `stackGroups` APPEARS HERE EXACTLY ONCE, and
   `utils/stages.test.mjs` fails the test run if that stops being true.
--------------------------------------------------------------------------- */

export const systemPlanes = [
  {
    id: "data",
    title: "Data plane",
    role: "Get it, keep it, understand it",
    flow: "--c-flow-1",
    out: "features & findings",
    nodes: [
      {
        id: "ingest",
        title: "Ingest & orchestrate",
        role: "Move it, on a schedule",
        items: ["Airflow", "ETL pipelines", "PySpark"],
      },
      {
        id: "store",
        title: "Store",
        role: "Keep it addressable",
        items: ["S3", "PostgreSQL", "DynamoDB", "DuckDB", "SQL"],
      },
      {
        id: "shape",
        title: "Shape & analyse",
        role: "Make it a table you can trust",
        items: ["pandas", "Polars", "NumPy", "Exploratory analysis"],
      },
      {
        id: "express",
        title: "Visualise",
        role: "Show what it supports",
        items: ["Jupyter", "Plotly", "Streamlit"],
      },
    ],
  },
  {
    id: "model",
    title: "Model plane",
    role: "Learn something from it",
    flow: "--c-flow-2",
    out: "weights & an index",
    // ALTERNATIVES, not steps. These five do not run in order and most
    // projects use one or two of them; drawing them as a chain would claim a
    // dependency between object detection and retrieval that does not exist.
    parallel: true,
    nodes: [
      {
        id: "detect",
        title: "Vision — detect & track",
        role: "Find it in a frame, follow it",
        items: ["PyTorch", "YOLOv8", "OpenCV", "Detection & tracking"],
      },
      {
        id: "federated",
        title: "Vision — federated",
        role: "Train where the data already is",
        items: ["Federated learning"],
      },
      {
        id: "classical",
        title: "Classical ML",
        role: "When a smaller model is the honest answer",
        items: ["scikit-learn"],
      },
      {
        id: "adapt",
        title: "Language — adapt",
        role: "Take a general model, fit it to the task",
        items: ["Hugging Face", "Transformers", "Fine-tuning"],
      },
      {
        id: "retrieve",
        title: "Language — retrieve",
        role: "Ground the answer in real sources",
        items: ["Embeddings", "Pinecone", "LangChain", "LangGraph"],
      },
    ],
  },
  {
    id: "serve",
    title: "Serving plane",
    role: "Put it in front of someone",
    flow: "--c-flow-3",
    nodes: [
      {
        id: "inference",
        title: "Inference",
        role: "Run the model on real traffic",
        items: ["vLLM", "Ollama", "Claude"],
      },
      {
        id: "api",
        title: "API",
        role: "A contract, and bad input stopped at the edge",
        items: ["FastAPI", "Pydantic"],
      },
      {
        id: "interface",
        title: "Interface",
        role: "The screen a person actually uses",
        items: ["Next.js", "React", "TypeScript", "Tauri"],
      },
    ],
  },
];

/**
 * NOT A PLANE. Nothing flows into it and nothing flows out of it: it is what
 * the three planes above are standing on, which is why it is drawn underneath
 * them, in neutral, with no arrow into it.
 *
 * The owner's own framing: "Python is a language where I can use for the
 * coding, Docker, Kubernetes for the MLOps" — those are not steps, they are
 * the ground.
 */
export const systemSubstrate = {
  title: "Substrate",
  role: "Everything above runs on this",
  nodes: [
    {
      id: "language",
      title: "Language & tests",
      role: "What all of it is written and checked in",
      items: ["Python", "pytest"],
    },
    {
      id: "package",
      title: "Package & run",
      role: "Same behaviour on a laptop and a cluster",
      items: ["Docker", "Kubernetes", "Helm"],
    },
    {
      id: "deliver",
      title: "Deliver",
      role: "Every change built and shipped the same way",
      items: ["GitHub Actions"],
    },
    {
      id: "track",
      title: "Track & evaluate",
      role: "Know which run produced which number",
      items: ["MLflow", "Weights & Biases", "DVC", "Evaluation"],
    },
  ],
};

export const PLATFORMS = [
  // The default is what he actually runs. Everything else is an equivalence,
  // and the UI says so -- see `PLATFORM_NOTE`.
  { id: "oss", label: "What I use", short: "What I use" },
  { id: "aws", label: "AWS", short: "AWS" },
  { id: "gcp", label: "Google Cloud", short: "GCP" },
  { id: "azure", label: "Azure", short: "Azure" },
];

/**
 * The honesty line, and it is not optional.
 *
 * This page's rule is that absent beats invented, and a grid of cloud service
 * names next to a person's photograph reads as "I have run all of these" to
 * anyone skimming. It is not that. It is the mapping any engineer should be
 * able to recite -- the role is the knowledge, the vendor is a lookup -- and
 * the interface has to say which of the two it is showing.
 */
/**
 * The provider's own architecture reference, one link per platform.
 *
 * Deliberately NOT a deep link per service. Ninety-nine service doc URLs is
 * ninety-nine chances to ship a dead link onto someone's portfolio, and cloud
 * vendors reorganise their docs constantly. These three roots are stable and
 * are the thing the owner actually asked for -- the provider's own material,
 * for a reader who wants to go further than a service name.
 */
export const PLATFORM_DOCS = {
  aws: { label: "AWS Architecture Center", href: "https://aws.amazon.com/architecture/" },
  gcp: { label: "Google Cloud Architecture Center", href: "https://cloud.google.com/architecture" },
  azure: { label: "Azure Architecture Center", href: "https://learn.microsoft.com/azure/architecture/" },
};

export const PLATFORM_NOTE =
  "One row per job a production system has to do. “What I use” is the only column that is a claim about me; the rest is what fills that slot on each platform. An em dash means the slot is real and I am not claiming it.";

/**
 * THE CLOUD MATRIX: one row per role a production system has to fill, and what
 * fills it on each platform.
 *
 * WHY IT IS NOT IN THE SKILL LIST, and must never be moved there. `mine` is
 * the only column that is a claim about him; the other three are a claim about
 * the platforms. Putting "Glue", "Dataflow" and "Purview" in `stackGroups`
 * would turn a mapping anyone can verify into thirty assertions of experience
 * nobody can. The owner drew that line himself -- "you don't need to show them
 * in the skills stack, you can show them separate" -- and it is the right one.
 *
 * WHY ROLES WITH NO `mine`. A production system needs secrets, identity,
 * monitoring, a queue and a cost story whether or not this person has a
 * favourite tool for each. Dropping those rows would draw a system with holes
 * in it; marking them with an em dash says "this slot is real, I am not
 * claiming it", which is the same honesty the rest of the page runs on.
 *
 * GROUPED BY THE DIAGRAM'S OWN PLANES, so a reader who has just looked at the
 * drawing finds the rows in the order the drawing put them.
 */
export const platformMatrix = [
  // --- data plane ---------------------------------------------------------
  { plane: "Data", role: "Orchestration", node: "ingest", mine: "Airflow", aws: "MWAA", gcp: "Cloud Composer", azure: "Data Factory" },
  { plane: "Data", role: "Batch compute", node: "ingest", mine: "PySpark", aws: "EMR", gcp: "Dataproc", azure: "Synapse Spark" },
  { plane: "Data", role: "Managed ETL", node: "ingest", mine: "ETL pipelines", aws: "Glue", gcp: "Dataflow", azure: "Data Factory flows" },
  { plane: "Data", role: "Streaming & events", node: "ingest", mine: null, aws: "Kinesis / MSK", gcp: "Pub/Sub", azure: "Event Hubs" },
  { plane: "Data", role: "Object store", node: "store", mine: "S3", aws: "S3", gcp: "Cloud Storage", azure: "Blob Storage" },
  { plane: "Data", role: "Relational store", node: "store", mine: "PostgreSQL", aws: "RDS", gcp: "Cloud SQL", azure: "Azure SQL" },
  { plane: "Data", role: "Key-value store", node: "store", mine: "DynamoDB", aws: "DynamoDB", gcp: "Firestore", azure: "Cosmos DB" },
  { plane: "Data", role: "Warehouse", node: "store", mine: "SQL", aws: "Redshift", gcp: "BigQuery", azure: "Synapse" },
  { plane: "Data", role: "Query engine", node: "shape", mine: "DuckDB", aws: "Athena", gcp: "BigQuery", azure: "Synapse serverless" },
  { plane: "Data", role: "Catalog & governance", node: "store", mine: null, aws: "Glue Catalog / Lake Formation", gcp: "Dataplex", azure: "Purview" },
  { plane: "Data", role: "Notebooks", node: "shape", mine: "Jupyter", aws: "SageMaker Studio", gcp: "Vertex AI Workbench", azure: "Azure ML Studio" },
  // The owner's own example, and a fair one: Power BI is what an Azure shop
  // actually puts in front of people, where this stack reaches for Plotly.
  { plane: "Data", role: "BI & dashboards", node: "express", mine: "Plotly", aws: "QuickSight", gcp: "Looker", azure: "Power BI" },

  // --- model plane --------------------------------------------------------
  { plane: "Model", role: "Training jobs", node: "detect", mine: "PyTorch", aws: "SageMaker Training", gcp: "Vertex AI Training", azure: "Azure ML Jobs" },
  { plane: "Model", role: "Experiment tracking", node: "track", mine: "MLflow", aws: "SageMaker Experiments", gcp: "Vertex AI Experiments", azure: "Azure ML" },
  { plane: "Model", role: "Model registry", node: "track", mine: "MLflow", aws: "SageMaker Model Registry", gcp: "Vertex AI Model Registry", azure: "Azure ML Registry" },
  { plane: "Model", role: "ML pipelines", node: "track", mine: null, aws: "SageMaker Pipelines", gcp: "Vertex AI Pipelines", azure: "Azure ML Pipelines" },
  { plane: "Model", role: "Feature store", node: "shape", mine: null, aws: "SageMaker Feature Store", gcp: "Vertex AI Feature Store", azure: "Azure ML Feature Store" },
  { plane: "Model", role: "Vector index", node: "retrieve", mine: "Pinecone", aws: "OpenSearch k-NN", gcp: "Vertex Vector Search", azure: "AI Search" },
  { plane: "Model", role: "Managed LLM", node: "adapt", mine: "Claude", aws: "Bedrock", gcp: "Vertex AI", azure: "Azure OpenAI" },
  { plane: "Model", role: "Document & vision AI", node: "detect", mine: "OpenCV", aws: "Textract / Rekognition", gcp: "Document AI / Vision AI", azure: "AI Document Intelligence" },

  // --- serving plane ------------------------------------------------------
  { plane: "Serving", role: "Model serving", node: "inference", mine: "vLLM", aws: "SageMaker Endpoints", gcp: "Vertex AI Endpoints", azure: "Azure ML Endpoints" },
  { plane: "Serving", role: "Serverless functions", node: "api", mine: null, aws: "Lambda", gcp: "Cloud Run functions", azure: "Azure Functions" },
  { plane: "Serving", role: "Containers on demand", node: "package", mine: "Docker", aws: "ECS / Fargate", gcp: "Cloud Run", azure: "Container Apps" },
  { plane: "Serving", role: "API gateway", node: "api", mine: "FastAPI", aws: "API Gateway", gcp: "Apigee", azure: "API Management" },
  { plane: "Serving", role: "Queue", node: "api", mine: null, aws: "SQS", gcp: "Pub/Sub", azure: "Service Bus" },
  { plane: "Serving", role: "Cache", node: "api", mine: null, aws: "ElastiCache", gcp: "Memorystore", azure: "Cache for Redis" },

  // --- substrate ----------------------------------------------------------
  { plane: "Substrate", role: "Container runtime", node: "package", mine: "Kubernetes", aws: "EKS", gcp: "GKE", azure: "AKS" },
  { plane: "Substrate", role: "Container registry", node: "package", mine: null, aws: "ECR", gcp: "Artifact Registry", azure: "ACR" },
  { plane: "Substrate", role: "CI/CD", node: "deliver", mine: "GitHub Actions", aws: "CodePipeline", gcp: "Cloud Build", azure: "Azure Pipelines" },
  { plane: "Substrate", role: "Secrets", node: "package", mine: null, aws: "Secrets Manager", gcp: "Secret Manager", azure: "Key Vault" },
  { plane: "Substrate", role: "Identity & access", node: "package", mine: null, aws: "IAM", gcp: "IAM", azure: "Entra ID" },
  { plane: "Substrate", role: "Monitoring & logs", node: "track", mine: null, aws: "CloudWatch", gcp: "Cloud Monitoring", azure: "Azure Monitor" },
  { plane: "Substrate", role: "Cost & budgets", node: "track", mine: null, aws: "Cost Explorer", gcp: "Billing / FinOps", azure: "Cost Management" },
];

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
export const DIAGRAM_WHY = [
  "A tool list answers what I know. It cannot answer whether the pieces fit together, which is the question an interview actually asks.",
  "So the boxes here are not my skill areas — they are the jobs a system has to do. Three planes pass work downward; inside a plane, nodes are either a sequence or alternatives. Same 47 tools; only the filing changes.",
  "The arrows carry what moves between stages, two stages run in parallel rather than in sequence, and the band underneath is what everything else stands on.",
  "Colour is depth, not category: one hue getting warmer as the work moves from raw data to a shipped product. The substrate sits off that scale, in neutral, because it is not a position on the path.",
  "Every managed piece is a role, not a lock-in: pick a platform to see what fills each one on AWS, Google Cloud or Azure.",
];
