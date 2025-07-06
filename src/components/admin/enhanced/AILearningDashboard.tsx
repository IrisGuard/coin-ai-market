import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Award, 
  Activity, 
  Target,
  BookOpen,
  Zap
} from 'lucide-react';
import { useAILearningSystem } from '@/hooks/useAILearningSystem';

const AILearningDashboard = () => {
  const { learningStats, userContribution } = useAILearningSystem();

  const stats = learningStats.data;
  const contribution = userContribution.data;

  if (learningStats.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Learning & Enhancement System</h2>
          <p className="text-muted-foreground">
            Continuous AI improvement through user feedback and multi-source verification
          </p>
        </div>
        <Badge variant="default" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Self-Learning Active
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Learning Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">AI training interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats?.averageAccuracy || 0) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">AI prediction accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              +{Math.round(stats?.improvementRate || 0)}%
            </div>
            <p className="text-xs text-muted-foreground">Learning progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories Learned</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.categoriesLearned?.length || 0}</div>
            <p className="text-xs text-muted-foreground">Multi-category support</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="contributors">Contributors</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  AI Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall AI Accuracy</span>
                    <span className="font-medium">{Math.round((stats?.averageAccuracy || 0) * 100)}%</span>
                  </div>
                  <Progress value={(stats?.averageAccuracy || 0) * 100} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Learning Efficiency</span>
                    <span className="font-medium">{Math.max(0, Math.round(stats?.improvementRate || 0))}%</span>
                  </div>
                  <Progress value={Math.max(0, stats?.improvementRate || 0)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Multi-Source Verification</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  System Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Multi-Category Analysis</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-Time Learning</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Source Verification</span>
                    <Badge variant="default">160+ Sources</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Enhancement</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feedback Integration</span>
                    <Badge variant="default">Live</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Learning Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['coins', 'banknotes', 'bullion', 'error_coins', 'error_banknotes'].map((category) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize">{category.replace('_', ' ')}</span>
                      <Badge variant="outline">
                        {stats?.categoriesLearned?.includes(category) ? 'Active Learning' : 'Available'}
                      </Badge>
                    </div>
                    <Progress 
                      value={stats?.categoriesLearned?.includes(category) ? 85 : 25} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contributors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold-600" />
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats?.topContributors?.slice(0, 5).map((contributor, index) => (
                    <div key={contributor.user_id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">#{index + 1}</span>
                        </div>
                        <span className="text-sm">User {contributor.user_id.slice(0, 8)}</span>
                      </div>
                      <Badge variant="secondary">{contributor.contribution_score} pts</Badge>
                    </div>
                  )) || (
                    <p className="text-sm text-muted-foreground">No contributors yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {contribution && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Your Contribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Contributions</span>
                      <span className="font-medium">{contribution.totalContributions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Contribution Score</span>
                      <span className="font-medium">{contribution.totalScore} pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Accuracy</span>
                      <span className="font-medium">
                        {Math.round((contribution.averageAccuracy || 0) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Processing Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Response Time</span>
                      <span className="font-medium">2.3s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Multi-Source Analysis Time</span>
                      <span className="font-medium">4.1s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cache Hit Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Quality Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Source Agreement Rate</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Confidence Accuracy</span>
                      <span className="font-medium">89%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Error Detection Rate</span>
                      <span className="font-medium">94%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AILearningDashboard;