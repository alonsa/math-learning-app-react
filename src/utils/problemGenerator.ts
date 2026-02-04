// Math Problem Generator for React Math Learning App

import type { MathProblem } from '../types/index';

export class ProblemGenerator {

  static generateAdditionProblem(grade: 1 | 3): MathProblem {
    let firstNumber: number;
    let secondNumber: number;

    if (grade === 1) {
      // Grade 1: Simple single-digit addition (0-9 + 0-9)
      firstNumber = Math.floor(Math.random() * 10);
      secondNumber = Math.floor(Math.random() * 10);
    } else {
      // Grade 3: Multi-digit addition (10-9999 + 10-9999)
      firstNumber = Math.floor(Math.random() * 9000) + 10; // 10-9999
      secondNumber = Math.floor(Math.random() * 9000) + 10; // 10-9999

      // Ensure result doesn't exceed 4 digits for input convenience
      while (firstNumber + secondNumber > 9999) {
        firstNumber = Math.floor(Math.random() * 5000) + 10;
        secondNumber = Math.floor(Math.random() * 4000) + 10;
      }
    }

    return {
      firstNumber,
      secondNumber,
      operation: 'addition',
      correctAnswer: firstNumber + secondNumber
    };
  }

  static generateSubtractionProblem(grade: 1 | 3): MathProblem {
    let firstNumber: number;
    let secondNumber: number;

    if (grade === 1) {
      // Grade 1: Simple single-digit subtraction (1-9 - 0-8, result >= 0)
      firstNumber = Math.floor(Math.random() * 9) + 1; // 1-9
      secondNumber = Math.floor(Math.random() * firstNumber); // 0 to firstNumber-1
    } else {
      // Grade 3: Multi-digit subtraction (10-9999 - 10-smaller, result >= 0)
      firstNumber = Math.floor(Math.random() * 9000) + 100; // 100-9999
      secondNumber = Math.floor(Math.random() * firstNumber) + 10; // 10 to firstNumber

      // Ensure we don't have negative results
      if (secondNumber > firstNumber) {
        [firstNumber, secondNumber] = [secondNumber, firstNumber];
      }
    }

    return {
      firstNumber,
      secondNumber,
      operation: 'subtraction',
      correctAnswer: firstNumber - secondNumber
    };
  }

  static generateMultiplicationProblem(grade: 1 | 3): MathProblem {
    let firstNumber: number;
    let secondNumber: number;

    if (grade === 1) {
      // Grade 1: Simple multiplication (1-5 × 1-5)
      firstNumber = Math.floor(Math.random() * 5) + 1;
      secondNumber = Math.floor(Math.random() * 5) + 1;
    } else {
      // Grade 3: One-digit multiplication (1-9 × 1-9)
      firstNumber = Math.floor(Math.random() * 9) + 1; // 1-9
      secondNumber = Math.floor(Math.random() * 9) + 1; // 1-9
    }

    return {
      firstNumber,
      secondNumber,
      operation: 'multiplication',
      correctAnswer: firstNumber * secondNumber
    };
  }

  static generateDivisionProblem(grade: 1 | 3): MathProblem {
    let divisor: number;
    let quotient: number;
    let dividend: number;

    if (grade === 1) {
      // Grade 1: Simple division (results 1-5)
      quotient = Math.floor(Math.random() * 5) + 1;
      divisor = Math.floor(Math.random() * 5) + 1;
    } else {
      // Grade 3: Division with one-digit integer results (1-9)
      quotient = Math.floor(Math.random() * 9) + 1; // 1-9 (one digit)
      divisor = Math.floor(Math.random() * 9) + 2; // 2-10 (to ensure reasonable dividends)
    }

    dividend = quotient * divisor; // Ensure exact division (integer result)

    return {
      firstNumber: dividend,
      secondNumber: divisor,
      operation: 'division',
      correctAnswer: quotient
    };
  }

  static generateRandomProblem(grade: 1 | 3): MathProblem {
    const operations = ['addition', 'subtraction', 'multiplication', 'division'];
    const randomOperation = operations[Math.floor(Math.random() * operations.length)];

    switch (randomOperation) {
      case 'addition':
        return this.generateAdditionProblem(grade);
      case 'subtraction':
        return this.generateSubtractionProblem(grade);
      case 'multiplication':
        return this.generateMultiplicationProblem(grade);
      case 'division':
        return this.generateDivisionProblem(grade);
      default:
        return this.generateAdditionProblem(grade);
    }
  }

  static formatProblem(problem: MathProblem): string {
    const symbols = {
      addition: '+',
      subtraction: '-',
      multiplication: '×',
      division: '÷'
    };

    return `${problem.firstNumber} ${symbols[problem.operation]} ${problem.secondNumber} = ?`;
  }

  static formatVerticalProblem(problem: MathProblem): { lines: string[], maxWidth: number } {
    const { firstNumber, secondNumber, operation } = problem;
    const symbols = {
      addition: '+',
      subtraction: '-',
      multiplication: '×',
      division: '÷'
    };

    const firstLine = firstNumber.toString();
    const secondNumberStr = secondNumber.toString();
    const operatorLine = `${symbols[operation]} ${secondNumberStr}`;

    // Calculate max width needed for proper alignment
    const maxWidth = Math.max(firstLine.length, operatorLine.length) + 1;

    // Right-align both numbers for proper place value alignment
    const alignedFirstLine = firstLine.padStart(maxWidth);
    const alignedSecondLine = operatorLine.padStart(maxWidth);
    const separator = '─'.repeat(maxWidth);

    return {
      lines: [alignedFirstLine, alignedSecondLine, separator],
      maxWidth
    };
  }
}