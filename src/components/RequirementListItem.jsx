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
      // FIX: Added tabIndex and role for accessibility
      // BEFORE: Div had onClick/onKeyDown but no tabIndex
      // Users couldn't tab to this element with keyboard
      // Screen readers didn't know it was interactive
      // AFTER: tabIndex={0} allows keyboard navigation
      //        role="button" tells screen readers this is a clickable element
      // This makes the app usable for keyboard-only and screen reader users
      tabIndex={0}
      role="button"
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

