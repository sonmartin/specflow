function StatusBadge({ status }) {
  const getStatusClasses = () => {
    switch (status) {
      case 'Draft':
        return 'bg-gray-200 text-gray-800';
      case 'In Progress':
        return 'bg-yellow-200 text-yellow-800';
      case 'Completed':
        return 'bg-green-200 text-green-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusClasses()}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;

