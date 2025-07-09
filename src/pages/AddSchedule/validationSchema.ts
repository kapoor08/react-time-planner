import * as Yup from "yup";
import dayjs from "dayjs";

const timeValidation = (value: string) => dayjs(value).isValid();

const validationSchema = Yup.object().shape(
  {
    fullName: Yup.string()
      .required("Full Name is required!")
      .matches(/^[A-Za-z\s]+$/, "Only characters are allowed in Full Name"),
    nickName: Yup.string().required("Display Name is required!"),
    email: Yup.string()
      .required("Email is required!")
      .matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Email is invalid!"
      ),
    phone: Yup.string().required("Mobile Number is required!"),
    gender: Yup.string().when("active", {
      is: true,
      then: (schema) => schema.required("Gender is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    specification: Yup.string().required("Specification is required!"),
    profileDescription: Yup.string().required(
      "Profile Description is required!"
    ),
    password: Yup.string()
      .optional()
      .when("password", (value) => {
        if (value === undefined || value.length === 0) {
          return Yup.string().nullable().optional();
        } else {
          return Yup.string()
            .min(8, "Password must be at least 8 characters")
            .matches(/[a-z]/, "At least one lowercase character!")
            .matches(/[A-Z]/, "At least one uppercase character!")
            .matches(
              /[a-zA-Z]+[^a-zA-Z\s]+/,
              "At least 1 number or special character (@, !, #, etc)!"
            );
        }
      }),

    confirmPassword: Yup.string()
      .optional()
      .when("password", (password, schema) => {
        if (password === undefined || password.length === 0) {
          return Yup.string().nullable().optional();
        } else {
          return schema
            .oneOf([Yup.ref("password")], "Passwords must match")
            .min(8, "Password must be at least 8 characters")
            .matches(/[a-z]/, "At least one lowercase character!")
            .matches(/[A-Z]/, "At least one uppercase character!")
            .matches(
              /[a-zA-Z]+[^a-zA-Z\s]+/,
              "At least 1 number or special character (@, !, #, etc)!"
            );
        }
      }),
    services: Yup.array()
      .of(
        Yup.object().shape({
          value: Yup.string().required("Service name is required"),
          label: Yup.string().required("Service ID is required"),
        })
      )
      .min(1, "At least one service must be selected")
      .required("Services is required!"),
    serviceTime: Yup.array().of(
      Yup.string().required("Service time is required")
    ),
    shopOpeningTime: Yup.string(),
    shopClosingTime: Yup.string(),
    allowSchedule: Yup.boolean(),
    allDays: Yup.object().shape({
      startTime: Yup.string()
        .required("Start time is required")
        .test("is-time", "Invalid time", timeValidation),
      endTime: Yup.string()
        .required("End time is required")
        .test("is-time", "Invalid time", timeValidation),

      breakStartTime: Yup.string(),
      breakEndTime: Yup.string(),
    }),
    days: Yup.array()
      .of(
        Yup.object().shape({
          active: Yup.boolean(),
          startTime: Yup.string().when("active", {
            is: true,
            then: (schema) =>
              schema
                .required("Start time is required")
                .test("is-time", "Invalid time", timeValidation),
            otherwise: (schema) => schema.notRequired(),
          }),
          endTime: Yup.string().when("active", {
            is: true,
            then: (schema) =>
              schema
                .required("End time is required")
                .test("is-time", "Invalid time", timeValidation),
            otherwise: (schema) => schema.notRequired(),
          }),
          queueNumber: Yup.number().when("active", {
            is: true,
            then: (schema) =>
              schema
                .required("Queue number is required")
                .typeError("Queue number must be a number")
                // .positive("Queue number must be greater than 0")
                .integer("Queue number must be an integer"),
            otherwise: (schema) => schema.notRequired(),
          }),
          breakActive: Yup.boolean(),
          breakStartTime: Yup.string().when("breakActive", {
            is: true,
            then: (schema) =>
              schema
                .required("Break start time is required")
                .test("is-time", "Invalid time", timeValidation)
                .test(
                  "break-start-within-shift",
                  "Break start time must be within shift time",
                  function (value) {
                    const { startTime, endTime, active } = this.parent;
                    // in case day row is not selected, the break start time should not be validated
                    if (!active) return true;
                    const start = dayjs(startTime);
                    const end = dayjs(endTime);
                    const breakStart = dayjs(value);

                    // start - 08:00 AM, end - 05:00 PM, breakStart - 01:00 PM

                    return (
                      breakStart.isValid() &&
                      (start.isSame(breakStart) ||
                        start.isBefore(breakStart)) &&
                      (end.isSame(breakStart) || end.isAfter(breakStart))
                    );
                  }
                ),
            otherwise: (schema) => schema.notRequired(),
          }),
          breakEndTime: Yup.string().when("breakActive", {
            is: true,
            then: (schema) =>
              schema
                .required("Break end time is required")
                .test("is-time", "Invalid time", timeValidation)
                .test(
                  "break-end-after-start",
                  "Break end time must be after break start time",
                  function (value) {
                    const { breakStartTime, active } = this.parent;
                    // in case day row is not selected, the break end time time should not be validated
                    if (!active) return true;
                    return dayjs(value).isAfter(dayjs(breakStartTime));
                  }
                )
                .test(
                  "break-end-within-shift",
                  "Break end time must be within shift time",
                  function (value) {
                    const { startTime, endTime, active } = this.parent;
                    // in case day row is not selected, the break end time should not be validated
                    if (!active) return true;

                    const start = dayjs(startTime);
                    const end = dayjs(endTime);
                    const breakEnd = dayjs(value);

                    // start - 08:00 AM, end - 05:00 PM, breakStart - 01:00 PM

                    return (
                      breakEnd.isValid() &&
                      (start.isSame(breakEnd) || start.isBefore(breakEnd)) &&
                      (end.isSame(breakEnd) || end.isAfter(breakEnd))
                    );
                  }
                ),
            otherwise: (schema) => schema.notRequired(),
          }),
        })
      )
      .required(),
  },
  [
    ["password", "password"],
    ["confirmPassword", "confirmPassword"],
  ]
);

export default validationSchema;

type IAddBarber = Yup.InferType<typeof validationSchema>;

export type IDay = IAddBarber["days"][0] & { breakDayIndex: number };

export type { IAddBarber };
