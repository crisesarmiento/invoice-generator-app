import { cn } from "@/lib/utils";

describe("cn helper", () => {
  it("merges class names", () => {
    expect(cn("bg-white", false && "hidden", "text-sm")).toBe(
      "bg-white text-sm",
    );
  });
});
