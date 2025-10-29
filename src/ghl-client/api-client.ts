import axios, { AxiosInstance } from 'axios';
import { GHLConfig } from '../types/ghl.js';

export class GHLApiClient {
  private client: AxiosInstance;
  private locationId: string;

  constructor(config: GHLConfig) {
    this.locationId = config.locationId;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Version': '2021-07-28',
      },
    });
  }

  public async makeRequest(method: string, endpoint: string, data: any = {}, params: any = {}): Promise<any> {
    try {
      const response = await this.client.request({
        method,
        url: endpoint,
        data,
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`[GHLApiClient] Error making request to ${endpoint} for location ${this.locationId}:`, error);
      throw error;
    }
  }
}
