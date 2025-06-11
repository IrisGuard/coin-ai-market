
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Eye
} from 'lucide-react';

const AdminReportsTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');

  // Mock reports data
  const mockReports = [
    {
      id: '1',
      name: 'Monthly Sales Report',
      type: 'sales',
      generated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      period: 'May 2024',
      format: 'PDF',
      size: '2.4 MB',
      downloads: 15
    },
    {
      id: '2',
      name: 'User Activity Analytics',
      type: 'users',
      generated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      period: 'Last 7 days',
      format: 'Excel',
      size: '1.8 MB',
      downloads: 8
    },
    {
      id: '3',
      name: 'Marketplace Performance',
      type: 'marketplace',
      generated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      period: 'Q2 2024',
      format: 'PDF',
      size: '3.1 MB',
      downloads: 23
    },
    {
      id: '4',
      name: 'AI Recognition Accuracy',
      type: 'ai_analytics',
      generated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      period: 'Last 30 days',
      format: 'PDF',
      size: '1.2 MB',
      downloads: 12
    }
  ];

  const reportTemplates = [
    {
      id: '1',
      name: 'Daily Activity Summary',
      description: 'Daily overview of platform activity and key metrics',
      icon: <BarChart3 className="h-6 w-6" />,
      frequency: 'Daily',
      last_generated: '6 hours ago'
    },
    {
      id: '2',
      name: 'User Engagement Report',
      description: 'Detailed analysis of user behavior and engagement',
      icon: <Users className="h-6 w-6" />,
      frequency: 'Weekly',
      last_generated: '2 days ago'
    },
    {
      id: '3',
      name: 'Revenue Analytics',
      description: 'Financial performance and revenue trends',
      icon: <DollarSign className="h-6 w-6" />,
      frequency: 'Monthly',
      last_generated: '1 week ago'
    },
    {
      id: '4',
      name: 'AI Performance Metrics',
      description: 'AI system accuracy and performance analytics',
      icon: <TrendingUp className="h-6 w-6" />,
      frequency: 'Weekly',
      last_generated: '3 days ago'
    }
  ];

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'sales': return 'bg-green-100 text-green-800';
      case 'users': return 'bg-blue-100 text-blue-800';
      case 'marketplace': return 'bg-purple-100 text-purple-800';
      case 'ai_analytics': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000));

    if (days > 0) return `${days}d ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Reports & Analytics</h3>
          <p className="text-sm text-muted-foreground">Generate and manage system reports</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Generate New Report
        </Button>
      </div>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {reportTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>Frequency: {template.frequency}</span>
                      <span>Last: {template.last_generated}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">
                        Generate Now
                      </Button>
                      <Button size="sm" variant="outline">
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{report.name}</span>
                      <Badge className={getReportTypeColor(report.type)}>
                        {report.type.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{report.format}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Period: {report.period} • Generated: {getTimeAgo(report.generated_at)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Size: {report.size} • Downloads: {report.downloads}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Scheduler */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-6 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <h4 className="font-medium">Daily Reports</h4>
              <p className="text-sm text-muted-foreground mt-1">5 active schedules</p>
              <Button size="sm" variant="outline" className="mt-3">
                Manage
              </Button>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <h4 className="font-medium">Weekly Reports</h4>
              <p className="text-sm text-muted-foreground mt-1">3 active schedules</p>
              <Button size="sm" variant="outline" className="mt-3">
                Manage
              </Button>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <h4 className="font-medium">Monthly Reports</h4>
              <p className="text-sm text-muted-foreground mt-1">2 active schedules</p>
              <Button size="sm" variant="outline" className="mt-3">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsTab;
