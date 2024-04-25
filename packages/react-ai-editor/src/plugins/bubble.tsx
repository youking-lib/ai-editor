import { Editor, Range } from "slate";
import { useEffect, useRef, useState } from "react";
import { useFocused, useSlate, useSlateSelection } from "slate-react";
import { BookmarkIcon, GlobeIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  Select,
  Separator,
} from "@radix-ui/themes";
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
  }, [editor, selection, isFocus]);

  return (
    <Popover.Root open={open}>
      <Popover.Trigger>
        <div
          ref={ref}
          style={{ ...trgglerStyle, position: "absolute", zIndex: -1 }}
        />
      </Popover.Trigger>
      <Popover.Content
        onOpenAutoFocus={e => e.preventDefault()}
        maxWidth="360px"
        minWidth="360px"
        align="center"
        width="360px"
        side="top"
        size="1"
      >
        <Flex gap="3" align="center">
          <Flex align="center" gap="2">
            <Select.Root defaultValue="apple" size="1">
              <Select.Trigger variant="soft">EN</Select.Trigger>
              <Select.Content>
                <Select.Item value="apple">English</Select.Item>
                <Select.Item value="orange">Chinese</Select.Item>
              </Select.Content>
            </Select.Root>
            <IconButton size="2" variant="ghost">
              <GlobeIcon />
            </IconButton>
          </Flex>

          <Separator orientation="vertical" />

          <IconButton size="2" variant="ghost">
            <BookmarkIcon />
          </IconButton>
        </Flex>

        {/* <Flex justify="between">
          
          <Button size="1" variant="soft">
            Share
          </Button>
        </Flex> */}
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
