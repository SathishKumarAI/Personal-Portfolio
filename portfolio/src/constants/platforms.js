/**
 * What fills each role on AWS, Google Cloud and Azure. A mapping, not a CV:
 * only the `mine` column is a claim about the owner.
 *
 * Split out of a single 885-line `index.js` on 2026-10-16. `index.js` is now a
 * barrel re-exporting every one of these, so every existing
 * `from "../constants"` import is unchanged.
 */

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
/**
 * When the vendor names were last checked, shown in the interface.
 *
 * Cloud products get renamed constantly -- Cognitive Search became AI Search,
 * Form Recognizer became AI Document Intelligence, Azure AD became Entra ID,
 * Cloud Functions became Cloud Run functions, Matching Engine became Vertex AI
 * Vector Search. A reader meeting a 2019 name on a 2026 page cannot tell
 * whether the page is stale or they are out of date, and the honest fix is not
 * to claim permanence but to date the claim.
 */

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
/**
 * When the vendor names were last checked, shown in the interface.
 *
 * Cloud products get renamed constantly -- Cognitive Search became AI Search,
 * Form Recognizer became AI Document Intelligence, Azure AD became Entra ID,
 * Cloud Functions became Cloud Run functions, Matching Engine became Vertex AI
 * Vector Search. A reader meeting a 2019 name on a 2026 page cannot tell
 * whether the page is stale or they are out of date, and the honest fix is not
 * to claim permanence but to date the claim.
 */
export const PLATFORM_CHECKED = "October 2026";

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
  { plane: "Data", role: "Batch compute", node: "ingest", mine: "PySpark", aws: "EMR", gcp: "Dataproc", azure: "Fabric Spark" },
  { plane: "Data", role: "Managed ETL", node: "ingest", mine: "ETL pipelines", aws: "Glue", gcp: "Dataflow", azure: "Data Factory flows" },
  { plane: "Data", role: "Streaming & events", node: "ingest", mine: null, aws: "Kinesis / MSK", gcp: "Pub/Sub", azure: "Event Hubs" },
  { plane: "Data", role: "Object store", node: "store", mine: "S3", aws: "S3", gcp: "Cloud Storage", azure: "Blob Storage" },
  { plane: "Data", role: "Relational store", node: "store", mine: "PostgreSQL", aws: "RDS", gcp: "Cloud SQL", azure: "Azure SQL" },
  { plane: "Data", role: "Key-value store", node: "store", mine: "DynamoDB", aws: "DynamoDB", gcp: "Firestore", azure: "Cosmos DB" },
  { plane: "Data", role: "Warehouse", node: "store", mine: "SQL", aws: "Redshift", gcp: "BigQuery", azure: "Fabric Warehouse" },
  { plane: "Data", role: "Query engine", node: "shape", mine: "DuckDB", aws: "Athena", gcp: "BigQuery", azure: "Fabric SQL analytics" },
  { plane: "Data", role: "Lakehouse", node: "store", mine: "Databricks", aws: "Lake Formation", gcp: "BigLake", azure: "Fabric Lakehouse" },
  { plane: "Data", role: "Data privacy", node: "store", mine: "PII & anonymisation", aws: "Macie", gcp: "Sensitive Data Protection", azure: "Purview DLP" },
  { plane: "Substrate", role: "Audit & lineage", node: "track", mine: "Unity Catalog", aws: "CloudTrail", gcp: "Cloud Audit Logs", azure: "Monitor audit logs" },
  { plane: "Data", role: "Catalog & governance", node: "store", mine: null, aws: "Glue Catalog / Lake Formation", gcp: "Dataplex Universal Catalog", azure: "Microsoft Purview" },
  { plane: "Data", role: "Notebooks", node: "shape", mine: "Jupyter", aws: "SageMaker AI Studio", gcp: "Vertex AI Workbench", azure: "Azure ML Studio" },
  // The owner's own example, and a fair one: Power BI is what an Azure shop
  // actually puts in front of people, where this stack reaches for Plotly.
  { plane: "Data", role: "BI & dashboards", node: "express", mine: "Plotly", aws: "QuickSight", gcp: "Looker", azure: "Power BI" },

  // --- model plane --------------------------------------------------------
  { plane: "Model", role: "Training jobs", node: "detect", mine: "PyTorch", aws: "SageMaker AI Training", gcp: "Vertex AI Training", azure: "Azure ML Jobs" },
  { plane: "Model", role: "Experiment tracking", node: "track", mine: "MLflow", aws: "SageMaker AI + MLflow", gcp: "Vertex AI Experiments", azure: "Azure ML" },
  { plane: "Model", role: "Model registry", node: "track", mine: "MLflow", aws: "SageMaker AI Model Registry", gcp: "Vertex AI Model Registry", azure: "Azure ML Registry" },
  { plane: "Model", role: "ML pipelines", node: "track", mine: null, aws: "SageMaker AI Pipelines", gcp: "Vertex AI Pipelines", azure: "Azure ML Pipelines" },
  { plane: "Model", role: "Feature store", node: "shape", mine: null, aws: "SageMaker AI Feature Store", gcp: "Vertex AI Feature Store", azure: "Azure ML Feature Store" },
  { plane: "Model", role: "Guardrails & safety", node: "api", mine: "Guardrails", aws: "Bedrock Guardrails", gcp: "Vertex AI safety filters", azure: "AI Content Safety" },
  { plane: "Model", role: "LLM evaluation", node: "track", mine: "Ragas", aws: "Bedrock Evaluations", gcp: "Vertex AI Gen AI evaluation", azure: "AI Foundry evaluations" },
  { plane: "Model", role: "Vector index", node: "retrieve", mine: "Pinecone", aws: "OpenSearch Serverless (vector)", gcp: "Vertex Vector Search", azure: "AI Search" },
  { plane: "Model", role: "Managed LLM", node: "providers", mine: "Claude", aws: "Bedrock", gcp: "Vertex AI", azure: "Azure OpenAI" },
  { plane: "Model", role: "Document & vision AI", node: "detect", mine: "OpenCV", aws: "Textract / Rekognition", gcp: "Document AI / Vision AI", azure: "AI Document Intelligence" },

  // --- serving plane ------------------------------------------------------
  { plane: "Serving", role: "Model serving", node: "inference", mine: "vLLM", aws: "SageMaker AI Endpoints", gcp: "Vertex AI Endpoints", azure: "Azure ML Endpoints" },
  { plane: "Serving", role: "Serverless functions", node: "api", mine: null, aws: "Lambda", gcp: "Cloud Run functions", azure: "Azure Functions" },
  { plane: "Serving", role: "Containers on demand", node: "package", mine: "Docker", aws: "ECS / Fargate", gcp: "Cloud Run", azure: "Container Apps" },
  { plane: "Serving", role: "API gateway", node: "api", mine: "FastAPI", aws: "API Gateway", gcp: "Apigee", azure: "API Management" },
  { plane: "Serving", role: "Queue", node: "api", mine: null, aws: "SQS", gcp: "Pub/Sub", azure: "Service Bus" },
  { plane: "Serving", role: "Cache", node: "api", mine: null, aws: "ElastiCache", gcp: "Memorystore", azure: "Managed Redis" },

  // --- substrate ----------------------------------------------------------
  { plane: "Substrate", role: "Container runtime", node: "package", mine: "Kubernetes", aws: "EKS", gcp: "GKE", azure: "AKS" },
  { plane: "Substrate", role: "Container registry", node: "package", mine: null, aws: "ECR", gcp: "Artifact Registry", azure: "ACR" },
  { plane: "Substrate", role: "CI/CD", node: "deliver", mine: "GitHub Actions", aws: "CodePipeline", gcp: "Cloud Build", azure: "Azure Pipelines" },
  { plane: "Substrate", role: "Secrets", node: "package", mine: "Secrets management", aws: "Secrets Manager", gcp: "Secret Manager", azure: "Key Vault" },
  { plane: "Substrate", role: "Identity & access", node: "package", mine: "IAM & RBAC", aws: "IAM", gcp: "IAM", azure: "Entra ID" },
  { plane: "Substrate", role: "Monitoring & logs", node: "track", mine: null, aws: "CloudWatch", gcp: "Cloud Monitoring", azure: "Azure Monitor" },
  { plane: "Substrate", role: "Cost & budgets", node: "track", mine: null, aws: "Cost Explorer", gcp: "Cloud Billing", azure: "Cost Management" },
];

/**
 * `out` is what LEAVES a stage, and it is the point of drawing this at all.
 *
 * A bare arrow between two boxes is decoration; it says "and then". A labelled
 * arrow says what the next stage receives, which is the one thing a tool list
 * structurally cannot express no matter how it is arranged.
 */
