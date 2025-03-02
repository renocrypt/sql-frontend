import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Code } from '@/components/ui/code';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpenIcon, PlayIcon, TrashIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QueryLibraryProps {
  savedQueries: string[];
  onDeleteQuery: (index: number) => void;
  onSelectQuery: (query: string) => void;
}

// Sample queries for beginners to learn SQL
const sampleQueries = [
  {
    name: "Select All Users",
    query: "SELECT * FROM users;",
    description: "Retrieves all columns from the users table."
  },
  {
    name: "Filter by Condition",
    query: "SELECT name, email FROM users WHERE age > 30;",
    description: "Selects specific columns with a WHERE clause to filter results."
  },
  {
    name: "Order Results",
    query: "SELECT * FROM users ORDER BY name ASC;",
    description: "Orders the results alphabetically by name."
  },
  {
    name: "Limit Results",
    query: "SELECT * FROM posts LIMIT 3;",
    description: "Limits the number of results returned."
  },
  {
    name: "Count Records",
    query: "SELECT COUNT(*) AS total_users FROM users;",
    description: "Counts the number of records in the users table."
  },
  {
    name: "Join Tables",
    query: "SELECT posts.title, users.name AS author\nFROM posts\nJOIN users ON posts.user_id = users.id;",
    description: "Joins the posts and users tables to show post titles with author names."
  },
  {
    name: "Group By",
    query: "SELECT user_id, COUNT(*) AS post_count\nFROM posts\nGROUP BY user_id;",
    description: "Groups posts by user_id and counts posts per user."
  },
  {
    name: "Subquery",
    query: "SELECT name, email FROM users\nWHERE id IN (\n  SELECT user_id FROM posts WHERE published = 1\n);",
    description: "Uses a subquery to find users who have published posts."
  },
  {
    name: "Insert Data",
    query: "INSERT INTO users (name, email, age)\nVALUES ('Sarah Connor', 'sarah@example.com', 35);",
    description: "Inserts a new record into the users table."
  },
  {
    name: "Update Data",
    query: "UPDATE users\nSET age = 29\nWHERE name = 'John Doe';",
    description: "Updates the age of a specific user."
  },
  {
    name: "Delete Data",
    query: "DELETE FROM comments\nWHERE post_id = 1;",
    description: "Deletes all comments for a specific post."
  },
  {
    name: "Complex Join",
    query: "SELECT\n  users.name,\n  posts.title,\n  COUNT(comments.id) AS comment_count\nFROM users\nJOIN posts ON users.id = posts.user_id\nLEFT JOIN comments ON posts.id = comments.post_id\nGROUP BY posts.id\nORDER BY comment_count DESC;",
    description: "A complex query joining three tables with aggregation and ordering."
  }
];

export function QueryLibrary({ savedQueries, onDeleteQuery, onSelectQuery }: QueryLibraryProps) {
  const [activeTab, setActiveTab] = useState<string>("examples");
  const { toast } = useToast();

  const handleRunQuery = (query: string) => {
    onSelectQuery(query);
    toast({
      title: "Query Loaded",
      description: "The query has been loaded into the editor.",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpenIcon className="mr-2 h-5 w-5" />
          Query Library
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="examples" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="examples">Example Queries</TabsTrigger>
            <TabsTrigger value="saved">Saved Queries ({savedQueries.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="examples">
            <ScrollArea className="h-[300px] rounded-md">
              {sampleQueries.map((example, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{example.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRunQuery(example.query)}
                    >
                      <PlayIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{example.description}</p>
                  <Code code={example.query} className="text-xs" />
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="saved">
            <ScrollArea className="h-[300px] rounded-md">
              {savedQueries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No saved queries yet. Execute and save queries to see them here.
                </div>
              ) : (
                savedQueries.map((query, index) => (
                  <div key={index} className="mb-4 p-4 border rounded-md">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">Saved Query #{index + 1}</h3>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRunQuery(query)}
                        >
                          <PlayIcon className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onDeleteQuery(index)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Code code={query} className="text-xs" />
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}