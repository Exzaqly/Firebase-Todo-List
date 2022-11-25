import { FC, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dispatch, TaskType } from '../../redux/tasksReducer'
import { getTasksSelector } from '../../redux/selectors'
import { Task } from './Task'

export const Tasks: FC = () => {
  const tasks = useSelector(getTasksSelector)
  return (
    <div>
      <div>
        {tasks.map((t: TaskType) => (
          <Task
            key={t.id}
            title={t.title}
            text={t.text}
            endDate={t.endDate}
            isComplete={t.isComplete}
            id={t.id}
            files={t.files}
          />
        ))}
      </div>
    </div>
  )
}
