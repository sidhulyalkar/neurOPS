import React, { useState } from "react";
import { runPipeline } from "@/api/pipeline";

export default function PipelineRunner() {
  const [engine, setEngine] = useState("nextflow");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    try {
      const result = await runPipeline(engine);
      setOutput(result.stdout || result.stderr);
    } catch (err) {
      setOutput(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-xl space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Run Pipeline</h2>
      <select
        className="p-2 border rounded"
        value={engine}
        onChange={(e) => setEngine(e.target.value)}
      >
        <option value="nextflow">Nextflow</option>
        <option value="snakemake">Snakemake</option>
      </select>
      <button
        onClick={handleRun}
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Running..." : "Run"}
      </button>
      {output && (
        <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap max-h-80 overflow-y-scroll">
          {output}
        </pre>
      )}
    </div>
  );
}