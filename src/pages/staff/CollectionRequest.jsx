import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import PageHeader from "../../components/PageHeader";
import CollectionForm from "../../components/CollectionForm";
import CollectionSuccess from "../../components/CollectionSuccess";
import { validateCollectionRequest, hasErrors } from "../../utils/validation";
import { DEPARTMENTS, PRIORITY_LEVELS } from "../../utils/constants";

const INITIAL = {
  department: DEPARTMENTS[0],
  binId: "",
  category: "yellow",
  fillLevel: 75,
  priority: PRIORITY_LEVELS.NORMAL,
  quantity: 1,
  notes: "",
};

const CollectionRequest = () => {
  const { user } = useAuth();
  const { createCollectionRequest, bins } = useAppData();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "fillLevel" || name === "quantity" ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validateCollectionRequest(form);
    if (hasErrors(v)) { setErrors(v); return; }
    setErrors({});
    setSubmitting(true);
    try {
      const req = await createCollectionRequest(form, user);
      setCreated(req);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to create request." });
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <>
        <PageHeader title="Request Submitted" subtitle="Your collection request has been created." backTo="/staff/requests" />
        <CollectionSuccess request={created} onReset={() => setCreated(null)} />
      </>
    );
  }

  return (
    <div>
      <PageHeader
        title="New Collection Request"
        subtitle="Submit a medical waste collection request for your department."
        backTo="/staff/dashboard"
      />
      <CollectionForm
        form={form}
        errors={errors}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        bins={bins}
      />
    </div>
  );
};

export default CollectionRequest;
