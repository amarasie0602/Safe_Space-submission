import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { CATEGORIES } from '../utils/categories';
import { containsRiskKeyword } from '../utils/riskKeywords';
import CrisisSupportBanner from '../components/CrisisSupportBanner';
import ErrorMessage from '../components/ErrorMessage';
import SubmitButton from '../components/SubmitButton';

const CreateThread = ({ onCreated }) => {
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();
  const showCrisisSupport = containsRiskKeyword(title) || containsRiskKeyword(body);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setStatus('saving');
    try {
      const { data } = await api.post('/threads', { category, title, body });
      setStatus('success');
      setTitle('');
      setBody('');
      onCreated?.(data);
      setTimeout(() => navigate(`/threads/${data._id}`), 500);
    } catch (err) {
      setStatus('failed');
      setSubmitError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="form-page">
      <h1>New Thread</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's on your mind?"
            required
          />
        </label>
        <label className="field">
          Body
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Say as much or as little as you'd like..."
            required
          />
        </label>
        {showCrisisSupport && <CrisisSupportBanner />}
        {submitError && <ErrorMessage message={submitError} />}
        <SubmitButton status={status} idleLabel="Create Thread" savingLabel="Creating..." />
      </form>
    </div>
  );
};

export default CreateThread;
