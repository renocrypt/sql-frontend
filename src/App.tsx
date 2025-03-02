import { useState, useEffect } from 'react';
import { QueryEditor } from '@/components/QueryEditor';
import { ResultsTable } from '@/components/ResultsTable';
import { SchemaViewer } from '@/components/SchemaViewer';
import { QueryLibrary } from '@/components/QueryLibrary';
import { SqlTutorial } from '@/components/SqlTutorial';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { QueryResult } from '@/lib/sqlService';
import { DatabaseIcon } from 'lucide-react';

function App() {
  const [results, setResults] = useState<QueryResult>({ columns: [], values: [] });
  const [savedQueries, setSavedQueries] = useState<string[]>([]);
  const [currentQuery, setCurrentQuery] = useState<string>('');

  // Load saved queries from localStorage
  useEffect(() => {
    const storedQueries = localStorage.getItem('savedQueries');
    if (storedQueries) {
      try {
        setSavedQueries(JSON.parse(storedQueries));
      } catch (error) {
        console.error('Error parsing saved queries:', error);
        localStorage.removeItem('savedQueries');
      }
    }
  }, []);

  // Save queries to localStorage when they change
  useEffect(() => {
    localStorage.setItem('savedQueries', JSON.stringify(savedQueries));
  }, [savedQueries]);

  const handleSaveQuery = (query: string) => {
    setSavedQueries([...savedQueries, query]);
  };

  const handleDeleteQuery = (index: number) => {
    const updatedQueries = [...savedQueries];
    updatedQueries.splice(index, 1);
    setSavedQueries(updatedQueries);
  };

  const handleSelectQuery = (query: string) => {
    setCurrentQuery(query);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <DatabaseIcon className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">SQL Playground</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <QueryEditor 
            onResultsChange={setResults} 
            onSaveQuery={handleSaveQuery}
            currentQuery={currentQuery}
          />
          <ResultsTable results={results} />
        </div>

        <Tabs defaultValue="schema" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schema">Database Schema</TabsTrigger>
            <TabsTrigger value="library">Query Library</TabsTrigger>
            <TabsTrigger value="tutorial">SQL Tutorial</TabsTrigger>
          </TabsList>
          <TabsContent value="schema">
            <SchemaViewer />
          </TabsContent>
          <TabsContent value="library">
            <QueryLibrary 
              savedQueries={savedQueries} 
              onDeleteQuery={handleDeleteQuery} 
              onSelectQuery={handleSelectQuery} 
            />
          </TabsContent>
          <TabsContent value="tutorial">
            <SqlTutorial />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>SQL Playground - A front-end only SQL learning environment</p>
          <p className="text-sm mt-1">Built with React, TypeScript, and sql.js</p>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;