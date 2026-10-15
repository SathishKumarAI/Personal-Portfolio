/**
 * Owns: a mark for the terms that are ideas rather than products.
 *
 * Why these exist at all. Most tags on a project card — RAG, MLOps, Vision,
 * Federated, Applied ML — have no logo, because there is no company to have
 * one. With only the branded tools marked, a "built with" row of three showed
 * one glyph and two bare words, which reads as a missing image rather than as
 * a distinction.
 *
 * Why drawing these is NOT the thing the generator refuses to do. A brand mark
 * recalled from memory is a claim about someone else's identity and is either
 * right or wrong. These are category marks in the site's own line language, the
 * same vocabulary as the project covers and the career diagrams: a bounding box
 * for detection, a hub and three satellites for federated training, a cylinder
 * for SQL. They claim nothing about anyone.
 *
 * Kept deliberately primitive — lines, arcs and dots, 1.8px stroke, round caps
 * — because they render at about 14px beside a word. Anything with more detail
 * than this turns to grey mush at that size; that was measured on the branded
 * marks, where PostgreSQL's elephant is already at the limit.
 *
 * `s: 1` means "draw this as a stroke". The brand marks in `toolIcons.js` are
 * filled silhouettes, and the two cannot share a renderer without it.
 */
export const CONCEPT_ICONS = {
  // A page with a passage marked: the site's own claim about retrieval.
  RAG: { d: "M7 4h7l3 3v13H7z M14 4v3h3 M10 12h4 M10 15.5h2.5", s: 1 },
  // A prompt window and the three dots of a reply.
  LLM: { d: "M4 6h16v9h-9l-4 3.5V15H4z M9.5 10.5h.01 M12.5 10.5h.01 M15.5 10.5h.01", s: 1 },
  // The loop: train, ship, watch, train again.
  MLOps: { d: "M20 12a8 8 0 1 1-2.6-5.9 M20.5 3v4h-4", s: 1 },
  // Corner brackets and a target: what a detector draws on a frame.
  Vision: { d: "M4 8V4h4 M16 4h4v4 M20 16v4h-4 M8 20H4v-4 M12 12h.01", s: 1 },
  // A hub and three clients. Updates travel the spokes; the data never does.
  Federated: { d: "M12 12V6 M12 12l5.2 3 M12 12l-5.2 3 M12 5.2h.01 M17.6 15.2h.01 M6.4 15.2h.01", s: 1 },
  "Federated learning": { d: "M12 12V6 M12 12l5.2 3 M12 12l-5.2 3 M12 5.2h.01 M17.6 15.2h.01 M6.4 15.2h.01", s: 1 },
  // Two kinds of thing read as one: a square and a circle, overlapping.
  Multimodal: { d: "M3.5 6.5h9v9h-9z M15 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9", s: 1 },
  "Applied ML": { d: "M4 18.5l5-5 3.5 2.5 7-7.5 M4 18.5h.01", s: 1 },
  // A built thing, in one piece.
  Product: { d: "M12 3l8 4.5v9L12 21l-8-4.5v-9z M12 12l8-4.5 M12 12v9 M12 12L4 7.5", s: 1 },
  // Something broadcasting right now.
  Live: { d: "M12 12h.01 M8.6 8.6a4.8 4.8 0 0 0 0 6.8 M15.4 8.6a4.8 4.8 0 0 1 0 6.8", s: 1 },
  // A vector: brackets around numbers, which is what an embedding is.
  // Nine loose dots were the first attempt and they disappeared at 14px —
  // 1.8px of ink nine times over is less ink than a single stroke.
  Embeddings: { d: "M8 4.5H5.5v15H8 M16 4.5h2.5v15H16 M10 9h.01 M13.5 12h.01 M10 15h.01", s: 1 },
  // Numbers you can compare, which is the whole point of the word.
  Evaluation: { d: "M5 19.5V12 M10 19.5V7.5 M15 19.5v-5 M20 19.5V5", s: 1 },
  // The cylinder every database diagram has used since about 1975.
  SQL: { d: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6", s: 1 },
  // Out of one store, through a transform, into another.
  "ETL pipelines": { d: "M3 8.5h5v7H3z M16 8.5h5v7h-5z M9.5 12h5 M12.8 10l2 2-2 2", s: 1 },
  // A box on the thing, and the path it has taken.
  "Detection & tracking": { d: "M9.5 9.5h6v6h-6z M5 19.5c2.5-.6 4.2-1.8 5.5-3.4", s: 1 },
  // Looking before concluding.
  "Exploratory analysis": { d: "M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z M15.4 15.4L20 20 M9 11h.01 M12.5 9.5h.01", s: 1 },

  /* THREE PRODUCTS, DRAWN AS STRUCTURES. These are the exception the rest of
     this file does not need, and the reasoning matters because the generator
     refuses to do what looks like the same thing.

     DynamoDB, S3 and Pinecone have no mark in simple-icons -- verified against
     the installed 16.31.0, which carries no `amazon`, `aws`, `azure` or
     `pinecone` entry at all, because the project removed several large
     corporate logos over trademark policy. So there was no mark to generate,
     and `gen-tool-icons.mjs` correctly maps all three to `null`.

     Leaving them bare was the old answer and it was visibly wrong: measured in
     the Stack grid, 30 of 33 terms rendered a glyph and exactly these three did
     not, which reads as three broken images rather than as a distinction. That
     is the same fault this file's opening paragraph was written about.

     Drawing their BRAND marks from memory would be the error the generator
     guards against -- a claim about someone else's identity that is simply
     right or wrong. These are not that. Each draws what the product IS, in the
     same line vocabulary as every mark above: a bucket of objects, a table of
     key-value pairs, a nearest-neighbour cluster. None resembles the company's
     logo and none is meant to. */

  // Object storage: a bucket with objects in it. "Bucket" is the product's own
  // word for the container, so the shape is the concept, not the branding.
  S3: { d: "M4.5 7.5h15l-1.6 12.5H6.1z M4.5 7.5l1.2-3.5h12.6l1.2 3.5 M9.8 12.5h.01 M14.2 12.5h.01 M12 16h.01", s: 1 },
  // Key-value store: a table whose rows are a key and its value, which is the
  // one structural thing that separates it from the SQL cylinder above.
  DynamoDB: { d: "M3.5 5.5h17v13h-17z M3.5 9.5h17 M10 9.5v9 M6.3 13h.01 M14.2 13h.01 M6.3 16h.01 M14.2 16h.01", s: 1 },
  /* The two terms added with the 2026-10-15 skills pass that have no upstream
     mark. `transformers` and `fine-tuning` are not companies, so simple-icons
     has nothing for them and never will -- which puts them squarely in this
     file's own remit rather than in the exception below. */
  // Attention: three tokens on a line, and the one in the middle reaching back
  // to both of the others. That reaching IS the architecture.
  Transformers: { d: "M5 19.5v-3 M12 19.5v-7 M19 19.5v-4 M5 16.5Q8.5 8 12 12.5 M19 15.5Q15.5 8 12 12.5", s: 1 },
  // Two sliders at different settings. A dial was the first draft and it read
  // as MLOps' loop at 14px; sliders share no silhouette with anything here.
  "Fine-tuning": { d: "M4 9h16 M4 15h16 M9.5 7v4 M15 13v4", s: 1 },

  // Vector index: a query point and the neighbours it returns. Embeddings
  // above is the vector itself; this is the search over many of them.
  Pinecone: { d: "M12 12h.01 M12 12l4.5-3.5 M12 12l-5 2.5 M12 12l3 5 M12 12m-7.5 0a7.5 7.5 0 1 0 15 0 7.5 7.5 0 1 0-15 0", s: 1 },
};

/* ---------------------------------------------------------------------------
   MARKS FOR THE ROLES IN THE CLOUD VIEW.

   The owner asked for logos on the cloud services. They cannot be had and
   should not be faked: simple-icons carries no Amazon, AWS, Microsoft, Azure
   or Google Cloud mark -- the project removed them over trademark policy --
   and drawing ninety-nine vendor logos from memory is the exact failure
   `gen-tool-icons.mjs` exists to prevent.

   So the mark belongs to the ROLE, not the vendor. A bucket means object
   store whether the cell says S3, Cloud Storage or Blob Storage, which is
   both honest and more useful: the glyph tells you what the slot DOES, and
   one mark serves all four columns instead of four marks saying the same
   thing in three liveries.

   Most roles reuse a mark already drawn above rather than inventing a second
   bucket; the aliases are listed first so the duplication is visible.
--------------------------------------------------------------------------- */
const ROLE_ALIAS = {
  "Object store": "S3",
  "Relational store": "SQL",
  "Warehouse": "SQL",
  "Key-value store": "DynamoDB",
  "Vector index": "Pinecone",
  "Managed ETL": "ETL pipelines",
  "ML pipelines": "ETL pipelines",
  "Query engine": "Exploratory analysis",
  "BI & dashboards": "Evaluation",
  "Experiment tracking": "Evaluation",
  "Cost & budgets": "Evaluation",
  "Managed LLM": "LLM",
  "Document & vision AI": "Vision",
  "CI/CD": "MLOps",
  "Training jobs": "Applied ML",
};

const ROLE_DRAWN = {
  // A clock over a stack of steps: work that runs in order, on a schedule.
  Orchestration: { d: "M4 7h7 M4 11h7 M4 15h7 M16.5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9z M16.5 8v2.2l1.6 1", s: 1 },
  // Many units chewing one pile at once.
  "Batch compute": { d: "M4 5.5h5v5H4z M10.5 5.5h5v5h-5z M4 12h5v5H4z M10.5 12h5v5h-5z M18.5 8h2 M18.5 12h2 M18.5 16h2", s: 1 },
  // A continuous line of events going past, rather than a batch.
  "Streaming & events": { d: "M3 12h3.5 M9 12h3.5 M15 12h3.5 M21 12h.01 M6.5 8.5l2.5 3.5-2.5 3.5 M15 8.5l2.5 3.5-2.5 3.5", s: 1 },
  // A ledger of what exists, with a tick: catalogued and governed.
  "Catalog & governance": { d: "M5 4.5h11l3 3v12H5z M8 9h8 M8 12.5h8 M8 16h4 M15.5 16l1.5 1.5 2.5-3", s: 1 },
  // A notebook: a cell of code, then its output.
  Notebooks: { d: "M5 4.5h14v15H5z M5 9h14 M8 4.5v15 M11 12h5 M11 15.5h3", s: 1 },
  // A labelled shelf of versions.
  "Model registry": { d: "M4 5.5h16v4H4z M4 11h16v4H4z M4 16.5h16v3H4z M7 7.5h.01 M7 13h.01 M7 18h.01", s: 1 },
  // Columns kept once and read by two consumers: train and serve.
  "Feature store": { d: "M4 6.5h7v11H4z M4 10h7 M4 14h7 M14 8.5h6 M14 12h6 M14 15.5h6 M11 12h3", s: 1 },
  // A model behind an endpoint, answering.
  "Model serving": { d: "M3.5 8.5h7v7h-7z M14 12h6.5 M14 12l-2.5-2.5 M14 12l-2.5 2.5 M17 7.5h.01 M17 16.5h.01", s: 1 },
  // A bolt: it exists only while it runs.
  "Serverless functions": { d: "M13.5 3.5 6 13.5h5l-.5 7 7.5-10h-5z", s: 1 },
  // A container lifted in and out on demand.
  "Containers on demand": { d: "M4.5 11.5h15v8h-15z M8 11.5v8 M12 11.5v8 M16 11.5v8 M12 8.5V3.5 M12 3.5 9.5 6 M12 3.5 14.5 6", s: 1 },
  // One door in front of several services.
  "API gateway": { d: "M9 4.5v15 M9 12h4 M17 6.5h3v4h-3z M17 13.5h3v4h-3z M13 12V8.5h4 M13 12v3.5h4", s: 1 },
  // Work waiting its turn.
  Queue: { d: "M3.5 8.5h4v7h-4z M9 8.5h4v7H9z M14.5 8.5h4v7h-4z M20.5 12h.01", s: 1 },
  // Something kept close so it is not fetched twice.
  Cache: { d: "M4 7c0-1.4 3.6-2.5 8-2.5s8 1.1 8 2.5-3.6 2.5-8 2.5S4 8.4 4 7z M4 7v10c0 1.4 3.6 2.5 8 2.5 M20 7v5 M15.5 16.5l2 2 4-4.5", s: 1 },
  // A helm: many containers, steered.
  "Container runtime": { d: "M12 5.5 18.5 9v6L12 18.5 5.5 15V9z M12 5.5v13 M5.5 9l6.5 3.5 6.5-3.5", s: 1 },
  // Images on a shelf, tagged.
  "Container registry": { d: "M4.5 6.5h15v11h-15z M4.5 10h15 M8 6.5v3.5 M12 13h4 M8 13h.01 M8 16h.01", s: 1 },
  // A key, kept in a box.
  Secrets: { d: "M5 9.5h14v10H5z M8.5 9.5V7a3.5 3.5 0 0 1 7 0v2.5 M12 13v3.5", s: 1 },
  // A person, and the gate that decides.
  "Identity & access": { d: "M8.5 8.5a3 3 0 1 0 0-.01 M4.5 19c0-3 1.8-4.5 4-4.5s4 1.5 4 4.5 M16 11.5h4v5h-4z M18 11.5V9.5a2 2 0 0 1 2-2", s: 1 },
  // A pulse on a screen.
  "Monitoring & logs": { d: "M3.5 12h3l2-4.5 3 9 2.5-6 1.5 3h5", s: 1 },
};

for (const [role, src] of Object.entries(ROLE_ALIAS)) {
  // Aliases, not copies: one path, several names. If the source mark is ever
  // redrawn the role follows it, which is the point of aliasing.
  CONCEPT_ICONS[role] = CONCEPT_ICONS[src];
}
Object.assign(CONCEPT_ICONS, ROLE_DRAWN);
