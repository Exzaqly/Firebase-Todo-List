import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import {
  getDownloadURL,
  getMetadata,
  list,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { FileData, TaskType } from '../redux/tasksReducer'

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
  uploadFile: async (id: string, file: Blob) => {
    const fileRef = ref(storage, `task${id}/${file.name}`)
    await uploadBytes(fileRef, file)
  },
  getFiles: async (id: string) => {
    const folderRef = ref(storage, `task${id}`)
    const firstPage = await list(folderRef)
    const files = [] as FileData[]
    firstPage.items.forEach((file) => {
      const fileData = {} as FileData
      getMetadata(file).then((metadata) => {
        fileData.name = metadata.name
      })
      getDownloadURL(file).then((url) => {
        fileData.url = url
      })
      files.push(fileData)
    })
    return files
  },
}
