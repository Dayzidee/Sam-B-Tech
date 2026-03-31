import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  Timestamp,
  serverTimestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Enterprise CRUD Service Factory
 * Provides a standardized way to interact with Firestore collections
 */

export interface BaseDocument {
  id?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const createFirestoreService = <T extends BaseDocument>(collectionName: string) => {
  const colRef = collection(db, collectionName);

  return {
    // Get all documents in collection
    getAll: async () => {
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },

    // Get document by ID (uses getDoc for reliability)
    getById: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as T;
    },

    // Create new document
    create: async (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(colRef, docData);
      return { id: docRef.id, ...docData } as unknown as T;
    },

    // Update existing document
    update: async (id: string, data: Partial<T>) => {
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      await updateDoc(docRef, updateData);
      return { id, ...updateData } as unknown as T;
    },

    // Get documents by field filter
    getWhere: async (field: string, operator: any, value: any) => {
      const q = query(colRef, where(field, operator, value));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },

    // Get recent documents (sorted by createdAt desc, limited)
    getRecent: async (count: number = 5) => {
      const q = query(colRef, orderBy('createdAt', 'desc'), limit(count));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    },

    // Get count of documents (optionally filtered)
    getCount: async (field?: string, operator?: any, value?: any) => {
      let q;
      if (field && operator !== undefined && value !== undefined) {
        q = query(colRef, where(field, operator, value));
      } else {
        q = query(colRef);
      }
      const snapshot = await getDocs(q);
      return snapshot.size;
    },

    // Delete document
    delete: async (id: string) => {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return id;
    }
  };
};

// === INTERFACES ===

export interface Product extends BaseDocument {
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  category: string;
  condition: 'Brand New' | 'UK Used' | 'Refurbished' | 'Pre-owned';
  images: string[];
  colors?: string[];
  storage?: string[];
  batteryHealth?: string;
  specs: {
    display: string;
    chip: string;
    camera: string;
    os: string;
  };
}

export interface ServiceRequest extends BaseDocument {
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  deviceModel: string;
  deviceDetails?: {
    storage?: string;
    color?: string;
    batteryHealth?: string;
    condition?: string;
    imei?: string;
  };
  issue?: string;
  type: 'repair' | 'trade-in';
  status: 'pending' | 'in-progress' | 'valuation' | 'offer-sent' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  urgency?: 'low' | 'medium' | 'high';
  estimatedValue?: number;
  repairCost?: number;
  notes?: string;
  adminResponse?: string;
  images?: string[];
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

export interface Order extends BaseDocument {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  vat: number;
  total: number;
  fulfillmentMethod: 'delivery' | 'pickup';
  paymentMethod: 'card' | 'transfer' | 'pod' | 'whatsapp';
  orderSource: 'web' | 'whatsapp';
  status: 'Processing' | 'Shipped' | 'In Transit' | 'Delivered' | 'Cancelled';
}

// Self-contained deal — acts like a full product entry tagged to a sales category
export interface Deal extends BaseDocument {
  // Product-like fields
  productName: string;
  description: string;
  originalPrice: number;
  dealPrice: number;
  image: string;
  images: string[];
  category: string;
  condition: string;
  stock: number;
  colors?: string[];
  storage?: string[];
  specs?: {
    display?: string;
    chip?: string;
    camera?: string;
    os?: string;
  };
  // Deal-specific fields
  section: 'flash-sales' | 'hot-deals' | 'power-bundles' | 'last-chance';
  status: 'Active' | 'Scheduled' | 'Expired';
  endDate: string;
  // Legacy compat
  productId?: string;
}

export interface DealCategory extends BaseDocument {
  label: string;
  icon: string;
}

export interface UserProfile extends BaseDocument {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  isAdmin: boolean;
  favourites?: string[];
}

export interface Review extends BaseDocument {
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
}

// === SERVICE INSTANCES ===

export const ProductService = createFirestoreService<Product>('products');
export const RepairService = createFirestoreService<ServiceRequest>('service_requests');
export const AppSettingsService = createFirestoreService<BaseDocument>('app_settings');
export const OrderService = createFirestoreService<Order>('orders');
export const DealService = createFirestoreService<Deal>('deals');
export const DealCategoryService = createFirestoreService<DealCategory>('deal_categories');
export const UserService = createFirestoreService<UserProfile>('users');
export const ReviewService = createFirestoreService<Review>('reviews');
