import React from 'react';
import { Trophy, Medal, Flame, Award, Shield } from 'lucide-react';

const LEADERBOARD_DATA = [
  { rank: 1, name: "Sophia Martinez", xp: 14850, streak: 42, track: "Cloud & Infrastructure", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
  { rank: 2, name: "Devon Chen", xp: 13900, streak: 38, track: "Software & AI Systems", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" },
  { rank: 3, name: "Amara Nwosu", xp: 12400, streak: 30, track: "Cyber Security", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" },
  { rank: 4, name: "Liam O'Connor", xp: 11200, streak: 25, track: "Data & Algorithms", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80" },
  { rank: 5, name: "Yuki Tanaka", xp: 10800, streak: 21, track: "Physical Ergonomics", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" }
];

export default function Leaderboard() {
  return (
    <div className="glass-panel" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Trophy color="var(--brand-gold)" size={28} />
            <span>Global Student Leaderboard</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Top performing engineers ranked by mastery XP points, lab completions, and daily streaks.
          </p>
        </div>

        <span className="badge-crimson">WEEKLY REFRESH</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {LEADERBOARD_DATA.map((user) => {
          let rankColor = "var(--text-secondary)";
          if (user.rank === 1) rankColor = "#FFD700";
          else if (user.rank === 2) rankColor = "#C0C0C0";
          else if (user.rank === 3) rankColor = "#CD7F32";

          return (
            <div 
              key={user.rank}
              className={`glass-panel ${user.rank === 1 ? 'glass-panel-highlight' : ''}`}
              style={{ padding: '16px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: rankColor, width: '32px', textAlign: 'center' }}>
                  #{user.rank}
                </div>

                <img src={user.avatar} alt={user.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />

                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.track}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--brand-gold)', fontWeight: 700 }}>
                  <Flame size={18} fill="#FFB703" color="#FFB703" />
                  <span>{user.streak} Days</span>
                </div>

                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-crimson)' }}>
                  {user.xp.toLocaleString()} XP
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
