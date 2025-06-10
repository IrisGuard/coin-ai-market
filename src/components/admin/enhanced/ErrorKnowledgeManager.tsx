
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Eye,
  Filter
} from 'lucide-react';

const ErrorKnowledgeManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - in real implementation, this would come from useErrorCoinsKnowledge hook
  const knowledgeEntries = [
    {
      id: '1',
      error_name: 'Double Die Obverse',
      error_type: 'Die Error',
      error_category: 'Striking Error',
      rarity_score: 8,
      severity_level: 7,
      description: 'Doubling visible on the obverse side of the coin due to die shift during striking process.',
      identification_techniques: ['Check for doubled lettering', 'Look for doubled design elements', 'Use magnification'],
      common_mistakes: ['Confusing with machine doubling', 'Missing subtle doubling'],
      created_at: '2024-01-15'
    },
    {
      id: '2',
      error_name: 'Off-Center Strike',
      error_type: 'Striking Error',
      error_category: 'Planchet Error',
      rarity_score: 6,
      severity_level: 5,
      description: 'Coin struck when planchet was not properly centered in the collar.',
      identification_techniques: ['Measure missing rim percentage', 'Check for blank area', 'Verify design displacement'],
      common_mistakes: ['Confusing with clipped planchet', 'Overestimating rarity'],
      created_at: '2024-01-12'
    },
    {
      id: '3',
      error_name: 'Clipped Planchet',
      error_type: 'Planchet Error',
      error_category: 'Planchet Error',
      rarity_score: 5,
      severity_level: 4,
      description: 'Missing portion of the planchet due to improper cutting from the metal strip.',
      identification_techniques: ['Identify clip type', 'Measure clip size', 'Check for overlapping cuts'],
      common_mistakes: ['Confusing with post-mint damage', 'Misidentifying clip type'],
      created_at: '2024-01-10'
    }
  ];

  const categories = ['all', 'Die Error', 'Striking Error', 'Planchet Error', 'Design Error'];

  const filteredEntries = knowledgeEntries.filter(entry => {
    const matchesSearch = entry.error_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || entry.error_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getRarityColor = (score: number) => {
    if (score >= 8) return 'bg-red-100 text-red-800';
    if (score >= 6) return 'bg-orange-100 text-orange-800';
    if (score >= 4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Error Coins Knowledge Base
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search knowledge entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Entries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Entries ({filteredEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Error Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rarity</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.error_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.error_type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.error_category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRarityColor(entry.rarity_score)}>
                      {entry.rarity_score}/10
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.severity_level}/10</Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate">{entry.description}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorKnowledgeManager;
