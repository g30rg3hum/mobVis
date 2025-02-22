"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/form";
import { Input } from "@/components/shadcn-components/input";
import { Button } from "@/components/shadcn-components/button";
import HyperLink from "@/components/custom/hyperlink";
import PasswordInput from "@/components/custom/password-input";
import { signIn } from "next-auth/react";
import ErrorMsg from "@/components/custom/error-msg";
import Error from "next/error";
import { useState } from "react";
import { useRouter } from "next/navigation";

const mandatoryErrorMsg = "Please fill in this field";
const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: mandatoryErrorMsg })
    .email("Invalid email address"),
  password: z.string().min(1, { message: mandatoryErrorMsg }),
});
type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const { email, password } = values;
    // sign in using nextAuth.
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!response?.error) {
        router.push("/");
        router.refresh(); // refresh to show logged in state.
      } else {
        setSubmissionError("Invalid email or password.");
      }
    } catch (error) {
      // error thrown while signing in with nextAuth.
      if (error instanceof Error) {
        setSubmissionError("There is an issue with the authentication system.");
      }
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
                <FormDescription>
                  <HyperLink url="/forgot-password">
                    Forgot your password?
                  </HyperLink>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="text-center space-y-2">
          {submissionError && <ErrorMsg>{submissionError}</ErrorMsg>}
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}
