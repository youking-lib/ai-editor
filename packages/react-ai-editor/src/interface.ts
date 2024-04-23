import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";
import {
  NodeTypes,
  CodeBlockNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  ParagraphNode,
  LinkNode,
  ImageNode,
  BlockQuoteNode,
  InlineCodeMarkNode,
  ThematicBreakNode,
  InlineCodeNode,
  TextNode,
} from "remark-slate";

import { SlateEditableVoidElement } from "./internal-plugins/editable-void";

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element:
      | SlateCodeBlockNode
      | SlateHeadingNode
      | SlateListNode
      | SlateListItemNode
      | SlateParagraphNode
      | SlateLinkNode
      | SlateImageNode
      | SlateBlockQuoteNode
      | SlateInlineCodeMarkNode
      | SlateThematicBreakNode

      // Internal Plugin Element
      | SlateEditableVoidElement;

    Text: SlateTextNode | SlateInlineCodeNode;
  }
}

export type SlateCodeBlockNode = CodeBlockNode<NodeTypes>;
export type SlateHeadingNode = HeadingNode<NodeTypes>;
export type SlateListNode = ListNode<NodeTypes>;
export type SlateListItemNode = ListItemNode<NodeTypes>;
export type SlateParagraphNode = ParagraphNode<NodeTypes>;
export type SlateLinkNode = LinkNode<NodeTypes>;
export type SlateImageNode = ImageNode<NodeTypes>;
export type SlateBlockQuoteNode = BlockQuoteNode<NodeTypes>;
export type SlateInlineCodeMarkNode = InlineCodeMarkNode<NodeTypes>;
export type SlateThematicBreakNode = ThematicBreakNode<NodeTypes>;

export type SlateInlineCodeNode = InlineCodeNode;
export type SlateTextNode = TextNode & {
  bold?: boolean;
  italic?: boolean;
  strikeThrough?: boolean;
};
