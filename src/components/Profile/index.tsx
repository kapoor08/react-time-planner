import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import dayjs from "dayjs";

import { Controller, useFormContext } from "react-hook-form";
import RequiredFieldSymbol from "@/components/RequiredFieldSymbol";
import { TimeField } from "@mui/x-date-pickers";
import {
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Select as MUISelect,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { MuiPhone } from "@/components/MUIPhone";

import { getToday } from "@/utils";
import {
  extractPhoneNumberDetails,
  getDefaultRegion,
} from "../MUIPhone/validate";
import { IServiceOption, genderOptions, serviceOptions } from "./util";

const Profile = () => {
  const animatedComponents = makeAnimated();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const phone = watch("phone");
  const selectedServices = (watch("services") || []) as IServiceOption[];
  const phoneDetails = useMemo(
    () => extractPhoneNumberDetails(phone, getDefaultRegion()),
    [phone]
  );
  const isValidPhoneNumber = useMemo(
    () => phoneDetails?.formattedNumber,
    [phoneDetails]
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [, setSearchService] = useState("");

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Box className="flex gap-4 relative !w-full flex-col">
        {/* Full Name and Display Name */}
        <Box className="flex gap-4 !w-full">
          <Controller
            control={control}
            name="fullName"
            render={({ field }) => {
              return (
                <TextField
                  label="Full Name"
                  sx={{ borderRadius: "40px" }}
                  required
                  fullWidth
                  type="text"
                  placeholder="Enter Full Name"
                  size="small"
                  variant="outlined"
                  error={!!errors.fullName}
                  helperText={(errors.fullName?.message ?? "") as string}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              );
            }}
          />

          <Controller
            control={control}
            name="nickName"
            render={({ field }) => {
              return (
                <TextField
                  label="Display Name"
                  required
                  fullWidth
                  type="text"
                  placeholder="Enter Display Name"
                  size="small"
                  variant="outlined"
                  error={!!errors.nickName}
                  helperText={(errors.nickName?.message ?? "") as string}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              );
            }}
          />
        </Box>

        {/* Email, Mobile Number and Gender */}
        <Box className="flex gap-4 !w-full">
          <Controller
            control={control}
            name="email"
            render={({ field }) => {
              return (
                <TextField
                  label="Email"
                  required
                  fullWidth
                  type="text"
                  placeholder="Enter your Email"
                  size="small"
                  variant="outlined"
                  error={!!errors.email}
                  helperText={(errors.email?.message ?? "") as string}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              );
            }}
          />

          <div className="!w-full">
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MuiPhone
                  value={field.value}
                  onChange={field.onChange}
                  variant="outlined"
                  size="small"
                  errorMessage={
                    isValidPhoneNumber ? "" : "Invalid phone number"
                  }
                />
              )}
            />
            {errors.phone && (
              <p className="mt-2 flex items-center text-sm text-error">
                {(errors.phone.message ?? "") as string}
              </p>
            )}
          </div>

          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <MUISelect
                  {...field}
                  labelId="gender-label"
                  id="gender"
                  label="Gender"
                  error={!!errors.gender}
                  className="w-full h-[40px] border rounded-md"
                >
                  {genderOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </MUISelect>
                <FormHelperText>
                  {errors.gender && (
                    <p>{(errors.gender?.message ?? "") as string}</p>
                  )}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>

        {/* Password and Confirm Password */}
        <div className="flex gap-4 !w-full">
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <div className="flex flex-col !w-full">
                <TextField
                  label="Password"
                  required
                  fullWidth
                  size="small"
                  error={!!errors.password}
                  helperText={(errors.password?.message ?? "") as string}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  autoComplete="off"
                  type={showPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className="!px-0">
                        <IconButton
                          onClick={() => {
                            handleTogglePassword();
                          }}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    placeholder: "●●●●●●●●",
                    onFocus: (event) => {
                      event.target.placeholder = "";
                    },
                    onBlur: (event) => {
                      event.target.placeholder = "●●●●●●●●";
                    },
                  }}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <div className="flex flex-col !w-full">
                <TextField
                  label="Confirm Password"
                  required
                  fullWidth
                  size="small"
                  error={!!errors.confirmPassword}
                  helperText={(errors.confirmPassword?.message ?? "") as string}
                  {...field}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  autoComplete="off"
                  type={showConfirmPassword ? "text" : "password"}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className="!px-0">
                        <IconButton
                          onClick={() => {
                            handleToggleConfirmPassword();
                          }}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    placeholder: "●●●●●●●●",
                    onFocus: (event) => {
                      event.target.placeholder = "";
                    },
                    onBlur: (event) => {
                      event.target.placeholder = "●●●●●●●●";
                    },
                  }}
                />
              </div>
            )}
          />
        </div>

        {/* Specification and Profile Description */}
        <Box className="flex gap-4 !w-full">
          <Controller
            control={control}
            name="specification"
            render={({ field }) => {
              return (
                <TextField
                  label="Specification"
                  required
                  fullWidth
                  type="text"
                  placeholder="Enter Specification"
                  size="small"
                  variant="outlined"
                  error={!!errors.specification}
                  helperText={(errors.specification?.message ?? "") as string}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              );
            }}
          />
          <Controller
            control={control}
            name="profileDescription"
            render={({ field }) => {
              return (
                <TextField
                  label="Profile Description"
                  required
                  fullWidth
                  type="text"
                  placeholder="Enter Profile Description"
                  size="small"
                  variant="outlined"
                  error={!!errors.profileDescription}
                  helperText={
                    (errors.profileDescription?.message ?? "") as string
                  }
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
                />
              );
            }}
          />
        </Box>

        {/* Services */}
        <Box
          className="!w-full"
          sx={[
            {
              '& .selector-dropdown > div:has(input[name="services"])': {
                display: "none",
              },
            },
            errors.services
              ? {
                  "& .selector-dropdown > div:first-of-type": {
                    borderRadius: "8px !important",
                    border: (theme) =>
                      `1px solid ${theme.palette.error.main} !important`,
                  },
                  "& .selector-dropdown > div:first-of-type:hover": {
                    borderWidth: "1px !important",
                    borderColor: (theme) =>
                      `${theme.palette.error.main} !important`,
                    boxShadow: (theme) =>
                      `0 0 0 1px ${theme.palette.error.main} !important`,
                  },
                }
              : {},
          ]}
        >
          <Controller
            control={control}
            name="services"
            render={({ field }) => (
              <>
                <Typography className="!text-[--black-text] lg:!text-sm sm:!text-sm !text-base">
                  Services
                  <RequiredFieldSymbol />
                </Typography>
                <Select
                  isSearchable
                  menuPlacement="auto"
                  menuPortalTarget={document.body}
                  menuPosition={"fixed"}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={serviceOptions || []}
                  className="selector-dropdown"
                  onInputChange={(search) => setSearchService(search)}
                  isDisabled={field.disabled}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value}
                  onChange={(selectedOptions) => {
                    // Add time initialization to each selected service
                    const servicesWithTime = selectedOptions.map((option) => ({
                      ...option,
                      time: dayjs(`${getToday()}T00:00`),
                    }));
                    field.onChange(servicesWithTime);
                  }}
                />
                {(errors.services?.root?.message ||
                  errors.services?.message) && (
                  <Typography
                    component="p"
                    sx={{
                      color: (theme) => theme.palette.error.main,
                      marginTop: "4px",
                      fontSize: "12px",
                    }}
                  >
                    {
                      (errors.services?.root?.message ||
                        errors.services?.message ||
                        "") as string
                    }
                  </Typography>
                )}
              </>
            )}
          />
          {selectedServices.length > 0 && (
            <>
              <Typography className="!text-[--black-text] lg:!text-sm sm:!text-sm !text-base !mb-2 !mt-4">
                Services Duration (HH:MM)
                <RequiredFieldSymbol />
              </Typography>
              <div className="grid grid-cols-5 gap-3 border-[1px] border-solid border-gray-300 !my-auto !rounded-lg !px-3 !pt-2 !pb-4">
                {selectedServices?.map((service, index) => (
                  <Box key={service.value}>
                    <Controller
                      control={control}
                      name={`services.${index}.time`}
                      render={({ field }) => {
                        return (
                          <>
                            <div className="!mb-1">{service?.label}</div>
                            <TimeField
                              {...field}
                              format="HH:mm"
                              onChange={(selectedTime) => {
                                const formattedTime =
                                  dayjs(selectedTime).format("HH:mm");
                                const updatedServices = [...selectedServices];
                                updatedServices[index] = {
                                  ...updatedServices[index],
                                  time: formattedTime,
                                };
                                setValue("services", updatedServices);
                              }}
                              value={field.value}
                              size="small"
                              // helperText={
                              //   (errors.services?.[index]?.time?.message ??
                              //     "") as string
                              // }
                            />
                          </>
                        );
                      }}
                    />
                  </Box>
                ))}
              </div>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Profile;
