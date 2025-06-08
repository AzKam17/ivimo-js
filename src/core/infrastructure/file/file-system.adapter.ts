import { FileUtilityPort } from "@/core/infrastructure/file/file-utility.port";
import { v4 as uuidv4 } from "uuid";
import * as fs from "fs/promises";
import * as path from "path";

export class FileSystemAdapter implements FileUtilityPort {
  private readonly uploadDir: string;
  constructor() {
    this.uploadDir = path.join(__dirname, "../../../uploads");
  }
  async downloadFile(fileName: string): Promise<File> {
    const filePath = path.join(this.uploadDir, fileName);

    try {
      await fs.access(filePath);
      const buffer = await fs.readFile(filePath);
      const stats = await fs.stat(filePath);

      const file = new File([buffer], path.basename(fileName), {
        type: this.getMimeType(fileName),
        lastModified: stats.mtime.getTime(),
      });

      return file;
    } catch (error) {
      throw new Error(`File not found or cannot be read: ${fileName}`);
    }
  }

  async uploadFile(file: File): Promise<string> {
    const fileId = uuidv4();
    const fileExtension = this.getFileExtension(file.name);
    const fileName = `${fileId}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    try {
      await this.ensureUploadDirExists();

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(filePath, buffer);

      return fileId;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  private getFileExtension(fileName: string): string {
    const lastDot = fileName.lastIndexOf(".");
    return lastDot > 0 ? fileName.substring(lastDot) : "";
  }

  private getMimeType(fileName: string): string {
    const extension = this.getFileExtension(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".txt": "text/plain",
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".json": "application/json",
      ".csv": "text/csv",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };
    return mimeTypes[extension] || "application/octet-stream";
  }
}
