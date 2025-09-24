import React, { useEffect, useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  source: string;
  url: string;
}

interface NewsProps {
  limit?: number;
}

const News: React.FC<NewsProps> = ({ limit = 5 }) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=automotive&apiKey=dd73aaf2484e40caaf19bb4f3dd7279f`,
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.articles && data.articles.length > 0) {
          const formattedNews: NewsItem[] = data.articles.slice(0, limit).map((article: any, index: number) => ({
            id: index + 1,
            title: article.title || 'Без назви',
            description: article.description || 'Опис відсутній',
            image: article.urlToImage || '/locales/images/car.png',
            date: new Date(article.publishedAt).toLocaleDateString('uk-UA'),
            source: article.source?.name || 'Невідоме джерело',
            url: article.url || '#',
          }));
          setNews(formattedNews);
        } else {
          // Fallback to mock data if no articles found
          const mockNews: NewsItem[] = [
            {
              id: 1,
              title: 'Нова електрична модель від Tesla',
              description:
                'Tesla анонсувала нову модель електричного автомобіля з автономним водінням та покращеною батареєю.',
              image: '/locales/images/car.png',
              date: '02.09.2025',
              source: 'AutoNews',
              url: 'https://www.tesla.com/blog/new-model-announcement',
            },
            {
              id: 2,
              title: 'BMV представляє оновлену серію 5',
              description: 'Компанія BMW представила оновлену серію 5 з новим дизайном та покращеними технологіями.',
              image: '/locales/images/car.png',
              date: '01.09.2025',
              source: 'Car Magazine',
              url: 'https://www.bmw.com/en/innovation/new-5-series',
            },
            {
              id: 3,
              title: 'Зростання продажів електромобілів в Україні',
              description: 'За останній рік продажі електромобілів в Україні зросли на 45% порівняно з минулим роком.',
              image: '/locales/images/car.png',
              date: '31.08.2025',
              source: 'Auto Review',
              url: 'https://www.autonews.com/ukraine-ev-sales-growth',
            },
            {
              id: 4,
              title: 'Нові правила техогляду для автомобілів',
              description:
                'З 1 жовтня запроваджуються нові правила проходження технічного огляду для всіх автомобілів.',
              image: '/locales/images/car.png',
              date: '30.08.2025',
              source: 'Transport News',
              url: 'https://www.transport.gov.ua/new-inspection-rules',
            },
            {
              id: 5,
              title: 'Audi запускає нову лінійку гібридних авто',
              description: 'Audi представила нову лінійку гібридних автомобілів з покращеною ефективністю палива.',
              image: '/locales/images/car.png',
              date: '29.08.2025',
              source: 'Auto World',
              url: 'https://www.audi.com/en/experience-audi/hybrid-models',
            },
          ];
          setNews(mockNews);
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Не вдалося завантажити новини');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [limit]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Завантаження новин...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* First row - single news */}
      {news.length > 0 && (
        <a
          href={news[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2">
              <img
                src={news[0].image}
                alt={news[0].title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/locales/images/car.png';
                }}
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{news[0].title}</h3>
              <p className="text-gray-600 mb-4">{news[0].description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{news[0].source}</span>
                <span>{news[0].date}</span>
              </div>
            </div>
          </div>
        </a>
      )}

      {/* Second row - two news */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.slice(1, 3).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/locales/images/car.png';
                  }}
                />
              </div>
              <div className="md:w-1/2 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Third row - two news */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {news.slice(3, 5).map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/locales/images/car.png';
                  }}
                />
              </div>
              <div className="md:w-1/2 p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default News;
