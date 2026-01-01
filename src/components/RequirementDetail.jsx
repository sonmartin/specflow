import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';

function RequirementDetail({
  requirement,
  onUpdate,
  onDelete,
  onGenerateAI,
  onClose,
  saving,
  generating,
  acceptanceCriteria,
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Draft');
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (requirement) {
      setTitle(requirement.title);
      setDescription(requirement.description);
    }
  }, [requirement]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && requirement) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (requirement) {
          onUpdate(requirement.id, { title, description, status });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
  });

  const handleSave = () => {
    onUpdate(requirement.id, { title: title.trim(), description, status });
    setLastSaved(new Date().toISOString());
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
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
        <h2 className="text-lg font-semibold text-gray-900">Requirement Details</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
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
                onChange={(e) => setStatus(e.target.value)}
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
              className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating...' : '✨ Generate AI Acceptance Criteria'}
            </button>
          </div>

          {acceptanceCriteria && acceptanceCriteria.requirementId === requirement.id && (
            <div className="mt-4 p-4 bg-purple-50 rounded-md">
              <h4 className="font-medium text-purple-900 mb-2">AI-Generated Acceptance Criteria</h4>
              <ul className="space-y-2">
                {acceptanceCriteria.criteria.map((criterion, index) => (
                  <li key={index} className="text-sm text-purple-800 flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    {criterion}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-purple-600">
                Generated at: {new Date(acceptanceCriteria.generatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between" style={{ flexShrink: 0, minHeight: '80px' }}>
        <button
          onClick={handleDelete}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
          style={{ flex: '1' }}
        >
          Delete
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ flex: '1' }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

export default RequirementDetail;

