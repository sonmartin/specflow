import { useState, useEffect, use } from "react";
import RequirementList from "./components/RequirementList";
import RequirementDetail from "./components/RequirementDetail";
import {
  getRequirements,
  createRequirement,
  updateRequirement,
  deleteRequirement,
  generateAcceptanceCriteria,
} from "./services/api";

function App() {
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirementId, setSelectedRequirementId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(null);
  const [versionHistory, setVersionHistory] = useState(() => {
    const saved = localStorage.getItem("specflow_version_history");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(
      "specflow_version_history",
      JSON.stringify(versionHistory)
    );
  }, [versionHistory]);

  const handleCommitVersion = (requirementId, title, description) => {
    const newVersion = {
      title,
      description,
      createdAt: new Date().toISOString(),
    };
    setVersionHistory((prev) => {
      const versions = prev[requirementId] || [];
      return {
        ...prev,
        [requirementId]: [...versions, newVersion],
      };
    });
  };

  const handleRestoreVersion = (requirementId, version) => {
    setSaving(true);
    try {
      setRequirements((prev) => {
        const updated = prev.map((req) =>
          req.id === requirementId
            ? { ...req, title: version.title, description: version.description }
            : req
        );
        return updated;
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

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
        title: "New Requirement",
        description: "",
        status: "Draft",
      });
      setRequirements((prev) => [...prev, newReq]);
      setSelectedRequirementId(newReq.id);
    } catch (err) {
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
    <div
      className="h-screen flex bg-gray-100"
      style={{ position: "relative", zIndex: 0 }}
    >
      <div
        className="w-1/2 h-full"
        style={{ position: "relative", zIndex: 10 }}
      >
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
      <div className="relative z-20">
        <RequirementDetail
          requirement={selectedRequirement}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onGenerateAI={handleGenerateAI}
          versionHistory={versionHistory[selectedRequirementId] || []}
          onCommitVersion={handleCommitVersion}
          onRestoreVersion={handleRestoreVersion}
          onClose={handleClose}
          saving={saving}
          generating={generating}
          acceptanceCriteria={acceptanceCriteria}
        />
      </div>
    </div>
  );
}

export default App;
