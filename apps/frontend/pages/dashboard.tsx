import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Head from 'next/head';
import Link from 'next/link';
import api from '../lib/api';

interface Scan {
  id: string;
  disease_label: string;
  confidence: number;
  health_score: number;
  created_at: string;
  image_url: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchScans();
  }, []);

  const fetchScans = async () => {
    try {
      const response = await api.get('/scan?limit=10');
      setScans(response.data.scans || []);
    } catch (error) {
      console.error('Failed to fetch scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Fasal Rakshak</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="container-mobile py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-primary-600">🌾 Fasal Rakshak</div>
            <div className="flex gap-4 items-center">
              <Link href="/scan" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                {t('common.scan')}
              </Link>
              <button onClick={handleLogout} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                {t('common.logout')}
              </button>
            </div>
          </div>
        </nav>

        <div className="container-mobile py-8">
          <h1 className="text-3xl font-bold mb-8">{t('dashboard.title')}</h1>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/scan"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">📸</div>
              <h3 className="font-semibold text-lg">{t('common.scan')}</h3>
            </Link>
            <Link
              href="/history"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold text-lg">{t('common.history')}</h3>
            </Link>
            <Link
              href="/community"
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-4xl mb-4">👥</div>
              <h3 className="font-semibold text-lg">{t('common.community')}</h3>
            </Link>
          </div>

          {/* Recent Scans */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">{t('dashboard.recentScans')}</h2>
            {scans.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No scans yet. <Link href="/scan" className="text-primary-600 hover:underline">Start scanning</Link>
              </p>
            ) : (
              <div className="space-y-4">
                {scans.map((scan) => (
                  <div key={scan.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-lg">{scan.disease_label}</p>
                        <p className="text-sm text-gray-600">
                          Confidence: {(scan.confidence * 100).toFixed(1)}% | 
                          Health Score: {scan.health_score}/100
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(scan.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        href={`/scan/${scan.id}`}
                        className="text-primary-600 hover:underline text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


