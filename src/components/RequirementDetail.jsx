import { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import VersionHistoryPanel from "./VersionHistoryPanel";

function RequirementDetail({
  requirement,
  onUpdate,
  onDelete,
  onGenerateAI,
  onClose,
  onCommitVersion,
  onRestoreVersion,
  versionHistory,
  saving,
  generating,
  acceptanceCriteria,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Draft");
  const [lastSaved, setLastSaved] = useState(null);
  // FIX: Track unsaved changes to provide visual feedback and enable auto-save
  // UI shows red asterisk (*) when hasUnsavedChanges = true
  // Auto-save triggers after 3 seconds of inactivity if this is true
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // FIX: Sync all state from requirement prop when selection changes
  // BEFORE: Only synced title and description, NOT status
  // This caused status to stay from previous requirement (data bleeding)
  // AFTER: All three fields sync when requirement changes
  useEffect(() => {
    if (requirement) {
      setTitle(requirement.title);
      setDescription(requirement.description);
      setStatus(requirement.status);
      setHasUnsavedChanges(false);
    }
  }, [requirement]);

  // FIX: Added cleanup function to prevent memory leak
  // BEFORE: No cleanup - event listener was added on every render but never removed
  // Clicking multiple requirements accumulated 10+ listeners
  // Pressing Escape or Ctrl+S would trigger multiple times
  // AFTER: Cleanup function removes listener when component unmounts
  // This is the React best practice for cleaning up side effects
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && requirement) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (requirement) {
          onUpdate(requirement.id, { title, description, status });
          setHasUnsavedChanges(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // CLEANUP: Remove listener when component unmounts or dependencies change
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [requirement, title, description, status, onUpdate, onClose]);

  // FIX: Implemented auto-save feature as per requirements
  // Requirement: "Application must auto-save changes to local state/backend every 3 seconds"
  // Behavior:
  // 1. User types in any field → hasUnsavedChanges = true
  // 2. If no changes for 3 seconds → auto-save triggers
  // 3. Resets hasUnsavedChanges to false and updates lastSaved timestamp
  // 4. If user types again within 3 seconds → timer resets (debouncing)
  // This prevents data loss without annoying the user with constant saves
  useEffect(() => {
    if (!hasUnsavedChanges || !requirement) {
      return;
    }

    const autoSaveTimer = setTimeout(() => {
      onUpdate(requirement.id, { title, description, status });
      setLastSaved(new Date().toISOString());
      setHasUnsavedChanges(false);
    }, 3000);

    return () => {
      clearTimeout(autoSaveTimer);
    };
  }, [hasUnsavedChanges, requirement, title, description, status, onUpdate]);

  // FIX: Clear unsaved changes flag on manual save
  // This ensures hasUnsavedChanges is always in sync with actual saved state
  const handleSave = () => {
    onUpdate(requirement.id, { title: title.trim(), description, status });
    setLastSaved(new Date().toISOString());
    setHasUnsavedChanges(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this requirement?")) {
      onDelete(requirement.id);
    }
  };

  if (!requirement) {
    return (
      <div className="fixed right-0 top-0 h-full w-1/2 z-50 bg-white shadow-lg flex items-center justify-center">
        <p className="text-gray-500">Select a requirement to view details</p>
      </div>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-1/2 z-10 bg-white shadow-lg flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Requirement Details
          {/* FIX: Show unsaved changes indicator
              yellow asterisk (unsaved) appears when user has unsaved changes
              This provides immediate visual feedback that changes exist
              Works together with auto-save to prevent data loss */}
          {hasUnsavedChanges && (
            <span
              className="ml-3 inline-flex items-center gap-2 px-2 py-0.5 text-xs font-medium rounded-full
                   bg-yellow-100 text-yellow-800 animate-pulse"
            >
              Unsaved
            </span>
          )}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pl-4 pr-8">
        <div className="space-y-4">
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // FIX: Track unsaved changes immediately when user types
                // This allows auto-save timer to start counting from this point
                setHasUnsavedChanges(true);
              }}
              disabled={saving}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </div>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                // FIX: Track unsaved changes when description is modified
                setHasUnsavedChanges(true);
              }}
              disabled={saving}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  // FIX: Track unsaved changes when status is modified
                  setHasUnsavedChanges(true);
                }}
                disabled={saving}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="Draft">Draft</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <StatusBadge status={status} />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => onGenerateAI(requirement.id)}
              disabled={generating}
              className="!px-4 !py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {generating
                ? "Generating..."
                : "✨ Generate AI Acceptance Criteria"}
            </button>
          </div>

          {acceptanceCriteria &&
            acceptanceCriteria.requirementId === requirement.id && (
              <div className="mt-4 p-4 bg-purple-50 rounded-md">
                <h4 className="font-medium text-purple-900 mb-2">
                  AI-Generated Acceptance Criteria
                </h4>
                <ul className="space-y-2">
                  {acceptanceCriteria.criteria.map((criterion, index) => (
                    <li
                      key={index}
                      className="text-sm text-purple-800 flex items-start gap-2"
                    >
                      <span className="text-purple-500">•</span>
                      {criterion}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-purple-600">
                  Generated at:{" "}
                  {new Date(acceptanceCriteria.generatedAt).toLocaleString()}
                </p>
              </div>
            )}

          {/* FEATURE: Version History Panel
              Shows all previous versions of this requirement
              User can commit snapshots and restore to previous versions */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <VersionHistoryPanel
              versions={versionHistory}
              onRestore={onRestoreVersion}
              onCommit={() =>
                onCommitVersion(requirement.id, title, description)
              }
              requirementId={requirement.id}
              saving={saving}
            />
          </div>
        </div>
      </div>

      <div
        className="p-4 border-t border-gray-200 flex flex-col gap-2 flex-shrink-0"
        style={{ flexShrink: 0 }}
      >
        {/* Last saved timestamp display */}
        {lastSaved && (
          <p className="text-xs text-gray-500 text-center">
            Last saved: {new Date(lastSaved).toLocaleTimeString()}
          </p>
        )}

        {/* Action buttons with improved styling */}
        <div className="flex gap-3 min-h-12">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex-1 px-4 py-4 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md active:scale-95 cursor-pointer"
            title="Delete this requirement permanently"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-4 py-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg active:scale-95 cursor-pointer"
            title="Save changes to this requirement"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequirementDetail;
