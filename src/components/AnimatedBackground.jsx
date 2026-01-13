export default function AnimatedBackground() {
  return (
    <>
      <style>{`
        @keyframes scroll-formulas {
          from { 
            transform: translateX(0); 
          }
          to { 
            transform: translateX(-3000px); 
          }
        }
        
        .formula-container {
          animation: scroll-formulas 120s linear infinite !important;
          width: 6000px;
          height: 100%;
          position: absolute;
          background-image: 
            linear-gradient(var(--bg-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--bg-grid) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .formula-overlay {
          position: absolute;
          font-family: 'Courier New', monospace;
          color: var(--fg-formula);
          font-size: 15px;
          font-weight: 500;
          white-space: nowrap;
          pointer-events: none;
        }
      `}</style>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 5 }}>
        {/* Animated container with grid and formulas */}
        <div className="formula-container">
          {/* Individual formulas scattered across the background */}
          <div className="formula-overlay" style={{ top: '8%', left: '5%', transform: 'rotate(-2deg)' }}>
            E = mc²
          </div>
          <div className="formula-overlay" style={{ top: '12%', left: '25%', transform: 'rotate(1deg)' }}>
            F = ma
          </div>
          <div className="formula-overlay" style={{ top: '18%', left: '50%', transform: 'rotate(-1deg)' }}>
            a² + b² = c²
          </div>
          <div className="formula-overlay" style={{ top: '22%', left: '70%', transform: 'rotate(2deg)' }}>
            ∫ f(x)dx
          </div>
          <div className="formula-overlay" style={{ top: '28%', left: '15%', transform: 'rotate(-1deg)' }}>
            dy/dx = f'(x)
          </div>
          <div className="formula-overlay" style={{ top: '32%', left: '40%', transform: 'rotate(1deg)' }}>
            sin²θ + cos²θ = 1
          </div>
          <div className="formula-overlay" style={{ top: '38%', left: '65%', transform: 'rotate(-2deg)' }}>
            PV = nRT
          </div>
          <div className="formula-overlay" style={{ top: '42%', left: '10%', transform: 'rotate(1deg)' }}>
            Q = mcΔT
          </div>
          <div className="formula-overlay" style={{ top: '48%', left: '35%', transform: 'rotate(-1deg)' }}>
            v = u + at
          </div>
          <div className="formula-overlay" style={{ top: '52%', left: '60%', transform: 'rotate(2deg)' }}>
            H₂O + CO₂ → H₂CO₃
          </div>
          <div className="formula-overlay" style={{ top: '58%', left: '20%', transform: 'rotate(-2deg)' }}>
            2H₂ + O₂ → 2H₂O
          </div>
          <div className="formula-overlay" style={{ top: '62%', left: '45%', transform: 'rotate(1deg)' }}>
            (a+b)² = a² + 2ab + b²
          </div>
          <div className="formula-overlay" style={{ top: '68%', left: '75%', transform: 'rotate(-1deg)' }}>
            x = (-b ± √(b²-4ac))/2a
          </div>
          <div className="formula-overlay" style={{ top: '72%', left: '8%', transform: 'rotate(2deg)' }}>
            s = ut + ½at²
          </div>
          <div className="formula-overlay" style={{ top: '78%', left: '30%', transform: 'rotate(-1deg)' }}>
            KE = ½mv²
          </div>
          <div className="formula-overlay" style={{ top: '82%', left: '55%', transform: 'rotate(1deg)' }}>
            PE = mgh
          </div>
          <div className="formula-overlay" style={{ top: '88%', left: '12%', transform: 'rotate(-2deg)' }}>
            ΔG = ΔH - TΔS
          </div>
          <div className="formula-overlay" style={{ top: '92%', left: '38%', transform: 'rotate(1deg)' }}>
            pH = -log[H⁺]
          </div>
          <div className="formula-overlay" style={{ top: '15%', left: '80%', transform: 'rotate(-1deg)' }}>
            V = IR
          </div>
          <div className="formula-overlay" style={{ top: '25%', left: '5%', transform: 'rotate(2deg)' }}>
            P = VI
          </div>
          <div className="formula-overlay" style={{ top: '35%', left: '85%', transform: 'rotate(-2deg)' }}>
            W = Fd cosθ
          </div>
          <div className="formula-overlay" style={{ top: '45%', left: '78%', transform: 'rotate(1deg)' }}>
            e^(iπ) + 1 = 0
          </div>
          <div className="formula-overlay" style={{ top: '55%', left: '3%', transform: 'rotate(-1deg)' }}>
            π ≈ 3.14159
          </div>
          <div className="formula-overlay" style={{ top: '65%', left: '28%', transform: 'rotate(2deg)' }}>
            tan(45°) = 1
          </div>
          <div className="formula-overlay" style={{ top: '75%', left: '68%', transform: 'rotate(-1deg)' }}>
            sin(30°) = 1/2
          </div>
          
          {/* Duplicate formulas for seamless loop */}
          <div className="formula-overlay" style={{ top: '8%', left: '3005%', transform: 'rotate(-2deg)' }}>
            E = mc²
          </div>
          <div className="formula-overlay" style={{ top: '12%', left: '3025%', transform: 'rotate(1deg)' }}>
            F = ma
          </div>
          <div className="formula-overlay" style={{ top: '18%', left: '3050%', transform: 'rotate(-1deg)' }}>
            a² + b² = c²
          </div>
          <div className="formula-overlay" style={{ top: '22%', left: '3070%', transform: 'rotate(2deg)' }}>
            ∫ f(x)dx
          </div>
        </div>
      </div>
    </>
  );
}
