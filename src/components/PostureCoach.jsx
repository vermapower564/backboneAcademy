import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, RotateCcw, HeartPulse, Check, ShieldAlert } from 'lucide-react';

const STRETCHES = [
  {
    title: "Cervical Spine Retraction (Chin Tuck)",
    duration: "30 Seconds",
    desc: "Pull head straight back like a turtle receding into its shell. Realigns cervical vertebrae C1-C7.",
    target: "Neck & Upper Back"
  },
  {
    title: "Scapular Squeeze & Chest Opener",
    duration: "45 Seconds",
    desc: "Squeeze shoulder blades together back and down. Counteracts forward slouching posture.",
    target: "Thoracic Spine & Pectorals"
  },
  {
    title: "Seated Spinal Decompression Twist",
    duration: "60 Seconds",
    desc: "Gently rotate torso to right, hold chair back, inhale deeply to lengthen intervertebral discs.",
    target: "Lumbar & Lower Back"
  },
  {
    title: "20-20-20 Ocular Reset Protocol",
    duration: "20 Seconds",
    desc: "Look at an object 20 feet away for 20 seconds to relax ciliary eye muscles.",
    target: "Ocular & Visual Strain"
  }
];

export default function PostureCoach() {
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes countdown
  const [isRunning, setIsRunning] = useState(false);
  const [completedStretches, setCompletedStretches] = useState([]);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(1200);
  };

  const toggleStretch = (index) => {
    if (completedStretches.includes(index)) {
      setCompletedStretches(completedStretches.filter(i => i !== index));
    } else {
      setCompletedStretches([...completedStretches, index]);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity color="var(--brand-crimson)" size={28} />
            <span>The Physical Backbone Coach</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Physical ergonomics for software engineers: Protect your spinal column, ocular vision, and posture longevity.
          </p>
        </div>

        <span className="badge-crimson" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <HeartPulse size={16} /> Spinal Alignment Score: 100%
        </span>
      </div>

      <div className="posture-widget" style={{ marginBottom: '32px' }}>
        {/* Timer Card */}
        <div className="glass-panel-highlight" style={{ padding: '24px', textAlign: 'center', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>
            20-20-20 Ergonomic Break Countdown
          </h3>

          <div className="timer-circle">
            <div className="timer-digits">{formatTime(timeLeft)}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Minutes : Seconds
            </span>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button className="btn-crimson" onClick={() => setIsRunning(!isRunning)}>
              {isRunning ? <Pause size={18} /> : <Play size={18} />}
              <span>{isRunning ? 'Pause Timer' : 'Start Focus Timer'}</span>
            </button>
            <button className="btn-outline" onClick={resetTimer}>
              <RotateCcw size={18} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Posture Guidance */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert color="var(--brand-crimson)" size={20} />
            <span>Optimal Ergonomic Geometry</span>
          </h3>
          
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--brand-crimson)', fontWeight: 800 }}>•</span>
              <span><strong>Monitor Alignment:</strong> Top third of display at eye level, 20-30 inches away.</span>
            </li>
            <li style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--brand-crimson)', fontWeight: 800 }}>•</span>
              <span><strong>Elbow Angle:</strong> 90-100 degrees flexed with wrists neutral on armrests.</span>
            </li>
            <li style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--brand-crimson)', fontWeight: 800 }}>•</span>
              <span><strong>Lumbar Support:</strong> Chair lumbar curve fit firmly against L1-L5 spinal vertebrae.</span>
            </li>
            <li style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: 'var(--brand-crimson)', fontWeight: 800 }}>•</span>
              <span><strong>Feet Placement:</strong> Flat on floor or footrest; hips slightly higher than knees.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Recommended Stretches Grid */}
      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '16px' }}>
        Daily 5-Minute Micro-Mobility Routines
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {STRETCHES.map((stretch, idx) => {
          const isDone = completedStretches.includes(idx);
          return (
            <div 
              key={idx}
              className={`glass-panel ${isDone ? 'glass-panel-highlight' : ''}`}
              style={{ padding: '16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => toggleStretch(idx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge-crimson" style={{ fontSize: '0.7rem' }}>{stretch.target}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--brand-gold)', fontWeight: 700 }}>{stretch.duration}</span>
              </div>
              
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>{stretch.title}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>{stretch.desc}</p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button className={isDone ? 'btn-crimson' : 'btn-outline'} style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                  <Check size={14} />
                  <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
