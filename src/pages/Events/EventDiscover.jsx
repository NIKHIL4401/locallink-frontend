import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EventCard from '../../components/common/Card';
import { FiCompass, FiGrid, FiSliders } from 'react-icons/fi';

export default function EventDiscover() {
  const queryClient = useQueryClient();

  // Unified data access caching mechanism via Tanstack React Query
  const { data: eventsData, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/v1/events');
      return res.data.data;
    }
  });

  const joinMutation = useMutation({
    mutationFn: async (eventId) => {
      // Access storage engine securely mapping transactional pipeline headers
      const res = await axios.post(`http://localhost:5000/api/v1/events/${eventId}/join`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
      alert('Reservation successfully provisioned on platform registers!');
    },
    onError: (err) => {
      alert(err.response?.data?.message || 'Transaction registry failure.');
    }
  });

  return (
    <div className="space-y-8">
      {/* Search Header Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/50 dark:bg-darkSurface/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-2">
            <FiCompass className="text-brand-500" /> Discover Nearby Activities
          </h2>
          <p className="text-sm text-slate-500">Real-time geo-located dynamic structural event parameters</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl glass-card text-slate-600 dark:text-slate-300 hover:text-brand-500">
            <FiSliders /> Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 w-full rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData?.map((event) => (
            <EventCard 
              key={event._id} 
              event={event} 
              onJoin={(id) => joinMutation.mutate(id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}