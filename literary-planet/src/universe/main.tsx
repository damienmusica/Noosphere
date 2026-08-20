import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadDataset } from "../data/load.ts";
import { UniverseApp } from "./UniverseApp.tsx";
import "../styles.css";
import "./universe.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("#root missing");
const root = createRoot(rootEl);

try {
  const dataset = loadDataset();
  root.render(
    <StrictMode>
      <UniverseApp dataset={dataset} />
    </StrictMode>
  );
} catch (err) {
  root.render(
    <div className="fatal-error" role="alert">
      <h1>문학의 성계</h1>
      <pre>{String(err)}</pre>
    </div>
  );
}
