import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  addDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { FIRESTORE_COLLECTIONS } from '../config/firestoreSchema';

// User Profile Services
export const userService = {
  // Get user profile
  async getUserProfile(uid) {
    try {
      const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        return { id: userSnap.id, ...userSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateUserProfile(uid, updates) {
    try {
      const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },

  // Update user preferences
  async updateUserPreferences(uid, preferences) {
    try {
      const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        preferences: preferences,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },

  // Track user login
  async updateLastLogin(uid) {
    try {
      const userRef = doc(db, FIRESTORE_COLLECTIONS.USERS, uid);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }
};

// Watchlist Services
export const watchlistService = {
  // Get user's watchlists
  async getUserWatchlists(uid) {
    try {
      const q = query(
        collection(db, FIRESTORE_COLLECTIONS.WATCHLISTS),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const watchlists = [];
      
      querySnapshot.forEach((doc) => {
        watchlists.push({ id: doc.id, ...doc.data() });
      });
      
      return watchlists;
    } catch (error) {
      console.error('Error getting user watchlists:', error);
      throw error;
    }
  },

  // Create new watchlist
  async createWatchlist(uid, watchlistData) {
    try {
      const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.WATCHLISTS), {
        userId: uid,
        ...watchlistData,
        stocks: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating watchlist:', error);
      throw error;
    }
  },

  // Add stock to watchlist
  async addStockToWatchlist(watchlistId, stockData) {
    try {
      const watchlistRef = doc(db, FIRESTORE_COLLECTIONS.WATCHLISTS, watchlistId);
      await updateDoc(watchlistRef, {
        stocks: arrayUnion({
          ...stockData,
          addedAt: serverTimestamp()
        }),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error adding stock to watchlist:', error);
      throw error;
    }
  },

  // Remove stock from watchlist
  async removeStockFromWatchlist(watchlistId, stockSymbol) {
    try {
      const watchlistRef = doc(db, FIRESTORE_COLLECTIONS.WATCHLISTS, watchlistId);
      const watchlistDoc = await getDoc(watchlistRef);
      
      if (watchlistDoc.exists()) {
        const currentStocks = watchlistDoc.data().stocks || [];
        const updatedStocks = currentStocks.filter(stock => stock.symbol !== stockSymbol);
        
        await updateDoc(watchlistRef, {
          stocks: updatedStocks,
          updatedAt: serverTimestamp()
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error removing stock from watchlist:', error);
      throw error;
    }
  },

  // Delete watchlist
  async deleteWatchlist(watchlistId) {
    try {
      const watchlistRef = doc(db, FIRESTORE_COLLECTIONS.WATCHLISTS, watchlistId);
      await deleteDoc(watchlistRef);
      return true;
    } catch (error) {
      console.error('Error deleting watchlist:', error);
      throw error;
    }
  }
};

// Stock Data Services
export const stockDataService = {
  // Get stock data from cache
  async getStockData(symbol) {
    try {
      const stockRef = doc(db, FIRESTORE_COLLECTIONS.STOCK_DATA, symbol.toUpperCase());
      const stockSnap = await getDoc(stockRef);
      
      if (stockSnap.exists()) {
        return { id: stockSnap.id, ...stockSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting stock data:', error);
      throw error;
    }
  },

  // Get multiple stocks data
  async getMultipleStocksData(symbols) {
    try {
      const stockPromises = symbols.map(symbol => this.getStockData(symbol));
      const results = await Promise.all(stockPromises);
      
      return results.filter(stock => stock !== null);
    } catch (error) {
      console.error('Error getting multiple stocks data:', error);
      throw error;
    }
  },

  // Cache stock data (typically called by cloud functions)
  async cacheStockData(symbol, stockData) {
    try {
      const stockRef = doc(db, FIRESTORE_COLLECTIONS.STOCK_DATA, symbol.toUpperCase());
      await setDoc(stockRef, {
        ...stockData,
        lastUpdated: serverTimestamp()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error caching stock data:', error);
      throw error;
    }
  }
};

// Report Services
export const reportService = {
  // Get user's reports
  async getUserReports(uid, limitCount = 20) {
    try {
      const q = query(
        collection(db, FIRESTORE_COLLECTIONS.REPORTS),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const reports = [];
      
      querySnapshot.forEach((doc) => {
        reports.push({ id: doc.id, ...doc.data() });
      });
      
      return reports;
    } catch (error) {
      console.error('Error getting user reports:', error);
      throw error;
    }
  },

  // Save AI-generated report
  async saveReport(uid, reportData) {
    try {
      const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.REPORTS), {
        userId: uid,
        ...reportData,
        createdAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error saving report:', error);
      throw error;
    }
  },

  // Get specific report
  async getReport(reportId) {
    try {
      const reportRef = doc(db, FIRESTORE_COLLECTIONS.REPORTS, reportId);
      const reportSnap = await getDoc(reportRef);
      
      if (reportSnap.exists()) {
        return { id: reportSnap.id, ...reportSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting report:', error);
      throw error;
    }
  },

  // Update report feedback
  async updateReportFeedback(reportId, feedback) {
    try {
      const reportRef = doc(db, FIRESTORE_COLLECTIONS.REPORTS, reportId);
      await updateDoc(reportRef, {
        userFeedback: feedback,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating report feedback:', error);
      throw error;
    }
  }
};

// Portfolio Services
export const portfolioService = {
  // Get user's portfolios
  async getUserPortfolios(uid) {
    try {
      const q = query(
        collection(db, FIRESTORE_COLLECTIONS.PORTFOLIOS),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const portfolios = [];
      
      querySnapshot.forEach((doc) => {
        portfolios.push({ id: doc.id, ...doc.data() });
      });
      
      return portfolios;
    } catch (error) {
      console.error('Error getting user portfolios:', error);
      throw error;
    }
  },

  // Create new portfolio
  async createPortfolio(uid, portfolioData) {
    try {
      const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.PORTFOLIOS), {
        userId: uid,
        ...portfolioData,
        holdings: [],
        analytics: {
          totalValue: 0,
          totalCost: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          sectorAllocation: {}
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  },

  // Add holding to portfolio
  async addHolding(portfolioId, holdingData) {
    try {
      const portfolioRef = doc(db, FIRESTORE_COLLECTIONS.PORTFOLIOS, portfolioId);
      await updateDoc(portfolioRef, {
        holdings: arrayUnion({
          ...holdingData,
          purchaseDates: [{
            date: serverTimestamp(),
            quantity: holdingData.quantity,
            price: holdingData.averageCost
          }]
        }),
        updatedAt: serverTimestamp()
      });
      
      return true;
    } catch (error) {
      console.error('Error adding holding to portfolio:', error);
      throw error;
    }
  }
};

// Sector Analytics Services
export const sectorAnalyticsService = {
  // Get sector analytics
  async getSectorAnalytics(sector) {
    try {
      const sectorRef = doc(db, FIRESTORE_COLLECTIONS.SECTOR_ANALYTICS, sector.toLowerCase());
      const sectorSnap = await getDoc(sectorRef);
      
      if (sectorSnap.exists()) {
        return { id: sectorSnap.id, ...sectorSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting sector analytics:', error);
      throw error;
    }
  },

  // Get all sectors analytics
  async getAllSectorAnalytics() {
    try {
      const q = query(collection(db, FIRESTORE_COLLECTIONS.SECTOR_ANALYTICS));
      const querySnapshot = await getDocs(q);
      const sectors = [];
      
      querySnapshot.forEach((doc) => {
        sectors.push({ id: doc.id, ...doc.data() });
      });
      
      return sectors;
    } catch (error) {
      console.error('Error getting all sector analytics:', error);
      throw error;
    }
  }
};

// Batch operations for better performance
export const batchService = {
  // Get user's complete data (profile, watchlists, recent reports)
  async getUserCompleteData(uid) {
    try {
      const [userProfile, watchlists, reports, portfolios] = await Promise.all([
        userService.getUserProfile(uid),
        watchlistService.getUserWatchlists(uid),
        reportService.getUserReports(uid, 10),
        portfolioService.getUserPortfolios(uid)
      ]);
      
      return {
        profile: userProfile,
        watchlists,
        reports,
        portfolios
      };
    } catch (error) {
      console.error('Error getting user complete data:', error);
      throw error;
    }
  },

  // Get dashboard data (user data + sector analytics)
  async getDashboardData(uid, selectedSector) {
    try {
      const [userData, sectorAnalytics] = await Promise.all([
        this.getUserCompleteData(uid),
        sectorAnalyticsService.getSectorAnalytics(selectedSector)
      ]);
      
      return {
        ...userData,
        sectorAnalytics
      };
    } catch (error) {
      console.error('Error getting dashboard data:', error);
      throw error;
    }
  }
};