import { AppStateType } from './store'

export const getTasksSelector = (state: AppStateType) => state.task.tasks
