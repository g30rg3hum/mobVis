"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/form";
import { Input } from "@/components/shadcn-components/input";
import { Button } from "@/components/shadcn-components/button";
import PasswordInput from "@/components/custom/password-input";
import { useState } from "react";
import ErrorMsg from "@/components/custom/error-msg";
import { redirect } from "next/navigation";
import SuccessMsg from "@/components/custom/success-msg";

const mandatoryErrorMsg = "Please fill in this field";
const formSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: mandatoryErrorMsg })
      .email("Invalid email address"),
    password: z.string().min(1, { message: mandatoryErrorMsg }),
    confirmPassword: z.string().min(1, { message: mandatoryErrorMsg }),
  })
  .superRefine((data, ctx) => {
    // matching passwords
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      });
    }

    // password complexity: 12 chars min, 1 uppercase, 1 lowercase, 1 number, 1 symbol.
    const password = data.password;
    const has12Chars = password.length >= 12;
    const hasUppercase = password !== password.toLowerCase();
    const hasLowercase = password !== password.toUpperCase();
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (
      !(has12Chars && hasUppercase && hasLowercase && hasNumber && hasSymbol)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Password must have at least 12 characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol",
        path: ["password"],
      });
    }
  });
type formValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: formValues) {
    // if reached here then passed all FE validations.
    const { email, password } = values;

    // POST to api route to create the user. (/api/auth/register)
    // don't need try and catch, handling done in api route.
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    // some internal error or email already exists
    if (!response.ok) {
      setSubmissionError(data.message);
    } else {
      // successfully created the user! redirect to login.
      setSuccessMsg(`${data.message} Redirecting to login page...`);
      setTimeout(() => {
        redirect("/login");
      }, 3000);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="text-center space-y-2">
          {submissionError && <ErrorMsg>{submissionError}</ErrorMsg>}
          {successMsg && <SuccessMsg>{successMsg}</SuccessMsg>}
          <Button type="submit" className="w-full">
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
