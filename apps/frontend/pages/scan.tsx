import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Link from 'next/link';
import api from '../lib/api';

export default function Scan() {
  const { t } = useTranslation();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setError('');
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await api.post('/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || t('errors.uploadFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Scan Crop - Fasal Rakshak</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container-mobile py-4 flex justify-between items-center">
            <Link href="/dashboard" className="text-2xl font-bold text-primary-600">
              🌾 Fasal Rakshak
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-800">
              ← Back to Dashboard
            </Link>
          </div>
        </nav>

        <div className="container-mobile py-8">
          <h1 className="text-3xl font-bold mb-8">{t('scan.title')}</h1>

          <div className="bg-white rounded-lg shadow-md p-6">
            {!result ? (
              <>
                <div className="mb-6">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded" />
                    ) : (
                      <div className="text-center">
                        <div className="text-4xl mb-2">📷</div>
                        <p className="text-gray-600">{t('scan.upload')}</p>
                      </div>
                    )}
                  </button>
                </div>

                {selectedFile && (
                  <button
                    onClick={handleScan}
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
                  >
                    {loading ? t('scan.processing') : 'Analyze Image'}
                  </button>
                )}

                {error && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">{t('scan.result')}</h2>
                  {preview && (
                    <img src={preview} alt="Scanned" className="max-w-full h-auto rounded-lg mb-4" />
                  )}
                </div>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('scan.disease')}</p>
                    <p className="text-2xl font-bold text-primary-600">{result.disease}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('scan.confidence')}</p>
                    <p className="text-xl font-semibold">{(result.confidence * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('scan.healthScore')}</p>
                    <p className="text-xl font-semibold">{result.healthScore}/100</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{t('scan.treatment')}</p>
                    <p className="text-gray-800">{result.treatment}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    href="/products"
                    className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-primary-700"
                  >
                    {t('scan.buyInputs')}
                  </Link>
                  <button
                    onClick={() => {
                      setResult(null);
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
                  >
                    Scan Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

