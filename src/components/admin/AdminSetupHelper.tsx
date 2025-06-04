
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { createFirstAdmin, checkAdminStatus } from '@/utils/adminUtils';
import { useToast } from '@/hooks/use-toast';

const AdminSetupHelper: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const createResult = await createFirstAdmin(email.trim());
      setResult(createResult);

      if (createResult.success) {
        toast({
          title: "Admin Created Successfully",
          description: createResult.message,
        });
        
        // Check admin status after creation
        setTimeout(async () => {
          const isAdmin = await checkAdminStatus();
          if (isAdmin) {
            toast({
              title: "Admin Access Confirmed",
              description: "You now have admin privileges. Refresh the page to access admin features.",
            });
          }
        }, 1000);
      } else {
        toast({
          title: "Admin Creation Failed",
          description: createResult.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const errorMessage = `Unexpected error: ${error.message}`;
      setResult({ success: false, message: errorMessage });
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Setup Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <UserPlus className="h-4 w-4" />
          <AlertDescription>
            Create the first admin user to access the admin panel and manage API keys.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="admin-email">Admin Email</Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button 
          onClick={handleCreateAdmin} 
          disabled={isLoading || !email.trim()}
          className="w-full"
        >
          {isLoading ? 'Creating Admin...' : 'Create First Admin'}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>Instructions:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-2">
            <li>Create a user account first through normal signup</li>
            <li>Enter that email address above</li>
            <li>Click "Create First Admin"</li>
            <li>Refresh the page after successful creation</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSetupHelper;
