import BackButton from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Status = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold">System Status</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>SmartLearn Service Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertDescription>
                All systems are operational. Last updated: {new Date().toLocaleString()}
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Core Services</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Authentication Service</span>
                    <Badge variant="default">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Course Management</span>
                    <Badge variant="default">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Assignment System</span>
                    <Badge variant="default">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Database</span>
                    <Badge variant="default">Operational</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Performance Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <Badge variant="secondary">150ms</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Uptime (24h)</span>
                    <Badge variant="secondary">99.99%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Error Rate</span>
                    <Badge variant="secondary">0.01%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Active Users</span>
                    <Badge variant="secondary">1,234</Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <p className="text-xs text-muted-foreground mb-4">
                For detailed incident reports and maintenance schedules, visit our status page.
              </p>
              <Button variant="outline" className="mr-2">
                Subscribe to Updates
              </Button>
              <Button variant="outline">
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Status;
