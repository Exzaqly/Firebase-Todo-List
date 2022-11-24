import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyAo0a_d4xwwgSMWIMIzBiolmE6nQbxRcuE',
  authDomain: 'fir-todo-list-933b8.firebaseapp.com',
  projectId: 'fir-todo-list-933b8',
  storageBucket: 'fir-todo-list-933b8.appspot.com',
  messagingSenderId: '455695945127',
  appId: '1:455695945127:web:316d070dbdf14374df7a82',
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)

export { db }
export { storage }
