import BackButton from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold">Terms of Service</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>SmartLearn Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing and using SmartLearn, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree with these terms, please do not use the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. User Responsibilities</h2>
              <p>
                Users are responsible for maintaining the confidentiality of their account and password. 
                SmartLearn reserves the right to terminate accounts that violate these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. Intellectual Property</h2>
              <p>
                All content on SmartLearn, including courses, materials, and software, is the property of SmartLearn or its licensors. 
                Users may not reproduce, distribute, or create derivative works without permission.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Limitation of Liability</h2>
              <p>
                SmartLearn is provided "as is" without warranties. We are not liable for any damages arising from use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. Changes to Terms</h2>
              <p>
                We may update these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="pt-6 border-t">
              <p className="text-xs text-muted-foreground">
                Last updated: January 1, 2024
              </p>
              <Button variant="outline" className="mt-4">
                Print Terms
              </Button>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
