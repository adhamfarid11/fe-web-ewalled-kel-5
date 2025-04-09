import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    password: '',
    noHp: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage(''); // Reset success message

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      setLoading(false);

      if (response.status === 201) {
        setSuccessMessage('Pendaftaran berhasil! Silakan login untuk melanjutkan.');
        setFormData({ namaLengkap: '', email: '', password: '', noHp: '' });

        // Optional: Redirect ke halaman login setelah beberapa detik
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
        'Pendaftaran gagal. Silakan coba lagi.'
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center">
          <div className="text-blue-600 mr-2">
              <img src="/images/logo.png" alt="E-Wallet Logo" width="32" height="32" />
            </div>
            <h1 className="text-2xl font-bold">Walled</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="namaLengkap"
                placeholder="Nama Lengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="tel"
                name="noHp"
                placeholder="No Hp"
                value={formData.noHp}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Mengirim...' : 'Daftar'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login di sini</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:block md:w-1/2 h-screen m-0 p-0">
        <div className="h-full w-full">
          <img
            src="/images/money.png"
            alt="Money"
            className="h-screen w-full object-cover"
            style={{ display: 'block', margin: 0, padding: 0 }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
