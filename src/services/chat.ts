import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import type { Message } from '../context/ChatSessionContext';

// Define what the OpenAI response looks like
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const getAIResponse = async (currentMessages: Message[]): Promise<string> => {
  const formattedMessages = currentMessages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.text,
  }));

  try {
    const response = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-turbo',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim(); 
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get AI response');
  }
};
