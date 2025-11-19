import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import api from '../../lib/api';

export default function Heatmap() {
  const router = useRouter();
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const userData = user ? JSON.parse(user) : null;
    if (userData?.role !== 'admin' && userData?.role !== 'expert') {
      router.push('/dashboard');
      return;
    }

    fetchHeatmapData();
  }, []);

  const fetchHeatmapData = async () => {
    try {
      const response = await api.get('/analytics/heatmap');
      setHeatmapData(response.data.heatmap || []);
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading heatmap data...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Disease Heatmap - Fasal Rakshak</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="container-mobile py-4">
            <h1 className="text-2xl font-bold text-primary-600">🌾 Disease Heatmap</h1>
          </div>
        </nav>

        <div className="container-mobile py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Disease Distribution by Region</h2>
            
            {heatmapData.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {heatmapData.map((item, idx) => (
                  <div key={idx} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{item.region || 'Unknown'}</p>
                        <p className="text-sm text-gray-600">
                          Disease: {item.disease} | Count: {item.count} | 
                          Avg Health: {item.avgHealthScore.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-400">
                          Location: {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a placeholder heatmap. In production, integrate with 
                a mapping library (e.g., Leaflet, Google Maps) to display interactive heatmaps.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


