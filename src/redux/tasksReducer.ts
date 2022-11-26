import { AppStateType, BaseThunk, InferActionsType } from './store'
import { ThunkDispatch } from 'redux-thunk'
import { TasksAPI } from '../api/api'
import { EditData } from '../components/Tasks/Task'

const ADD_TASK = 'tasks/ADD_TASK'
const DELETE_TASK = 'tasks/DELETE_TASK'
const TOGGLE_COMPLETE = 'tasks/TOGGLE_COMPLETE'
const EDIT_TASK = 'tasks/EDIT_TASK'
const SET_TASKS = 'tasks/SET_TASKS'
const ADD_FILE = 'tasks/ADD_FILE'
const DELETE_FILE = 'tasks/DELETE_FILE'

let initialState = {
  tasks: [] as TaskType[],
}

const tasksReducer = (
  state = initialState,
  action: Actions
): initialStateType => {
  switch (action.type) {
    case ADD_TASK: {
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      }
    }
    case DELETE_TASK: {
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload.taskId),
      }
    }
    case TOGGLE_COMPLETE: {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id === action.payload.taskId) {
            return {
              ...t,
              isComplete: action.payload.value
            }
          }
          return t
        }),
      }
    }
    case EDIT_TASK: {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id === action.payload.taskId) {
            return {
              ...t,
              title: action.payload.title,
              text: action.payload.text,
              endDate: action.payload.endDate
            }
          }
          return t
        }),
      }
    }
    case SET_TASKS: {
      return {
        ...state,
        tasks: [...Object.values(action.payload)],
      }
    }
    case ADD_FILE: {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id === action.payload.taskId) {
            return {
              ...t,
              files: [...t.files, action.payload.file]
            }
          }
          return t
        }),
      }
    }
    case DELETE_FILE: {
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id === action.payload.taskId) {
            return {
              ...t,
              files: t.files.filter(f => f.id !== action.payload.fileId)
            }
          }
          return t
        }),
      }
    }
    default:
      return state
  }
}

export const actions = {
  addTask: (task: TaskType) => ({ type: ADD_TASK, payload: task } as const),
  deleteTask: (taskId: string) =>
    ({ type: DELETE_TASK, payload: { taskId } } as const),
  toggleComplete: (taskId: string, value: boolean) =>
    ({ type: TOGGLE_COMPLETE, payload: { taskId, value } } as const),
  editTask: (taskId: string, title: string, text: string, endDate: string) =>
    ({
      type: EDIT_TASK,
      payload: { taskId, title, text, endDate: endDate },
    } as const),
  setTasks: (tasks: TaskType[]) =>
    ({ type: SET_TASKS, payload: tasks } as const),
  addFile: (file: FileData, taskId: string) =>
      ({ type: ADD_FILE, payload: { file, taskId } } as const),
  deleteFile: (fileId: string, taskId: string) =>
      ({ type: DELETE_FILE, payload: { fileId, taskId } } as const),
}

export const addTask =
  (task: Omit<TaskType, 'id'>): Thunk =>
  async (dispatch) => {
    try {
      const newTask = {
        ...task,
        createdAt: Date.now(),
        isComplete: false,
        files: [],
      }
      const id = await TasksAPI.addTask(newTask);
      
      dispatch(actions.addTask({ id, ...newTask }));
    } catch (e) {
      alert('failed to add task ' + e)
    }
  }
export const editTask =
  (task: EditData): Thunk =>
  async (dispatch) => {
    try {
      dispatch(actions.editTask(task.id, task.title, task.text, task.endDate))
      await TasksAPI.editTask(task);
    } catch (e) {
      alert('failed to edit task ' + e)
    }
  }
export const deleteTask =
  (taskId: string): Thunk =>
  async (dispatch) => {
    try {
      dispatch(actions.deleteTask(taskId))
      await TasksAPI.deleteTask(taskId);
    } catch (e) {
      alert('failed to delete task ' + e)
    }
  }
export const toggleComplete =
  (taskId: string, value: boolean): Thunk =>
  async (dispatch) => {
    try {
      dispatch(actions.toggleComplete(taskId, value))
      await TasksAPI.toggleComplete(taskId, value);
    } catch (e) {
      alert('failed to toggle complete task ' + e)
    }
  }
export const getTasks = (): Thunk => async (dispatch) => {
  try {
    const tasks = await TasksAPI.getTasks()
    dispatch(actions.setTasks(tasks))
  } catch (e) {
    alert('failed to load tasks ' + e)
  }
}
export const uploadFile =
  (taskId: string, file: Blob): Thunk =>
  async (dispatch) => {
    try {
      const newFile = await TasksAPI.uploadFile(taskId, file)
      dispatch(actions.addFile(newFile, taskId))
    } catch (e) {
      alert('failed to upload file ' + e)
    }
  }
export const deleteFile =
    (taskId: string, file: FileData): Thunk =>
        async (dispatch) => {
          try {
            dispatch(actions.deleteFile(file.id, taskId))
            await TasksAPI.deleteFile(taskId, file)
          } catch (e) {
            alert('failed to delete file ' + e)
          }
        }

export default tasksReducer
type Thunk = BaseThunk<Actions, void>
type initialStateType = typeof initialState
type Actions = InferActionsType<typeof actions>
export type Dispatch = ThunkDispatch<AppStateType, any, Actions>

export type NewTask = {
  title: string
  text: string
  endDate: string
}

export type TaskType = {
  title: string
  text: string
  endDate: string
  isComplete: boolean
  createdAt: number;
  id: string
  files: FileData[]
}

export type FileData = {
  id: string;
  name: string
  url: string
}
