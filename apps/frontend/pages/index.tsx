import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>Fasal Rakshak - Crop Disease Detection</title>
        <meta name="description" content="AI-powered crop disease detection for farmers" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Navigation */}
        <nav className="container-mobile py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">🌾 Fasal Rakshak</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-primary-600 hover:text-primary-700">
              {t('common.login')}
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              {t('common.signup')}
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container-mobile py-12 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              {t('hero.subtitle')}
            </p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('hero.cta')}
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
            {[
              { key: 'fast', icon: '⚡' },
              { key: 'accurate', icon: '🎯' },
              { key: 'treatment', icon: '💊' },
              { key: 'community', icon: '👥' },
            ].map((feature) => (
              <div
                key={feature.key}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-gray-800">
                  {t(`hero.features.${feature.key}`)}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="container-mobile py-12 bg-white">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload Photo', desc: 'Take or upload a photo of your crop' },
              { step: '2', title: 'AI Analysis', desc: 'Get instant disease detection in seconds' },
              { step: '3', title: 'Get Treatment', desc: 'Receive treatment recommendations and buy inputs' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-600">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="container-mobile py-8 border-t mt-12">
          <div className="text-center text-gray-600">
            <p>© 2024 Fasal Rakshak - Team CodeMatrix</p>
            <p className="text-sm mt-2">Smart India Hackathon 2024</p>
          </div>
        </footer>
      </div>
    </>
  );
}


