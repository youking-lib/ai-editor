import { withHistory } from "slate-history";
import { useCallback, useState } from "react";
import { BookmarkIcon, GlobeIcon } from "@radix-ui/react-icons";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { createEditor, Editor, Node, Element as SlateElement } from "slate";
import { Button, Card, Flex, IconButton, Inset, Theme } from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";

import { Element } from "./element";
import { SHORTCUTS, withShortcuts } from "./shortcuts";
import { Leaf, LeafRenderer } from "./leaf";
import { parse } from "./parse";
import { EditableVoidPlugin } from "./internal-plugins/editable-void";
import { BubblePlugin } from "./plugins/bubble";

const initialValue = parse(`
# Hello world

A line of text in a paragraph.

\`\`\`
var a = 0;
console.log(a);
\`\`\`

---

# Header1
## Header2
### Header3
#### Header4
##### Header5
###### Header6

A line of plain text in a **paragraph**.
`);

console.log("initialValue", initialValue);

export function ReactAIEditor(props: React.PropsWithChildren) {
  const [editor] = useState(() =>
    withShortcuts(withReact(withHistory(createEditor())))
  );

  const handleDOMBeforeInput = useCallback(
    (e: InputEvent) => {
      queueMicrotask(() => {
        const pendingDiffs = ReactEditor.androidPendingDiffs(editor);

        const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
          if (!diff.text.endsWith(" ")) {
            return false;
          }

          const leaf = Node.leaf(editor, path);
          const text = Leaf.getText(leaf);
          const beforeText =
            text?.slice(0, diff.start) + diff.text.slice(0, -1);

          if (!(beforeText in SHORTCUTS)) {
            return;
          }

          const blockEntry = Editor.above(editor, {
            at: path,
            match: n => SlateElement.isElement(n) && Editor.isBlock(editor, n),
          });
          if (!blockEntry) {
            return false;
          }

          const [, blockPath] = blockEntry;
          return Editor.isStart(editor, Editor.start(editor, path), blockPath);
        });

        if (scheduleFlush) {
          ReactEditor.androidScheduleFlush(editor);
        }
      });
    },
    [editor]
  );
  return (
    <Theme>
      <Card>
        <Inset clip="border-box" style={{ position: "relative" }} m="2">
          <Slate editor={editor} initialValue={initialValue}>
            <Editable
              renderLeaf={props => <LeafRenderer {...props} />}
              renderElement={props => <Element {...props} />}
              onDOMBeforeInput={handleDOMBeforeInput}
              spellCheck
              autoFocus
            />
            {props.children}

            <EditableVoidPlugin />
            <BubblePlugin />
          </Slate>
        </Inset>

        <Toolbar />
      </Card>
    </Theme>
  );
}

function Toolbar() {
  return (
    <Flex pt="2" justify="between">
      <Flex gap="2" align="center">
        <IconButton size="1" variant="ghost">
          <BookmarkIcon />
        </IconButton>
        <IconButton size="1" variant="ghost">
          <GlobeIcon />
        </IconButton>
      </Flex>
      <Button size="1" variant="soft">
        Share
      </Button>
    </Flex>
  );
}
