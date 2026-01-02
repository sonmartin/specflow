import { useState } from "react";

function VersionHistoryPanel({
  versions,
  onRestore,
  onCommit,
  requirementId,
  saving,
}) {
  const hasVersions = versions && versions.length > 0;

  return (
    <div className="space-y-3">
      {/* Commit Version button - always visible */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Version History</h4>
        <button
          onClick={onCommit}
          disabled={saving}
          className="!p-3 py-2 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowe cursor-pointer"
          title="Create a new version snapshot of current changes"
        >
          Commit Version
        </button>
      </div>

      {/* Show empty state or version list */}
      {!hasVersions ? (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            No version history yet. Click "Commit Version" to create your first
            snapshot!
          </p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto space-y-2">
          {versions.map((version, index) => {
            const isNewest = index === 0;
            const canRestore = isNewest;
            const timestamp = new Date(version.createdAt).toLocaleString();

            return (
              <div
                key={version.id}
                className={`p-3 rounded-lg border transition-all ${
                  isNewest
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm text-gray-900 truncate">
                        {version.title}
                      </h5>
                      {isNewest && (
                        <span className="px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full whitespace-nowrap">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
                    {/* Show description preview */}
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 mb-2">
                      {version.description || "(no description)"}
                    </p>
                  </div>
                </div>

                {/* Restore button - only on most recent version */}
                {canRestore && (
                  <button
                    onClick={() => {
                      onRestore(requirementId, version);
                    }}
                    disabled={saving}
                    className="!px-3 !py-2 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 border border-green-300 rounded transition-colors disabled:opacity-50"
                    title="Restore this version to replace current changes"
                  >
                    Restore Version
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VersionHistoryPanel;
