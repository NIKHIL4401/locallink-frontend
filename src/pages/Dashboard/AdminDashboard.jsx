import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import AnalyticsChart from '../../components/dashboard/AnalyticsChart';
import { FiTrendingUp, FiUsers, FiActivity, FiLayers } from 'react-icons/fi';

export default function AdminDashboard() {
  const { data: metricsData, isLoading } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:5000/api/v1/admin/analytics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
      return res.data;
    }
  });

  if (isLoading) return <div className="p-10 text-center animate-pulse text-sm">Collating operational analytical matrices...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Control Panel Dashboard</h1>
        <p className="text-sm text-slate-400">High-level data overview and platform operational analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Registered Accounts</span>
            <h3 className="text-3xl font-extrabold mt-1">{metricsData?.metrics?.totalUsers}</h3>
          </div>
          <div className="p-4 bg-brand-500/10 rounded-xl text-brand-500 text-2xl"><FiUsers /></div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Event Instances</span>
            <h3 className="text-3xl font-extrabold mt-1">{metricsData?.metrics?.totalEvents}</h3>
          </div>
          <div className="p-4 bg-emerald-500/10 rounded-xl text-emerald-500 text-2xl"><FiActivity /></div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Hub Networks</span>
            <h3 className="text-3xl font-extrabold mt-1">{metricsData?.metrics?.totalCommunities}</h3>
          </div>
          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-500 text-2xl"><FiLayers /></div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        <h3 className="text-md font-bold flex items-center gap-2"><FiTrendingUp className="text-brand-500" /> Platform Growth Velocity Vectors</h3>
        <AnalyticsChart chartData={metricsData?.charts} />
      </div>
    </div>
  );
}
