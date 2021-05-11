const { performance } = require('perf_hooks');

class FiniteStateMachine {
  constructor(alphabet, availableStates, finiteStates, startState, transitions) {
    this.alphabet = alphabet;
    this.availableStates = availableStates;
    this.finiteStates = finiteStates;
    this.transitions = transitions;

    this.currentState = startState;
  }

  _checkAlphabet(symbol) {
    if (!this.alphabet.includes(symbol)) {
      throw new Error(`Symbol ${symbol} does not belong to defined alphabet`);
    }
  }

  _makeTransition(symbol) {
    const newState = this.transitions[this.currentState][symbol];

    if (newState && this.availableStates.includes(newState)) {
      this.currentState = newState;
    } else {
      throw new Error(`Symbol ${symbol} does not invoke transition`);
    }
  }

  test(symbols) {
    for (const symbol of symbols) {
      this._checkAlphabet(symbol);
      this._makeTransition(symbol);
    }

    return this.finiteStates.includes(this.currentState);
  }
}

const V1 = 'abcdefghijklmnopqrstuvwxyz'.split('');
const V2 = '!@#$%^&*()-=_+'.split('');
const V3 = '1234567890'.split('');

const V = [...V1, ...V2, ...V3];

const Q = ['q0', 'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];

const F = ['q7'];

const S = 'q0';

function mapTransitiontoSymbol(alphabet, transition) {
  return alphabet.reduce((acc, symbol) => {
    return {
      ...acc,
      [symbol]: transition
    };
  }, {});
}

function transitionsArray(vt1, vt2, vt3) {
  return {
    ...mapTransitiontoSymbol(V1, vt1),
    ...mapTransitiontoSymbol(V2, vt2),
    ...mapTransitiontoSymbol(V3, vt3),
  }
}

const transitions = {
  q0: transitionsArray('q1', 'q2', 'q3'),
  q1: transitionsArray('q1', 'q4', 'q5'),
  q2: transitionsArray('q4', 'q2', 'q6'),
  q3: transitionsArray('q5', 'q6', 'q3'),
  q4: transitionsArray('q4', 'q4', 'q7'),
  q5: transitionsArray('q5', 'q7', 'q5'),
  q6: transitionsArray('q7', 'q6', 'q6'),
  q7: transitionsArray('q7', 'q7', 'q7'),
};

const fsm = new FiniteStateMachine(V, Q, F, S, transitions);

try {
  const x1 = performance.now();
  console.log(fsm.test('1gsgfg#$#$@424234324g'));
  const y1 = performance.now();
  console.log(y1 - x1);
} catch (error) {
  console.log(error.message);
}
