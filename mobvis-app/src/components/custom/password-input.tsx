import React, { useState } from "react";
import { Input } from "../shadcn-components/input";
import { Button } from "../shadcn-components/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function PasswordInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex gap-2">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        {...props}
      ></Input>
      <Button
        size="icon"
        variant="outline"
        type="button"
        className="w-10"
        onClick={() => setShowPassword(!showPassword)}
      >
        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
      </Button>
    </div>
  );
}
