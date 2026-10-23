import author from "./author";
import storyBody, { prompt, pullQuote, richText, sectionBreak, textBlock } from "./blockContent";
import explorePage from "./explorePage";
import { mediaTypes } from "./objects/media";
import { bodyModules, sectionTypes } from "./objects/modules";
import post from "./post";
import topic from "./topic";

export const schemaTypes = [
  explorePage,
  post,
  topic,
  author,
  storyBody,
  richText,
  textBlock,
  pullQuote,
  prompt,
  sectionBreak,
  ...mediaTypes,
  ...bodyModules,
  ...sectionTypes,
];
