/**
 * Jobs and degrees, in reverse order.
 *
 * Split out of a single 885-line `index.js` on 2026-10-16. `index.js` is now a
 * barrel re-exporting every one of these, so every existing
 * `from "../constants"` import is unchanged.
 */

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
