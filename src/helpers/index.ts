import dayjs from 'dayjs';


/**
 * Return true if task has expired, otherwise return false
 * @param {string} endDate Task end date
 */
export const isTaskExpired = (endDate: string) => {
    return +dayjs(endDate, 'DD.MM.YYYY').endOf('date') < +dayjs();
}