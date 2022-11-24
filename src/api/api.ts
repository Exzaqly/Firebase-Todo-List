import { collection, getDocs, setDoc, doc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { ref, uploadBytes } from 'firebase/storage'
import { TaskType } from '../redux/tasksReducer'

export const tasksAPI = {
  getTasks: async () => {
    const response = await getDocs(collection(db, 'tasks'))
    let tasks = [] as TaskType[]
    response.forEach((data) => {
      tasks = { ...data.data().tasks }
    })
    return tasks
  },
  setTasks: async (newTasks: TaskType[]) => {
    await setDoc(doc(db, 'tasks', 'zkL2OHilsjfVs4SB0Uas'), {
      tasks: newTasks,
    })
  },
  uploadFile: async (id: number, file: File) => {
    const fileRef = ref(storage, `task${id}/${file.name}`)
    await uploadBytes(fileRef, file)
  },
}
