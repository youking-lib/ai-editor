import { withHistory } from "slate-history";
import { useCallback, useState } from "react";
import { GlobeIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { createEditor, Editor, Node, Element as SlateElement } from "slate";
import {
  Button,
  Card,
  Flex,
  IconButton,
  Inset,
  Select,
  Separator,
  Theme,
} from "@radix-ui/themes";

import "@radix-ui/themes/styles.css";

import { parse } from "./parse";
import { Element } from "./element";
import { Leaf, LeafRenderer, withLeaf } from "./leaf";
import { BubblePlugin } from "./plugins/bubble";
import { LANGUAGE_ENTRYS } from "./prompts/language";
import { SHORTCUTS, withShortcuts } from "./shortcuts";
import { EditableVoidPlugin } from "./internal-plugins/editable-void";

const initialValue = parse(`
# Hello world

A line of text in a paragraph.

\`\`\`
var a = 0;
console.log(a);
\`\`\`

A ~~line~~ of --plain-- *text* in a **paragraph**.

[gonote](https://gonote.io)

---

# Header1
## Header2
### Header3
#### Header4
##### Header5
###### Header6

A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.
A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.

A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.
A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.

A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.
A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.

A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.
A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.

A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.
A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.

A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.
A line of plain text in a **paragraph**.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.This is an official starter Turborepo.
`);

console.log("initialValue", initialValue);

export function ReactAIEditor(props: React.PropsWithChildren) {
  const [editor] = useState(() =>
    withLeaf(withShortcuts(withReact(withHistory(createEditor()))))
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
    <Theme data-is-root-theme="false">
      <Card>
        <Inset clip="border-box" style={{ position: "relative" }} pb="current">
          <Slate editor={editor} initialValue={initialValue}>
            <Editable
              style={{
                maxHeight: 600,
                overflowY: "auto",
                padding:
                  "var(--inset-padding-top) var(--inset-padding-right) var(--inset-padding-bottom) var(--inset-padding-left)",
              }}
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
      <Flex gap="3" align="center">
        <IconButton size="2" variant="ghost">
          <MagicWandIcon />
        </IconButton>

        <Separator orientation="vertical" />

        <Flex align="center" gap="2">
          <Select.Root defaultValue="apple" size="1">
            <Select.Trigger variant="soft">EN</Select.Trigger>
            <Select.Content>
              {LANGUAGE_ENTRYS.map(item => {
                return (
                  <Select.Item value={item[0]} key={item[0]}>
                    {item[1].name}
                  </Select.Item>
                );
              })}
            </Select.Content>
          </Select.Root>

          <IconButton size="2" variant="ghost">
            <GlobeIcon />
          </IconButton>
        </Flex>

        <Separator orientation="vertical" />

        <Flex align="center" gap="2">
          <Select.Root defaultValue="apple" size="1">
            <Select.Trigger variant="soft">Tone</Select.Trigger>
            <Select.Content>
              <Select.Item value="apple">English</Select.Item>
              <Select.Item value="orange">Chinese</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
      <Button size="1" variant="soft">
        Share
      </Button>
    </Flex>
  );
}
