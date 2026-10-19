import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import AuthCard from '../components/AuthCard';
import RecoveryCodeDialog from '../components/RecoveryCodeDialog';

const ADJECTIVES = ['quiet', 'steady', 'hopeful', 'gentle', 'brave', 'calm', 'kind', 'bright'];
const NOUNS = ['fox', 'river', 'sky', 'maple', 'harbor', 'ember', 'willow', 'meadow'];

const suggestNickname = () => {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  return `${adjective}_${noun}${number}`;
};

const Register = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/register', { pseudonym, password });
      login(data);
      setRecoveryCode(data.recoveryCode);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard immersive scene="register"
      title="Join SafeSpace"
      subtitle="Choose a nickname and a password. Keep your real name to yourself."
    >
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Nickname
          <div className="input-group">
            <input
              aria-label="Nickname"
              autoComplete="username"
              name="username"
              value={pseudonym}
              onChange={(e) => setPseudonym(e.target.value)}
              minLength={3}
              maxLength={32}
              required
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setPseudonym(suggestNickname())}
            >
              Suggest one
            </button>
          </div>
        </label>
        <label className="field">
          Password
          <div className="login-password">
          <input
            aria-label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
          <button type="button" className="login-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        {error && <ErrorMessage message={error} />}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
        <p className="text-muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
      <AnimatePresence>
        {recoveryCode && (
          <RecoveryCodeDialog recoveryCode={recoveryCode} onContinue={() => navigate('/')} />
        )}
      </AnimatePresence>
    </AuthCard>
  );
};

export default Register;
