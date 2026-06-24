"use client";

import { useState } from "react";
import { UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    setMessage("Generating cryptographic allocation...");

    try {
      // 1. Request a presigned URL from our secure route
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate secure upload token.");
      }

      const { url, key } = await response.json();

      setMessage("Streaming binary to edge node...");

      // 2. Perform zero-buffer direct PUT to Cloudflare R2 / AWS S3
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (uploadResponse.ok) {
        setStatus("success");
        setMessage(`Upload secured at edge allocation: ${key}`);
      } else {
        throw new Error("Cloud Storage rejected the binary stream.");
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setStatus("error");
      setMessage(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Storage Logistics</h1>

      <div className="max-w-xl bg-slate-900/50 border border-white/5 rounded-3xl p-8 shadow-2xl">
        <h2 className="text-xl font-semibold text-slate-200 mb-6">Direct-to-Edge File Allocation</h2>
        
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-colors bg-slate-950">
          <UploadCloud className="w-12 h-12 mx-auto text-slate-400 mb-4" />
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setStatus("idle");
              setMessage("");
            }}
            className="block w-full text-sm text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-slate-800 file:text-white
              hover:file:bg-slate-700
              cursor-pointer transition-all"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || status === "uploading"}
          className="w-full mt-6 bg-white text-slate-950 font-bold py-3 rounded-full hover:bg-slate-200 disabled:opacity-50 transition-colors"
        >
          {status === "uploading" ? "Encrypting & Streaming..." : "Initialize Upload"}
        </button>

        {status === "success" && (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-400">{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
