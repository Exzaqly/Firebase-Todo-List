import { FC, useState } from 'react'
import { ModalForm } from '../Modal/ModalForm'
import styles from './Header.module.less'
import { useDispatch } from 'react-redux'
import { addTask, Dispatch, TaskType } from '../../redux/tasksReducer'
import { SubmitHandler } from 'react-hook-form'

/**
 * Header component
 * @returns {React.ReactElement}
 */
export const Header: FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const dispatch: Dispatch = useDispatch()

  const showModal = () => {
    setIsAddModalOpen(true)
  }

  const handleAddTask: SubmitHandler<TaskType> = (data) => {
    dispatch(addTask(data))
  }

  return (
    <div className={styles.headerContainer}>
      <button onClick={showModal}>Add Task</button>
      {isAddModalOpen && (
        <ModalForm
          handleAccept={handleAddTask}
          modalTitle={'Add task: '}
          onModalClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  )
}
