import { ChangeEvent, FC, useEffect, useState } from 'react'
import {
  deleteTask,
  Dispatch,
  editTask,
  TaskType,
  toggleComplete,
  uploadFile,
} from '../../redux/tasksReducer'
import { useDispatch } from 'react-redux'
import styles from './Tasks.module.less'
import cn from 'classnames'
import { ModalForm } from '../Modal/ModalForm'
import dayjs from 'dayjs'

export const Task: FC<Omit<TaskType, 'createdAt'>> = ({
  title,
  text,
  endDate,
  isComplete,
  id,
  files,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isExpired, setIsExpired] = useState(
    dayjs(endDate, 'DD.MM.YYYY').valueOf() < getTimestamp(new Date())
  )
  const dispatch: Dispatch = useDispatch()

  function getTimestamp(date: Date) {
    return dayjs(dayjs(date).format('DD.MM.YYYY'), 'DD.MM.YYYY').valueOf()
  }

  useEffect(() => {
    setIsExpired(
      dayjs(endDate, 'DD.MM.YYYY').valueOf() < getTimestamp(new Date())
    )

    if (isExpired) return

    const timeout = setTimeout(
      () => setIsExpired(true),
      dayjs(endDate, 'DD.MM.YYYY').valueOf() - getTimestamp(new Date())
    )
    return () => clearTimeout(timeout)
  }, [endDate])

  const taskDelete = (taskId: string) => {
    dispatch(deleteTask(taskId))
  }
  const completeToggle = (taskId: string) => {
    dispatch(toggleComplete(taskId, !isComplete))
  }

  const showModal = () => {
    setIsEditModalOpen(true)
  }

  const handleSubmit = (data: EditData) => {
    dispatch(editTask(data))
    setIsEditModalOpen(false)
  }

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files[0]) {
      dispatch(uploadFile(id, e.target.files[0]))
      // @ts-ignore reset file input
      e.target.value = null;
    }
  }

  /*  const buttonStyle = {
    marginBottom: '5px',
    width: '120px',
  }*/

  return (
    <div
      className={cn(
        { [styles.complete]: isComplete, [styles.expired]: isExpired },
        styles.task
      )}
    >
      <div className={styles.titleContainer}>
        <h2>{title}</h2>
        <span>{endDate}</span>
      </div>
      <div className={styles.textContainer}>
        <div>
          <p>{text}</p>
        </div>
        <div>
          <div>
            {files?.map((f, index) => (
                <a key={f.id} href={f.url}>
                  {f.name}
                </a>
            ))}
          </div>
          <div>
            <input
              type="file"
              onChange={onFileInputChange}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        {<button
            onClick={() => {
              completeToggle(id)
            }}
        >
          {isComplete ? 'Complete' : 'Active'}
        </button>}
        <button onClick={showModal}> Edit</button>
        <button
          onClick={() => {
            taskDelete(id)
          }}
        >
          Delete{' '}
        </button>
      </div>
      {isEditModalOpen && (
        <ModalForm
          handleAccept={handleSubmit}
          setIsModalOpen={setIsEditModalOpen}
          modalTitle={'Edit task: '}
          titleValue={title}
          textValue={text}
          endDateValue={endDate}
          id={id}
        />
      )}
    </div>
  )
}

export type EditData = {
  id: string
  title: string
  text: string
  endDate: string
}
