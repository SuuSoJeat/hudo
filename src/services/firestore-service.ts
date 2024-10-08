import type {
  FirestoreService,
  FirestoreServiceOptions,
} from "@/types/firestore-service";
import { FirestoreOperationError, ValidationError } from "@/utils/errors";
import { logger } from "@/utils/logger";
import {
  type DataWithId,
  type PartialData,
  addIdToSchema,
  makeSchemaPartial,
} from "@/utils/zod-schema";
import {
  type DocumentData,
  type FirestoreError,
  type QueryConstraint,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { z } from "zod";

/**
 * Creates a Firestore service with CRUD operations and real-time updates.
 * @template T - The Zod schema type for the collection documents.
 * @param {FirestoreServiceOptions<T>} options - Configuration options.
 * @returns {FirestoreService<T>} An object with Firestore operations.
 */
export function createFirestoreService<T extends z.ZodTypeAny>({
  db,
  collectionName,
  schema,
}: FirestoreServiceOptions<T>): FirestoreService<T> {
  const collectionRef = collection(db, collectionName);
  const schemaWithId = addIdToSchema(schema);

  /**
   * Subscribes to real-time updates of the collection.
   * Filters out invalid documents and reports errors.
   */
  function subscribe(
    onData: (items: DataWithId<T>[]) => void,
    onError: (error: FirestoreError | ValidationError) => void,
    queryConstraints: QueryConstraint[] = [],
  ): () => void {
    const q = query(collectionRef, ...queryConstraints);
    return onSnapshot(
      q,
      (snapshot) => {
        const validItems = snapshot.docs.reduce((acc: DataWithId<T>[], doc) => {
          const item = docToItem(doc);
          const parsedItem = schemaWithId.safeParse(item);
          if (parsedItem.success) {
            acc.push(parsedItem.data);
          } else {
            logger.warn(
              `Skipping invalid item with ID ${item.id}: ${parsedItem.error.message}`,
            );
            onError(
              new ValidationError(
                `Skipping invalid item with ID ${item.id}: ${parsedItem.error.message}`,
              ),
            );
          }
          return acc;
        }, []);
        onData(validItems);
      },
      onError,
    );
  }

  /**
   * Retrieves all documents from the collection that match the query constraints.
   * Validates the data against the schema before returning.
   */
  async function getAll(
    queryConstraints: QueryConstraint[] = [],
  ): Promise<DataWithId<T>[]> {
    try {
      const q = query(collectionRef, ...queryConstraints);
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(docToItem);
      return z.array(schemaWithId).parse(items) as z.infer<T>[];
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Data validation failed: ${error.message}`);
      }
      throw new FirestoreOperationError("getAll", (error as Error).message);
    }
  }

  /**
   * Adds a new document to the collection.
   * Validates the data against the schema before adding.
   */
  async function add(data: z.infer<T>): Promise<string> {
    try {
      const validData = schema.parse(data) as z.infer<T>;
      const docRef = doc(collectionRef);
      await setDoc(docRef, validData);
      return docRef.id;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Data validation failed: ${error.message}`);
      }
      throw new FirestoreOperationError("add", (error as Error).message);
    }
  }

  /**
   * Updates an existing document in the collection.
   * Validates the partial data against the schema before updating.
   */
  async function update(id: string, data: PartialData<T>): Promise<void> {
    try {
      const validData = makeSchemaPartial(schema).parse(data) as z.infer<T>;
      await updateDoc(doc(collectionRef, id), validData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError(`Data validation failed: ${error.message}`);
      }
      throw new FirestoreOperationError("update", (error as Error).message);
    }
  }

  /**
   * Removes a document from the collection by its ID.
   */
  async function remove(id: string): Promise<void> {
    try {
      await deleteDoc(doc(collectionRef, id));
    } catch (error) {
      throw new FirestoreOperationError("remove", (error as Error).message);
    }
  }

  function docToItem(doc: DocumentData): DataWithId<T> {
    return { id: doc.id, ...doc.data() };
  }

  return {
    subscribe,
    getAll,
    add,
    update,
    remove,
  };
}
