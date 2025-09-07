import React, { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Auto logout configuration
  const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes
  const WARNING_TIMEOUT = 2.5 * 60 * 1000; // 2.5 minutes (30 seconds before logout)
  const inactivityTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const [isWarningShown, setIsWarningShown] = useState(false);

  // Auto logout functions
  const resetInactivityTimer = useCallback(() => {
    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
    }
    
    // Close any open warning dialogs
    if (isWarningShown) {
      Swal.close();
      setIsWarningShown(false);
    }

    // Only set timers if user is logged in
    if (currentUser) {
      // Set warning timer (2.5 minutes)
      warningTimerRef.current = setTimeout(() => {
        showInactivityWarning();
      }, WARNING_TIMEOUT);

      // Set logout timer (3 minutes)
      inactivityTimerRef.current = setTimeout(() => {
        handleAutoLogout();
      }, INACTIVITY_TIMEOUT);
    }
  }, [currentUser, isWarningShown]);

  const showInactivityWarning = () => {
    if (!currentUser || isWarningShown) return;
    
    setIsWarningShown(true);
    let timerInterval;
    
    Swal.fire({
      title: 'Session Timeout Warning',
      icon: 'warning',
      html: `
        <div style="text-align: center;">
          <p style="margin-bottom: 20px;">You will be logged out due to inactivity in:</p>
          <div style="font-size: 48px; font-weight: bold; color: #ef4444; margin: 20px 0;">
            <span id="countdown">30</span>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Click "Stay Logged In" to continue your session
          </p>
        </div>
      `,
      confirmButtonText: 'Stay Logged In',
      confirmButtonColor: '#3b82f6',
      showCancelButton: true,
      cancelButtonText: 'Logout Now',
      cancelButtonColor: '#ef4444',
      allowOutsideClick: false,
      allowEscapeKey: false,
      timer: 30000,
      timerProgressBar: true,
      didOpen: () => {
        const countdownEl = Swal.getPopup().querySelector('#countdown');
        let countdown = 30;
        
        timerInterval = setInterval(() => {
          countdown--;
          if (countdownEl) {
            countdownEl.textContent = countdown;
          }
          
          if (countdown <= 0) {
            clearInterval(timerInterval);
          }
        }, 1000);
      },
      willClose: () => {
        clearInterval(timerInterval);
        setIsWarningShown(false);
      }
    }).then((result) => {
      setIsWarningShown(false);
      
      if (result.isConfirmed) {
        // User chose to stay logged in
        resetInactivityTimer();
        
        // Show success toast
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
        
        Toast.fire({
          icon: 'success',
          title: 'Session extended successfully!'
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose to logout now
        handleAutoLogout();
      } else {
        // Timer expired - auto logout
        handleAutoLogout();
      }
    });
  };

  const handleAutoLogout = async () => {
    try {
      // Clear timers
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
      
      // Close any open dialogs
      Swal.close();
      setIsWarningShown(false);

      // Sign out user
      await signOut(auth);

      // Show logout notification
      Swal.fire({
        title: 'Session Expired',
        text: 'You have been logged out due to inactivity for security reasons.',
        icon: 'info',
        confirmButtonText: 'Login Again',
        confirmButtonColor: '#3b82f6',
        allowOutsideClick: false,
        allowEscapeKey: false
      }).then(() => {
        // Redirect handled by auth state change
        window.location.reload();
      });
    } catch (error) {
      console.error('Auto logout error:', error);
    }
  };

  // Activity event listeners
  useEffect(() => {
    if (!currentUser) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      resetInactivityTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Initial timer setup
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
      
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
      }
    };
  }, [currentUser, resetInactivityTimer]);

  // Sign up function
  const signup = async (userData) => {
    try {
      setError('');
      // Create user account
      const { user } = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );

      // Update display name
      await updateProfile(user, {
        displayName: userData.fullName
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        fullName: userData.fullName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        employeeId: userData.employeeId,
        jobTitle: userData.jobTitle,
        department: userData.department,
        facilityName: userData.facilityName,
        facilityType: userData.facilityType,
        userRole: userData.userRole,
        licenseNumber: userData.licenseNumber || '',
        trainingStatus: userData.trainingStatus || false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        lastLogin: new Date().toISOString()
      }, { merge: true });

      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Password reset function
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setCurrentUser({ ...user, profile });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};