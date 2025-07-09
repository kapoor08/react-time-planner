import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Typography, Button, Box, Container, Paper } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import Profile from "@/components/Profile";
import Schedule from "@/components/Schedule";
import validationSchema, { IAddBarber } from "./validationSchema";
import { defaultValues } from "./defaults";
import { IQueueAvailable } from "@/components/Schedule/util";

const AddSchedule = () => {
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  const [queueAvailable, setQueueAvailable] = useState<
    Record<string, IQueueAvailable>
  >({});

  const onSubmit = (data: IAddBarber) => {
    console.log(data, "data is here!");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Card */}
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            p: { xs: 3, sm: 4, md: 6 },
            borderRadius: "24px",
            textAlign: "center",
            mb: 4,
            boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box
              sx={{
                width: { xs: 60, sm: 70, md: 80 },
                height: { xs: 60, sm: 70, md: 80 },
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              📅
            </Box>
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              mb: 2,
              background: "linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 20px rgba(255, 255, 255, 0.3)",
            }}
          >
            React TimePlanner
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.95,
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
              lineHeight: 1.6,
              maxWidth: "600px",
              mx: "auto",
              fontWeight: 400,
            }}
          >
            An advanced form implementation showcasing complex time validations
            powered by Yup, React Hook Form, and Day.js
          </Typography>
        </Paper>

        {/* Main Form */}
        <FormProvider {...methods}>
          <Box
            component="form"
            onSubmit={methods.handleSubmit(onSubmit)}
            noValidate
            autoComplete="off"
          >
            <Profile />
            <Schedule
              defaultValues={defaultValues}
              queueAvailable={queueAvailable}
              setQueueAvailable={setQueueAvailable}
              onSubmit={onSubmit}
            />

            {/* Submit Button */}
            <Box sx={{ textAlign: "center", mt: 6, mb: 4 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  background:
                    "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
                  px: { xs: 4, sm: 6, md: 8 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  fontWeight: 700,
                  borderRadius: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.5)",
                    background:
                      "linear-gradient(45deg, #5a67d8 30%, #6b46c1 90%)",
                  },
                  "&:active": {
                    transform: "translateY(0px)",
                  },
                }}
              >
                Submit Form
              </Button>
            </Box>
          </Box>
        </FormProvider>
      </Container>
    </Box>
  );
};

export default AddSchedule;
