declare module 'mssql' {
  export interface IConfig {
    user: string;
    password: string;
    server: string;
    database: string;
    options?: { encrypt?: boolean; trustServerCertificate?: boolean };
  }

  export class ConnectionPool {
    constructor(config: IConfig);
    connect(): Promise<ConnectionPool>;
    request(): Request;
    close(): Promise<void>;
  }

  export class Request {
    input(name: string, value: any): Request;
    query<T = any>(query: string): Promise<{ recordset: T[]; rowsAffected: number[] }>;
  }

  const sql: any;
  export default sql;
}



