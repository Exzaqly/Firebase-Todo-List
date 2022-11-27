import { ChangeEvent, FC, useEffect, useState } from 'react'
import {
  deleteFile,
  deleteTask,
  Dispatch,
  EditData,
  editTask,
  FileData,
  TaskType,
  toggleComplete,
  uploadFile,
} from '../../redux/tasksReducer'
import { useDispatch } from 'react-redux'
import styles from './Tasks.module.less'
import cn from 'classnames'
import { ModalForm } from '../Modal/ModalForm'
import dayjs from 'dayjs'
import { isTaskExpired } from '../../helpers'

/**
 * Task component
 * @param {Omit<TaskType, 'createdAt'>} props - Props.
 * @returns {React.ReactElement}
 */
export const Task: FC<Omit<TaskType, 'createdAt'>> = ({
  title,
  text,
  endDate,
  isComplete,
  id,
  files,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpired, setIsExpired] = useState(isTaskExpired(endDate))
  const dispatch: Dispatch = useDispatch()

  useEffect(() => {
    setIsExpired(isTaskExpired(endDate))
    if (isExpired) return

    const timeout = setTimeout(
      () => setIsExpired(true),
      dayjs(endDate, 'DD.MM.YYYY').endOf('date').diff(dayjs())
    )
    return () => clearTimeout(timeout)
  }, [endDate])

  const handleTaskDelete = () => {
    dispatch(deleteTask(id))
  }

  const handleCompleteToggle = () => {
    dispatch(toggleComplete(id, !isComplete))
  }

  const handleFileDelete = (file: FileData) => {
    dispatch(deleteFile(id, file))
  }

  const handleSubmit = (data: EditData) => {
    dispatch(editTask(data))
    setIsModalOpen(false)
  }

  const onFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null && e.target.files[0]) {
      dispatch(uploadFile(id, e.target.files[0]))
      // @ts-ignore reset file input
      e.target.value = null
    }
  }

  return (
    <div
      className={cn(
        {
          [styles.complete]: isComplete,
          [styles.expired]: !isComplete && isExpired,
        },
        styles.task
      )}
    >
      <div className={styles.titleContainer}>
        <h2>{title}</h2>
        <span>{dayjs(endDate, 'DD.MM.YYYY').format('MMMM D, YYYY')}</span>
      </div>
      <div className={styles.textContainer}>
        <div className={styles.text}>
          <p>{text}</p>
        </div>
        <div className={styles.files}>
          <div className={styles.files_block}>
            {files?.map((f) => (
              <div className={styles.file} key={f.id}>
                <a href={f.url} download={f.url}>
                  {f.name}
                </a>
                <button
                  className={styles.files_delete}
                  onClick={() => {
                    handleFileDelete(f)
                  }}
                >
                  &#10006;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <label className={styles.input_file}>
          <input onChange={onFileInputChange} type="file" name="file" />
          <span>Select file</span>
        </label>
        {
          <button className={styles.button} onClick={handleCompleteToggle}>
            {isComplete ? 'Completed' : 'Active'}
          </button>
        }
        <button className={styles.button} onClick={() => setIsModalOpen(true)}>
          {' '}
          Edit
        </button>
        <button className={styles.button} onClick={handleTaskDelete}>
          Delete{' '}
        </button>
      </div>
      {isModalOpen && (
        <ModalForm
          handleAccept={handleSubmit}
          onModalClose={() => setIsModalOpen(false)}
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
