
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, MapPin, ExternalLink, CheckCircle, Clock, Circle } from 'lucide-react';

export const WhitepaperRoadmapSection = () => {
  const roadmapItems = [
    {
      phase: "Q1 2024",
      title: "Platform Foundation",
      status: "completed",
      items: [
        "AI coin recognition system",
        "Error detection algorithms",
        "Basic marketplace functionality",
        "User authentication system"
      ]
    },
    {
      phase: "Q2 2024",
      title: "Advanced Features",
      status: "completed",
      items: [
        "Enhanced AI accuracy",
        "Dealer panel integration",
        "Advanced search filters",
        "Mobile app optimization"
      ]
    },
    {
      phase: "Q3 2024",
      title: "Token Launch",
      status: "in-progress",
      items: [
        "GCAI token deployment",
        "Token locking system",
        "Referral program",
        "Revenue sharing model"
      ]
    },
    {
      phase: "Q4 2024",
      title: "Ecosystem Expansion",
      status: "planned",
      items: [
        "Cross-platform integration",
        "Advanced trading features",
        "Partnership integrations",
        "Global marketplace launch"
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in-progress':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Whitepaper & Roadmap
          </h2>
          <p className="text-xl text-text-secondary">
            Learn about our vision and track our progress
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Whitepaper Section */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-primary" />
                GCAI Whitepaper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-brand-primary/10 rounded-lg">
                  <h3 className="font-semibold text-text-primary mb-2">Technical Overview</h3>
                  <p className="text-sm text-text-secondary">
                    Comprehensive documentation of our AI-powered numismatic recognition system, 
                    tokenomics model, and platform architecture.
                  </p>
                </div>

                <div className="p-4 bg-brand-secondary/10 rounded-lg">
                  <h3 className="font-semibold text-text-primary mb-2">Economic Model</h3>
                  <p className="text-sm text-text-secondary">
                    Detailed explanation of token utilities, revenue sharing mechanisms, 
                    and platform governance structure.
                  </p>
                </div>

                <div className="p-4 bg-brand-success/10 rounded-lg">
                  <h3 className="font-semibold text-text-primary mb-2">AI Technology</h3>
                  <p className="text-sm text-text-secondary">
                    In-depth analysis of our machine learning algorithms, error detection 
                    capabilities, and continuous improvement processes.
                  </p>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Download Whitepaper (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Roadmap Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-6 h-6 text-brand-primary" />
                Development Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roadmapItems.map((item, index) => (
                  <div key={index} className={`p-4 rounded-lg border-2 ${getStatusColor(item.status)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(item.status)}
                        <h3 className="font-semibold text-text-primary">{item.title}</h3>
                      </div>
                      <span className="text-sm font-medium text-text-secondary">{item.phase}</span>
                    </div>
                    <ul className="space-y-1">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex} className="text-sm text-text-secondary flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                          {subItem}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg text-center">
          <h3 className="text-xl font-bold text-text-primary mb-2">Stay Updated</h3>
          <p className="text-text-secondary mb-4">
            Follow our progress and get notified about major milestones and token launch updates.
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Join Discord
            </Button>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Follow Twitter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
