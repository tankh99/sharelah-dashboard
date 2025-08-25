'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UploadedFile {
  file: File
  id: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

interface FileUploadProps {
  onFileUpload: (file: File) => Promise<void>
  onFileRemove?: (fileId: string) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number // in MB
  multiple?: boolean
  className?: string
}

// currently partially
export default function FileUpload({
  onFileUpload,
  onFileRemove,
  acceptedFileTypes = ['.pdf'],
  maxFileSize = 5, // 5MB default
  multiple = false,
  className
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'uploading' as const,
      progress: 0
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Process each file
    for (const uploadedFile of newFiles) {
      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, progress: Math.min(f.progress + 20, 90) }
                : f
            )
          )
        }, 200)

        // Call the upload function
        await onFileUpload(uploadedFile.file)

        clearInterval(progressInterval)
        
        // Mark as success
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, status: 'success', progress: 100 }
              : f
          )
        )
      } catch (error) {
        // Mark as error
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { 
                  ...f, 
                  status: 'error', 
                  progress: 0,
                  error: error instanceof Error ? error.message : 'Upload failed'
                }
              : f
          )
        )
      }
    }
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxSize: maxFileSize * 1024 * 1024, // Convert MB to bytes
    multiple,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  })

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
    onFileRemove?.(fileId)
  }

  const getFileIcon = () => {
    return <File className="h-4 w-4" />
  }

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card className={cn(
        'border-2 border-dashed transition-colors',
        isDragActive || isDragging 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      )}>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className="text-center cursor-pointer"
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              {isDragActive ? 'Drop your file here' : 'Upload your file'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-gray-400">
              Supported formats: {acceptedFileTypes.join(', ')} • Max size: {maxFileSize}MB
            </p>
            <Button variant="outline" className="mt-4">
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Files</h3>
          {uploadedFiles.map((uploadedFile) => (
            <Card key={uploadedFile.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon()}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  {getStatusIcon(uploadedFile.status)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(uploadedFile.id)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploadedFile.status === 'uploading' && (
                <div className="mt-3">
                  <Progress value={uploadedFile.progress} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    Uploading... {uploadedFile.progress}%
                  </p>
                </div>
              )}
              
              {uploadedFile.status === 'error' && uploadedFile.error && (
                <Alert className="mt-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {uploadedFile.error}
                  </AlertDescription>
                </Alert>
              )}
              
              {uploadedFile.status === 'success' && (
                <p className="text-xs text-green-600 mt-2">
                  Successfully uploaded
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}