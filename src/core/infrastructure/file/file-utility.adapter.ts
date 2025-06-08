import { FileSystemAdapter } from "@/core/infrastructure/file/file-system.adapter";
import { FileUtilityPort } from "@/core/infrastructure/file/file-utility.port";

export class FileUtilityAdapter implements FileUtilityPort {
  private readonly driver: FileUtilityPort;
  constructor() {
    const driverType = Bun.env.FILE_DRIVER as string;

    if (!driverType) {
      throw new Error("FILE_DRIVER not defined");
    }

    // Initialize the appropriate driver based on environment variable
    switch (driverType) {
      case "local":
        this.driver = new FileSystemAdapter();
        break;
      default:
        throw new Error(`Unsupported file driver: ${driverType}`);
    }
  }
  async uploadFile(file: File): Promise<string> {
    return this.driver.uploadFile(file);
  }

  async downloadFile(fileName: string): Promise<File> {
    return this.driver.downloadFile(fileName);
  }
}
