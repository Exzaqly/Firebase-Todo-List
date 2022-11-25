import { FC, useEffect, useState } from 'react'
import {
  deleteTask,
  Dispatch,
  editTask,
  FileData,
  TaskType,
  toggleComplete,
  UploadFile,
} from '../../redux/tasksReducer'
import { useDispatch } from 'react-redux'
import styles from './Tasks.module.less'
import cn from 'classnames'
import { ModalForm } from '../Modal/ModalForm'
import dayjs from 'dayjs'

export const Task: FC<TaskType> = ({
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
  const [filesData, setFilesData] = useState<FileData[]>(files)
  const dispatch: Dispatch = useDispatch()

  function getTimestamp(date: Date) {
    return dayjs(dayjs(date).format('DD.MM.YYYY'), 'DD.MM.YYYY').valueOf()
  }
  useEffect(() => {
    setFilesData(files)
    console.log(filesData)
  }, [files])

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
    dispatch(toggleComplete(taskId))
  }

  const showModal = () => {
    setIsEditModalOpen(true)
  }

  const handleSubmit = (data: EditData) => {
    dispatch(editTask(data))
    setIsEditModalOpen(false)
  }

  const uploadFile = (file: Blob) => {
    dispatch(UploadFile(id, file))
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
            {filesData?.map((f, index) => (
              <a key={index} href={f.url}>
                {f.name}
              </a>
            ))}
          </div>
          <div>
            <input
              type="file"
              onChange={(event) => {
                if (event.target.files !== null && event.target.files[0]) {
                  uploadFile(event.target.files[0])
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        {isComplete ? (
          <button
            onClick={() => {
              completeToggle(id)
            }}
          >
            Complete
          </button>
        ) : (
          <button
            onClick={() => {
              completeToggle(id)
            }}
          >
            Active
          </button>
        )}
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
