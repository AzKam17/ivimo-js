import { FileUtilityAdapter, FileUtilityPort } from "@/core/infrastructure/file";
import Elysia from "elysia";

export const AssetModule = new Elysia({ name: "asset-module", prefix: "api/v1/assets" }).get(
  "/:fileName",
  async ({ params: { fileName } }) => {
    const fileAdapter: FileUtilityPort = new FileUtilityAdapter();
    return await fileAdapter.downloadFile(fileName);
  },

  {
    detail: {
      summary: "Get an asset",
      description: "Use this api to retrieve any asset you saved in the system.",
      tags: ["Assets"],
    },
  }
);
