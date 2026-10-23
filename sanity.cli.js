import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./studio/env";

/** For `npx sanity …` commands (cors, dataset, exec the seed script). The Studio itself runs at /studio. */
export default defineCliConfig({ api: { projectId, dataset } });
