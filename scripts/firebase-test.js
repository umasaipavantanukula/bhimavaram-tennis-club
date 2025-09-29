// Firebase Connection Test Script
// Run this in the browser console to test Firebase connectivity

console.log('🔥 Firebase Connection Test Starting...')

// Test Firebase initialization
import { auth, db, storage } from '@/lib/firebase'

console.log('📋 Firebase Services Status:')
console.log('Auth:', auth ? '✅ Initialized' : '❌ Not initialized')
console.log('Firestore:', db ? '✅ Initialized' : '❌ Not initialized')
console.log('Storage:', storage ? '✅ Initialized' : '❌ Not initialized')

// Test storage bucket access
if (storage) {
  import('firebase/storage').then(({ ref, getDownloadURL }) => {
    try {
      const testRef = ref(storage, 'test-connection')
      console.log('🔗 Storage Reference Created:', testRef.bucket)
      console.log('🌐 Storage Host:', testRef.root.bucket)
      console.log('✅ Storage connectivity test passed')
    } catch (error) {
      console.error('❌ Storage test failed:', error)
    }
  })
}

// Test Firestore connection
if (db) {
  import('firebase/firestore').then(({ collection, getDocs, limit, query }) => {
    try {
      const testQuery = query(collection(db, 'gallery'), limit(1))
      getDocs(testQuery)
        .then(() => console.log('✅ Firestore connectivity test passed'))
        .catch(error => console.error('❌ Firestore test failed:', error))
    } catch (error) {
      console.error('❌ Firestore test setup failed:', error)
    }
  })
}

console.log('🏁 Firebase Connection Test Complete')
console.log('💡 Check the messages above for any issues')
console.log('📖 If you see CORS errors, follow the setup guide in FIREBASE_SETUP.md')