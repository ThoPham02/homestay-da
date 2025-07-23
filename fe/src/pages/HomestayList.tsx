import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HomestayCard from '../components/Homestay/HomestayCard';
import SearchFilters from '../components/Homestay/SearchFilters';
import { homestayService } from '../services/homestayService';
import { Homestay, HomestayListRequest } from '../types';

const HomestayList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<HomestayListRequest>({
    page: 1,
    pageSize: 1,
    search: '',
    city: '',
    district: '',
    status: 'active'
  });

  useEffect(() => {
    if (location.state?.filters) {
      setFilters(prev => ({ ...prev, ...location.state.filters }));
    }
  }, [location.state]);

  const loadHomestays = async () => {
    try {
      setLoading(true);
      const response = await homestayService.getPublicHomestayList(filters);
      setHomestays(response.homestays);
    } catch (error) {
      console.error('Error loading homestays:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomestays();
  }, [filters]);

  const handleHomestayClick = (homestayId: number) => {
    navigate(`/homestay/${homestayId}`);
  };

  const handleFiltersChange = (newFilters: HomestayListRequest) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
  };

  if (loading && homestays.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách homestay...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Tất cả Homestay
          </h1>
          <p className="text-lg text-gray-600">
            {homestays.length} homestay được tìm thấy
          </p>
        </div>
        
        <SearchFilters filters={filters} onFiltersChange={handleFiltersChange} />
        
        {homestays.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy homestay</h3>
            <p className="text-gray-600">Thử thay đổi bộ lọc tìm kiếm của bạn</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {homestays.map((homestay) => (
                <HomestayCard
                  key={homestay.id}
                  homestay={homestay}
                  onClick={() => handleHomestayClick(homestay.id)}
                />
              ))}
            </div>
            
            {homestays.length >= (filters.pageSize || 12) && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Đang tải...' : 'Tải thêm'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomestayList;