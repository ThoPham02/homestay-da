import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Home/Hero';
import HomestayCard from '../components/Homestay/HomestayCard';
import { Homestay } from '../types';
import { homestayService } from '../services/homestayService';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [homestays, setHomestays] = React.useState<Homestay[]>([]);

  useEffect(() => {
    const fetchHomestays = async () => {
      try {
        const data = await homestayService.getTopHomestays(8);
        
        setHomestays(data);
      } catch (error) {
        console.error('Error fetching homestays:', error);
      }
    };

    fetchHomestays();
  }, []);

  const handleSearch = (filters: any) => {
    navigate('/homestays', { state: { filters } });
  };

  const handleHomestayClick = (homestayId: number) => {
    navigate(`/homestay/${homestayId}`);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Homestay nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Khám phá những homestay được yêu thích nhất
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {homestays.slice(0, 8).map((homestay) => (
            <HomestayCard
              key={homestay.id}
              homestay={homestay}
              onClick={() => handleHomestayClick(homestay.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;