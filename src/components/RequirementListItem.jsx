import StatusBadge from './StatusBadge';

function RequirementListItem({ requirement, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(requirement.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSelect(requirement.id);
        }
      }}
      className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 truncate flex-1 mr-2">
          {requirement.title}
        </h3>
        <StatusBadge status={requirement.status} />
      </div>
      <p className="mt-1 text-sm text-gray-500 truncate">
        {requirement.description}
      </p>
    </div>
  );
}

export default RequirementListItem;

