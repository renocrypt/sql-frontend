import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayIcon, RotateCcwIcon, DatabaseIcon, SaveIcon, FileIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import sqlService, { QueryResult } from '@/lib/sqlService';

interface QueryEditorProps {
  onResultsChange: (results: QueryResult) => void;
  onSaveQuery: (query: string) => void;
  currentQuery?: string;
}

export function QueryEditor({ onResultsChange, onSaveQuery, currentQuery }: QueryEditorProps) {
  const [query, setQuery] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const { toast } = useToast();

  // Update query when currentQuery prop changes
  useEffect(() => {
    if (currentQuery) {
      setQuery(currentQuery);
    }
  }, [currentQuery]);

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Please enter a SQL query to execute.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      // Ensure database is initialized
      await sqlService.init();
      
      const results = await sqlService.executeQuery(query);
      onResultsChange(results);
      
      if (results.error) {
        toast({
          title: "Query Error",
          description: results.error,
          variant: "destructive",
        });
      } else if (results.columns.length === 0) {
        toast({
          title: "Query Executed",
          description: "The query was executed successfully with no results to display.",
        });
      } else {
        toast({
          title: "Query Executed",
          description: `Retrieved ${results.values.length} rows.`,
        });
      }
    } catch (error) {
      console.error('Execution error:', error);
      toast({
        title: "Execution Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const resetDatabase = async () => {
    try {
      setIsExecuting(true);
      await sqlService.resetDatabase();
      await sqlService.loadSampleData();
      toast({
        title: "Database Reset",
        description: "The database has been reset with sample data.",
      });
      // Clear any previous results
      onResultsChange({ columns: [], values: [] });
    } catch (error) {
      console.error('Reset error:', error);
      toast({
        title: "Reset Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveQuery = () => {
    if (!query.trim()) {
      toast({
        title: "Empty Query",
        description: "Cannot save an empty query.",
        variant: "destructive",
      });
      return;
    }
    
    onSaveQuery(query);
    toast({
      title: "Query Saved",
      description: "Your query has been saved to the library.",
    });
  };

  const exportDatabase = async () => {
    try {
      setIsExecuting(true);
      const sql = await sqlService.exportAsSQL();
      
      // Create a blob and download it
      const blob = new Blob([sql], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'database_export.sql';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Database Exported",
        description: "The database has been exported as SQL statements.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DatabaseIcon className="mr-2 h-5 w-5" />
          SQL Query Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="font-mono min-h-[200px] resize-y"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button 
            onClick={executeQuery} 
            disabled={isExecuting}
            variant="default"
          >
            <PlayIcon className="mr-2 h-4 w-4" />
            Execute
          </Button>
          <Button 
            onClick={resetDatabase} 
            disabled={isExecuting}
            variant="outline"
          >
            <RotateCcwIcon className="mr-2 h-4 w-4" />
            Reset DB
          </Button>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSaveQuery} 
            disabled={isExecuting}
            variant="secondary"
          >
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Query
          </Button>
          <Button 
            onClick={exportDatabase} 
            disabled={isExecuting}
            variant="outline"
          >
            <FileIcon className="mr-2 h-4 w-4" />
            Export DB
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}