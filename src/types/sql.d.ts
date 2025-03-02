declare module 'sql.js' {
  export interface SqlJsStatic {
    Database: typeof Database;
    Statement: typeof Statement;
    new(config?: SqlJsConfig): SqlJsStatic;
  }

  export interface SqlJsConfig {
    locateFile?: (file: string) => string;
  }

  export class Database {
    constructor(data?: Buffer | Uint8Array);
    run(sql: string, params?: any): void;
    exec(sql: string): ExecResult[];
    each(sql: string, params: any, callback: (row: any) => void, done: () => void): void;
    prepare(sql: string, params?: any): Statement;
    export(): Uint8Array;
    close(): void;
    getRowsModified(): number;
  }

  export class Statement {
    bind(params: any): boolean;
    step(): boolean;
    get(params?: any): any[];
    getColumnNames(): string[];
    getAsObject(params?: any): Record<string, any>;
    run(params?: any): void;
    reset(): void;
    free(): void;
  }

  export interface ExecResult {
    columns: string[];
    values: any[][];
  }

  export function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
}