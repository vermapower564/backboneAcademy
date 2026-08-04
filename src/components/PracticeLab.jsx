import React, { useState } from 'react';
import { LAB_QUIZZES } from '../data/labQuizzes';
import { Terminal, CheckCircle2, XCircle, RotateCcw, Award, Sparkles, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PracticeLab({ onAddXP }) {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuiz = LAB_QUIZZES[currentQuizIdx];

  const handleSelectOption = (optId) => {
    if (!isSubmitted) {
      setSelectedOption(optId);
    }
  };

  const handleSubmit = () => {
    if (!selectedOption || isSubmitted) return;
    setIsSubmitted(true);

    if (selectedOption === currentQuiz.correctAnswer) {
      setScore(prev => prev + currentQuiz.xpReward);
      onAddXP(currentQuiz.xpReward);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentQuizIdx < LAB_QUIZZES.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      // Loop back to start
      setCurrentQuizIdx(0);
    }
  };

  return (
    <div className="glass-panel lab-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Terminal color="var(--brand-crimson)" size={28} />
            <span>Interactive Code & Architecture Lab</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Solve real-world technical scenarios, verify algorithm logic, and test architectural depth.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '8px 16px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--brand-gold)" />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Lab Score: {score} XP</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {LAB_QUIZZES.map((quiz, idx) => (
          <button
            key={quiz.id}
            onClick={() => {
              setCurrentQuizIdx(idx);
              setSelectedOption(null);
              setIsSubmitted(false);
            }}
            className={`track-tab-btn ${currentQuizIdx === idx ? 'active' : ''}`}
          >
            Scenario #{idx + 1}: {quiz.track.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Quiz Scenario Box */}
      <div className="glass-panel-highlight" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <span className="badge-crimson">{currentQuiz.track} • {currentQuiz.difficulty}</span>
          <span style={{ color: 'var(--brand-gold)', fontWeight: 700, fontSize: '0.9rem' }}>
            Reward: +{currentQuiz.xpReward} XP
          </span>
        </div>

        <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '14px', lineHeight: 1.4 }}>
          {currentQuiz.question}
        </h3>

        {/* Code Snippet Box */}
        {currentQuiz.codeSnippet && (
          <div className="code-window">
            <code>{currentQuiz.codeSnippet}</code>
          </div>
        )}

        {/* Options */}
        <div style={{ marginTop: '20px' }}>
          {currentQuiz.options.map((opt) => {
            let optionClass = "quiz-option";
            if (selectedOption === opt.id) optionClass += " selected";
            if (isSubmitted) {
              if (opt.id === currentQuiz.correctAnswer) optionClass += " correct";
              else if (selectedOption === opt.id) optionClass += " incorrect";
            }

            return (
              <div 
                key={opt.id}
                className={optionClass}
                onClick={() => handleSelectOption(opt.id)}
              >
                <div style={{ 
                  width: '28px', 
                  height: '28px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-glass)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {opt.id}
                </div>
                <div style={{ flex: 1 }}>{opt.text}</div>
                {isSubmitted && opt.id === currentQuiz.correctAnswer && (
                  <CheckCircle2 size={20} color="#4ADE80" />
                )}
                {isSubmitted && selectedOption === opt.id && opt.id !== currentQuiz.correctAnswer && (
                  <XCircle size={20} color="#FCA5A5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Explanation Banner when submitted */}
        {isSubmitted && (
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            borderRadius: '10px', 
            background: selectedOption === currentQuiz.correctAnswer ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${selectedOption === currentQuiz.correctAnswer ? '#22C55E' : '#EF4444'}`
          }}>
            <h4 style={{ fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} />
              <span>Architectural Explanation</span>
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{currentQuiz.explanation}</p>
          </div>
        )}

        {/* Action Controls */}
        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {!isSubmitted ? (
            <button className="btn-crimson" onClick={handleSubmit} disabled={!selectedOption}>
              <span>Submit Answer</span>
            </button>
          ) : (
            <button className="btn-crimson" onClick={handleNext}>
              <span>Next Challenge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
