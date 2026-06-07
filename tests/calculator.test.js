const { evaluateExpression } = require('../src/calculator');

describe('arithmetic', () => {
  it('adds two numbers', () => {
    expect(evaluateExpression('2+3')).toBe(5);
  });

  it('subtracts', () => {
    expect(evaluateExpression('10-3')).toBe(7);
  });

  it('multiplies', () => {
    expect(evaluateExpression('4*5')).toBe(20);
  });

  it('divides', () => {
    expect(evaluateExpression('15/3')).toBe(5);
  });

  it('handles operator precedence', () => {
    expect(evaluateExpression('2+3*4')).toBe(14);
  });

  it('handles parentheses', () => {
    expect(evaluateExpression('(2+3)*4')).toBe(20);
  });

  it('handles nested parentheses', () => {
    expect(evaluateExpression('((2+3)*2)+1')).toBe(11);
  });

  it('handles decimal numbers', () => {
    expect(evaluateExpression('3.5+2.5')).toBe(6);
  });

  it('handles power operator', () => {
    expect(evaluateExpression('2^3')).toBe(8);
  });

  it('handles power right associativity', () => {
    expect(evaluateExpression('2^3^2')).toBe(512);
  });

  it('handles modulo', () => {
    expect(evaluateExpression('10%3')).toBe(1);
  });

  it('handles chained operations', () => {
    expect(evaluateExpression('2+3+4')).toBe(9);
  });
});

describe('negative numbers', () => {
  it('handles unary minus at start', () => {
    expect(evaluateExpression('-5+3')).toBe(-2);
  });

  it('handles unary minus in parentheses', () => {
    expect(evaluateExpression('(-5)')).toBe(-5);
  });


});

describe('constants', () => {
  it('resolves pi', () => {
    expect(evaluateExpression('pi')).toBeCloseTo(Math.PI, 10);
  });

  it('resolves e', () => {
    expect(evaluateExpression('e')).toBeCloseTo(Math.E, 10);
  });
});

describe('trig functions', () => {
  it('calculates sin', () => {
    expect(evaluateExpression('sin(0)')).toBeCloseTo(0, 10);
  });

  it('calculates cos', () => {
    expect(evaluateExpression('cos(0)')).toBeCloseTo(1, 10);
  });

  it('calculates tan', () => {
    expect(evaluateExpression('tan(0)')).toBeCloseTo(0, 10);
  });

  it('calculates asin', () => {
    expect(evaluateExpression('asin(0)')).toBeCloseTo(0, 10);
  });

  it('calculates acos', () => {
    expect(evaluateExpression('acos(1)')).toBeCloseTo(0, 10);
  });

  it('calculates atan', () => {
    expect(evaluateExpression('atan(0)')).toBeCloseTo(0, 10);
  });

  it('calculates sinh', () => {
    expect(evaluateExpression('sinh(0)')).toBeCloseTo(0, 10);
  });

  it('calculates cosh', () => {
    expect(evaluateExpression('cosh(0)')).toBeCloseTo(1, 10);
  });

  it('calculates sin in degrees', () => {
    expect(evaluateExpression('sinDeg(90)')).toBeCloseTo(1, 10);
  });

  it('calculates cos in degrees', () => {
    expect(evaluateExpression('cosDeg(0)')).toBeCloseTo(1, 10);
  });

  it('calculates tan in degrees', () => {
    expect(evaluateExpression('tanDeg(45)')).toBeCloseTo(1, 10);
  });

  it('calculates asin in degrees', () => {
    expect(evaluateExpression('asinDeg(0)')).toBeCloseTo(0, 10);
  });

  it('calculates acos in degrees', () => {
    expect(evaluateExpression('acosDeg(1)')).toBeCloseTo(0, 10);
  });

  it('calculates atan in degrees', () => {
    expect(evaluateExpression('atanDeg(0)')).toBeCloseTo(0, 10);
  });
});

describe('math functions', () => {
  it('calculates sqrt', () => {
    expect(evaluateExpression('sqrt(9)')).toBe(3);
  });

  it('calculates abs', () => {
    expect(evaluateExpression('abs(-5)')).toBe(5);
  });

  it('calculates log', () => {
    expect(evaluateExpression('log(100)')).toBeCloseTo(2, 10);
  });

  it('calculates ln', () => {
    expect(evaluateExpression('ln(e)')).toBeCloseTo(1, 10);
  });

  it('calculates exp', () => {
    expect(evaluateExpression('exp(0)')).toBeCloseTo(1, 10);
  });

  it('calculates floor', () => {
    expect(evaluateExpression('floor(3.7)')).toBe(3);
  });

  it('calculates ceil', () => {
    expect(evaluateExpression('ceil(3.2)')).toBe(4);
  });

  it('calculates round', () => {
    expect(evaluateExpression('round(3.5)')).toBe(4);
  });

  it('calculates asinh', () => {
    expect(evaluateExpression('asinh(0)')).toBeCloseTo(0, 10);
  });
});

describe('error handling', () => {
  it('throws on empty expression', () => {
    expect(() => evaluateExpression('')).toThrow();
  });

  it('throws on whitespace only', () => {
    expect(() => evaluateExpression('   ')).toThrow();
  });

  it('throws on division by zero', () => {
    expect(() => evaluateExpression('1/0')).toThrow();
  });

  it('throws on invalid characters', () => {
    expect(() => evaluateExpression('2&3')).toThrow();
  });

  it('throws on mismatched parentheses', () => {
    expect(() => evaluateExpression('(2+3')).toThrow();
  });

  it('throws on extra closing paren', () => {
    expect(() => evaluateExpression('2+3)')).toThrow();
  });
});
