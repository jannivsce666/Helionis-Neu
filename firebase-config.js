// Firebase Configuration for Helionis Website
// Replace these values with your actual Firebase project configuration

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlQFqmGGBIrttrC6Ids-bppFpeOOfWXVU",
    authDomain: "helionis.firebaseapp.com",
    databaseURL: "https://helionis-default-rtdb.firebaseio.com",
    projectId: "helionis",
    storageBucket: "helionis.firebasestorage.app",
    messagingSenderId: "112789846576",
    appId: "1:112789846576:web:5a8049942a7c559ca98bf5",
    measurementId: "G-8W0GMB0F73"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();
const analytics = firebase.analytics();

// Configure Auth providers
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Firestore settings
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

// Enable offline persistence
db.enablePersistence().catch((err) => {
    if (err.code == 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
        console.warn('The current browser does not support all features required for persistence.');
    }
});

// Export Firebase services for use in other modules
window.firebase = firebase;
window.firebaseAuth = auth;
window.firebaseDb = db;
window.firebaseStorage = storage;
window.firebaseAnalytics = analytics;
window.googleProvider = googleProvider;

console.log('Firebase configuration loaded');

// Auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
    console.log('User authenticated:', user.email);
        
        // Update user profile in Firestore
        const userRef = db.collection('users').doc(user.uid);
        userRef.set({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            uid: user.uid
        }, { merge: true });
        
        // Track login event
        analytics.logEvent('login', {
            method: user.providerData[0]?.providerId || 'email'
        });
        
    } else {
    console.log('User not authenticated');
    }
});

// Error handling
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Log errors to Firebase if in production
    if (window.location.hostname !== 'localhost' && analytics) {
        analytics.logEvent('exception', {
            description: event.reason.message || 'Unknown error',
            fatal: false
        });
    }
});

// Firestore data models
const DataModels = {
    // User profile structure
    User: {
        uid: '',
        email: '',
        displayName: '',
        firstName: '',
        lastName: '',
        photoURL: '',
        birthDate: null,
        birthTime: '',
        birthPlace: '',
        zodiacSign: '',
        preferences: {
            newsletter: true,
            moonCalendar: true,
            smsNotifications: false,
            emailNotifications: true
        },
        createdAt: null,
        lastLogin: null
    },
    
    // Order structure
    Order: {
        id: '',
        userId: '',
        items: [],
        totals: {
            subtotal: 0,
            discount: 0,
            shipping: 0,
            total: 0
        },
        customer: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            postalCode: '',
            city: '',
            country: ''
        },
        payment: {
            method: '',
            status: 'pending'
        },
        status: 'pending',
        createdAt: null,
        updatedAt: null
    },
    
    // Product structure
    Product: {
        id: '',
        name: '',
        description: '',
        price: 0,
        category: '',
        images: [],
        inStock: true,
        stockQuantity: 0,
        weight: 0,
        dimensions: {
            length: 0,
            width: 0,
            height: 0
        },
        materials: [],
        energyProperties: [],
        tags: [],
        rating: 0,
        reviewCount: 0,
        createdAt: null,
        updatedAt: null
    },
    
    // Horoscope structure
    Horoscope: {
        id: '',
        userId: '',
        type: '', // 'daily', 'monthly', 'yearly', 'spiritual'
        zodiacSign: '',
        content: '',
        predictions: {
            love: '',
            career: '',
            health: '',
            money: '',
            spiritual: ''
        },
        validFrom: null,
        validTo: null,
        createdAt: null
    }
};

// Firestore helper functions
const FirestoreHelpers = {
    // Save user profile
    async saveUserProfile(userId, profileData) {
        try {
            const userRef = db.collection('users').doc(userId);
            await userRef.set({
                ...profileData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            return { success: true };
        } catch (error) {
            console.error('Error saving user profile:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get user profile
    async getUserProfile(userId) {
        try {
            const userDoc = await db.collection('users').doc(userId).get();
            if (userDoc.exists) {
                return { success: true, data: userDoc.data() };
            } else {
                return { success: false, error: 'User not found' };
            }
        } catch (error) {
            console.error('Error getting user profile:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Save order
    async saveOrder(orderData) {
        try {
            const orderRef = await db.collection('orders').add({
                ...orderData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Track purchase event
            analytics.logEvent('purchase', {
                transaction_id: orderRef.id,
                value: orderData.totals.total,
                currency: 'EUR',
                items: orderData.items.map(item => ({
                    item_id: item.id,
                    item_name: item.product.name,
                    item_category: item.product.category,
                    quantity: item.quantity,
                    price: item.product.price
                }))
            });
            
            return { success: true, orderId: orderRef.id };
        } catch (error) {
            console.error('Error saving order:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get user orders
    async getUserOrders(userId) {
        try {
            const ordersSnapshot = await db.collection('orders')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            const orders = ordersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return { success: true, data: orders };
        } catch (error) {
            console.error('Error getting user orders:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Save horoscope
    async saveHoroscope(horoscopeData) {
        try {
            const horoscopeRef = await db.collection('horoscopes').add({
                ...horoscopeData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true, horoscopeId: horoscopeRef.id };
        } catch (error) {
            console.error('Error saving horoscope:', error);
            return { success: false, error: error.message };
        }
    },
    
    // Get user horoscopes
    async getUserHoroscopes(userId) {
        try {
            const horoscopesSnapshot = await db.collection('horoscopes')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            const horoscopes = horoscopesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return { success: true, data: horoscopes };
        } catch (error) {
            console.error('Error getting user horoscopes:', error);
            return { success: false, error: error.message };
        }
    }
};

// Export for use in other modules
window.FirebaseConfig = firebaseConfig;
window.DataModels = DataModels;
window.FirestoreHelpers = FirestoreHelpers;