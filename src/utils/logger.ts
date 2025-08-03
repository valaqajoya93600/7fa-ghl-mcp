/**
 * Simple logger for GHL Agency MCP
 * Outputs to stderr to avoid interfering with MCP protocol
 */

export class Logger {
  private readonly prefix: string;
  private readonly debugEnabled: boolean;

  constructor(prefix: string = '[GHL Agency MCP]') {
    this.prefix = prefix;
    this.debugEnabled = process.env.DEBUG === 'true';
  }

  info(message: string, meta?: any): void {
    this.log('INFO', message, meta);
  }

  error(message: string, error?: any): void {
    this.log('ERROR', message, error);
  }

  debug(message: string, meta?: any): void {
    if (this.debugEnabled) {
      this.log('DEBUG', message, meta);
    }
  }

  private log(level: string, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const output = `${timestamp} ${this.prefix} ${level}: ${message}`;
    
    if (meta) {
      console.error(output, JSON.stringify(meta, null, 2));
    } else {
      console.error(output);
    }
  }
}