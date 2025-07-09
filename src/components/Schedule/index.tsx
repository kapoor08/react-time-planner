import { useCallback, useMemo } from "react";
import dayjs from "dayjs";
import {
  useFieldArray,
  Controller,
  useWatch,
  useFormContext,
} from "react-hook-form";
import {
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormLabel,
  RadioGroup,
  Radio,
  Typography,
  FormHelperText,
  Paper,
  Grid,
  Chip,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { allDays, getDayNameByIndex, getQueueOptions } from "@/utils";
import { cn } from "@/lib/cn";
import { IAddBarber, IDay } from "@/pages/AddSchedule/validationSchema";
import { IQueueAvailable } from "./util";

const totalBarbers = 4;
const queueOptions = getQueueOptions(totalBarbers);

interface IProps {
  defaultValues: IAddBarber;
  queueAvailable: Record<string, IQueueAvailable>;
  setQueueAvailable: React.Dispatch<
    React.SetStateAction<Record<string, IQueueAvailable>>
  >;
  onSubmit: (data: IAddBarber) => void;
  loading?: boolean;
}

const Schedule = ({
  defaultValues,
  queueAvailable,
  setQueueAvailable,
}: IProps) => {
  const {
    control,
    setValue,
    watch,
    formState: { errors: formErrors },
    getValues,
    trigger,
  } = useFormContext();
  const allowSchedule = watch("allowSchedule");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = formErrors as any;

  const { fields } = useFieldArray({
    control,
    name: "days",
  });

  const days: IDay[] = useWatch({
    control,
    name: "days",
    defaultValue: defaultValues.days,
  });

  const activeScheduleDays: IDay[] = useMemo(
    () => days.filter((day) => day.active),
    [days]
  );

  const activeBreakDays = useMemo(
    () => days.filter((day) => day.breakActive),
    [days]
  );

  const validateForm = useCallback(async () => {
    // re-trigger validation
    await trigger();
  }, [trigger]);

  const setApplyScheduleToAllDays = useCallback(
    (apply: boolean) => {
      const {
        allDays: { startTime, endTime },
      } = getValues();
      if (apply) {
        fields.forEach((_: unknown, index: number) => {
          setValue(`days.${index}.active`, true);
          setValue(`days.${index}.startTime`, startTime);
          setValue(`days.${index}.endTime`, endTime);
        });
      } else {
        fields.forEach((_: unknown, index: number) => {
          setValue(`days.${index}.active`, false);
        });
      }
    },
    [fields, setValue, getValues]
  );

  // this method is for start time and end time for all days
  const setApplyScheduleToSelectedDays = useCallback(
    ({
      startTime,
      endTime,
    }: {
      startTime: string | undefined;
      endTime: string | undefined;
    }) => {
      days.forEach((day, index) => {
        if (day.active) {
          setValue(`days.${index}.active`, true);
          setValue(`days.${index}.startTime`, startTime);
          setValue(`days.${index}.endTime`, endTime);
        }
      });
    },
    [days, setValue]
  );

  // this method is for break time for selected days
  const setApplyBreakTimeToSelectedDays = useCallback(
    ({
      breakStartTime,
      breakEndTime,
    }: {
      breakStartTime: string | undefined;
      breakEndTime: string | undefined;
    }) => {
      days.forEach((day, index) => {
        if (day.active) {
          setValue(`days.${index}.active`, true);
          setValue(`days.${index}.breakStartTime`, breakStartTime);
          setValue(`days.${index}.breakEndTime`, breakEndTime);
        }
      });
    },
    [days, setValue]
  );

  // mark the apply on all days if all visible days are active
  const applyBreakTimeToAllDays = useMemo(
    () => activeBreakDays.length === days.map((day) => day.breakActive).length,
    [days, activeBreakDays]
  );
  const setApplyBreakTimeToAllDays = useCallback(
    (apply: boolean) => {
      const {
        allDays: { breakStartTime, breakEndTime },
      } = getValues();
      if (apply) {
        fields.forEach((_: unknown, index: number) => {
          setValue(`days.${index}.breakDayIndex`, index);
          setValue(`days.${index}.breakActive`, true);
          setValue(`days.${index}.breakStartTime`, breakStartTime);
          setValue(`days.${index}.breakEndTime`, breakEndTime);
        });
      } else {
        fields.forEach((_: unknown, index: number) => {
          setValue(`days.${index}.breakActive`, false);
          setValue(`days.${index}.breakDayIndex`, -1);
        });
      }
    },
    [fields, setValue, getValues]
  );

  return (
    <Paper
      elevation={0}
      className="!p-8 !mb-6 !border !border-gray-100 !rounded-2xl !bg-white !shadow-sm hover:!shadow-md !transition-shadow !duration-300 !mt-5"
    >
      {/* Section Header */}
      <div className="flex items-center mb-8 pb-4 border-b-2 border-gray-50">
        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
          <span className="text-white text-lg">📅</span>
        </div>
        <Typography variant="h5" className="!font-bold !text-gray-800">
          Schedule Management
        </Typography>
      </div>

      {/* Schedule Toggle */}
      <Paper
        elevation={0}
        className="!p-6 !mb-6 !bg-gradient-to-r !from-indigo-50 !to-blue-50 !border !border-indigo-100 !rounded-xl"
      >
        <FormControl>
          <FormLabel className="!text-gray-800 !font-semibold !text-lg !mb-4">
            Do you want to add the Schedule of Barber?
          </FormLabel>
          <Controller
            name="allowSchedule"
            control={control}
            render={({ field }) => {
              return (
                <RadioGroup
                  row
                  value={field.value ? "yes" : "no"}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(e.target.value === "yes");
                    if (value === "yes") {
                      setApplyScheduleToAllDays(true);
                    }
                  }}
                  className="!gap-6"
                >
                  <FormControlLabel
                    value="yes"
                    control={
                      <Radio
                        sx={{
                          color: "#6366f1",
                          "&.Mui-checked": {
                            color: "#6366f1",
                          },
                        }}
                      />
                    }
                    label={
                      <span className="text-gray-700 font-medium">Yes</span>
                    }
                  />
                  <FormControlLabel
                    value="no"
                    control={
                      <Radio
                        sx={{
                          color: "#6366f1",
                          "&.Mui-checked": {
                            color: "#6366f1",
                          },
                        }}
                      />
                    }
                    label={
                      <span className="text-gray-700 font-medium">No</span>
                    }
                  />
                </RadioGroup>
              );
            }}
          />
        </FormControl>
      </Paper>

      {allowSchedule && (
        <>
          {/* Shop Opening and Closing Time */}
          <Paper
            elevation={0}
            className="!p-6 !mb-6 !bg-gradient-to-r !from-gray-50 !to-slate-50 !border !border-gray-200 !rounded-xl"
          >
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-slate-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🏪</span>
              </div>
              <Typography
                variant="h6"
                className="!font-semibold !text-gray-800"
              >
                Shop Hours
              </Typography>
            </div>

            <Grid container spacing={4} className="!mt-2">
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  label={
                    <Typography className="!font-medium !text-gray-700 !mr-4">
                      Shop Opening Time
                    </Typography>
                  }
                  sx={{ ml: 0 }}
                  labelPlacement="start"
                  className="!w-full !justify-between"
                  control={
                    <Controller
                      control={control}
                      name="shopOpeningTime"
                      render={({ field }) => (
                        <TimePicker
                          className="!w-48"
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px",
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                            },
                          }}
                          disabled
                          label="Opening Time"
                          value={dayjs(field.value)}
                          onChange={(value) => {
                            field.onChange(value?.toISOString());
                          }}
                        />
                      )}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  sx={{ ml: 0 }}
                  label={
                    <Typography className="!font-medium !text-gray-700 !mr-4">
                      Shop Closing Time
                    </Typography>
                  }
                  labelPlacement="start"
                  className="!w-full !justify-between"
                  control={
                    <Controller
                      control={control}
                      name="shopClosingTime"
                      render={({ field }) => (
                        <TimePicker
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px",
                              borderRadius: "12px",
                              backgroundColor: "#f8fafc",
                            },
                          }}
                          className="!w-48"
                          disabled
                          label="Closing Time"
                          value={dayjs(field.value)}
                          onChange={(value) => {
                            field.onChange(value?.toISOString());
                          }}
                        />
                      )}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Master Schedule Controls */}
          <Paper
            elevation={0}
            className="!p-6 !mb-6 !bg-gradient-to-r !from-blue-50 !to-indigo-50 !border-2 !border-blue-200 !rounded-xl"
          >
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">🕐</span>
              </div>
              <Typography
                variant="h6"
                className="!font-semibold !text-gray-800"
              >
                All Days
              </Typography>
            </div>

            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  label={
                    <Typography className="!font-medium !text-gray-700 !mr-4">
                      Start Time
                    </Typography>
                  }
                  labelPlacement="start"
                  className="!w-full !justify-between"
                  control={
                    <Controller
                      control={control}
                      name="allDays.startTime"
                      render={({ field }) => {
                        return (
                          <TimePicker
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "48px",
                                borderRadius: "12px",
                                backgroundColor: "#ffffff",
                                border: "2px solid #dbeafe",
                                "&:hover": {
                                  borderColor: "#3b82f6",
                                },
                                "&.Mui-focused": {
                                  borderColor: "#3b82f6",
                                  boxShadow:
                                    "0 0 0 3px rgba(59, 130, 246, 0.1)",
                                },
                              },
                            }}
                            className="!w-44"
                            label="Start Time"
                            value={dayjs(field.value)}
                            onChange={(value) => {
                              field.onChange(value?.toISOString());
                              setApplyScheduleToSelectedDays({
                                startTime: value?.toISOString(),
                                endTime: getValues("allDays.endTime"),
                              });
                              setTimeout(() => {
                                validateForm();
                              }, 0);
                            }}
                          />
                        );
                      }}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  label={
                    <Typography className="!font-medium !text-gray-700 !mr-4">
                      End Time
                    </Typography>
                  }
                  labelPlacement="start"
                  className="!w-full !justify-between"
                  control={
                    <Controller
                      control={control}
                      name="allDays.endTime"
                      render={({ field }) => (
                        <TimePicker
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px",
                              borderRadius: "12px",
                              backgroundColor: "#ffffff",
                              border: "2px solid #dbeafe",
                              "&:hover": {
                                borderColor: "#3b82f6",
                              },
                              "&.Mui-focused": {
                                borderColor: "#3b82f6",
                                boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                              },
                            },
                          }}
                          className="!w-44"
                          label="End Time"
                          value={dayjs(field.value)}
                          onChange={(value) => {
                            const endTime = value?.toISOString();
                            field.onChange(endTime);
                            setApplyScheduleToSelectedDays({
                              startTime: getValues("allDays.startTime"),
                              endTime,
                            });
                            setTimeout(() => {
                              validateForm();
                            }, 0);
                          }}
                        />
                      )}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  sx={{ cursor: "not-allowed" }}
                  control={
                    <Checkbox
                      sx={{
                        cursor: "not-allowed",
                        color: "#9ca3af",
                        "&.Mui-checked": {
                          color: "#6b7280",
                        },
                      }}
                      checked
                      onChange={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />
                  }
                  label={
                    <span className="text-gray-400 font-medium">
                      Apply on all days
                    </span>
                  }
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Weekly Schedule */}
          <Paper
            elevation={0}
            className="!p-6 !mb-6 !border !border-gray-200 !rounded-xl !bg-white"
          >
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">📋</span>
              </div>
              <Typography
                variant="h6"
                className="!font-semibold !text-gray-800"
              >
                Weekly Schedule
              </Typography>
            </div>

            <div className="space-y-4">
              {fields.map((day, index: number) => (
                <Paper
                  key={day.id}
                  elevation={0}
                  className="!p-5 !border !border-gray-100 !rounded-xl !bg-gray-50 hover:!bg-gray-100 !transition-colors !duration-200"
                >
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={3} md={2}>
                      <FormControlLabel
                        className="!w-full"
                        control={
                          <Controller
                            control={control}
                            name={`days.${index}.active`}
                            render={({ field }) => {
                              return (
                                <Checkbox
                                  {...field}
                                  checked={field.value}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    field.onChange(isChecked);
                                    setValue(`days.${index}.active`, isChecked);
                                    if (!isChecked) {
                                      setValue(`days.${index}.queueNumber`, 0);
                                    }
                                    setQueueAvailable((prev) => {
                                      prev[index] = {
                                        index: -1,
                                        status: "",
                                        loading: false,
                                      };
                                      return prev;
                                    });
                                  }}
                                  sx={{
                                    color: "#6366f1",
                                    "&.Mui-checked": {
                                      color: "#6366f1",
                                    },
                                  }}
                                />
                              );
                            }}
                          />
                        }
                        label={
                          <Typography className="!font-semibold !text-gray-700">
                            {getDayNameByIndex(index)}
                          </Typography>
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={3}>
                      <Controller
                        control={control}
                        name={`days.${index}.startTime`}
                        render={({ field }) => (
                          <TimePicker
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "44px",
                                borderRadius: "10px",
                                backgroundColor: days[index]?.active
                                  ? "#ffffff"
                                  : "#f3f4f6",
                                border: "1px solid #d1d5db",
                                "&:hover": {
                                  borderColor: days[index]?.active
                                    ? "#3b82f6"
                                    : "#d1d5db",
                                },
                                "&.Mui-focused": {
                                  borderColor: "#3b82f6",
                                  boxShadow:
                                    "0 0 0 2px rgba(59, 130, 246, 0.1)",
                                },
                              },
                            }}
                            className="!w-full"
                            label="Start Time"
                            value={dayjs(field.value)}
                            onChange={(value) => {
                              field.onChange(value?.toISOString());
                              validateForm();
                            }}
                            disabled={!days[index]?.active}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={3}>
                      <Controller
                        control={control}
                        name={`days.${index}.endTime`}
                        render={({ field }) => (
                          <TimePicker
                            sx={{
                              "& .MuiInputBase-root": {
                                height: "44px",
                                borderRadius: "10px",
                                backgroundColor: days[index]?.active
                                  ? "#ffffff"
                                  : "#f3f4f6",
                                border: "1px solid #d1d5db",
                                "&:hover": {
                                  borderColor: days[index]?.active
                                    ? "#3b82f6"
                                    : "#d1d5db",
                                },
                                "&.Mui-focused": {
                                  borderColor: "#3b82f6",
                                  boxShadow:
                                    "0 0 0 2px rgba(59, 130, 246, 0.1)",
                                },
                              },
                            }}
                            label="End Time"
                            value={dayjs(field.value)}
                            onChange={(value) => {
                              field.onChange(value?.toISOString());
                              validateForm();
                            }}
                            className="!w-full"
                            disabled={!days[index]?.active}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} md={2}>
                      <Controller
                        control={control}
                        name={`days.${index}.queueNumber`}
                        defaultValue=""
                        disabled={!days[index]?.active}
                        render={({ field }) => (
                          <FormControl
                            fullWidth
                            error={
                              queueAvailable[index] &&
                              !queueAvailable[index].loading &&
                              queueAvailable[index].status === "error"
                            }
                          >
                            <InputLabel
                              sx={{
                                color: "#6b7280",
                                fontWeight: 500,
                                "&.Mui-focused": {
                                  color: "#3b82f6",
                                },
                              }}
                            >
                              Queue
                            </InputLabel>
                            <Select
                              variant="outlined"
                              label="Queue"
                              {...field}
                              value={field.value || ""}
                              onChange={(event) => {
                                setQueueAvailable((prev) => ({
                                  ...prev,
                                  [index]: {
                                    index: -1,
                                    status: "",
                                    loading: true,
                                  },
                                }));
                                field.onChange(event.target.value);
                              }}
                              disabled={!days[index]?.active}
                              sx={{
                                height: "44px",
                                borderRadius: "10px",
                                backgroundColor: days[index]?.active
                                  ? "#ffffff"
                                  : "#f3f4f6",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "#d1d5db",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: days[index]?.active
                                    ? "#3b82f6"
                                    : "#d1d5db",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                  {
                                    borderColor: "#3b82f6",
                                    boxShadow:
                                      "0 0 0 2px rgba(59, 130, 246, 0.1)",
                                  },
                              }}
                            >
                              <MenuItem value="">
                                <em className="text-gray-400">Select Queue</em>
                              </MenuItem>
                              {queueOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                            {queueAvailable[index] &&
                              !queueAvailable[index].loading &&
                              queueAvailable[index].status !== "" && (
                                <FormHelperText
                                  sx={{
                                    color: (theme) =>
                                      queueAvailable[index].status === "success"
                                        ? theme.palette.success.main
                                        : theme.palette.error.main,
                                    fontWeight: 500,
                                  }}
                                >
                                  {queueAvailable[index].status === "success"
                                    ? "Queue Available"
                                    : "Queue not available"}
                                </FormHelperText>
                              )}
                          </FormControl>
                        )}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </div>
          </Paper>

          {/* Break Time Section */}
          <Paper
            elevation={0}
            className="!p-6 !mb-6 !bg-gradient-to-r !from-amber-50 !to-orange-50 !border-2 !border-amber-200 !rounded-xl"
          >
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white text-sm">☕</span>
              </div>
              <Typography
                variant="h6"
                className="!font-semibold !text-gray-800"
              >
                Break Time
              </Typography>
            </div>

            <Grid container spacing={4} alignItems="center" className="!mb-6">
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  label={
                    <Typography className="!font-medium !text-gray-700 !mr-4">
                      Start Time
                    </Typography>
                  }
                  labelPlacement="start"
                  className="!w-full !justify-between"
                  control={
                    <Controller
                      control={control}
                      name="allDays.breakStartTime"
                      render={({ field }) => (
                        <TimePicker
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px",
                              borderRadius: "12px",
                              backgroundColor: "#ffffff",
                              border: "2px solid #fed7aa",
                              "&:hover": {
                                borderColor: "#f59e0b",
                              },
                              "&.Mui-focused": {
                                borderColor: "#f59e0b",
                                boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
                              },
                            },
                          }}
                          className="!w-44"
                          label="Start Time"
                          value={dayjs(field.value)}
                          onChange={(value) => {
                            const breakStartTime = value?.toISOString();
                            field.onChange(breakStartTime);
                            setApplyBreakTimeToSelectedDays({
                              breakStartTime,
                              breakEndTime: getValues("allDays.breakEndTime"),
                            });
                            setTimeout(() => {
                              validateForm();
                            }, 0);
                          }}
                        />
                      )}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  label={
                    <Typography className="!font-medium !text-gray-700 !mr-4">
                      End Time
                    </Typography>
                  }
                  labelPlacement="start"
                  className="!w-full !justify-between"
                  control={
                    <Controller
                      control={control}
                      name="allDays.breakEndTime"
                      render={({ field }) => (
                        <TimePicker
                          sx={{
                            "& .MuiInputBase-root": {
                              height: "48px",
                              borderRadius: "12px",
                              backgroundColor: "#ffffff",
                              border: "2px solid #fed7aa",
                              "&:hover": {
                                borderColor: "#f59e0b",
                              },
                              "&.Mui-focused": {
                                borderColor: "#f59e0b",
                                boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.1)",
                              },
                            },
                          }}
                          className="!w-44"
                          label="End Time"
                          value={dayjs(field.value)}
                          onChange={(value) => {
                            const breakEndTime = value?.toISOString();
                            field.onChange(value?.toISOString());
                            setApplyBreakTimeToSelectedDays({
                              breakStartTime: getValues(
                                "allDays.breakStartTime"
                              ),
                              breakEndTime,
                            });
                            setTimeout(() => {
                              validateForm();
                            }, 0);
                          }}
                        />
                      )}
                    />
                  }
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={applyBreakTimeToAllDays}
                      onChange={(e) => {
                        setApplyBreakTimeToAllDays(e.target.checked);
                        setTimeout(() => {
                          validateForm();
                        }, 0);
                      }}
                      sx={{
                        color: "#f59e0b",
                        "&.Mui-checked": {
                          color: "#f59e0b",
                        },
                      }}
                    />
                  }
                  label={
                    <span className="text-gray-700 font-medium">
                      Apply on all days
                    </span>
                  }
                  className={cn("", {
                    "opacity-0": activeScheduleDays.length === 0,
                  })}
                />
              </Grid>
            </Grid>

            {activeScheduleDays.length > 0 && (
              <div className="border-t border-amber-200 pt-6">
                <Typography
                  variant="body1"
                  className="!font-semibold !text-gray-700 !mb-4"
                >
                  Select days for break time:
                </Typography>
                <div className="flex flex-wrap gap-3 !mb-6">
                  {allDays.map((_, index) => {
                    if (!days[index]?.active) return null;
                    return (
                      <Controller
                        key={`break_time__${index}`}
                        control={control}
                        name={`days.${index}.breakActive`}
                        render={({ field }) => {
                          return (
                            <Chip
                              label={getDayNameByIndex(index)}
                              clickable
                              variant={field.value ? "filled" : "outlined"}
                              color={field.value ? "warning" : "default"}
                              onClick={() => {
                                field.onChange(!field.value);
                                if (!field.value) {
                                  setValue(
                                    `days.${index}.breakDayIndex`,
                                    index
                                  );
                                } else {
                                  setValue(`days.${index}.breakDayIndex`, -1);
                                }
                                validateForm();
                              }}
                              sx={{
                                fontWeight: 600,
                                fontSize: "14px",
                                height: "36px",
                                borderRadius: "18px",
                                "&.MuiChip-filled": {
                                  backgroundColor: "#f59e0b",
                                  color: "white",
                                },
                                "&.MuiChip-outlined": {
                                  borderColor: "#d1d5db",
                                  color: "#6b7280",
                                  "&:hover": {
                                    borderColor: "#f59e0b",
                                    backgroundColor: "#fef3c7",
                                  },
                                },
                              }}
                            />
                          );
                        }}
                      />
                    );
                  })}
                </div>

                {(applyBreakTimeToAllDays || activeScheduleDays.length > 0) && (
                  <div className="space-y-4">
                    {activeScheduleDays.map((day, index) => {
                      const dayIndex = day.breakDayIndex;
                      if (
                        day.breakDayIndex === -1 &&
                        (!day.active || !day.breakActive)
                      ) {
                        return null;
                      }

                      return (
                        <Paper
                          key={`active_break_time__${index}`}
                          elevation={0}
                          className="!p-4 !bg-white !border !border-amber-200 !rounded-xl"
                        >
                          <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} sm={3} md={2}>
                              <Typography className="!font-semibold !text-gray-700">
                                {getDayNameByIndex(day.breakDayIndex)}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} sm={4} md={4}>
                              <FormControlLabel
                                label={
                                  <Typography className="!font-medium !text-gray-600 !mr-4">
                                    Start Time
                                  </Typography>
                                }
                                labelPlacement="start"
                                className="!w-full !justify-between"
                                control={
                                  <Controller
                                    control={control}
                                    name={`days.${dayIndex}.breakStartTime`}
                                    render={({ field }) => (
                                      <TimePicker
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: "44px",
                                            borderRadius: "10px",
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #fed7aa",
                                            "&:hover": {
                                              borderColor: "#f59e0b",
                                            },
                                            "&.Mui-focused": {
                                              borderColor: "#f59e0b",
                                              boxShadow:
                                                "0 0 0 2px rgba(245, 158, 11, 0.1)",
                                            },
                                          },
                                        }}
                                        className="!w-40"
                                        label="Start Time"
                                        value={dayjs(field.value)}
                                        onChange={(value) => {
                                          field.onChange(value?.toISOString());
                                        }}
                                        slotProps={{
                                          textField: {
                                            variant: "outlined",
                                            error:
                                              !!errors.days?.[dayIndex]
                                                ?.breakStartTime?.message,
                                            helperText:
                                              errors.days?.[dayIndex]
                                                ?.breakStartTime?.message,
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                }
                              />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4}>
                              <FormControlLabel
                                label={
                                  <Typography className="!font-medium !text-gray-600 !mr-4">
                                    End Time
                                  </Typography>
                                }
                                labelPlacement="start"
                                className="!w-full !justify-between"
                                control={
                                  <Controller
                                    control={control}
                                    name={`days.${dayIndex}.breakEndTime`}
                                    render={({ field }) => (
                                      <TimePicker
                                        sx={{
                                          "& .MuiInputBase-root": {
                                            height: "44px",
                                            borderRadius: "10px",
                                            backgroundColor: "#ffffff",
                                            border: "1px solid #fed7aa",
                                            "&:hover": {
                                              borderColor: "#f59e0b",
                                            },
                                            "&.Mui-focused": {
                                              borderColor: "#f59e0b",
                                              boxShadow:
                                                "0 0 0 2px rgba(245, 158, 11, 0.1)",
                                            },
                                          },
                                        }}
                                        className="!w-40"
                                        label="End Time"
                                        value={dayjs(field.value)}
                                        onChange={(value) =>
                                          field.onChange(value?.toISOString())
                                        }
                                        slotProps={{
                                          textField: {
                                            variant: "outlined",
                                            error:
                                              !!errors.days?.[dayIndex]
                                                ?.breakEndTime?.message,
                                            helperText:
                                              errors.days?.[dayIndex]
                                                ?.breakEndTime?.message,
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                }
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </Paper>
        </>
      )}
    </Paper>
  );
};

export default Schedule;
