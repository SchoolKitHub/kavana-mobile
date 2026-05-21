const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../flashcards.csv');
const outputPath = path.join(__dirname, 'src/data/flashcards.ts');

// Create directory if it doesn't exist
const dir = path.dirname(outputPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const fileContent = fs.readFileSync(csvPath, 'utf-8');
const lines = fileContent.split(/\r?\n/);
const flashcards = [];

let id = 1;
for (const line of lines) {
  if (!line.trim()) continue;
  
  const parts = parseCSVLine(line);
  if (parts.length >= 2) {
    const question = parts[0];
    const answer = parts.slice(1).join(', '); // Join back if there were trailing commas parsed
    
    // Clean up quotes from ends
    const cleanQuestion = question.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
    const cleanAnswer = answer.replace(/^"|"$/g, '').replace(/""/g, '"').trim();

    flashcards.push({
      id: id++,
      question: cleanQuestion,
      answer: cleanAnswer
    });
  }
}

const tsContent = `export interface Flashcard {
  id: number;
  question: string;
  answer: string;
}

export const flashcards: Flashcard[] = ${JSON.stringify(flashcards, null, 2)};
`;

fs.writeFileSync(outputPath, tsContent, 'utf-8');
console.log(`Successfully parsed ${flashcards.length} flashcards and wrote to src/data/flashcards.ts`);
