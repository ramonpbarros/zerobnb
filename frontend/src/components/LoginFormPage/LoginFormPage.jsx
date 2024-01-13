import './LoginForm.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/session';
import { useNavigate } from 'react-router-dom';

const LoginFormPage = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    if (sessionUser) {
      navigate('/');
    }
  }, [sessionUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await dispatch(login({ credential, password }));

      if (user) {
        navigate('/');
      }
    } catch (error) {
      if (error.status === 401) {
        setErrors(['Invalid credentials. Please try again.']);
      } else {
        console.error('Login error:', error);
        setErrors(['An error occurred. Please try again.']);
      }
    }
  };

  return (
    <div>
      <h2>Login Form Page</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Credential (Username or Email):
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {errors.length > 0 && (
          <div>
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginFormPage;
