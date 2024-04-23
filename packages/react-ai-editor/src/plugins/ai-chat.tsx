import { EditableVoidProvider } from "../internal-plugins/editable-void";

const ChatAIPlginKey = "ChatAIPlginKey";

export function AIChatPlgin() {
  return (
    <>
      <EditableVoidProvider
        key={ChatAIPlginKey}
        render={() => <input autoFocus />}
      />
    </>
  );
}
