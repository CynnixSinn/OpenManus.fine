import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ProtectedRoute } from "@/components/auth/route-components";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ArrowLeft, Save } from "lucide-react";

function SettingsPage() {
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
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground mt-2">
              Configure OpenManus to your preferences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Navigation</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    <a href="#general" className="block p-2 rounded-md hover:bg-muted">
                      General Settings
                    </a>
                    <a href="#ai" className="block p-2 rounded-md hover:bg-muted">
                      AI Configuration
                    </a>
                    <a href="#deployment" className="block p-2 rounded-md hover:bg-muted">
                      Deployment Settings
                    </a>
                    <a href="#account" className="block p-2 rounded-md hover:bg-muted">
                      Account Settings
                    </a>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <Card id="general">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Configure general application settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="flex items-center justify-between">
                      <span>Dark Mode</span>
                      <Switch id="theme" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="notifications">Notifications</Label>
                    <div className="flex items-center justify-between">
                      <span>Enable Notifications</span>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="ai">
                <CardHeader>
                  <CardTitle>AI Configuration</CardTitle>
                  <CardDescription>
                    Configure AI model settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model</Label>
                    <Input id="model" defaultValue="DeepSeek" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API Key</Label>
                    <Input id="api-key" type="password" placeholder="Enter your API key" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input id="temperature" type="number" defaultValue="0.7" min="0" max="1" step="0.1" />
                    <p className="text-xs text-muted-foreground">
                      Controls randomness: 0 is deterministic, 1 is very creative
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="deployment">
                <CardHeader>
                  <CardTitle>Deployment Settings</CardTitle>
                  <CardDescription>
                    Configure deployment options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Default Platform</Label>
                    <Input id="platform" defaultValue="Vercel" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Deployment Options</Label>
                    <div className="flex items-center justify-between">
                      <span>Auto-deploy on completion</span>
                      <Switch id="auto-deploy" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card id="account">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" />
                  </div>
                  
                  <Button className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProtectedSettings() {
  return <ProtectedRoute Component={SettingsPage} />;
}