import dayjs from "dayjs";
import { IAddBarber } from "./validationSchema";

export const defaultValues: IAddBarber = {
  allDays: {
    startTime: dayjs().startOf("day").toISOString(),
    endTime: dayjs().startOf("day").toISOString(),
    breakStartTime: dayjs().startOf("day").toISOString(),
    breakEndTime: dayjs().startOf("day").toISOString(),
  },
  days: Array(7).fill({
    breakDayIndex: -1, // for break day index
    active: false,
    startTime: dayjs().startOf("day").toISOString(),
    endTime: dayjs().startOf("day").toISOString(),

    breakActive: false,
    breakStartTime: dayjs().startOf("day").toISOString(),
    breakEndTime: dayjs().startOf("day").toISOString(),
    // queue number
    queueNumber: 0,
  }),
  shopOpeningTime: dayjs().startOf("day").toISOString(),
  shopClosingTime: dayjs().startOf("day").toISOString(),
  fullName: "",
  gender: "Male",
  nickName: "",
  phone: "",
  email: "",
  specification: "",
  profileDescription: "",
  password: "",
  confirmPassword: "",
  services: [],
  allowSchedule: false,
};
