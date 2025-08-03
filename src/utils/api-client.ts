/**
 * Minimal GHL API Client
 * Only implements methods needed for our 34 essential tools
 */

import axios, { AxiosInstance } from 'axios';
import { GHLConfig } from '../types/index.js';
import { Logger } from './logger.js';

export class GHLApiClient {
  private readonly client: AxiosInstance;
  private readonly config: GHLConfig;
  private readonly logger: Logger;

  constructor(config: GHLConfig) {
    this.config = config;
    this.logger = new Logger('[GHL API]');
    
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://services.leadconnectorhq.com',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });

    // Add request/response logging in debug mode
    if (process.env.DEBUG === 'true') {
      this.client.interceptors.request.use(request => {
        this.logger.debug(`API Request: ${request.method?.toUpperCase()} ${request.url}`);
        return request;
      });

      this.client.interceptors.response.use(
        response => {
          this.logger.debug(`API Response: ${response.status} ${response.config.url}`);
          return response;
        },
        error => {
          this.logger.error(`API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
          return Promise.reject(error);
        }
      );
    }
  }

  // Contact Management
  async searchContacts(params: any): Promise<any> {
    const response = await this.client.get('/contacts/', { params });
    return response.data;
  }

  async getContact(contactId: string): Promise<any> {
    const response = await this.client.get(`/contacts/${contactId}`);
    return response.data;
  }

  async createContact(data: any): Promise<any> {
    const response = await this.client.post('/contacts/', data);
    return response.data;
  }

  async updateContact(contactId: string, data: any): Promise<any> {
    const response = await this.client.put(`/contacts/${contactId}`, data);
    return response.data;
  }

  async addContactTags(contactId: string, tags: string[]): Promise<any> {
    const response = await this.client.post(`/contacts/${contactId}/tags`, { tags });
    return response.data;
  }

  async removeContactTags(contactId: string, tags: string[]): Promise<any> {
    const response = await this.client.delete(`/contacts/${contactId}/tags`, { data: { tags } });
    return response.data;
  }

  async bulkUpdateContactTags(data: any): Promise<any> {
    const response = await this.client.post('/contacts/bulk/tags', data);
    return response.data;
  }

  // Tag Management
  async getLocationTags(): Promise<any> {
    const response = await this.client.get(`/locations/${this.config.locationId}/tags`);
    return response.data;
  }

  async createLocationTag(name: string): Promise<any> {
    const response = await this.client.post(`/locations/${this.config.locationId}/tags`, { name });
    return response.data;
  }

  // Workflow Management
  async getWorkflows(): Promise<any> {
    try {
      // Try the workflows endpoint first
      const response = await this.client.get(`/workflows/`, {
        params: { locationId: this.config.locationId }
      });
      return response.data;
    } catch (error: any) {
      // If 401, it might be a scope issue or API version issue
      if (error.response?.status === 401) {
        this.logger.error('Workflow access denied. This may require additional API permissions or OAuth scopes.');
        throw new Error('Workflow access requires additional permissions. Please check your API key scopes in GoHighLevel.');
      }
      throw error;
    }
  }

  async addContactToWorkflow(contactId: string, workflowId: string): Promise<any> {
    const response = await this.client.post(`/contacts/${contactId}/workflow/${workflowId}`);
    return response.data;
  }

  async removeContactFromWorkflow(contactId: string, workflowId: string): Promise<any> {
    const response = await this.client.delete(`/contacts/${contactId}/workflow/${workflowId}`);
    return response.data;
  }

  // Campaign Management
  async getEmailCampaigns(params?: any): Promise<any> {
    try {
      const response = await this.client.get(`/locations/${this.config.locationId}/campaigns`, { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        // Return empty result if no campaigns found
        return { campaigns: [], total: 0 };
      }
      throw error;
    }
  }

  async addContactToCampaign(contactId: string, campaignId: string): Promise<any> {
    const response = await this.client.post(`/contacts/${contactId}/campaigns/${campaignId}`);
    return response.data;
  }

  async removeContactFromCampaign(contactId: string, campaignId: string): Promise<any> {
    const response = await this.client.delete(`/contacts/${contactId}/campaigns/${campaignId}`);
    return response.data;
  }

  // Custom Fields
  async getLocationCustomFields(): Promise<any> {
    const response = await this.client.get(`/locations/${this.config.locationId}/customFields`);
    return response.data;
  }

  async createLocationCustomField(data: any): Promise<any> {
    const response = await this.client.post(`/locations/${this.config.locationId}/customFields`, data);
    return response.data;
  }

  // Communication
  async searchConversations(params: any): Promise<any> {
    const response = await this.client.get('/conversations/search', { params });
    return response.data;
  }

  async sendSMS(contactId: string, message: string): Promise<any> {
    const response = await this.client.post('/conversations/messages', {
      type: 'SMS',
      contactId,
      message
    });
    return response.data;
  }

  async sendEmail(data: any): Promise<any> {
    const response = await this.client.post('/conversations/messages', {
      type: 'Email',
      ...data
    });
    return response.data;
  }

  // Location/Discovery
  async getLocation(): Promise<any> {
    const response = await this.client.get(`/locations/${this.config.locationId}`);
    return response.data;
  }

  // Pipeline Management
  async getPipelines(): Promise<any> {
    const response = await this.client.get('/opportunities/pipelines', {
      params: { locationId: this.config.locationId }
    });
    return response.data;
  }

  // Template Management
  async getLocationTemplates(params?: any): Promise<any> {
    const response = await this.client.get(`/locations/${this.config.locationId}/templates`, { params });
    return response.data;
  }

  async getEmailTemplates(params?: any): Promise<any> {
    const response = await this.client.get(`/locations/${this.config.locationId}/templates`, {
      params: { ...params, type: 'email' }
    });
    return response.data;
  }

  // Contact Tasks & Notes
  async getContactTasks(contactId: string): Promise<any> {
    const response = await this.client.get(`/contacts/${contactId}/tasks`);
    return response.data;
  }

  async getContactNotes(contactId: string): Promise<any> {
    const response = await this.client.get(`/contacts/${contactId}/notes`);
    return response.data;
  }

  async createContactNote(contactId: string, body: string): Promise<any> {
    const response = await this.client.post(`/contacts/${contactId}/notes`, { body });
    return response.data;
  }

  // Duplicate Detection
  async getDuplicateContact(params: any): Promise<any> {
    const response = await this.client.get('/contacts/lookup', { params });
    return response.data;
  }
}