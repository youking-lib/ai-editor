import {
  Blockquote,
  Card,
  Heading,
  HeadingProps,
  Separator,
  Theme,
} from "@radix-ui/themes";
import { RenderElementProps } from "slate-react";
import { SlateHeadingNode } from "./interface";

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

export const Element = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
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
    default:
      return <p {...attributes}>{children}</p>;
  }
};