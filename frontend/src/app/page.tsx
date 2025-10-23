"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface HealthStatus {
  success: boolean;
  message: string;
  timestamp: string;
  version: string;
  database: string;
  environment: string;
}

// Environment variable validation
const getApiBaseUrl = (): string => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!apiBaseUrl) {
    console.error("NEXT_PUBLIC_API_BASE_URL environment variable is not set");
    throw new Error("API base URL is not configured. Please check your environment variables.");
  }
  
  // Remove trailing slash if present
  return apiBaseUrl.replace(/\/$/, '');
};

export default function Home() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiBaseUrl = getApiBaseUrl();
        const response = await fetch(`${apiBaseUrl}/api/v1/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000), // 10 second timeout
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: HealthStatus = await response.json();
        setHealthStatus(data);
      } catch (err) {
        console.error("Failed to fetch health status:", err);
        
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred while fetching health status");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealthStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🏆 Sports Prediction App
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Predict the outcomes of your favorite sports matches and compete
            with friends!
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Features */}
          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">⚽</div>
              <CardTitle>Multiple Sports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Football, Basketball, Soccer, Baseball, and Hockey predictions
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">📊</div>
              <CardTitle>Real-time Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Track your prediction accuracy and compete on leaderboards
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">👥</div>
              <CardTitle>Social Features</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share predictions and compete with friends and family
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Backend Status */}
        <div className="max-w-2xl mx-auto mt-12">
          <Card>
            <CardHeader>
              <CardTitle>🔧 System Status</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-muted-foreground">
                    Checking backend...
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <Badge variant="destructive">
                    ❌ {error}
                  </Badge>
                </div>
              ) : healthStatus ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Status:</span>
                    <Badge
                      variant={healthStatus.success ? "default" : "destructive"}
                    >
                      {healthStatus.success ? "✅ Online" : "❌ Offline"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Database:</span>
                    <Badge variant="outline">{healthStatus.database}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Version:</span>
                    <Badge variant="outline">{healthStatus.version}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Environment:</span>
                    <Badge variant="secondary">
                      {healthStatus.environment}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Badge variant="destructive">
                    ❌ Unable to connect to backend
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Getting Started */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Ready to Start Predicting?
              </CardTitle>
              <CardDescription>
                Join thousands of sports fans making predictions and competing
                for glory!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 justify-center">
                <Button size="lg">Sign Up</Button>
                <Button variant="outline" size="lg">
                  View Matches
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
