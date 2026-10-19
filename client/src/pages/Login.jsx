import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';
import AuthCard from '../components/AuthCard';

const Login = () => {
  const [pseudonym, setPseudonym] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { pseudonym, password });
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthCard immersive title="Welcome back" subtitle="Sign in to your SafeSpace account.">
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Nickname
          <input autoComplete="username" name="username" value={pseudonym} onChange={(e) => setPseudonym(e.target.value)} required />
        </label>
        <label className="field">
          Password
          <div className="login-password">
          <input
            aria-label="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" className="login-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(value => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </label>
        <div className="login-recovery"><Link to="/forgot-password">Forgot your password?</Link></div>
        {error && <ErrorMessage message={error} />}
        <button type="submit" className="btn btn-primary">
          Login
        </button>
        <p className="text-muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </AuthCard>
  );
};

export default Login;
