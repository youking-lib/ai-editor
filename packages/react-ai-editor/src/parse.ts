import { unified } from "unified";
import markdown from "remark-parse";
import slate, { serialize } from "remark-slate";
import { Descendant } from "slate";

export { serialize };

export function parse(md: string) {
  return unified().use(markdown).use(slate).processSync(md)
    .result as Descendant[];
}
