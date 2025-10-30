import { adminDb } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  downloadLink?: string;
  createdAt: Date;
};

export type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  customerPhone?: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  total: number;
  status: 'pending' | 'confirmed' | 'rejected';
  receiptImageUrl?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Purchase = {
  id: string;
  orderId: string;
  customerEmail: string;
  productId: string;
  productTitle: string;
  downloadLink?: string;
  purchasedAt: Date;
};

export type Settings = {
  id: string;
  ccpNumber: string;
  ccpName: string;
  updatedAt: Date;
};

const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp.toDate) return timestamp.toDate();
  if (timestamp._seconds) return new Date(timestamp._seconds * 1000);
  return new Date(timestamp);
};

export const firestoreService = {
  products: {
    async getAll(): Promise<Product[]> {
      const snapshot = await adminDb.collection('products').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt)
      } as Product));
    },

    async getById(id: string): Promise<Product | null> {
      const doc = await adminDb.collection('products').doc(id).get();
      if (!doc.exists) return null;
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data()?.createdAt)
      } as Product;
    },

    async create(product: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
      const docRef = await adminDb.collection('products').add({
        ...product,
        createdAt: FieldValue.serverTimestamp()
      });
      return docRef.id;
    },

    async update(id: string, product: Partial<Product>): Promise<void> {
      const { createdAt, id: _, ...updateData } = product as any;
      await adminDb.collection('products').doc(id).update(updateData);
    },

    async delete(id: string): Promise<void> {
      await adminDb.collection('products').doc(id).delete();
    }
  },

  orders: {
    async getAll(): Promise<Order[]> {
      const snapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      } as Order));
    },

    async getById(id: string): Promise<Order | null> {
      const doc = await adminDb.collection('orders').doc(id).get();
      if (!doc.exists) return null;
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: convertTimestamp(data?.createdAt),
        updatedAt: convertTimestamp(data?.updatedAt)
      } as Order;
    },

    async getByEmail(email: string): Promise<Order[]> {
      const snapshot = await adminDb.collection('orders')
        .where('customerEmail', '==', email)
        .orderBy('createdAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      } as Order));
    },

    async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
      const now = FieldValue.serverTimestamp();
      const docRef = await adminDb.collection('orders').add({
        ...order,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    },

    async update(id: string, order: Partial<Order>): Promise<void> {
      const { createdAt, updatedAt, id: _, ...updateData } = order as any;
      await adminDb.collection('orders').doc(id).update({
        ...updateData,
        updatedAt: FieldValue.serverTimestamp()
      });
    },

    async delete(id: string): Promise<void> {
      await adminDb.collection('orders').doc(id).delete();
    },

    async deleteOldOrders(daysOld: number = 7): Promise<number> {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const snapshot = await adminDb.collection('orders')
        .where('createdAt', '<', cutoffDate)
        .get();
      
      const batch = adminDb.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      return snapshot.size;
    }
  },

  purchases: {
    async getAll(): Promise<Purchase[]> {
      const snapshot = await adminDb.collection('purchases').orderBy('purchasedAt', 'desc').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        purchasedAt: convertTimestamp(doc.data().purchasedAt)
      } as Purchase));
    },

    async getByEmail(email: string): Promise<Purchase[]> {
      const snapshot = await adminDb.collection('purchases')
        .where('customerEmail', '==', email)
        .orderBy('purchasedAt', 'desc')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        purchasedAt: convertTimestamp(doc.data().purchasedAt)
      } as Purchase));
    },

    async create(purchase: Omit<Purchase, 'id' | 'purchasedAt'>): Promise<string> {
      const docRef = await adminDb.collection('purchases').add({
        ...purchase,
        purchasedAt: FieldValue.serverTimestamp()
      });
      return docRef.id;
    }
  },

  settings: {
    async get(): Promise<Settings | null> {
      const snapshot = await adminDb.collection('settings').limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        updatedAt: convertTimestamp(doc.data().updatedAt)
      } as Settings;
    },

    async createOrUpdate(settings: Omit<Settings, 'id' | 'updatedAt'>): Promise<void> {
      const snapshot = await adminDb.collection('settings').limit(1).get();
      
      if (snapshot.empty) {
        await adminDb.collection('settings').add({
          ...settings,
          updatedAt: FieldValue.serverTimestamp()
        });
      } else {
        await adminDb.collection('settings').doc(snapshot.docs[0].id).update({
          ...settings,
          updatedAt: FieldValue.serverTimestamp()
        });
      }
    }
  }
};
