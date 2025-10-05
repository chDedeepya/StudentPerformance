import BackButton from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Security = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold">Security Policy</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>SmartLearn Security Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Security Commitment</h2>
              <p>
                At SmartLearn, security is our top priority. We implement industry-standard security practices to protect your data and ensure a safe learning environment.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. Access Controls</h2>
              <p>
                All user accounts are protected with strong password requirements and multi-factor authentication options. Role-based access control ensures users only see appropriate content.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. Data Encryption</h2>
              <p>
                All data in transit is encrypted using TLS 1.3. Sensitive data at rest is encrypted with AES-256. We regularly audit our encryption practices.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Vulnerability Management</h2>
              <p>
                We conduct regular security audits, penetration testing, and vulnerability scans. All identified issues are prioritized and remediated promptly.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. Incident Response</h2>
              <p>
                In the event of a security incident, we have a dedicated response team that follows our incident response plan. Users will be notified if their data is affected.
              </p>
            </section>

            <section className="pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">Security Rating</Badge>
                <Badge>A+</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Last updated: January 1, 2024
              </p>
              <Button variant="outline" className="mt-4">
                Report Security Issue
              </Button>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Security;
