import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import HomestayCard from '../components/Homestay/HomestayCard';
import SearchFilters from '../components/Homestay/SearchFilters';
import { useData } from '../contexts/DataContext';

const HomestayList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { homestays } = useData();
  const [filters, setFilters] = useState<any>({});

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(location.state.filters);
    }
  }, [location.state]);

  const handleHomestayClick = (homestayId: string) => {
    navigate(`/homestay/${homestayId}`);
  };

  const filteredHomestays = homestays.filter(homestay => {
    if (!filters.location) return true;
    return homestay.location.toLowerCase().includes(filters.location.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tất cả Homestay
          </h1>
          <p className="text-lg text-gray-600">
            {filteredHomestays.length} homestay được tìm thấy
          </p>
        </div>
        
        <SearchFilters filters={filters} onFiltersChange={setFilters} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredHomestays.map((homestay) => (
            <HomestayCard
              key={homestay.id}
              homestay={homestay}
              onClick={() => handleHomestayClick(homestay.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomestayList;