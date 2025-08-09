/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DocumentSnapshot,
  FieldValue,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  query as firestoreQuery,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  setDoc,
  startAfter,
  updateDoc,
  where,
  type DocumentData,
  type OrderByDirection,
  type WhereFilterOp,
} from "firebase/firestore";

import initFirebase from "./initFirebase";
import type { Order } from "@/types/Orders";
import type { Product } from "@/types/Product";
import type { Shop } from "@/types/Shop";

initFirebase();

type FirestoreCollectionPaths = {
  "weblinnk-orders": Order;
  "weblinnk-products": Product;
  "weblinnk-shop": Shop;
  "weblinnk-showcase": "";
};

const getById = async <T extends keyof FirestoreCollectionPaths>(
  collectionPath: T,
  recordId: string
) => {
  const db = getFirestore();
  const docRef = doc(db, collectionPath, recordId);
  const result = await getDoc(docRef);
  if (result.exists()) {
    return {
      id: result.id,
      ...(result.data() as FirestoreCollectionPaths[T]),
    };
  }
};

type WhereClause<T extends keyof FirestoreCollectionPaths> = [
  Extract<keyof Omit<FirestoreCollectionPaths[T], "id">, string>,
  WhereFilterOp,
  any
];
type OrderByClause<T> = [Extract<T, string>, OrderByDirection?];

async function queryAll<T extends keyof FirestoreCollectionPaths>({
  collection: collectionPath,
  where: whereClause = [],
  orderBy: orderByClause,
  limit: limitClause = 1000,
}: {
  collection: T;
  where?: WhereClause<T>[] | WhereClause<T>;
  orderBy?: OrderByClause<keyof Omit<FirestoreCollectionPaths[T], "id">>;
  limit?: number;
}) {
  const db = getFirestore();
  if (isSingleWhereClause(whereClause)) {
    whereClause = [whereClause];
  }

  const optionalQueryOptions = [
    ...whereClause.map((w) => where(...w)),
    orderByClause ? orderBy(...orderByClause) : undefined,
  ].filter(isNotUndefined);

  const q = firestoreQuery(
    collection(db, collectionPath),
    ...optionalQueryOptions,
    limit(limitClause)
  );

  const result = await getDocs(q);
  return result.docs.map((item) => ({
    ...item.data(),
    id: item.id,
  }));
}

async function query<T extends keyof FirestoreCollectionPaths>({
  collection: collectionPath,
  where: whereClause = [],
  orderBy: orderByClause,
  limit: limitClause = 1000,
  startAfterDoc,
}: {
  collection: T;
  where?: WhereClause<T>[] | WhereClause<T>;
  orderBy?: OrderByClause<keyof Omit<FirestoreCollectionPaths[T], "id">>;
  limit?: number;
  startAfterDoc?: DocumentSnapshot<DocumentData>; // new addition
}) {
  const db = getFirestore();
  if (isSingleWhereClause(whereClause)) {
    whereClause = [whereClause];
  }

  const optionalQueryOptions = [
    ...whereClause.map((w) => where(...w)),
    orderByClause ? orderBy(...orderByClause) : undefined,
    startAfterDoc ? startAfter(startAfterDoc) : undefined, // new
    limit(limitClause),
  ].filter(isNotUndefined);

  const q = firestoreQuery(
    collection(db, collectionPath),
    ...optionalQueryOptions
  );

  const result = await getDocs(q);
  return {
    data: result.docs.map((item) => ({
      ...item.data(),
      id: item.id,
    })),
    lastDoc: result.docs[result.docs.length - 1], // return lastDoc
  };
}

function isNotUndefined<T>(val: T | undefined): val is T {
  return !!val;
}

function isSingleWhereClause(
  whereClause: WhereClause<any> | WhereClause<any>[]
): whereClause is WhereClause<any> {
  return whereClause.length > 0 && !Array.isArray(whereClause[0]);
}

// server timestamps must be Firestore Fieldvalues
type TimestampToFieldValue<T> = {
  [K in keyof T]: T[K] extends Timestamp ? FieldValue : T[K];
};

const addItem = async <T extends keyof FirestoreCollectionPaths>(
  collectionPath: T,
  item: TimestampToFieldValue<Omit<FirestoreCollectionPaths[T], "id">>
) => {
  const firestore = getFirestore();
  const result = await addDoc(collection(firestore, collectionPath), item);

  return result; // as FirestoreCollectionPaths[T]
};

const addItemById = async <T extends keyof FirestoreCollectionPaths>(
  collectionPath: T,
  itemId: string,
  item: TimestampToFieldValue<Omit<FirestoreCollectionPaths[T], "id">>
) => {
  const firestore = getFirestore();
  const result = await setDoc(doc(firestore, collectionPath, itemId), item);

  return result;
};

const updateItem = async <T extends keyof FirestoreCollectionPaths>(
  collectionPath: T,
  itemId: string,
  item: Partial<TimestampToFieldValue<Omit<FirestoreCollectionPaths[T], "id">>>
) => {
  const firestore = getFirestore();
  return await updateDoc(doc(firestore, collectionPath, itemId), item);
};

const deleteItem = async <T extends keyof FirestoreCollectionPaths>(
  collectionPath: T,
  itemId: string
) => {
  const firestore = getFirestore();
  return await deleteDoc(doc(firestore, collectionPath, itemId));
};

const db = {
  getById,
  query,
  addItem,
  updateItem,
  deleteItem,
  addItemById,
  queryAll,
};

export default db;
