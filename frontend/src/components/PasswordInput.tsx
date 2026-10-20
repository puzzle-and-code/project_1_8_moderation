import { useState } from "react";
import type { ChangeEvent } from "react";
import {
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  error?: string;
  autoComplete?: string;
}

export function PasswordInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  autoComplete = "current-password",
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      id={id}
      label={label}
      placeholder={placeholder}
      type={isVisible ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      error={Boolean(error)}
      helperText={error}
      fullWidth
      required
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={isVisible ? "Скрыть пароль" : "Показать пароль"}
                onClick={() => setIsVisible((prev) => !prev)}
                edge="end"
              >
                {isVisible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
