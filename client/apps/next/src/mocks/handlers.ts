import { projectHandlers } from "./projects";
import { skillHandlers } from "./skills";
import { careerHandlers } from "./careers";
import { certificationHandlers } from "./certifiactions";
import { eduHandlers } from "./edu";
import { resumeHandlers } from "./resume";

export const handlers = [
  ...projectHandlers,
  ...skillHandlers,
  ...careerHandlers,
  ...eduHandlers,
  ...certificationHandlers,
  ...resumeHandlers,
];
