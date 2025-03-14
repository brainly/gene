import { prompt } from 'inquirer';

export async function promptBoolean(question: string): Promise<boolean> {
  const response = await prompt([
    {
      type: 'confirm',
      name: 'answer',
      message: question,
    },
  ]);

  return response.answer;
}
