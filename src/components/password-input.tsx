"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

export function PasswordInput(props: React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);
  return <InputGroup>
    <InputGroupInput {...props} type={visible ? "text" : "password"} />
    <InputGroupAddon align="inline-end">
      <InputGroupButton type="button" size="icon-xs" aria-label={visible ? "Hide password" : "Show password"} onClick={() => setVisible((value) => !value)}>
        {visible ? <EyeOff /> : <Eye />}
      </InputGroupButton>
    </InputGroupAddon>
  </InputGroup>;
}
