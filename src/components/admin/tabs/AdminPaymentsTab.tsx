import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentTablesSection from '@/components/admin/payments/PaymentTablesSection';
import { CreditCard, Database } from 'lucide-react';

const AdminPaymentsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CreditCard className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Payment Management</h2>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <div className="text-center py-8 text-muted-foreground">
            Stripe transaction history — coming in next phase.
          </div>
        </TabsContent>

        <TabsContent value="database">
          <PaymentTablesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPaymentsTab;
