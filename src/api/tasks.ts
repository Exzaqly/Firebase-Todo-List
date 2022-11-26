import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  query,
} from 'firebase/firestore'
import { db, storage } from '../firebase'
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
  listAll,
} from 'firebase/storage'
import { EditData, FileData, TaskType } from '../redux/tasksReducer'
import { v4 } from 'uuid'

export class TasksAPI {
  static async getTasks() {
    const response = await getDocs(
      query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
    )

    return response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TaskType[]
  }

  static async addTask(newTask: Omit<TaskType, 'id'>) {
    const response = await addDoc(collection(db, 'tasks'), newTask)

    return response.id
  }

  static async editTask({ id, ...rest }: EditData) {
    await updateDoc(doc(db, 'tasks', id), rest)
  }

  static async toggleComplete(
    id: TaskType['id'],
    value: TaskType['isComplete']
  ) {
    await updateDoc(doc(db, 'tasks', id), { isComplete: value })
  }

  static async deleteTask(id: TaskType['id']) {
    await deleteDoc(doc(db, 'tasks', id))

    const filesRef = ref(storage, `task${id}`)
    const results = await listAll(filesRef)
    await Promise.all(results.items.map((file) => deleteObject(file)))
  }

  static async uploadFile(taskId: string, file: Blob) {
    const fileId = `${v4()}-${file.name}`
    const fileRef = ref(storage, `task${taskId}/${fileId}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)

    const fileItem = { id: fileId, name: file.name, url }
    await updateDoc(doc(db, 'tasks', taskId), { files: arrayUnion(fileItem) })

    return fileItem
  }

  static async deleteFile(taskId: string, file: FileData) {
    const fileRef = ref(storage, `task${taskId}/${file.id}`)
    await deleteObject(fileRef)
    await updateDoc(doc(db, 'tasks', taskId), { files: arrayRemove(file) })
  }
}
