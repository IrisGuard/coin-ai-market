
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, MapPin, Clock, DollarSign, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const GeographicDataSection = () => {
  const geographicTables = [
    {
      name: 'geographic_regions',
      description: 'World geographic regions and continents',
      records: '195',
      status: 'active',
      icon: Globe,
      coverage: '100%'
    },
    {
      name: 'countries',
      description: 'Country codes and information',
      records: '195',
      status: 'active',
      icon: MapPin,
      coverage: '100%'
    },
    {
      name: 'currencies',
      description: 'World currencies and exchange rates',
      records: '168',
      status: 'active',
      icon: DollarSign,
      coverage: '95%'
    },
    {
      name: 'time_zones',
      description: 'Global time zone definitions',
      records: '400',
      status: 'active',
      icon: Clock,
      coverage: '100%'
    },
    {
      name: 'regional_settings',
      description: 'Regional preferences and formats',
      records: '195',
      status: 'active',
      icon: Settings,
      coverage: '85%'
    }
  ];

  const geographicStats = [
    { label: 'Countries', value: '195', icon: MapPin, color: 'text-blue-600' },
    { label: 'Currencies', value: '168', icon: DollarSign, color: 'text-green-600' },
    { label: 'Time Zones', value: '400', icon: Clock, color: 'text-purple-600' },
    { label: 'Coverage', value: '96%', icon: Globe, color: 'text-emerald-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Geographic Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {geographicStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <p className="text-xs text-muted-foreground">Global data</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Geographic Tables */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {geographicTables.map((table) => {
          const IconComponent = table.icon;
          return (
            <Card key={table.name} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-teal-600" />
                  <CardTitle className="text-lg">{table.name}</CardTitle>
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                    {table.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{table.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm">
                    <span className="font-medium">{table.records}</span> records
                  </div>
                  <div className="text-sm font-medium text-teal-600">
                    {table.coverage} coverage
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Data
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Regional Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Regional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { region: 'Europe', countries: 44, percentage: 23 },
                { region: 'Africa', countries: 54, percentage: 28 },
                { region: 'Asia', countries: 48, percentage: 25 },
                { region: 'North America', countries: 23, percentage: 12 },
                { region: 'South America', countries: 12, percentage: 6 },
                { region: 'Oceania', countries: 14, percentage: 7 }
              ].map((region) => (
                <div key={region.region} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-teal-600" />
                    <span className="font-medium">{region.region}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {region.countries} countries
                    </span>
                    <span className="text-sm font-medium">
                      {region.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Currency Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { currency: 'USD', countries: 16, symbol: '$' },
                { currency: 'EUR', countries: 19, symbol: '€' },
                { currency: 'GBP', countries: 1, symbol: '£' },
                { currency: 'JPY', countries: 1, symbol: '¥' },
                { currency: 'CAD', countries: 1, symbol: 'C$' },
                { currency: 'AUD', countries: 1, symbol: 'A$' }
              ].map((currency) => (
                <div key={currency.currency} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{currency.currency}</span>
                    <span className="text-muted-foreground">{currency.symbol}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currency.countries} {currency.countries === 1 ? 'country' : 'countries'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeographicDataSection;
