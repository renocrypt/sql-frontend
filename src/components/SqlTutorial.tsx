import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookIcon } from 'lucide-react';
import { Code } from '@/components/ui/code';

export function SqlTutorial() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookIcon className="mr-2 h-5 w-5" />
          SQL Tutorial
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basics">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="queries">Queries</TabsTrigger>
            <TabsTrigger value="joins">Joins</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <ScrollArea className="h-[400px] mt-4">
            <TabsContent value="basics" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">What is SQL?</h3>
                <p className="text-muted-foreground">
                  SQL (Structured Query Language) is a standard language for storing, manipulating, and retrieving data in databases.
                  It's used to communicate with relational database management systems like MySQL, PostgreSQL, SQLite, and more.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Basic SQL Commands</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>SELECT</strong> - extracts data from a database</li>
                  <li><strong>INSERT INTO</strong> - inserts new data into a database</li>
                  <li><strong>UPDATE</strong> - updates data in a database</li>
                  <li><strong>DELETE</strong> - deletes data from a database</li>
                  <li><strong>CREATE TABLE</strong> - creates a new table</li>
                  <li><strong>ALTER TABLE</strong> - modifies a table</li>
                  <li><strong>DROP TABLE</strong> - deletes a table</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">SELECT Statement</h3>
                <p className="text-muted-foreground mb-2">
                  The SELECT statement is used to select data from a database. The data returned is stored in a result table, called the result-set.
                </p>
                <Code code="SELECT column1, column2, ... FROM table_name;" />
                <p className="text-muted-foreground mt-2">
                  To select all columns, use the * symbol:
                </p>
                <Code code="SELECT * FROM table_name;" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">WHERE Clause</h3>
                <p className="text-muted-foreground mb-2">
                  The WHERE clause is used to filter records.
                </p>
                <Code code="SELECT column1, column2, ... FROM table_name WHERE condition;" />
                <p className="text-muted-foreground mt-2">
                  Example: Find all users older than 30
                </p>
                <Code code="SELECT * FROM users WHERE age > 30;" />
              </div>
            </TabsContent>
            
            <TabsContent value="queries" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">ORDER BY</h3>
                <p className="text-muted-foreground mb-2">
                  The ORDER BY keyword is used to sort the result-set in ascending or descending order.
                </p>
                <Code code="SELECT column1, column2, ... FROM table_name ORDER BY column1 [ASC|DESC];" />
                <p className="text-muted-foreground mt-2">
                  Example: Sort users by age in descending order
                </p>
                <Code code="SELECT * FROM users ORDER BY age DESC;" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">GROUP BY</h3>
                <p className="text-muted-foreground mb-2">
                  The GROUP BY statement groups rows that have the same values into summary rows.
                </p>
                <Code code="SELECT column_name(s), aggregate_function(column_name) FROM table_name GROUP BY column_name(s);" />
                <p className="text-muted-foreground mt-2">
                  Example: Count posts by each user
                </p>
                <Code code="SELECT user_id, COUNT(*) AS post_count FROM posts GROUP BY user_id;" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">HAVING Clause</h3>
                <p className="text-muted-foreground mb-2">
                  The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions.
                </p>
                <Code code="SELECT column_name(s), aggregate_function(column_name) FROM table_name GROUP BY column_name(s) HAVING condition;" />
                <p className="text-muted-foreground mt-2">
                  Example: Find users who have more than 1 post
                </p>
                <Code code="SELECT user_id, COUNT(*) AS post_count FROM posts GROUP BY user_id HAVING COUNT(*) > 1;" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">LIMIT Clause</h3>
                <p className="text-muted-foreground mb-2">
                  The LIMIT clause is used to specify the number of records to return.
                </p>
                <Code code="SELECT column_name(s) FROM table_name LIMIT number;" />
                <p className="text-muted-foreground mt-2">
                  Example: Get the 3 oldest users
                </p>
                <Code code="SELECT * FROM users ORDER BY age DESC LIMIT 3;" />
              </div>
            </TabsContent>
            
            <TabsContent value="joins" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">SQL JOINs</h3>
                <p className="text-muted-foreground mb-2">
                  A JOIN clause is used to combine rows from two or more tables, based on a related column between them.
                </p>
                <p className="text-muted-foreground">
                  There are different types of JOINs in SQL:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li><strong>INNER JOIN</strong>: Returns records that have matching values in both tables</li>
                  <li><strong>LEFT JOIN</strong>: Returns all records from the left table, and the matched records from the right table</li>
                  <li><strong>RIGHT JOIN</strong>: Returns all records from the right table, and the matched records from the left table</li>
                  <li><strong>FULL JOIN</strong>: Returns all records when there is a match in either left or right table</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">INNER JOIN</h3>
                <p className="text-muted-foreground mb-2">
                  The INNER JOIN keyword selects records that have matching values in both tables.
                </p>
                <Code code="SELECT columns FROM table1 INNER JOIN table2 ON table1.column_name = table2.column_name;" />
                <p className="text-muted-foreground mt-2">
                  Example: Get all posts with their author names
                </p>
                <Code code="SELECT posts.title, users.name FROM posts INNER JOIN users ON posts.user_id = users.id;" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">LEFT JOIN</h3>
                <p className="text-muted-foreground mb-2">
                  The LEFT JOIN keyword returns all records from the left table (table1), and the matched records from the right table (table2).
                </p>
                <Code code="SELECT columns FROM table1 LEFT JOIN table2 ON table1.column_name = table2.column_name;" />
                <p className="text-muted-foreground mt-2">
                  Example: Get all users and their posts (if any)
                </p>
                <Code code="SELECT users.name, posts.title FROM users LEFT JOIN posts ON users.id = posts.user_id;" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Multiple JOINs</h3>
                <p className="text-muted-foreground mb-2">
                  You can join multiple tables in a single query.
                </p>
                <Code code="SELECT users.name, posts.title, comments.content 
FROM users 
JOIN posts ON users.id = posts.user_id 
JOIN comments ON posts.id = comments.post_id;" />
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Subqueries</h3>
                <p className="text-muted-foreground mb-2">
                  A subquery is a query within another query. Subqueries can be used with SELECT, INSERT, UPDATE, and DELETE statements.
                </p>
                <Code code="SELECT column_name [, column_name ]
FROM table1 [, table2 ]
WHERE column_name OPERATOR
   (SELECT column_name [, column_name ]
   FROM table1 [, table2 ]
   [WHERE]);" />
                <p className="text-muted-foreground mt-2">
                  Example: Find users who have published posts
                </p>
                <Code code="SELECT name FROM users 
WHERE id IN (SELECT user_id FROM posts WHERE published = 1);" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Common Table Expressions (CTE)</h3>
                <p className="text-muted-foreground mb-2">
                  A CTE is a temporary result set that you can reference within a SELECT, INSERT, UPDATE, or DELETE statement.
                </p>
                <Code code="WITH cte_name (column_names) AS (
    CTE_query
)
SELECT * FROM cte_name;" />
                <p className="text-muted-foreground mt-2">
                  Example: Find users with their post count
                </p>
                <Code code="WITH user_posts AS (
    SELECT user_id, COUNT(*) AS post_count 
    FROM posts 
    GROUP BY user_id
)
SELECT users.name, user_posts.post_count 
FROM users 
JOIN user_posts ON users.id = user_posts.user_id;" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">CASE Statement</h3>
                <p className="text-muted-foreground mb-2">
                  The CASE statement goes through conditions and returns a value when the first condition is met.
                </p>
                <Code code="CASE
    WHEN condition1 THEN result1
    WHEN condition2 THEN result2
    ...
    ELSE resultN
END;" />
                <p className="text-muted-foreground mt-2">
                  Example: Categorize users by age
                </p>
                <Code code="SELECT name, 
CASE
    WHEN age < 30 THEN 'Young'
    WHEN age BETWEEN 30 AND 50 THEN 'Middle-aged'
    ELSE 'Senior'
END AS age_category
FROM users;" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Transactions</h3>
                <p className="text-muted-foreground mb-2">
                  A transaction is a unit of work that is performed against a database. Transactions ensure that database operations are completed reliably.
                </p>
                <Code code="BEGIN TRANSACTION;
-- SQL statements
COMMIT;
-- or ROLLBACK; to undo changes" />
                <p className="text-muted-foreground mt-2">
                  Note: In this SQLite implementation, transactions are handled automatically for most operations.
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}