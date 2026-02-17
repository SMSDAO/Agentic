import OpenAI from 'openai';

export class DALLEClient {
  private openai: OpenAI;

  constructor(apiKey?: string) {
    this.openai = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    });
  }

  async generateImage(
    prompt: string,
    size: '1024x1024' | '1792x1024' | '1024x1792' = '1024x1024',
    quality: 'standard' | 'hd' = 'standard'
  ): Promise<string> {
    const response = await this.openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality,
    });

    return response.data?.[0]?.url || '';
  }

  async generateNFTArtwork(description: string): Promise<string> {
    const enhancedPrompt = `Create a unique digital art piece for an NFT with the following description: ${description}. 
    Style: vibrant, high quality, detailed, suitable for blockchain art collection.`;
    
    return this.generateImage(enhancedPrompt, '1024x1024', 'hd');
  }

  async generateVariations(imageUrl: string): Promise<string[]> {
    // Note: This requires the image to be in PNG format and less than 4MB
    const response = await this.openai.images.createVariation({
      image: imageUrl as unknown as File,
      n: 2,
      size: '1024x1024',
    });

    return response.data?.map(img => img.url || '') || [];
  }
}

export const dalleClient = new DALLEClient();
