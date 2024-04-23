import { Editor } from "slate";
import { RenderElementProps } from "slate-react";

export type Plugin = EditorPlugin;

export type EditorPlugin = {
  key: string;
  type: "Editor";
  renderElement?: (props: RenderElementProps) => React.ReactNode;
};

export const Plugin = {
  EDITOR_TO_PLUGINS: new WeakMap<Editor, Plugin[]>(),

  add(editor: Editor, plugin: Plugin) {
    const plugins = Plugin.EDITOR_TO_PLUGINS.get(editor) || [];

    if (!plugins.find(item => item.key === plugin.key)) {
      plugins.push(plugin);
      Plugin.EDITOR_TO_PLUGINS.set(editor, plugins);
    }
  },

  getPlugins(editor: Editor, type?: Plugin["type"]) {
    const plugins = Plugin.EDITOR_TO_PLUGINS.get(editor) || [];

    if (!type) return plugins;

    return plugins.filter(item => item.type === type);
  },
};
