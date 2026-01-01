import { useState, useEffect } from 'react';
import RequirementList from './components/RequirementList';
import RequirementDetail from './components/RequirementDetail';
import {
  getRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  generateAcceptanceCriteria,
} from './services/api';

function App() {
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(null);

  const fetchRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRequirements();
      setRequirements(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleSelect = (id) => {
    setTimeout(() => {
      setSelectedRequirementId(id);
    }, 100);
    setAcceptanceCriteria(null);
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const newReq = await createRequirement({
        title: 'New Requirement',
        description: '',
        status: 'Draft',
      });
      setRequirements((prev) => [...prev, newReq]);
      setSelectedRequirementId(newReq.id);
    } catch (err) {
      console.error('Failed to create requirement:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setSaving(true);
    setRequirements([...requirements]);
    try {
      const updated = await updateRequirement(id, data);
      setRequirements((prev) =>
        prev.map((req) => (req.id === id ? updated : req))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setSaving(true);
    try {
      await deleteRequirement(id);
      setRequirements((prev) => prev.filter((req) => req.id !== id));
      if (selectedRequirementId === id) {
        setSelectedRequirementId(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAI = async (id) => {
    setGenerating(true);
    try {
      const criteria = await generateAcceptanceCriteria(id);
      setAcceptanceCriteria(criteria);
      setGenerating(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    setSelectedRequirementId(null);
    setAcceptanceCriteria(null);
  };

  const selectedRequirement = requirements.find(
    (req) => req.id === selectedRequirementId
  );

  return (
    <div className="h-screen flex bg-gray-100" style={{ position: 'relative', zIndex: 1 }}>
      <div className="w-1/2 h-full" style={{ position: 'relative', zIndex: 100 }}>
        <RequirementList
          requirements={requirements}
          selectedId={selectedRequirementId}
          onSelect={handleSelect}
          onCreate={handleCreate}
          loading={loading}
          error={error}
          onRetry={fetchRequirements}
        />
      </div>
      <RequirementDetail
        requirement={selectedRequirement}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onGenerateAI={handleGenerateAI}
        onClose={handleClose}
        saving={saving}
        generating={generating}
        acceptanceCriteria={acceptanceCriteria}
      />
    </div>
  );
}

export default App;
