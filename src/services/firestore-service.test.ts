import type { FirestoreService } from "@/types/firestore-service";
import { FirestoreOperationError, ValidationError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import type { PartialData } from "@/utils/zod-schema";
import {
  type DocumentData,
  type DocumentReference,
  type Firestore,
  type QuerySnapshot,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { createFirestoreService } from "./firestore-service";

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  getDocs: vi.fn(),
}));

describe("FirestoreService", () => {
  let db: Firestore;
  const testSchema = z.object({
    name: z.string(),
    age: z.number(),
  });
  let service: FirestoreService<typeof testSchema>;

  beforeEach(() => {
    db = {} as Firestore;
    service = createFirestoreService({
      db,
      collectionName: "test",
      schema: testSchema,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("subscribe", () => {
    it("should call onData with valid data", () => {
      const mockSnapshot = {
        docs: [
          { id: "1", data: () => ({ name: "John", age: 30 }) },
          { id: "2", data: () => ({ name: "Jane", age: 25 }) },
        ],
      } as unknown as QuerySnapshot<DocumentData>;

      const onData = vi.fn();
      const onError = vi.fn();

      vi.mocked(onSnapshot).mockImplementation((_, callback) => {
        (callback as (snapshot: QuerySnapshot<DocumentData>) => void)(
          mockSnapshot,
        );
        return vi.fn();
      });

      service.subscribe(onData, onError);

      expect(onData).toHaveBeenCalledWith([
        { id: "1", name: "John", age: 30 },
        { id: "2", name: "Jane", age: 25 },
      ]);
      expect(onError).not.toHaveBeenCalled();
    });

    it("should handle invalid data correctly", () => {
      const mockSnapshot = {
        docs: [
          { id: "1", data: () => ({ name: "John", age: "thirty" }) },
          { id: "2", data: () => ({ name: "Jane", age: 25 }) },
        ],
      } as unknown as QuerySnapshot<DocumentData>;

      const onData = vi.fn();
      const onError = vi.fn();

      const loggerWarnMock = vi
        .spyOn(logger, "warn")
        .mockImplementation(() => {});

      vi.mocked(onSnapshot).mockImplementation((_, callback) => {
        (callback as (snapshot: QuerySnapshot<DocumentData>) => void)(
          mockSnapshot,
        );
        return vi.fn();
      });

      service.subscribe(onData, onError);

      expect(onData).toHaveBeenCalledWith([{ id: "2", name: "Jane", age: 25 }]);
      expect(onError).toHaveBeenCalledWith(expect.any(ValidationError));
      expect(loggerWarnMock).toHaveBeenCalledWith(
        expect.stringContaining("Skipping invalid item with ID 1"),
      );

      loggerWarnMock.mockRestore();
    });
  });

  describe("getAll", () => {
    it("should return all valid documents", async () => {
      const mockDocs = [
        { id: "1", data: () => ({ name: "John", age: 30 }) },
        { id: "2", data: () => ({ name: "Jane", age: 25 }) },
      ];
      vi.mocked(getDocs).mockResolvedValue({
        docs: mockDocs,
      } as unknown as QuerySnapshot<DocumentData>);

      const result = await service.getAll();

      expect(result).toEqual([
        { id: "1", name: "John", age: 30 },
        { id: "2", name: "Jane", age: 25 },
      ]);
    });

    it("should throw ValidationError for invalid data", async () => {
      const mockDocs = [
        { id: "1", data: () => ({ name: "John", age: "thirty" }) },
      ];
      vi.mocked(getDocs).mockResolvedValue({
        docs: mockDocs,
      } as unknown as QuerySnapshot<DocumentData>);

      await expect(service.getAll()).rejects.toThrow(ValidationError);
    });

    it("should throw FirestoreOperationError for Firestore errors", async () => {
      vi.mocked(getDocs).mockRejectedValue(new Error("Firestore error"));

      await expect(service.getAll()).rejects.toThrow(FirestoreOperationError);
    });
  });

  describe("add", () => {
    it("should add a valid document and return its id", async () => {
      const mockDocRef = { id: "newId" } as DocumentReference<DocumentData>;
      vi.mocked(doc).mockReturnValue(mockDocRef);
      vi.mocked(setDoc).mockResolvedValue(undefined);

      const newData = { name: "Alice", age: 28 };
      const result = await service.add(newData);

      expect(result).toBe("newId");
      expect(setDoc).toHaveBeenCalledWith(mockDocRef, newData);
    });

    it("should throw ValidationError for invalid data", async () => {
      const invalidData = {
        name: "Alice",
        age: "twenty-eight",
      } as unknown as z.infer<typeof testSchema>;

      await expect(service.add(invalidData)).rejects.toThrow(ValidationError);
    });

    it("should throw FirestoreOperationError for Firestore errors", async () => {
      vi.mocked(setDoc).mockRejectedValue(new Error("Firestore error"));

      const newData = { name: "Alice", age: 28 };
      await expect(service.add(newData)).rejects.toThrow(
        FirestoreOperationError,
      );
    });
  });

  describe("update", () => {
    it("should update a document with valid data", async () => {
      vi.mocked(updateDoc).mockResolvedValue(undefined);

      const updateData = { age: 31 };
      await service.update("1", updateData);

      expect(updateDoc).toHaveBeenCalledWith(expect.any(Object), updateData);
    });

    it("should throw ValidationError for invalid data", async () => {
      const invalidData = { age: "thirty-one" } as unknown as PartialData<
        typeof testSchema
      >;

      await expect(service.update("1", invalidData)).rejects.toThrow(
        ValidationError,
      );
    });

    it("should throw FirestoreOperationError for Firestore errors", async () => {
      vi.mocked(updateDoc).mockRejectedValue(new Error("Firestore error"));

      const updateData = { age: 31 };
      await expect(service.update("1", updateData)).rejects.toThrow(
        FirestoreOperationError,
      );
    });
  });

  describe("remove", () => {
    it("should remove a document", async () => {
      vi.mocked(deleteDoc).mockResolvedValue(undefined);

      await service.remove("1");

      expect(deleteDoc).toHaveBeenCalled();
    });

    it("should throw FirestoreOperationError for Firestore errors", async () => {
      vi.mocked(deleteDoc).mockRejectedValue(new Error("Firestore error"));

      await expect(service.remove("1")).rejects.toThrow(
        FirestoreOperationError,
      );
    });
  });
});
