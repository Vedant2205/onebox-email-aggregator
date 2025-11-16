import OpenAI from 'openai';
import { config } from '../config/env';
import { logger } from '../config/logger';

export type EmailLabel = 'Interested' | 'Meeting Booked' | 'Not Interested' | 'Spam' | 'Out of Office';

export class ClassificationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  async classifyEmail(subject: string, text: string, from: string): Promise<EmailLabel> {
    const prompt = this.buildClassificationPrompt(subject, text, from);

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'You are an email classification assistant. Classify emails into one of these categories: Interested, Meeting Booked, Not Interested, Spam, Out of Office. Respond with only the category name.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 20,
      });

      const label = response.choices[0]?.message?.content?.trim() as EmailLabel;
      
      // Validate label
      const validLabels: EmailLabel[] = ['Interested', 'Meeting Booked', 'Not Interested', 'Spam', 'Out of Office'];
      if (validLabels.includes(label)) {
        return label;
      }

      // Default fallback
      logger.warn(`Invalid label returned: ${label}, defaulting to Not Interested`);
      return 'Not Interested';
    } catch (error) {
      logger.error('Error classifying email:', error);
      return 'Not Interested';
    }
  }

  private buildClassificationPrompt(subject: string, text: string, from: string): string {
    return `Classify the following email into one of these categories: Interested, Meeting Booked, Not Interested, Spam, Out of Office.

Examples:

Subject: "Interested in your product demo"
From: "prospect@company.com"
Text: "Hi, I saw your product and I'm very interested. Can we schedule a call?"
Classification: Interested

Subject: "Meeting scheduled for next week"
From: "client@company.com"
Text: "Thanks! I've booked the meeting for Tuesday at 2pm. See you then!"
Classification: Meeting Booked

Subject: "Re: Your inquiry"
From: "noreply@company.com"
Text: "Thank you for your interest, but we're not looking for new solutions at this time."
Classification: Not Interested

Subject: "You've won $1,000,000!"
From: "winner@spam.com"
Text: "Click here to claim your prize now!"
Classification: Spam

Subject: "Out of office"
From: "person@company.com"
Text: "I'm currently out of office and will return on Monday."
Classification: Out of Office

Now classify this email:

Subject: "${subject}"
From: "${from}"
Text: "${text.substring(0, 1000)}"

Classification:`;
  }
}









