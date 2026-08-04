export const LAB_QUIZZES = [
  {
    id: "quiz-navodaya",
    title: "Navodaya Entrance (JNVST): Mental Ability & Arithmetic",
    track: "Navodaya Entrance Prep",
    difficulty: "Medium",
    xpReward: 100,
    question: "In a Jawahar Navodaya Entrance Mock Test, if 25% of a number is equal to 75, what is 40% of that same number?",
    codeSnippet: `// Step 1: Let the number be X
// 0.25 * X = 75  => X = 75 / 0.25 = 300
// Step 2: Find 40% of 300
// 0.40 * 300 = ???`,
    options: [
      { id: "A", text: "120" },
      { id: "B", text: "100" },
      { id: "C", text: "150" },
      { id: "D", text: "180" }
    ],
    correctAnswer: "A",
    explanation: "If 25% of X = 75, then X = 300. 40% of 300 = 0.40 * 300 = 120."
  },
  {
    id: "quiz-excel",
    title: "Computer Class: MS Excel Lookup Formulas",
    track: "Computer Classes (DCA/ADCA)",
    difficulty: "Medium",
    xpReward: 120,
    question: "Which MS Excel formula correctly searches for a student's Roll Number in Column A and returns their Total Marks from Column C?",
    codeSnippet: `=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])`,
    options: [
      { id: "A", text: "=VLOOKUP(RollNo, A:C, 3, FALSE)" },
      { id: "B", text: "=VLOOKUP(RollNo, A:C, 1, TRUE)" },
      { id: "C", text: "=LOOKUP(A:C, 3)" },
      { id: "D", text: "=SUMIF(A:C, 3)" }
    ],
    correctAnswer: "A",
    explanation: "=VLOOKUP(lookup_value, A:C, 3, FALSE) looks up the Roll Number in the 1st column of range A:C and returns the value from the 3rd column (Column C) for an exact match."
  },
  {
    id: "quiz-science-10",
    title: "Class 10th Science: Physics & Electricity",
    track: "Class 5 to 10 Academics",
    difficulty: "Hard",
    xpReward: 150,
    question: "According to Ohm's Law, if the resistance of a circuit is doubled while keeping the potential difference (Voltage) constant, what happens to the electric current?",
    codeSnippet: `// Ohm's Law Formula:
// V = I * R  =>  I = V / R`,
    options: [
      { id: "A", text: "The current is halved (reduced to 1/2)" },
      { id: "B", text: "The current is doubled" },
      { id: "C", text: "The current remains unchanged" },
      { id: "D", text: "The current becomes zero" }
    ],
    correctAnswer: "A",
    explanation: "Since I = V / R, electric current (I) is inversely proportional to resistance (R). Doubling the resistance halves the current."
  }
];
