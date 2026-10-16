/* ---------------------------------------------------------------------------
   THE BARREL.

   This file was 885 lines holding ten unrelated subjects, which meant every
   session that touched one fact scrolled past nine others. The content is now
   one file per subject and this re-exports all of it, so every existing
   `import { x } from "../constants"` keeps working unchanged.

   ADD A NEW FACT TO THE FILE THAT OWNS ITS SUBJECT, not here. This file should
   only ever grow a line when a whole new subject appears.

     identity.js    who he is, contact, status, quotes
     theme.js       the six palettes
     career.js      jobs and degrees
     projects.js    the work
     glossary.js    every term, in plain English
     nav.js         the sections
     stack.js       tools filed by skill area      (the tool list's filing)
     system.js      tools filed by job in a system (the diagram's filing)
     platforms.js   what fills each role on AWS / GCP / Azure
--------------------------------------------------------------------------- */
export * from "./identity.js";
export * from "./theme.js";
export * from "./career.js";
export * from "./projects.js";
export * from "./glossary.js";
export * from "./nav.js";
export * from "./stack.js";
export * from "./system.js";
export * from "./platforms.js";
