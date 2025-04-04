import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Shield } from "lucide-react";

export default function SecurityPolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full bg-background text-foreground">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center mb-8">
            <Shield className="h-8 w-8 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Security Policy</h1>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Reporting Security Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The OpenManus team takes security issues seriously. We appreciate your efforts to responsibly disclose your findings.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">How to Report a Security Issue</h3>
              <p>
                If you believe you've found a security vulnerability in OpenManus, please send it to us by emailing <a href="mailto:security@openmanus.app" className="text-primary hover:underline">security@openmanus.app</a>.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">What to Include</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Description of the issue and potential impact</li>
                <li>Steps to reproduce the issue</li>
                <li>Any proof of concept code, if applicable</li>
                <li>Your name and contact information for follow-up questions</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Security Measures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                OpenManus implements the following security measures:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Secure authentication and authorization</li>
                <li>Data encryption in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Input validation and output encoding</li>
                <li>Protection against common web vulnerabilities (XSS, CSRF, SQL Injection)</li>
                <li>Secure API access controls</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Responsible Disclosure Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                We follow responsible disclosure principles:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>We will acknowledge receipt of your report within 48 hours</li>
                <li>We will provide an estimated timeline for addressing the issue</li>
                <li>We will keep you informed about our progress</li>
                <li>We will not take legal action against researchers who report in good faith</li>
                <li>We may offer recognition or rewards for significant findings</li>
              </ul>
              
              <p className="mt-4">
                Thank you for helping keep OpenManus and our users safe!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}