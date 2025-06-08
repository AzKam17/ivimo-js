import { t } from "elysia";

export const ExtrasTransform = t.Optional(
  t
    .Transform(t.String())
    .Decode((value) => {
      if (!value || value.trim() === "") return {};
      try {
        const parsed = JSON.parse(value);
        if (typeof parsed !== "object" || Array.isArray(parsed)) {
          throw new Error("Extras must be a valid object");
        }
        return parsed;
      } catch (error) {
        throw new Error("Invalid JSON format for extras");
      }
    })
    .Encode((value) => JSON.stringify(value))
);
