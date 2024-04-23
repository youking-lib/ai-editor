// Plugin is A React Component

import { useEffect } from "react";
import { EditableVoidProvider } from "./internal-plugins/editable-void";

export class PluginContext {}

function usePluginCtx() {}

export function TranlsatePlugin() {
  const ctx = usePluginCtx();

  // ctx.addToolbar
  // ctx.bubble
  // ctx.slash
  // ctx.decorate

  return <div>Translate Plugin Placeholder</div>;
}

const ChatAIPlginKey = "ChatAIPlginKey";

export function ChatAIPlgin() {
  const ctx = usePluginCtx();

  useEffect(() => {}, []);

  return (
    <>
      <EditableVoidProvider
        key={ChatAIPlginKey}
        render={() => <input autoFocus />}
      />
    </>
  );
}

const SlashPluginKey = "SlashPluginKey";

export function SlashPlugin() {
  const ctx = usePluginCtx();

  useEffect(() => {}, []);

  return (
    <>
      <EditableVoidProvider
        key={SlashPluginKey}
        render={() => <input autoFocus />}
      />
    </>
  );
}
