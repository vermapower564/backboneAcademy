import React, { useState } from 'react';
import { SKILL_NODES } from '../data/skillTreeData';
import { GitMerge, Lock, Unlock, Award, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SkillTree({ onLaunchLab }) {
  const [selectedNode, setSelectedNode] = useState(SKILL_NODES[0]);

  return (
    <div className="glass-panel skill-tree-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GitMerge color="var(--brand-crimson)" size={28} />
            <span>Interactive Skill Tree</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Map your engineering trajectory from Foundational Principles to Master Architect credentials.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand-crimson)' }}></span> Unlocked
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#64748B' }}></span> Locked
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', marginTop: '20px' }}>
        {/* Nodes Grid */}
        <div className="skill-nodes-grid">
          {SKILL_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            const isUnlocked = node.status === 'unlocked' || node.status === 'in-progress';
            return (
              <div 
                key={node.id}
                className={`glass-panel skill-node-card ${isUnlocked ? 'unlocked' : 'locked'} ${isSelected ? 'glass-panel-highlight' : ''}`}
                onClick={() => setSelectedNode(node)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge-crimson" style={{ fontSize: '0.7rem' }}>Level {node.level} • {node.category}</span>
                  {isUnlocked ? (
                    <Unlock size={16} color="var(--brand-crimson)" />
                  ) : (
                    <Lock size={16} color="#64748B" />
                  )}
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{node.name}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{node.desc}</p>

                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--brand-gold)', fontWeight: 700 }}>+{node.xp} XP</span>
                  <span style={{ color: 'var(--brand-crimson)', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                    Inspect <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Node Detail Inspector */}
        {selectedNode && (
          <div className="glass-panel-highlight" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(230, 57, 70, 0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'var(--brand-crimson)', justifyContent: 'center' }}>
                  <Zap size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{selectedNode.name}</h3>
                  <span style={{ color: 'var(--brand-crimson)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {selectedNode.category} Track • Level {selectedNode.level}
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '0.95rem' }}>
                {selectedNode.desc}
              </p>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Prerequisite Skills
                </h4>
                {selectedNode.prereqs.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> None (Entry Level Foundational Skill)
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {selectedNode.prereqs.map(p => (
                      <span key={p} style={{ padding: '4px 10px', background: 'var(--bg-glass)', border: '1px solid var(--border-light)', borderRadius: '6px', fontSize: '0.8rem' }}>
                        Node #{p}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Mastery XP Reward:</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--brand-gold)' }}>+{selectedNode.xp} XP</span>
              </div>

              <button className="btn-crimson" style={{ width: '100%', justifyContent: 'center' }} onClick={onLaunchLab}>
                <Zap size={18} />
                <span>Launch Practice Challenge for this Skill</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
