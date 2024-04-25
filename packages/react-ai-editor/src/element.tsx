import {
  Blockquote,
  Card,
  Heading,
  HeadingProps,
  Separator,
  Text,
  Theme,
} from "@radix-ui/themes";
import { RenderElementProps, useSlate } from "slate-react";
import { Editor } from "slate";
import { useMemo } from "react";

import { SlateHeadingNode } from "./interface";
import { Plugin } from "./internal-plugins/plugin";

const SlateHeadingUIMap: Record<SlateHeadingNode["type"], HeadingProps> = {
  heading_one: {
    as: "h1",
    size: "8",
  },
  heading_two: {
    as: "h2",
    size: "7",
  },
  heading_three: {
    as: "h3",
    size: "6",
  },
  heading_four: {
    as: "h4",
    size: "5",
  },
  heading_five: {
    as: "h5",
    size: "4",
  },
  heading_six: {
    as: "h6",
    size: "3",
  },
};

export const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;

  const slate = useSlate();
  const pluginRendererElement = useMemo(
    () => getPluginRenderElement(slate),
    [slate]
  );

  const pluginNode = pluginRendererElement(props);

  if (pluginNode) {
    return pluginNode;
  }

  switch (element.type) {
    case "heading_one":
    case "heading_two":
    case "heading_three":
    case "heading_four":
    case "heading_five":
    case "heading_six":
      return (
        <Heading my="2" {...attributes} {...SlateHeadingUIMap[element.type]}>
          {children}
        </Heading>
      );
    case "block_quote":
      return (
        <Blockquote my="2" {...attributes}>
          {children}
        </Blockquote>
      );
    // case "thematic_break":
    //   return <Separator my="4" orientation="horizontal" size="4" />;
    case "ul_list":
      return <ul {...attributes}>{children}</ul>;
    case "list_item":
      return <li {...attributes}>{children}</li>;
    case "ol_list":
      return <ol {...attributes}>{children}</ol>;
    case "code_block":
      return (
        <Theme appearance="dark">
          <Card my="2" variant="classic">
            <pre>
              <code {...attributes}>{children}</code>
            </pre>
          </Card>
        </Theme>
      );
    case "paragraph":
      return (
        <Text my="2" {...attributes} as="p">
          {children}
        </Text>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

function getPluginRenderElement(editor: Editor) {
  const plugins = Plugin.getPlugins(editor, "Editor").filter(
    item => item.renderElement
  );

  return function renderElement(props: RenderElementProps) {
    for (let i = 0; i < plugins.length; i++) {
      const node = plugins[i].renderElement?.(props);

      if (node) return node;
    }

    return null;
  };
}
