import { useState } from 'react';
import { ApiError, mapValidationErrors } from '../api/apiClient';

export function useForm(initialValues, validate, onSubmit) {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.validationErrors) {
          setErrors(mapValidationErrors(err.validationErrors));
        } else {
          setServerError(err.message);
        }
      } else {
        setServerError('No connection to server');
      }
    } finally {
      setLoading(false);
    }
  };

  return { form, errors, serverError, loading, handleChange, handleSubmit };
}
