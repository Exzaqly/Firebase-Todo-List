import { FC, useState } from 'react'
import { ModalForm } from '../Modal/ModalForm'
import styles from './Header.module.less'
import { useDispatch } from 'react-redux'
import { addTask, Dispatch, NewTask } from '../../redux/tasksReducer'
import dayjs from 'dayjs'

export const Header: FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const dispatch: Dispatch = useDispatch()

  const showModal = () => {
    setIsAddModalOpen(true)
  }

  const handleAddTask = (data: any) => {
    dispatch(addTask(data))
  }

  return (
    <div className={styles.headerContainer}>
      <button onClick={showModal}>Add Task</button>
      {isAddModalOpen && (
        <ModalForm
          handleAccept={handleAddTask}
          modalTitle={'Add task: '}
          setIsModalOpen={setIsAddModalOpen}
        />
      )}
    </div>
  )
}
