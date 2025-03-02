import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DatabaseIcon, TableIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import sqlService from '@/lib/sqlService';

export function SchemaViewer() {
  const [tables, setTables] = useState<string[]>([]);
  const [tableDetails, setTableDetails] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSchema = async () => {
      try {
        setLoading(true);
        
        // Initialize the database with sample data if it's the first load
        await sqlService.init();
        await sqlService.loadSampleData();
        
        // Get the list of tables
        const tablesList = await sqlService.getTables();
        setTables(tablesList);
        
        // Get details for each table
        const details: Record<string, any> = {};
        for (const table of tablesList) {
          const columnsResult = await sqlService.getTableColumns(table);
          details[table] = columnsResult;
        }
        
        setTableDetails(details);
      } catch (error) {
        console.error('Schema loading error:', error);
        toast({
          title: "Schema Loading Error",
          description: error instanceof Error ? error.message : "An unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSchema();
  }, [toast]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DatabaseIcon className="mr-2 h-5 w-5" />
            Database Schema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading schema...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <DatabaseIcon className="mr-2 h-5 w-5" />
          Database Schema
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tables.length === 0 ? (
          <div className="text-center py-4">No tables found in the database.</div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {tables.map((table) => (
              <AccordionItem key={table} value={table}>
                <AccordionTrigger className="font-medium">
                  <div className="flex items-center">
                    <TableIcon className="mr-2 h-4 w-4" />
                    {table}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Not Null</TableHead>
                        <TableHead>Default</TableHead>
                        <TableHead>Primary Key</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tableDetails[table]?.values.map((column: any[], index: number) => (
                        <TableRow key={index}>
                          <TableCell>{column[1]}</TableCell>
                          <TableCell>{column[2]}</TableCell>
                          <TableCell>{column[3] ? 'Yes' : 'No'}</TableCell>
                          <TableCell>
                            {column[4] === null ? 
                              <span className="text-muted-foreground italic">NULL</span> : 
                              String(column[4])}
                          </TableCell>
                          <TableCell>{column[5] ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}