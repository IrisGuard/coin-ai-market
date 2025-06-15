
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle, Clock, Circle } from 'lucide-react';

export const WhitepaperRoadmapSection = () => {
  const roadmapItems = [
    {
      quarter: 'Q1 2024',
      title: 'Platform Launch',
      description: 'Launch of GCAI token and initial platform features',
      status: 'completed',
      items: ['Token launch', 'Basic AI recognition', 'Wallet integration']
    },
    {
      quarter: 'Q2 2024',
      title: 'Enhanced AI Features',
      description: 'Advanced AI capabilities and error detection',
      status: 'completed',
      items: ['Error coin detection', 'Dual image analysis', 'Market intelligence']
    },
    {
      quarter: 'Q3 2024',
      title: 'Token Locking & Staking',
      description: 'Implementation of token locking mechanism',
      status: 'in-progress',
      items: ['Locking contracts', 'Reward distribution', 'Governance features']
    },
    {
      quarter: 'Q4 2024',
      title: 'Platform Expansion',
      description: 'Global expansion and partnership integrations',
      status: 'planned',
      items: ['Multi-language support', 'Exchange listings', 'Mobile app launch']
    }
  ];

  const handleDownloadWhitepaper = () => {
    // In real implementation, this would download the actual whitepaper
    console.log('Downloading GCAI Whitepaper...');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-brand-success" />;
      case 'in-progress':
        return <Clock className="w-6 h-6 text-brand-warning" />;
      case 'planned':
        return <Circle className="w-6 h-6 text-text-muted" />;
      default:
        return <Circle className="w-6 h-6 text-text-muted" />;
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
            Learn about our vision and development milestones
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Whitepaper */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-brand-primary" />
                GCAI Whitepaper
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-text-secondary">
                Download our comprehensive whitepaper to learn about GCAI's technology, 
                tokenomics, and future roadmap.
              </p>
              
              <div className="space-y-2 text-sm text-text-secondary">
                <div>• AI Recognition Technology</div>
                <div>• Tokenomics & Distribution</div>
                <div>• Platform Architecture</div>
                <div>• Market Analysis</div>
                <div>• Technical Specifications</div>
              </div>

              <Button 
                onClick={handleDownloadWhitepaper}
                className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Whitepaper
              </Button>
            </CardContent>
          </Card>

          {/* Roadmap */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Development Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roadmapItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {getStatusIcon(item.status)}
                      {index < roadmapItems.length - 1 && (
                        <div className="w-px h-16 bg-border-custom-secondary mt-2"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded">
                          {item.quarter}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === 'completed' ? 'bg-brand-success/10 text-brand-success' :
                          item.status === 'in-progress' ? 'bg-brand-warning/10 text-brand-warning' :
                          'bg-text-muted/10 text-text-muted'
                        }`}>
                          {item.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-text-primary mb-1">
                        {item.title}
                      </h4>
                      
                      <p className="text-text-secondary text-sm mb-3">
                        {item.description}
                      </p>
                      
                      <div className="space-y-1">
                        {item.items.map((feature, idx) => (
                          <div key={idx} className="text-sm text-text-secondary flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-brand-primary rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
