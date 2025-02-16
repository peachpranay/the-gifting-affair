"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { createUserDocument } from '@/utils/userService';
import { useAuth } from '@/contexts/AuthContext';

const AuthPage = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user]);

  if (user) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        // First create the authentication user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Then create the user document in Firestore
        try {
          await createUserDocument(userCredential.user.uid, {
            firstName,
            lastName,
            email,
            phoneNumber,
            shippingAddress: {
              street,
              city,
              state,
              postalCode: postalCode,
            },
          });
          
          router.push('/profile');
        } catch (firestoreError) {
          console.error('Error creating user document:', firestoreError);
          setError('Failed to create user profile. Please try again.');
        }
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      try {
        // Always try to create/update the user document
        await createUserDocument(result.user.uid, {
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ')[1] || '',
          email: result.user.email || '',
          phoneNumber: result.user.phoneNumber || '',
          shippingAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
          },
        });
        
        router.push('/profile');
      } catch (firestoreError) {
        console.error('Error creating user document:', firestoreError);
        setError('Failed to create user profile. Please try again.');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-semibold mb-6 font-alegreya text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
            </div>
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          
          {!isLogin && (
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-2 border rounded"
                required={!isLogin}
              />
              
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-2 border rounded"
                  required={!isLogin}
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 border rounded"
                    required={!isLogin}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2 border rounded"
                    required={!isLogin}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-2 border rounded"
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-bg4 text-white py-2 rounded hover:bg-bg4/90"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-4 flex items-center justify-center gap-2 border border-gray-300 p-2 rounded hover:bg-gray-50"
        >
          <img src="\images\google-icon.png" alt="Google" className="w-5 h-5" />
          Continue with Google
        </button>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-bg4 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
          </button>
        </div>

        <button
          onClick={() => router.push('/')}  // Changed from router.back()
          className="mt-4 text-gray-500 hover:underline text-sm w-full text-center"
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
};

export default AuthPage;