'use strict';

var LAST_RESULT = 0;

var DEG_FUNCTIONS = {
  sinDeg:  function(x) { return Math.sin(x * Math.PI / 180); },
  cosDeg:  function(x) { return Math.cos(x * Math.PI / 180); },
  tanDeg:  function(x) { return Math.tan(x * Math.PI / 180); },
  asinDeg: function(x) { return Math.asin(x) * 180 / Math.PI; },
  acosDeg: function(x) { return Math.acos(x) * 180 / Math.PI; },
  atanDeg: function(x) { return Math.atan(x) * 180 / Math.PI; },
};

var MATH_FUNCTIONS = {
  sin:   Math.sin,
  cos:   Math.cos,
  tan:   Math.tan,
  asin:  Math.asin,
  acos:  Math.acos,
  atan:  Math.atan,
  sinh:  Math.sinh,
  cosh:  Math.cosh,
  tanh:  Math.tanh,
  asinh: Math.asinh,
  acosh: Math.acosh,
  atanh: Math.atanh,
  sqrt:  Math.sqrt,
  log:   Math.log10,
  ln:    Math.log,
  abs:   Math.abs,
  floor: Math.floor,
  ceil:  Math.ceil,
  round: Math.round,
  exp:   Math.exp,
};

var PRECEDENCE = { '+': 2, '-': 2, '*': 3, '/': 3, '%': 3, '^': 4 };
var RIGHT_ASSOC = { '^': true };

function tokenize(expr) {
  var tokens = [];
  var i = 0;
  var len = expr.length;

  while (i < len) {
    var ch = expr[i];

    if (/\s/.test(ch)) { i++; continue; }

    if ((ch >= '0' && ch <= '9') || ch === '.') {
      var num = '';
      while (i < len && ((expr[i] >= '0' && expr[i] <= '9') || expr[i] === '.')) {
        num += expr[i++];
      }
      tokens.push({ type: 'NUMBER', value: parseFloat(num) });
      continue;
    }

    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'PAREN', value: ch });
      i++;
      continue;
    }

    if ('+-*/^%'.indexOf(ch) !== -1) {
      tokens.push({ type: 'OPERATOR', value: ch });
      i++;
      continue;
    }

    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_') {
      var name = '';
      while (i < len && /[a-zA-Z0-9_]/.test(expr[i])) {
        name += expr[i++];
      }
      if (name === 'pi' || name === 'PI') {
        tokens.push({ type: 'NUMBER', value: Math.PI });
      } else if (name === 'e' || name === 'E') {
        tokens.push({ type: 'NUMBER', value: Math.E });
      } else if (name.toLowerCase() === 'ans') {
        tokens.push({ type: 'NUMBER', value: LAST_RESULT });
      } else {
        tokens.push({ type: 'FUNCTION', value: name });
      }
      continue;
    }

    tokens.push({ type: 'UNKNOWN', value: ch });
    i++;
  }

  return tokens;
}

function shuntingYard(tokens) {
  var output = [];
  var operators = [];

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (token.type === 'NUMBER') {
      output.push(token);
    } else if (token.type === 'FUNCTION') {
      operators.push(token);
    } else if (token.type === 'PAREN') {
      if (token.value === '(') {
        operators.push(token);
      } else {
        while (operators.length > 0 && operators[operators.length - 1].value !== '(') {
          output.push(operators.pop());
        }
        if (operators.length === 0) throw new Error('Mismatched parentheses');
        operators.pop();
        if (operators.length > 0 && operators[operators.length - 1].type === 'FUNCTION') {
          output.push(operators.pop());
        }
      }
    } else if (token.type === 'OPERATOR') {
      if (token.value === '-' && (i === 0 ||
          (tokens[i-1].type === 'OPERATOR') ||
          tokens[i-1].value === '(')) {
        token.unary = true;
      }

      while (operators.length > 0) {
        var top = operators[operators.length - 1];
        if (top.type === 'PAREN') break;
        if (top.type === 'FUNCTION') break;
        if ((PRECEDENCE[top.value] || 0) > (PRECEDENCE[token.value] || 0) ||
            ((PRECEDENCE[top.value] || 0) === (PRECEDENCE[token.value] || 0) &&
             !RIGHT_ASSOC[token.value])) {
          output.push(operators.pop());
        } else {
          break;
        }
      }
      operators.push(token);
    }
  }

  while (operators.length > 0) {
    var op = operators.pop();
    if (op.type === 'PAREN') throw new Error('Mismatched parentheses');
    output.push(op);
  }

  return output;
}

function evaluateRPN(tokens) {
  var stack = [];

  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (token.type === 'NUMBER') {
      stack.push(token.value);
    } else if (token.type === 'OPERATOR') {
      if (token.unary) {
        var val = stack.pop();
        stack.push(-val);
      } else {
        var b = stack.pop();
        var a = stack.pop();
        switch (token.value) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/':
            if (b === 0) throw new Error('Division by zero');
            stack.push(a / b);
            break;
          case '%':
            if (b === 0) throw new Error('Division by zero');
            stack.push(a % b);
            break;
          case '^': stack.push(Math.pow(a, b)); break;
          default: throw new Error('Unknown operator: ' + token.value);
        }
      }
    } else if (token.type === 'FUNCTION') {
      var arg = stack.pop();
      var fn = DEG_FUNCTIONS[token.value] || MATH_FUNCTIONS[token.value];
      if (!fn) throw new Error('Unknown function: ' + token.value);
      stack.push(fn(arg));
    }
  }

  if (stack.length !== 1) throw new Error('Invalid expression');

  return stack[0];
}

function evaluateExpression(expr) {
  if (typeof expr !== 'string' || expr.trim() === '') {
    throw new Error('Empty expression');
  }

  var tokens = tokenize(expr);
  if (tokens.length === 0) throw new Error('Empty expression');

  for (var j = 0; j < tokens.length; j++) {
    if (tokens[j].type === 'UNKNOWN') {
      throw new Error('Invalid character: ' + tokens[j].value);
    }
  }

  var rpn = shuntingYard(tokens);
  var result = evaluateRPN(rpn);

  if (!isFinite(result)) throw new Error('Result is not finite');

  return result;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { evaluateExpression: evaluateExpression };
}
