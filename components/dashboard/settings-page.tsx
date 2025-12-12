"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { User, Building, Bell, Shield, Key } from "lucide-react"

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and organization settings</p>
      </div>

      {/* Profile */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            <CardTitle className="text-base">Profile</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Admin User" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@company.com" className="bg-secondary border-border" />
            </div>
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-accent" />
            <CardTitle className="text-base">Organization</CardTitle>
          </div>
          <CardDescription>Manage your workspace settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="org">Organization Name</Label>
              <Input id="org" defaultValue="Acme Corp" className="bg-secondary border-border" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input id="domain" defaultValue="acme.com" className="bg-secondary border-border" />
            </div>
          </div>
          <Button>Update Organization</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            <CardTitle className="text-base">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">Email Notifications</div>
              <div className="text-sm text-muted-foreground">Receive scan completion alerts</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">Risk Score Alerts</div>
              <div className="text-sm text-muted-foreground">Get notified when scores change significantly</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">Weekly Digest</div>
              <div className="text-sm text-muted-foreground">Summary of all monitored companies</div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <CardTitle className="text-base">Security</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">Two-Factor Authentication</div>
              <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
            </div>
            <Button variant="outline" size="sm">
              Enable
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">Change Password</div>
              <div className="text-sm text-muted-foreground">Update your account password</div>
            </div>
            <Button variant="outline" size="sm">
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="glass">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-accent" />
            <CardTitle className="text-base">API Keys</CardTitle>
          </div>
          <CardDescription>Manage API access for integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-sm text-foreground">ra_live_****************************</div>
                <div className="text-xs text-muted-foreground">Created Dec 1, 2025</div>
              </div>
              <Button variant="outline" size="sm">
                Revoke
              </Button>
            </div>
          </div>
          <Button>Generate New Key</Button>
        </CardContent>
      </Card>
    </div>
  )
}
