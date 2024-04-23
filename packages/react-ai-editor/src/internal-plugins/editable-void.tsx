import { useLayoutEffect } from "react";
import { Editor, Text, Transforms } from "slate";
import { RenderElementProps, useSlate } from "slate-react";
import { Plugin } from "./plugin";

export type SlateEditableVoidElement = {
  type: "editable-void";
  key: string;
  children: Text[];
};

export function EditableVoidPlugin() {
  const slate = useSlate();

  useLayoutEffect(() => {
    Plugin.add(slate, {
      key: "EditableVoidPlugin",
      type: "Editor",
      renderElement: ({ element, attributes, children }) => {
        if (element.type === "editable-void") {
          return (
            <EditableVoidElement
              element={element}
              attributes={attributes}
              children={children}
            />
          );
        }

        return null;
      },
    });
  }, [slate]);

  return null;
}

export const EditableVoid = {
  EDITOR_TO_EDITABLE_VOIDS: new WeakMap<Editor, EditableVoidProps[]>(),

  insertEditableVoid(editor: Editor, key: string) {
    const text = { text: "" };
    const voidNode: SlateEditableVoidElement = {
      key,
      type: "editable-void",
      children: [text],
    };
    Transforms.insertNodes(editor, voidNode);
  },

  getEditableVoid(editor: Editor, key: string) {
    const list = EditableVoid.EDITOR_TO_EDITABLE_VOIDS.get(editor) || [];
    return list.find(item => item.key === key);
  },

  addEditableVoid(editor: Editor, options: EditableVoidProps) {
    const list = EditableVoid.EDITOR_TO_EDITABLE_VOIDS.get(editor) || [];

    if (list.find(item => item.key === options.key)) {
      return;
    }

    list.push(options);
    EditableVoid.EDITOR_TO_EDITABLE_VOIDS.set(editor, list);
  },

  removeEditableVoid(editor: Editor, key: string) {
    const list = EditableVoid.EDITOR_TO_EDITABLE_VOIDS.get(editor) || [];

    EditableVoid.EDITOR_TO_EDITABLE_VOIDS.set(
      editor,
      list.filter(item => item.key !== key)
    );
  },
};

export const withEditableVoid = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = element => {
    return element.type === "editable-void" ? true : isVoid(element);
  };
};

export type EditableVoidElementProps = Omit<RenderElementProps, "element"> & {
  element: SlateEditableVoidElement;
};

export function EditableVoidElement(props: EditableVoidElementProps) {
  const { attributes, children, element } = props;
  const slate = useSlate();
  const editableProps = EditableVoid.getEditableVoid(slate, element.key);

  return (
    <div {...attributes} contentEditable={false}>
      {editableProps?.render(props)}
      {children}
    </div>
  );
}

export type EditableVoidProps = {
  key: string;
  render: (props: RenderElementProps) => JSX.Element;
};

export function EditableVoidProvider(props: EditableVoidProps) {
  const slate = useSlate();

  useLayoutEffect(() => {
    EditableVoid.addEditableVoid(slate, props);

    return () => {
      EditableVoid.removeEditableVoid(slate, props.key);
    };
  }, [slate, props]);

  return null;
}
