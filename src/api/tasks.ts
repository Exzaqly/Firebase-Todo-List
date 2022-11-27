import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db, storage } from '../firebase'
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage'
import { EditData, FileData, TaskType } from '../redux/tasksReducer'
import { v4 } from 'uuid'

export class TasksAPI {
  /**
   * Get tasks
   * @returns {TaskType[]} - Tasks array
   */
  static async getTasks() {
    const response = await getDocs(
      query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
    )

    return response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TaskType[]
  }

  /**
   * Add task
   * @param {Omit<TaskType, 'id'>} newTask - New task data.
   * @returns {React.ReactElement}
   */
  static async addTask(newTask: Omit<TaskType, 'id'>) {
    const response = await addDoc(collection(db, 'tasks'), newTask)

    return response.id
  }

  /**
   * * Edit task
   * @param {EditData} EditData - Edited task data.
   */
  static async editTask({ id, ...rest }: EditData) {
    await updateDoc(doc(db, 'tasks', id), rest)
  }

  /**
   * * Toggle complete
   * @param {TaskType['id']}  id - task id
   * @param {TaskType['isComplete']} value - isComplete task value
   */
  static async toggleComplete(
    id: TaskType['id'],
    value: TaskType['isComplete']
  ) {
    await updateDoc(doc(db, 'tasks', id), { isComplete: value })
  }

  /**
   * * Delete task
   * @param {TaskType['id']}  id - task id
   */
  static async deleteTask(id: TaskType['id']) {
    await deleteDoc(doc(db, 'tasks', id))

    const filesRef = ref(storage, `task${id}`)
    const results = await listAll(filesRef)
    await Promise.all(results.items.map((file) => deleteObject(file)))
  }

  /**
   * * Upload file
   * @param {TaskType['id'] }  taskId - task id
   * @param {Blob} file - uploaded task file
   * @returns {FileData}
   */
  static async uploadFile(taskId: TaskType[`id`], file: Blob) {
    const fileId = `${v4()}-${file.name}`
    const fileRef = ref(storage, `task${taskId}/${fileId}`)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)

    const fileItem = { id: fileId, name: file.name, url }
    await updateDoc(doc(db, 'tasks', taskId), { files: arrayUnion(fileItem) })

    return fileItem
  }

  /**
   * * Delete file
   * @param {TaskType['id'] }  taskId - task id
   * @param {FileData} file - task file data to delete
   */
  static async deleteFile(taskId: TaskType[`id`], file: FileData) {
    const fileRef = ref(storage, `task${taskId}/${file.id}`)
    await deleteObject(fileRef)
    await updateDoc(doc(db, 'tasks', taskId), { files: arrayRemove(file) })
  }
}
