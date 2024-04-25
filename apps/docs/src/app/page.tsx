import { Editor } from "./editor";

export default function Page(): JSX.Element {
  return (
    <main className="flex flex-col min-h-screen p-48 box-border">
      <Editor />
    </main>
  );
}
