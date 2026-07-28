import { createNoteTitle } from "@/domain/value-objects/noteTitle";

describe("createNoteTitle", () => {
  it("should trim title when title has surrounding spaces", () => {
    const result = createNoteTitle("  Reunion projet  ");

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe("Reunion projet");
    }
  });

  it("should reject empty title when title is blank", () => {
    const result = createNoteTitle("   ");

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("empty_title");
    }
  });

  it("should reject title when title is longer than limit", () => {
    const longTitle = "a".repeat(81);

    const result = createNoteTitle(longTitle);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("title_too_long");
    }
  });
});
