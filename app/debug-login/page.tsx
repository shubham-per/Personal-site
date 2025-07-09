"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function DebugLogin() {
  const [email, setEmail] = useState("admin@shubham.dev")
  const [password, setPassword] = useState("admin123")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<any>(null)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/full-setup", { method: "GET" })
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({ error: error.message })
    }
    setLoading(false)
  }

  const fullSetup = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/full-setup", { method: "POST" })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    }
    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/test-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: error.message })
    }
    setLoading(false)
  }

  const tryActualLogin = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: "Login successful! You can now go to /admin" })
      } else {
        setResult({ success: false, error: data.error || "Login failed" })
      }
    } catch (error) {
      setResult({ error: error.message })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>🔧 Admin Login Troubleshooter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Follow these steps in order to fix your admin login issue.</AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={checkStatus} disabled={loading} variant="outline">
                1️⃣ Check Current Status
              </Button>
              <Button onClick={fullSetup} disabled={loading}>
                2️⃣ Complete Setup & Fix
              </Button>
              <Button onClick={testLogin} disabled={loading} variant="outline">
                3️⃣ Test Login
              </Button>
              <Button onClick={tryActualLogin} disabled={loading} className="bg-green-600 hover:bg-green-700">
                4️⃣ Try Real Login
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        {status && (
          <Card>
            <CardHeader>
              <CardTitle>📊 Current Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {status.databaseConnected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  Database Connected: {status.databaseConnected ? "Yes" : "No"}
                </div>
                <div className="flex items-center gap-2">
                  {status.userExists ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  Admin User Exists: {status.userExists ? "Yes" : "No"}
                </div>
                <div className="flex items-center gap-2">
                  {status.environmentVariables?.DATABASE_URL ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  DATABASE_URL Set: {status.environmentVariables?.DATABASE_URL ? "Yes" : "No"}
                </div>
                <div className="flex items-center gap-2">
                  {status.environmentVariables?.JWT_SECRET ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  JWT_SECRET Set: {status.environmentVariables?.JWT_SECRET ? "Yes" : "No"}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.steps && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Setup Steps:</h4>
                  <div className="space-y-1 text-sm font-mono">
                    {result.steps.map((step: string, index: number) => (
                      <div
                        key={index}
                        className={
                          step.startsWith("❌")
                            ? "text-red-600"
                            : step.startsWith("✅")
                              ? "text-green-600"
                              : "text-gray-600"
                        }
                      >
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    <strong>Success!</strong> You can now go to{" "}
                    <a href="/admin" className="underline">
                      /admin
                    </a>{" "}
                    and login with:
                    <br />
                    Email: admin@shubham.dev
                    <br />
                    Password: admin123
                  </AlertDescription>
                </Alert>
              )}

              <details className="mt-4">
                <summary className="cursor-pointer font-medium">Full Debug Info</summary>
                <pre className="text-xs overflow-auto mt-2 p-2 bg-gray-100 rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
