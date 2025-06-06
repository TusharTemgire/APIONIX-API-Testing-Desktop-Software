"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Folder, File, Upload, Download, Plus, Search } from "lucide-react"

interface FileManagerProps {
  isElectron: boolean
}

interface FileItem {
  name: string
  type: "file" | "folder"
  size?: string
  modified: string
}

export function FileManager({ isElectron }: FileManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPath, setCurrentPath] = useState("/Documents")

  // Mock file data
  const [files] = useState<FileItem[]>([
    { name: "Projects", type: "folder", modified: "2024-01-15" },
    { name: "Documents", type: "folder", modified: "2024-01-14" },
    { name: "README.md", type: "file", size: "2.4 KB", modified: "2024-01-13" },
    { name: "package.json", type: "file", size: "1.8 KB", modified: "2024-01-12" },
    { name: "config.json", type: "file", size: "856 B", modified: "2024-01-11" },
  ])

  const filteredFiles = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCreateFolder = async () => {
    if (isElectron && window.electron) {
      await window.electron.showMessageBox({
        type: "info",
        title: "Create Folder",
        message: "This would create a new folder in the desktop app",
        buttons: ["OK"],
      })
    } else {
      alert("Folder creation would work in the desktop app")
    }
  }

  const handleUploadFile = async () => {
    if (isElectron && window.electron) {
      await window.electron.showMessageBox({
        type: "info",
        title: "Upload File",
        message: "This would open a file picker in the desktop app",
        buttons: ["OK"],
      })
    } else {
      alert("File upload would work in the desktop app")
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            File Manager
          </CardTitle>
          <CardDescription>Browse and manage files {isElectron ? "on your system" : "in the web app"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Path and Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{currentPath}</Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCreateFolder}>
                <Plus className="w-4 h-4 mr-2" />
                New Folder
              </Button>
              <Button size="sm" variant="outline" onClick={handleUploadFile}>
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </div>
          </div>

          <Separator />

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Files</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search files and folders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* File List */}
          <div className="space-y-2">
            {filteredFiles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No files found</p>
            ) : (
              filteredFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                >
                  <div className="flex-shrink-0">
                    {file.type === "folder" ? (
                      <Folder className="w-5 h-5 text-blue-500" />
                    ) : (
                      <File className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">Modified {file.modified}</p>
                  </div>
                  {file.size && (
                    <div className="flex-shrink-0">
                      <Badge variant="secondary">{file.size}</Badge>
                    </div>
                  )}
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
