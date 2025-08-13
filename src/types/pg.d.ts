declare module 'pg' {
  export interface ClientConfig {
    host?: string;
    port?: number;
    user?: string;
    password?: string;
    database?: string;
    ssl?: boolean | object;
  }

  export class Client {
    constructor(config?: ClientConfig);
    connect(): Promise<void>;
    end(): Promise<void>;
    query<T = any>(text: string, params?: any[]): Promise<{ rows: T[]; rowCount: number }>;
  }
}



