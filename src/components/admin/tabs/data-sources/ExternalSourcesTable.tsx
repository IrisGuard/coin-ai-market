
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface ExternalSourcesTableProps {
  externalSources: any[];
  searchTerm: string;
}

const ExternalSourcesTable: React.FC<ExternalSourcesTableProps> = ({
  externalSources,
  searchTerm
}) => {
  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredExternalSources = externalSources.filter(source =>
    source.source_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.base_url?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>External Price Sources</CardTitle>
        <CardDescription>Manage external price data sources and API integrations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source Name</TableHead>
              <TableHead>Base URL</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rate Limit</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Reliability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExternalSources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>
                  <div className="font-medium">{source.source_name}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-blue-600">{source.base_url}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{source.source_type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(source.is_active)}>
                    {source.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {source.rate_limit_per_hour}/hr
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{source.priority_score}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{((source.reliability_score || 0) * 100).toFixed(1)}%</span>
                    <Progress value={(source.reliability_score || 0) * 100} className="w-16" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExternalSourcesTable;
