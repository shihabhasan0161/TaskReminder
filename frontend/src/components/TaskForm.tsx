// Task Form Page (for creating and editing tasks)
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, {
  type SelectChangeEvent,
  type SelectProps,
} from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";
import dayjs, { Dayjs } from "dayjs";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";

export default function TaskForm() {
  const [formState, setFormState] = useState({
    values: {
      title: "",
      content: "",
      due_date: null as Dayjs | null,
    },
    errors: {},
  });
  const formValues = formState.values;
  const formErrors = formState.errors;

  // only authenticated user can create task
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (user) {
        // Call API to create task
        await api.post("/api/tasks/", formState.values);
        // Redirect to tasks page after successful creation
        navigate("/");
      }
    } catch {
      setFormState((prev) => ({
        ...prev,
        errors: { submit: "Failed to create task" },
      }));
    }
  };

  const handleTextFieldChange = (key: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [key]: value,
      },
      errors: { general: "Failed to change field" },
    }));
  };

  const handleDateFieldChange = (key: string) => (value: Dayjs | null) => {
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [key]: value,
      },
      errors: { general: "Failed to change field" },
    }));
  };

  const handleReset = () => {
    setFormState({
      values: {
        title: "",
        content: "",
        due_date: null,
      },
      errors: {},
    });
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
      sx={{ width: "100%" }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: "100%" }}>
          {/* Title */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.title ?? ""}
              onChange={(e) => handleTextFieldChange("title", e.target.value)}
              name="title"
              label="Title"
              fullWidth
            />
          </Grid>

          {/* Content */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <TextField
              value={formValues.content ?? ""}
              onChange={(e) => handleTextFieldChange("content", e.target.value)}
              name="content"
              label="Content"
              fullWidth
            />
          </Grid>

          {/* Due date */}
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: "flex" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={formValues.due_date ? dayjs(formValues.due_date) : null}
                onChange={handleDateFieldChange("due_date")}
                name="due_date"
                label="Due date"
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </FormGroup>
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button type="submit" variant="contained" size="large">
          Create
        </Button>
      </Stack>
    </Box>
  );
}
