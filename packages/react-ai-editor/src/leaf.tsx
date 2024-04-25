import { Editor, Text } from "slate";
import { RenderLeafProps } from "slate-react";
import { Code, Em, Strong } from "@radix-ui/themes";

import { SlateInlineCodeNode } from "./interface";

export const withLeaf = (editor: Editor) => {
  const { isInline } = editor;

  editor.isInline = value => {
    if (value.type === "link") {
      return true;
    }

    return isInline(value);
  };

  return editor;
};

export function LeafRenderer({ leaf, children, attributes }: RenderLeafProps) {
  if (Leaf.isInlineCode(leaf)) {
    return <Code>{children}</Code>;
  }

  if (leaf.bold) {
    children = <Strong>{children}</Strong>;
  }

  if (leaf.italic) {
    children = <Em>{children}</Em>;
  }

  if (leaf.strikeThrough) {
    children = <Em>{children}</Em>;
  }

  return <span {...attributes}>{children}</span>;
}

export const Leaf = {
  isInlineCode(leaf: Text): leaf is SlateInlineCodeNode {
    return (leaf as SlateInlineCodeNode).code;
  },

  getText(leaf: Text) {
    return leaf.text;
  },
};
