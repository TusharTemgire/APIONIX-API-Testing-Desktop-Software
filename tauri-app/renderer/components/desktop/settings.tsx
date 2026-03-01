"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/renderer/components/ui/card"
import { Button } from "@/renderer/components/ui/button"
import { Switch } from "@/renderer/components/ui/switch"
import { Label } from "@/renderer/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/renderer/components/ui/select"
import { Separator } from "@/renderer/components/ui/separator"
import { Badge } from "@/renderer/components/ui/badge"
import { SettingsIcon, Moon, Sun, Bell, Shield, Palette } from "lucide-react"
import { useTheme } from "next-themes"

interface SettingsProps {
  isElectron: boolean
}

export function Settings({ isElectron }: SettingsProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoStart, setAutoStart] = useState(false)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSaveSettings = async () => {
    const settings = {
      theme,
      notifications,
      autoStart,
      language,
    }

    if (isElectron && window.electron) {
      const result = await window.electron.saveData({ settings })
      if (result.success) {
        await window.electron.showMessageBox({
          type: "info",
          title: "Settings Saved",
          message: "Your settings have been saved successfully!",
          buttons: ["OK"],
        })
      }
    } else {
      localStorage.setItem("app-settings", JSON.stringify(settings))
      alert("Settings saved to local storage!")
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Application Settings
          </CardTitle>
          <CardDescription>Customize your application preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <h3 className="text-lg font-semibold">Appearance</h3>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
              </div>
              <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>

          <Separator />

          {/* System */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <h3 className="text-lg font-semibold">System</h3>
            </div>

            <div className="grid gap-4">
              {isElectron && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autostart">Auto Start</Label>
                    <p className="text-sm text-muted-foreground">Launch app when system starts</p>
                  </div>
                  <Switch id="autostart" checked={autoStart} onCheckedChange={setAutoStart} />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Language</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Environment Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Environment</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={isElectron ? "default" : "secondary"}>{isElectron ? "Desktop App" : "Web Browser"}</Badge>
              <Badge variant="outline">Next.js 14</Badge>
              <Badge variant="outline">Tailwind CSS</Badge>
              <Badge variant="outline">TypeScript</Badge>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
