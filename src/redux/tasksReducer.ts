import { AppStateType, BaseThunk, InferActionsType } from './store'
import { ThunkDispatch } from 'redux-thunk'
import { tasksAPI } from '../api/api'
import { EditData } from '../components/Tasks/Task'

const ADD_TASK = 'tasks/ADD_TASK'
const DELETE_TASK = 'tasks/DELETE_TASK'
const TOGGLE_COMPLETE = 'tasks/TOGGLE_COMPLETE'
const EDIT_TASK = 'tasks/EDIT_TASK'
const SET_TASKS = 'tasks/SET_TASKS'

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
        tasks: [...state.tasks, action.payload],
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
            t.isComplete = !t.isComplete
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
            t.title = action.payload.title
            t.text = action.payload.text
            t.endDate = action.payload.endDate
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
    default:
      return state
  }
}

export const actions = {
  addTask: (task: TaskType) => ({ type: ADD_TASK, payload: task } as const),
  deleteTask: (taskId: number) =>
    ({ type: DELETE_TASK, payload: { taskId } } as const),
  toggleComplete: (taskId: number) =>
    ({ type: TOGGLE_COMPLETE, payload: { taskId } } as const),
  editTask: (taskId: number, title: string, text: string, endDate: string) =>
    ({
      type: EDIT_TASK,
      payload: { taskId, title, text, endDate: endDate },
    } as const),
  setTasks: (tasks: TaskType[]) =>
    ({ type: SET_TASKS, payload: tasks } as const),
}

export const addTask =
  (task: any): Thunk =>
  async (dispatch, getState) => {
    const newTask = {
      ...task,
      id: getState().task.tasks.length + 1,
      isComplete: false,
    }
    try {
      await tasksAPI.uploadFile(newTask.id, task.files)
      dispatch(actions.addTask(newTask))

      await tasksAPI.setTasks(getState().task.tasks)
    } catch (e) {
      alert('failed to upload tasks ' + e)
    }
  }
export const editTask =
  (task: EditData): Thunk =>
  async (dispatch, getState) => {
    try {
      dispatch(actions.editTask(task.id, task.title, task.text, task.endDate))
      await tasksAPI.setTasks(getState().task.tasks)
    } catch (e) {
      alert('failed to upload tasks ' + e)
    }
  }
export const deleteTask =
  (taskId: number): Thunk =>
  async (dispatch, getState) => {
    try {
      dispatch(actions.deleteTask(taskId))
      await tasksAPI.setTasks(getState().task.tasks)
    } catch (e) {
      alert('failed to upload tasks ' + e)
    }
  }
export const toggleComplete =
  (taskId: number): Thunk =>
  async (dispatch, getState) => {
    try {
      dispatch(actions.toggleComplete(taskId))
      await tasksAPI.setTasks(getState().task.tasks)
    } catch (e) {
      alert('failed to upload tasks ' + e)
    }
  }
export const getTasks = (): Thunk => async (dispatch, getState) => {
  try {
    const tasks = await tasksAPI.getTasks()
    dispatch(actions.setTasks(tasks))
  } catch (e) {
    alert('failed to load tasks ' + e)
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
  id: number
}