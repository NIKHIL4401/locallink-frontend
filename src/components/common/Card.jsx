import React from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi';

export default function EventCard({ event, onJoin }) {
  const { title, description, banner, startDateTime, location, maxCapacity, joinedCount } = event;

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 flex flex-col group">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={banner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop"} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute top-3 right-3 bg-darkSurface/80 backdrop-blur-md text-xs font-bold text-brand-500 px-3 py-1.5 rounded-xl border border-white/10">
          {joinedCount} / {maxCapacity} Attending
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white line-clamp-1">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {description}
          </p>
        </div>

        <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
          <div className="flex items-center space-x-2">
            <FiCalendar className="text-brand-500 text-sm" />
            <span>{new Date(startDateTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiMapPin className="text-brand-500 text-sm" />
            <span className="line-clamp-1">{location.venueName || location.address}</span>
          </div>
        </div>

        <button 
          onClick={() => onJoin(event._id)} 
          className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-600/10 hover:bg-brand-600 text-brand-600 dark:text-brand-500 dark:hover:text-white hover:text-white font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:bg-brand-600 group-hover:text-white"
        >
          <span>Claim Reservation Slot</span>
          <FiArrowRight />
        </button>
      </div>
    </div>
  );
}