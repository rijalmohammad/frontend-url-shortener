import Header from '@/components/Header';
import UrlShortenerForm from '@/components/UrlShortenerForm';
import ShortLinksList from '@/components/ShortLinksList';
 
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <UrlShortenerForm />
          <ShortLinksList />
        </div>
      </main>
    </div>
  );
}