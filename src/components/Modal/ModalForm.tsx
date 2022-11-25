import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TaskType } from '../../redux/tasksReducer'
import styles from './ModalForm.module.less'
import dayjs from 'dayjs'
import { Simulate } from 'react-dom/test-utils'
import error = Simulate.error
import { tasksAPI } from '../../api/api'

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
  } = useForm<any>()

  const handleCancel = () => {
    setIsModalOpen(false)
    reset()
  }

  const handleAcceptCallback = (data: any) => {
    if (id) {
      data.id = id
    }
    data.endDate = dayjs(data.endDate).format('DD.MM.YYYY')
    console.log(data)
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
                  ? dayjs(endDateValue).format('YYYY-DD-MM')
                  : '',
              })}
              type={'date'}
            />
            {errors?.endDate?.type === 'required' && (
              <p className={styles.error}>This field is required</p>
            )}
          </div>
          <div>
            <input className={styles.input} type="file" />
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
