
export interface FileUtilityPort{
  uploadFile(file: File): Promise<string>
  downloadFile(fileName: string): Promise<File>
}