import BackButton from "@/components/ui/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>SmartLearn Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold mb-2">1. Information We Collect</h2>
              <p>
                We collect personal information such as name, email, and educational data when you create an account or interact with our services. 
                We also collect usage data to improve your learning experience.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. How We Use Your Information</h2>
              <p>
                Your information is used to provide personalized learning paths, track progress, and communicate important updates. 
                We do not sell your data to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. Data Sharing</h2>
              <p>
                We may share information with educational institutions for verification purposes or with service providers who help us operate the platform. 
                All sharing complies with applicable privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your data from unauthorized access. However, no system is completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information. Contact us at privacy@smartlearn.edu for assistance.
              </p>
            </section>

            <section className="pt-6 border-t">
              <p className="text-xs text-muted-foreground">
                Last updated: January 1, 2024
              </p>
              <Button variant="outline" className="mt-4">
                Download Policy
              </Button>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
