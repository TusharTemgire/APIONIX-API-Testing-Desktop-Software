"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/renderer/components/ui/card"
import { Button } from "@/renderer/components/ui/button"
import { Badge } from "@/renderer/components/ui/badge"
import { Separator } from "@/renderer/components/ui/separator"
import { Monitor, Cpu, HardDrive, Wifi, RefreshCw } from "lucide-react"

import { type, arch, version } from "@tauri-apps/plugin-os"

interface SystemInfoProps {
  isTauri?: boolean
}

interface SystemData {
  platform: string
  arch: string
  version: string
}

export function SystemInfo({ isTauri = true }: SystemInfoProps) {
  const [systemData, setSystemData] = useState<SystemData | null>(null)
  const [loading, setLoading] = useState(false)

  const loadSystemInfo = async () => {
    setLoading(true)
    try {
      if (isTauri) {
        setSystemData({
          platform: await type(),
          arch: await arch(),
          version: await version(),
        })
      } else {
        // Web fallback
        setSystemData({
          platform: navigator.platform,
          arch: "unknown",
          version: "Web Browser",
        })
      }
    } catch (error) {
      console.error("Failed to load system info:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSystemInfo()
  }, [isTauri])

  const systemItems = [
    {
      icon: Monitor,
      label: "Platform",
      value: systemData?.platform || "Unknown",
      color: "bg-blue-500",
    },
    {
      icon: Cpu,
      label: "Architecture",
      value: systemData?.arch || "Unknown",
      color: "bg-green-500",
    },
    {
      icon: HardDrive,
      label: "OS Version",
      value: systemData?.version || "N/A",
      color: "bg-purple-500",
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                System Information
              </CardTitle>
              <CardDescription>Runtime environment and system details</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadSystemInfo} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {systemItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-4 border rounded-lg">
                <div className={`p-2 rounded-md ${item.color} text-white`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Runtime Environment</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant={isTauri ? "default" : "secondary"}>
                {isTauri ? "Tauri Desktop" : "Web Browser"}
              </Badge>
              <Badge variant="outline">Next.js 15</Badge>
              <Badge variant="outline">React 18</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
