import RequirementListItem from './RequirementListItem';

function RequirementList({
  requirements,
  selectedId,
  onSelect,
  onCreate,
  loading,
  error,
  onRetry,
}) {
  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Requirements</h2>
          <div
            onClick={!loading ? onCreate : undefined}
            className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? 'none' : 'auto' }}
          >
            + New
          </div>
        </div>
        {loading && (
          <div className="text-sm text-gray-500">Loading...</div>
        )}
        {error && (
          <div className="text-sm text-red-600 flex items-center gap-2">
            <span>{error}</span>
            <button
              onClick={onRetry}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Retry
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {requirements.length === 0 && !loading && (
          <div className="p-4 text-center text-gray-500">
            No requirements yet. Create one to get started.
          </div>
        )}
        {requirements.map((requirement) => (
          <RequirementListItem
            key={requirement.id}
            requirement={requirement}
            isSelected={selectedId === requirement.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default RequirementList;

