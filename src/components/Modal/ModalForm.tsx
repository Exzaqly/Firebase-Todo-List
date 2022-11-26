import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TaskType } from '../../redux/tasksReducer'
import styles from './ModalForm.module.less'
import dayjs from 'dayjs'

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

export const ModalForm: FC<Props> = ({
  endDateValue,
  handleAccept,
  titleValue,
  modalTitle,
  textValue,
  setIsModalOpen,
  id,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskType>()

  const handleCancel = () => {
    setIsModalOpen(false)
    reset()
  }

  const handleAcceptCallback: SubmitHandler<TaskType> = (data) => {
    if (id) {
      data.id = id
    }

    data.endDate = dayjs(data.endDate).format('DD.MM.YYYY')
    handleAccept(data)
    setIsModalOpen(false)
    reset()
  }

  return (
    <div
      className={styles.modal}
      onClick={() => {
        setIsModalOpen(false)
      }}
    >
      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()}
      >
        <form>
          <h2>{modalTitle}</h2>
          <div>
            <input
              className={styles.input}
              {...register('title', {
                value: titleValue ? titleValue : '',
              })}
              placeholder={'title'}
            />
          </div>
          <div>
            <textarea
              {...register('text', {
                value: textValue ? textValue : '',
              })}
              placeholder={'task'}
              className={styles.textarea}
            />
          </div>
          <div>
            <label htmlFor="date">Expire date</label>
            <input
              className={styles.input_date}
              {...register('endDate', {
                required: true,
                value: endDateValue
                  ? dayjs(endDateValue, 'DD.MM.YYYY').format('YYYY-MM-DD')
                  : '',
              })}
              type={'date'}
            />
            {errors?.endDate?.type === 'required' && (
              <p className={styles.error}>This field is required</p>
            )}
          </div>
          <button type={'submit'} onClick={handleSubmit(handleAcceptCallback)}>
            Accept
          </button>
          <button onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </div>
  )
}

type Props = {
  handleAccept: SubmitHandler<TaskType>
  setIsModalOpen: (value: boolean) => void
  modalTitle: string
  titleValue?: string
  textValue?: string
  endDateValue?: string
  id?: string
}
