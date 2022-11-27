import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TaskType } from '../../redux/tasksReducer'
import styles from './ModalForm.module.less'
import dayjs from 'dayjs'

const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

/**
 * ModalForm component
 * @param {Props} props - Props.
 * @returns {React.ReactElement}
 */
export const ModalForm: FC<Props> = ({
  endDateValue,
  handleAccept,
  titleValue,
  modalTitle,
  textValue,
  onModalClose,
  id,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskType>()

  const handleCancel = () => {
    onModalClose()
    reset()
  }

  const handleAcceptCallback: SubmitHandler<TaskType> = (data) => {
    if (id) {
      data.id = id
    }

    data.endDate = dayjs(data.endDate).format('DD.MM.YYYY')
    handleAccept(data)
    onModalClose()
    reset()
  }

  return (
    <div className={styles.modal} onClick={onModalClose}>
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
                value: titleValue ?? '',
              })}
              placeholder={'title'}
            />
          </div>
          <div>
            <textarea
              {...register('text', {
                value: textValue ?? '',
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
                required: {
                  value: true,
                  message: 'This field is required',
                },
                pattern: {
                  value: /^[^0]\d{3}-\d{2}-\d{2}$/,
                  message: 'Date is invalid',
                },
                value: endDateValue
                  ? dayjs(endDateValue, 'DD.MM.YYYY').format('YYYY-MM-DD')
                  : '',
              })}
              type={'date'}
            />
            {errors?.endDate?.message && (
              <p className={styles.error}>{errors.endDate.message}</p>
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
  onModalClose: () => void
  modalTitle: string
  titleValue?: string
  textValue?: string
  endDateValue?: string
  id?: string
}
