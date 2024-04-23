import { Editor, Range } from "slate";
import { ReactEditor } from "slate-react";

export function posToOffsetRect(editor: Editor, range: Range) {
  const domRange = ReactEditor.toDOMRange(editor, range);
  const rect = domRange.getBoundingClientRect();
  const root = ReactEditor.toDOMNode(editor, editor);
  const parentRect = root.getBoundingClientRect();

  const x = rect.left - parentRect.left + root.scrollLeft;
  const y = rect.top - parentRect.top + root.scrollTop;

  return new DOMRect(x, y, rect.width, rect.height);
}
