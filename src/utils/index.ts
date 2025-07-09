import dayjs from "dayjs";

export const allDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const allDayValues = allDays.map((day) => day.toLowerCase());

export const getDayNameByIndex = (index: number) => {
  return allDays[index];
};

export const getDayValueByIndex = (index: number) => {
  return allDayValues[index];
};

export const getQueueOptions = (totalBarbers: number) => {
  return Array(totalBarbers)
    .fill(null)
    .map((_, index) => index + 1);
};

export const getDayIndexByValue = (value: string) => {
  return allDayValues.indexOf(value);
};
export const getDayIndexByName = (value: string) => {
  return allDays.indexOf(value);
};

export const getToday = () => dayjs().format("YYYY-MM-DD");
