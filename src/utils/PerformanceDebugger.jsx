import React, { useEffect, useState } from 'react';
import { DiagnosticWishlist, analyzeSuspects, getQuickFixes, NuclearWishlist } from '../../utils/performanceDiagnostic';
import { mockWishItems } from '../../data/mockData';
import UltraFastWishlistMobile from './UltraFastWishlistMobile';

/**
 * Performance Debugging Component
 * Use this to identify what's ACTUALLY slow in your app
 */
const PerformanceDebugger = () => {
  const [diagnosticMode, setDiagnosticMode] = useState('original');
  const [quickFixes, setQuickFixes] = useState([]);

  useEffect(() => {
    // Run diagnostics after component mounts
    setTimeout(() => {
      analyzeSuspects();
      setQuickFixes(getQuickFixes());
    }, 2000);
  }, []);

  const renderContent = () => {
    switch (diagnosticMode) {
      case 'nuclear':
        return <NuclearWishlist items={mockWishItems} />;
      case 'ultra-fast':
        return <UltraFastWishlistMobile />;
      case 'original':
      default:
        return (
          <DiagnosticWishlist>
            <UltraFastWishlistMobile />
          </DiagnosticWishlist>
        );
    }
  };

  return (
    <div>
      {/* Debug Controls */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#000',
        color: '#fff',
        padding: '10px',
        zIndex: 10000,
        fontSize: '12px'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <strong>🔍 Performance Debug Mode:</strong>
          <select
            value={diagnosticMode}
            onChange={(e) => setDiagnosticMode(e.target.value)}
            style={{ marginLeft: '10px', padding: '4px' }}
          >
            <option value="original">Original (with diagnostics)</option>
            <option value="ultra-fast">Ultra Fast Version</option>
            <option value="nuclear">Nuclear Option (minimal)</option>
          </select>
        </div>

        {quickFixes.length > 0 && (
          <div>
            <strong>⚡ Quick Fixes:</strong>
            {quickFixes.map((fix, index) => (
              <span key={index} style={{ marginLeft: '10px', color: '#ff6b6b' }}>{fix}</span>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ paddingTop: '80px' }}>
        {renderContent()}
      </div>
    </div>
  );
};

export default PerformanceDebugger;