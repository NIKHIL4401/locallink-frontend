import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FiMessageSquare, FiSend, FiUsers, FiAward } from 'react-icons/fi';

export default function CommunityFeed() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: feedData, isLoading } = useQuery({
    key: ['communityFeed', id],
    fn: async () => {
      const res = await axios.get(`http://localhost:5000/api/v1/communities/${id}/posts`);
      return res.data.data;
    },
    enabled: !!id
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-panel p-5 rounded-2xl space-y-4">
          <textarea 
            placeholder="Announce or share architectural thoughts with your hub..." 
            className="w-full h-24 p-3 bg-slate-100/50 dark:bg-darkBg/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-brand-500 text-sm resize-none"
          />
          <div className="flex justify-end">
            <button className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-brand-600/10">
              <FiSend /> Broadcast Post
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(n => <div key={n} className="h-40 glass-card rounded-2xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {feedData?.map((post) => (
              <div key={post._id} className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <img src={post.author?.profile?.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold">{post.author?.firstName} {post.author?.lastName}</h4>
                    <span className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{post.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-md font-bold tracking-tight flex items-center gap-2"><FiUsers className="text-brand-500" /> Hub Governance</h3>
          <div className="text-xs text-slate-400 space-y-2">
            <p>1. Respect programmatic design boundaries.</p>
            <p>2. Keep topics structured around local infrastructure frameworks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
