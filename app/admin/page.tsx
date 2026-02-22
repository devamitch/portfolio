

import { DataSourceManager } from "~/components/admin/DataSourceManager";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {}
      <header className="border-b bg-white sticky top-0">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Knowledge Base Admin
          </h1>
          <p className="text-gray-600">
            Manage data sources and knowledge base entries
          </p>
        </div>
      </header>

      {}
      <div className="max-w-6xl mx-auto py-8">
        <DataSourceManager />
      </div>
    </main>
  );
}