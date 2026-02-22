"use client";

import { Link as LinkIcon, Plus, RefreshCw, Upload } from "lucide-react";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "../ui";

export function DataSourceManager() {
  const [activeTab, setActiveTab] = useState<"upload" | "scrape" | "manual">(
    "upload",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/rag/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({
          type: "success",
          text: `Uploaded ${file.name} with ${result.documentsCreated} documents`,
        });
      } else {
        setMessage({ type: "error", text: result.error || "Upload failed" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Upload error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrape = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const url = formData.get("url") as string;

    if (!url) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/rag/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({
          type: "success",
          text: `Scraped ${url} with ${result.documentsCreated} documents`,
        });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({ type: "error", text: result.error || "Scrape failed" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Scrape error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualEntry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;
    const tags = (formData.get("tags") as string)
      .split(",")
      .map((t) => t.trim());

    if (!title || !content) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/rag/knowledge-base", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, category, tags }),
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({
          type: "success",
          text: `Created knowledge base entry: ${title}`,
        });
        (e.target as HTMLFormElement).reset();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to create entry",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Error creating entry",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitialize = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/rag/index-portfolio", {
        method: "POST",
      });

      const result = await response.json();
      if (response.ok) {
        setMessage({
          type: "success",
          text: `Indexed ${result.documentsAdded} portfolio documents`,
        });
      } else {
        setMessage({
          type: "error",
          text: result.error || "Initialization failed",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Initialization error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Source Management</CardTitle>
          <CardDescription>
            Add and manage knowledge base sources
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-800"
                  : "bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          {}
          <div>
            <Button
              onClick={handleInitialize}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Initialize Portfolio KB
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              Load default portfolio data into the knowledge base
            </p>
          </div>

          {}
          <div className="border-b">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("upload")}
                className={`pb-2 px-4 border-b-2 font-medium transition ${
                  activeTab === "upload"
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Upload className="w-4 h-4 inline mr-2" />
                Upload Documents
              </button>
              <button
                onClick={() => setActiveTab("scrape")}
                className={`pb-2 px-4 border-b-2 font-medium transition ${
                  activeTab === "scrape"
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <LinkIcon className="w-4 h-4 inline mr-2" />
                Scrape URLs
              </button>
              <button
                onClick={() => setActiveTab("manual")}
                className={`pb-2 px-4 border-b-2 font-medium transition ${
                  activeTab === "manual"
                    ? "border-amber-600 text-amber-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                Manual Entries
              </button>
            </div>
          </div>

          {}
          {activeTab === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                  accept=".txt,.pdf,.md,.json"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    TXT, PDF, MD, or JSON (max 10MB)
                  </p>
                </label>
              </div>
            </div>
          )}

          {}
          {activeTab === "scrape" && (
            <form onSubmit={handleScrape} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <Input
                  type="url"
                  name="url"
                  placeholder="https://example.com"
                  required
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <LinkIcon className="w-4 h-4 mr-2" />
                Scrape URL
              </Button>
            </form>
          )}

          {}
          {activeTab === "manual" && (
            <form onSubmit={handleManualEntry} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  type="text"
                  name="title"
                  placeholder="Entry title"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  placeholder="Entry content"
                  required
                  disabled={isLoading}
                  rows={6}
                  className="w-full px-3 py-2 border rounded-lg text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <Input
                    type="text"
                    name="category"
                    placeholder="e.g., FAQ, Skills"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input
                    type="text"
                    name="tags"
                    placeholder="e.g., python, javascript"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Entry
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}