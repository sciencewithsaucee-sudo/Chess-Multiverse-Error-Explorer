// =====================================================================
// CMEED UNIT TESTS (JOSS COMPLIANCE)
// Isolating pure functions from app.js to verify mathematical integrity
// =====================================================================

// 1. PURE FUNCTIONS TO TEST
const calcExpect = (e) => 1 / (1 + Math.exp(-e / 2.2));

const calcEsl = (before, after, side) => {
    let pb = side === 'black' ? -Number(before) : Number(before);
    let pa = side === 'black' ? -Number(after) : Number(after);
    return Math.max(0, calcExpect(pb) - calcExpect(pa)) * 100;
};

const getBadge = function(type) {
    if (!type) return '';
    const t = type.toLowerCase();
    if (t === 'blunder') return 'badge-blunder';
    if (t === 'mistake') return 'badge-mistake';
    return 'badge-inaccuracy';
};

const formatClock = function(seconds) {
    if (seconds === null || seconds === undefined) return 'N/A';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

// =====================================================================
// 2. TEST SUITES
// =====================================================================

describe('CMEED Core Mathematical Models', function() {
    
    it('calcExpect should return exactly 0.5 (50%) for an equal 0.0 evaluation', function() {
        expect(calcExpect(0)).to.equal(0.5);
    });

    it('calcEsl should calculate the correct Expected Score Loss percentage for White', function() {
        // Engine drops from +2.0 (winning) to 0.0 (equal)
        let esl = calcEsl(2.0, 0.0, 'white');
        // A +2.0 to 0.0 drop should discard approx 21.4% of win probability
        expect(esl).to.be.closeTo(21.4, 0.2); 
    });

    it('calcEsl should correctly invert evaluation logic for Black', function() {
        // Engine drops from -2.0 (Black winning) to 0.0 (equal)
        let esl = calcEsl(-2.0, 0.0, 'black');
        expect(esl).to.be.closeTo(21.4, 0.2);
    });

    it('calcEsl should floor at 0 and never return negative loss (no mathematical gain)', function() {
        // Player plays a move that improves the eval from 0.0 to +2.0
        let esl = calcEsl(0.0, 2.0, 'white');
        expect(esl).to.equal(0);
    });
});

describe('CMEED UI & Data Formatters', function() {
    
    it('formatClock should correctly parse raw seconds into mm:ss strings', function() {
        expect(formatClock(9)).to.equal('9s');
        expect(formatClock(65)).to.equal('1m 5s');
        expect(formatClock(600)).to.equal('10m 0s');
    });

    it('formatClock should handle null or undefined database inputs gracefully', function() {
        expect(formatClock(null)).to.equal('N/A');
        expect(formatClock(undefined)).to.equal('N/A');
    });

    it('getBadge should return the strict CSS classification based on engine severity', function() {
        expect(getBadge('Blunder')).to.equal('badge-blunder');
        expect(getBadge('MISTAKE')).to.equal('badge-mistake'); // Should handle case-insensitivity
        expect(getBadge('Inaccuracy')).to.equal('badge-inaccuracy');
        expect(getBadge('')).to.equal('');
    });
});

// Execute the test runner
mocha.run();
