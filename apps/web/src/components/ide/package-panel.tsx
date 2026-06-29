"use client";

import { useState } from "react";
import { usePackages } from "@/hooks/use-packages";
import { cn } from "@/lib/utils";

export function PackagePanel() {
  const {
    packages,
    manager,
    isLoading,
    installPackage,
    uninstallPackage,
    refresh,
  } = usePackages();
  const [searchQuery, setSearchQuery] = useState("");
  const [newPackage, setNewPackage] = useState("");

  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-white">Packages</span>
          <span className="text-xs text-gray-400">({manager})</span>
          <button
            onClick={refresh}
            className="ml-auto text-xs text-gray-400 hover:text-white"
          >
            Refresh
          </button>
        </div>

        <input
          type="text"
          placeholder="Search packages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1 text-sm bg-[#3c3c3c] text-white rounded border border-[#505050] focus:border-blue-500 focus:outline-none"
        />
      </div>

      <div className="p-3 border-b border-[#3c3c3c]">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Package name..."
            value={newPackage}
            onChange={(e) => setNewPackage(e.target.value)}
            className="flex-1 px-2 py-1 text-sm bg-[#3c3c3c] text-white rounded border border-[#505050] focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => {
              installPackage(newPackage);
              setNewPackage("");
            }}
            disabled={!newPackage || isLoading}
            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
          >
            Install
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.name}
            className="px-3 py-2 border-b border-[#3c3c3c] hover:bg-[#2a2d2e]"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-white font-mono">
                  {pkg.name}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  {pkg.version}
                </span>
              </div>
              <button
                onClick={() => uninstallPackage(pkg.name)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Uninstall
              </button>
            </div>
            {pkg.description && (
              <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
