import { Editor, Range } from "slate";
import { useEffect, useRef, useState } from "react";
import { useFocused, useSlate, useSlateSelection } from "slate-react";
import { BookmarkIcon, GlobeIcon } from "@radix-ui/react-icons";
import { Button, Flex, IconButton, Popover } from "@radix-ui/themes";
import { posToOffsetRect } from "../utils/posToOffsetRect";

export const BubblePluginKey = "Bubble";

const defaultPosition = {
  top: -9999,
  left: -9999,
  width: 20,
  height: 20,
};

export function BubblePlugin() {
  const ref = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const isFocus = useFocused();
  const selection = useSlateSelection();

  const [trgglerStyle, setTrgglerStyle] = useState(defaultPosition);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isFocus) {
      setOpen(false);
      return setTrgglerStyle(defaultPosition);
    }

    const rect = Bubble.getSelectionRect(editor);

    if (rect && ref.current) {
      setTrgglerStyle({
        top: rect.y,
        left: rect.x,
        width: rect.width,
        height: rect.height,
      });
      setOpen(true);
    } else {
      setTrgglerStyle(defaultPosition);
      setOpen(false);
    }
  }, [editor, selection]);

  return (
    <Popover.Root open={open}>
      <Popover.Trigger>
        <div
          ref={ref}
          style={{ ...trgglerStyle, position: "absolute", zIndex: -1 }}
        />
      </Popover.Trigger>
      <Popover.Content
        width="360px"
        side="top"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <Flex justify="between">
          <Flex gap="2" align="center">
            <IconButton size="1" variant="ghost" autoFocus={false}>
              <BookmarkIcon />
            </IconButton>
            <IconButton size="1" variant="ghost" autoFocus={false}>
              <GlobeIcon />
            </IconButton>
          </Flex>
          <Button size="1" variant="soft" autoFocus={false}>
            Share
          </Button>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}

const Bubble = {
  getSelectionRect(editor: Editor) {
    const { selection } = editor;

    if (
      !selection ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      return null;
    }

    return posToOffsetRect(editor, selection);
  },
};
