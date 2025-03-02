import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

// Define the result type for SQL queries
export interface QueryResult {
  columns: string[];
  values: any[][];
  error?: string;
}

class SqlService {
  private SQL: SqlJsStatic | null = null;
  private db: Database | null = null;
  private initialized = false;
  private initializing = false;
  private initPromise: Promise<void> | null = null;

  // Initialize SQL.js
  async init(): Promise<void> {
    if (this.initialized) return;
    
    // If already initializing, return the existing promise
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initializing = true;
    
    // Create a promise for initialization
    this.initPromise = new Promise<void>(async (resolve, reject) => {
      try {
        console.log('Initializing SQL.js...');
        
        // Initialize SQL.js
        this.SQL = await initSqlJs({
          // Specify the location of the wasm file
          locateFile: file => `https://sql.js.org/dist/${file}`
        });
        
        // Create a new database
        this.db = new this.SQL.Database();
        
        this.initialized = true;
        this.initializing = false;
        console.log('SQL.js initialized successfully');
        resolve();
      } catch (error) {
        this.initializing = false;
        console.error('Failed to initialize SQL.js:', error);
        reject(error);
      }
    });

    return this.initPromise;
  }

  // Execute a SQL query
  async executeQuery(sql: string): Promise<QueryResult> {
    try {
      if (!this.initialized) {
        await this.init();
      }

      if (!this.db) {
        throw new Error('Database not initialized');
      }

      try {
        const result = this.db.exec(sql);
        
        if (result.length === 0) {
          // For queries that don't return data (like INSERT, UPDATE, DELETE)
          return {
            columns: [],
            values: [],
          };
        }
        
        return {
          columns: result[0].columns,
          values: result[0].values,
        };
      } catch (sqlError) {
        console.error('SQL execution error:', sqlError);
        return {
          columns: [],
          values: [],
          error: sqlError instanceof Error ? sqlError.message : String(sqlError),
        };
      }
    } catch (error) {
      console.error('Error executing query:', error);
      return {
        columns: [],
        values: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // Load sample data
  async loadSampleData(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }

    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      // Check if tables already exist
      const tablesResult = await this.executeQuery(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name NOT LIKE 'sqlite_%'
      `);
      
      if (tablesResult.values.length > 0) {
        console.log('Sample data already loaded');
        return; // Tables already exist, no need to recreate
      }

      console.log('Loading sample data...');

      // Create users table
      await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          age INTEGER,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create posts table
      await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS posts (
          id INTEGER PRIMARY KEY,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          content TEXT,
          published BOOLEAN DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Create comments table
      await this.executeQuery(`
        CREATE TABLE IF NOT EXISTS comments (
          id INTEGER PRIMARY KEY,
          post_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          content TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (post_id) REFERENCES posts (id),
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      // Insert sample users
      await this.executeQuery(`
        INSERT INTO users (name, email, age) VALUES
          ('John Doe', 'john@example.com', 28),
          ('Jane Smith', 'jane@example.com', 32),
          ('Bob Johnson', 'bob@example.com', 45),
          ('Alice Williams', 'alice@example.com', 24),
          ('Charlie Brown', 'charlie@example.com', 37)
      `);

      // Insert sample posts
      await this.executeQuery(`
        INSERT INTO posts (user_id, title, content, published) VALUES
          (1, 'Getting Started with SQL', 'SQL is a powerful language for working with databases...', 1),
          (1, 'Advanced SQL Techniques', 'In this post, we will explore some advanced SQL concepts...', 1),
          (2, 'Web Development Tips', 'Here are some tips for becoming a better web developer...', 1),
          (3, 'My Travel Adventures', 'I recently visited some amazing places...', 0),
          (4, 'Cooking Recipes', 'My favorite recipes for quick and healthy meals...', 1),
          (5, 'Book Recommendations', 'These are the books I read last month...', 1),
          (2, 'Career Advice', 'Tips for advancing your career in tech...', 0)
      `);

      // Insert sample comments
      await this.executeQuery(`
        INSERT INTO comments (post_id, user_id, content) VALUES
          (1, 2, 'Great introduction to SQL!'),
          (1, 3, 'This helped me understand the basics.'),
          (1, 4, 'Looking forward to more SQL tutorials.'),
          (2, 5, 'These advanced techniques are exactly what I needed.'),
          (2, 3, 'Could you explain joins in more detail?'),
          (3, 1, 'Thanks for sharing these tips!'),
          (5, 2, 'I tried the pasta recipe and it was delicious!'),
          (6, 3, 'I just ordered the third book on your list.'),
          (6, 4, 'Have you read anything by that author''s latest work?')
      `);
      
      console.log('Sample data loaded successfully');
    } catch (error) {
      console.error('Error loading sample data:', error);
      throw error;
    }
  }

  // Reset the database
  async resetDatabase(): Promise<void> {
    try {
      if (this.db) {
        this.db.close();
      }
      
      if (this.SQL) {
        this.db = new this.SQL.Database();
        this.initialized = true;
      } else {
        this.initialized = false;
        this.initPromise = null;
        await this.init();
      }
      console.log('Database reset successfully');
    } catch (error) {
      console.error('Error resetting database:', error);
      throw error;
    }
  }

  // Get the schema of the database
  async getSchema(): Promise<QueryResult> {
    return this.executeQuery(`
      SELECT 
        name AS 'Table Name',
        sql AS 'Create Statement'
      FROM 
        sqlite_master
      WHERE 
        type='table' AND 
        name NOT LIKE 'sqlite_%'
    `);
  }

  // Get the list of tables
  async getTables(): Promise<string[]> {
    const result = await this.executeQuery(`
      SELECT name FROM sqlite_master
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `);
    
    return result.values.map(row => row[0] as string);
  }

  // Get the columns of a table
  async getTableColumns(tableName: string): Promise<QueryResult> {
    return this.executeQuery(`PRAGMA table_info(${tableName})`);
  }

  // Export database as SQL statements
  async exportAsSQL(): Promise<string> {
    try {
      const tables = await this.getTables();
      let sql = '';
      
      for (const table of tables) {
        // Get create statement
        const createResult = await this.executeQuery(`
          SELECT sql FROM sqlite_master WHERE type='table' AND name='${table}'
        `);
        
        if (createResult.values.length > 0) {
          sql += createResult.values[0][0] + ';\n\n';
        }
        
        // Get data
        const dataResult = await this.executeQuery(`SELECT * FROM ${table}`);
        
        for (const row of dataResult.values) {
          const values = row.map(value => {
            if (value === null) return 'NULL';
            if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
            return value;
          }).join(', ');
          
          sql += `INSERT INTO ${table} VALUES (${values});\n`;
        }
        
        sql += '\n';
      }
      
      return sql;
    } catch (error) {
      console.error('Error exporting database:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const sqlService = new SqlService();
export default sqlService;