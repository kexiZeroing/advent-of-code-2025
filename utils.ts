import fs from 'fs/promises';
import path from 'path';

export async function readTextFile(filePath: string): Promise<string> {
  if (!filePath) {
    console.error('No file path provided');
    return '';
  }

  try {
    const resolvedPath = path.resolve(filePath);
    return await fs.readFile(resolvedPath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    throw error;
  }
}