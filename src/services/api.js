const STORAGE_KEY = 'specflow_requirements';
const NEXT_ID_KEY = 'specflow_next_id';

// FIX: Normalized status values to consistent format
// BEFORE: Mixed case formats ('Completed', 'in_progress', 'draft')
// AFTER: All use proper case ('Completed', 'In Progress', 'Draft')
// This prevents data bleeding where UI couldn't match status values
const defaultRequirements = [
  {
    id: '1',
    title: 'User Authentication',
    description: 'Implement secure user authentication with OAuth 2.0 support',
    status: 'Completed',
  },
  {
    id: '2',
    title: 'Dashboard Analytics',
    description: 'Create a dashboard with real-time analytics and charts',
    status: 'In Progress',
  },
  {
    id: '3',
    title: 'Export to PDF',
    description: 'Allow users to export reports as PDF documents',
    status: 'Draft',
  },
  {
    id: '4',
    title: 'Email Notifications',
    description: 'Send automated email notifications for important events',
    status: 'Draft',
  },
];

const loadRequirements = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRequirements));
  return [...defaultRequirements];
};

const saveRequirements = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadNextId = () => {
  const stored = localStorage.getItem(NEXT_ID_KEY);
  if (stored) {
    return parseInt(stored, 10);
  }
  localStorage.setItem(NEXT_ID_KEY, '5');
  return 5;
};

const saveNextId = (id) => {
  localStorage.setItem(NEXT_ID_KEY, String(id));
};

let requirements = loadRequirements();
let nextId = loadNextId();

const randomDelay = () => {
  const min = 500;
  const max = 3000;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const maybeReject = () => {
  return Math.random() < 0.25;
};

const simulateRequest = (callback) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (maybeReject()) {
        reject(new Error('Network error: Request failed. Please try again.'));
      } else {
        resolve(callback());
      }
    }, randomDelay());
  });
};

// FIX: Fixed error handling in getRequirements
// BEFORE: Caught errors and silently returned empty array []
// This was misleading - user couldn't tell if no requirements existed or if there was an error
// AFTER: Errors properly propagate to App.jsx, which displays error message to user
export const getRequirements = () => {
  return simulateRequest(() => [...requirements]);
};

export const getRequirementById = (id) => {
  return simulateRequest(() => {
    const requirement = requirements.find((r) => r.id === id);
    if (!requirement) {
      throw new Error(`Requirement with id ${id} not found`);
    }
    return { ...requirement };
  });
};

// FIX: Removed random status transformation that caused data bleeding
// BEFORE: Had Math.random() < 0.3 chance to transform status to lowercase
// Example: 'Draft' could randomly become 'draft'
// This caused data inconsistency - what was saved didn't match what was displayed
// AFTER: Status value is preserved exactly as provided
export const createRequirement = (data) => {
  return simulateRequest(() => {
    const newRequirement = {
      id: String(nextId++),
      title: data.title || 'Untitled Requirement',
      description: data.description || '',
      status: data.status || 'Draft',
    };
    requirements.push(newRequirement);
    saveNextId(nextId);
    saveRequirements(requirements);
    return { ...newRequirement };
  });
};

// FIX: Removed random status transformation in update
// BEFORE: Had Math.random() < 0.2 chance to transform status
// AFTER: Status values are preserved consistently
export const updateRequirement = (id, data) => {
  return simulateRequest(() => {
    const index = requirements.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Requirement with id ${id} not found`);
    }

    requirements[index] = {
      ...requirements[index],
      ...data,
    };
    saveRequirements(requirements);
    return { ...requirements[index] };
  });
};

export const deleteRequirement = (id) => {
  return simulateRequest(() => {
    const index = requirements.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Requirement with id ${id} not found`);
    }
    requirements.splice(index, 1);
    saveRequirements(requirements);
    return { success: true };
  });
};

export const generateAcceptanceCriteria = (requirementId) => {
  return simulateRequest(() => {
    const requirement = requirements.find((r) => r.id === requirementId);
    if (!requirement) {
      throw new Error(`Requirement with id ${requirementId} not found`);
    }
    
    const criteria = [
      `Given a user is on the ${requirement.title} feature`,
      `When the user interacts with the ${requirement.title} functionality`,
      `Then the system should respond within 2 seconds`,
      `And the user should see a confirmation message`,
      `Given the ${requirement.title} is configured correctly`,
      `When an error occurs during ${requirement.title}`,
      `Then the system should display a user-friendly error message`,
      `And log the error for debugging purposes`,
    ];
    
    return {
      requirementId,
      criteria,
      generatedAt: new Date().toISOString(),
    };
  });
};

