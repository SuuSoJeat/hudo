import type { ValidationError } from "@/utils/errors";
import type { DataWithId, PartialData } from "@/utils/zod-schema";
import type {
  Firestore,
  FirestoreError,
  QueryConstraint,
} from "firebase/firestore";
import type { z } from "zod";

export type FirestoreServiceOptions<T extends z.ZodTypeAny> = {
  db: Firestore;
  collectionName: string;
  schema: T;
};

export type FirestoreService<T extends z.ZodTypeAny> = {
  subscribe: (
    onData: (items: DataWithId<T>[]) => void,
    onError: (error: FirestoreError | ValidationError) => void,
    queryConstraints?: QueryConstraint[],
  ) => () => void;
  getAll: (queryConstraints?: QueryConstraint[]) => Promise<DataWithId<T>[]>;
  add: (data: z.infer<T>) => Promise<string>;
  update: (id: string, data: PartialData<T>) => Promise<void>;
  remove: (id: string) => Promise<void>;
};
