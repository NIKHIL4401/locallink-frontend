import React, { useState } from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import { getGeocodedCoordinates } from '../../services/geoService';

export default function SearchAutocomplete({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearchExecute = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const locationData = await getGeocodedCoordinates(query);
      onLocationSelect(locationData);
    } catch (error) {
      console.error('[Geocoding Engine Error]:', error);
      alert('Could not compute target coordinate vector.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearchExecute} className="w-full relative flex items-center">
      <div className="absolute left-4 text-slate-400 text-lg">
        <FiMapPin />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Input location string context (e.g. Manhattan, NY)..."
        className="w-full py-3.5 pl-12 pr-28 bg-white/70 dark:bg-darkSurface/70 backdrop-blur-md border border-white/20 dark:border-slate-800/60 rounded-xl focus:outline-none focus:border-brand-500 text-sm font-medium shadow-inner transition-all"
      />
      <button
        type="submit"
        disabled={loading}
        className="absolute right-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-brand-600/10"
      >
        <FiSearch /> {loading ? 'Searching...' : 'Locate'}
      </button>
    </form>
  );
}
