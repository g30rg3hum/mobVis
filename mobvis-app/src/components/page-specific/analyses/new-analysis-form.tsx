"use client";

import HyperLink from "@/components/custom/hyperlink";
import MutedMsg from "@/components/custom/muted-msg";
import { Button } from "@/components/shadcn-components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-components/form";
import { Input } from "@/components/shadcn-components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/shadcn-components/select";
import { Textarea } from "@/components/shadcn-components/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn-components/dialog";
import { mandatoryErrorMsg } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const settingOptions = ["laboratory", "free_living"];
const formSchema = z.object({
  name: z.string().min(1, { message: mandatoryErrorMsg }),
  description: z.string().min(1, { message: mandatoryErrorMsg }),
  samplingRate: z.coerce
    .number()
    .int({ message: "Please enter an integer" })
    .positive(),
  sensorHeight: z.coerce.number().positive(),
  patientHeight: z.coerce.number().positive(),
  setting: z.string().refine((val) => settingOptions.includes(val), {
    message: "Setting is not from the list",
  }),
  public: z.boolean(),
  // TODO: change the file size limit.
  csvFile: z
    .instanceof(File, { message: mandatoryErrorMsg })
    .refine((file: File) => file.size < 5000000, {
      message: "File size must be less than 5MB",
    }),
  convertToMs: z.boolean(),
});

export type FormValues = z.infer<typeof formSchema>;

interface Props {
  submissionHandler?: (values: FormValues) => void;
}
export default function NewAnalysisForm({ submissionHandler }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [possibleError, setPossibleError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitForm(values: FormValues) {
    setIsSubmitting(true);
    // sending FormData rather than just json.
    // create the form data first.
    const formData = new FormData();
    for (const key in values) {
      const value = values[key as keyof FormValues];
      const isStringOrFile = typeof value === "string" || value instanceof File;
      formData.append(key, isStringOrFile ? value : value.toString());
    }

    // send the api call.
    const response = await fetch("/api/py/dmo_extraction", {
      method: "POST",
      body: formData,
    }).then((res) => {
      if (res.ok) {
        setSuccess(true);
        setDialogMessage(
          "Gait parameters have been successfully extracted from your input data. Results have been saved locally."
        );
      } else {
        setSuccess(false);
        setDialogMessage(
          "There was an error trying to extract gait parameters from your input data. Please ensure that your inputs are sensible."
        );
      }
      return res.json();
    });

    if (success) {
      localStorage.setItem(
        "inputs",
        JSON.stringify({ ...values, csvFile: values.csvFile.name })
      );
      localStorage.setItem(
        "total_walking_duration",
        response.total_walking_duration
      );
      localStorage.setItem(
        "per_wb_parameters",
        JSON.stringify(response.per_wb_parameters)
      );
      localStorage.setItem(
        "per_stride_parameters",
        JSON.stringify(response.per_stride_parameters)
      );
      localStorage.setItem(
        "aggregate_parameters",
        JSON.stringify(response.aggregate_parameters)
      );
    } else {
      setPossibleError(response["detail"]);
    }

    setIsDialogOpen(true);
    setIsSubmitting(false);
  }

  // to enable customisation of submission handler from outside.
  const onSubmit = (values: FormValues) => {
    if (submissionHandler) {
      submissionHandler(values);
    } else {
      // actual implementation.
      submitForm(values);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      samplingRate: 0,
      sensorHeight: 0,
      patientHeight: 0,
      setting: "laboratory",
      public: false,
      csvFile: undefined,
      convertToMs: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter the name of your analysis"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what your analysis is about"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex space-x-4">
            <FormField
              control={form.control}
              name="samplingRate"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Sampling rate (hz) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter sampling rate in hz"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sensorHeight"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Sensor height (m) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter sensor height in m"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="patientHeight"
              render={({ field }) => (
                <FormItem className="w-1/3">
                  <FormLabel>Patient height (m) *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter patient height in m"
                      type="number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="setting"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Measurement setting *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your management setting" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="laboratory">Laboratory</SelectItem>
                    <SelectItem value="free_living">Free living</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="public"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <div className="flex gap-2 items-center mt-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      value={value.toString()}
                      onChange={onChange}
                    />
                  </FormControl>
                  <FormLabel>Public?</FormLabel>
                </div>
                <MutedMsg>
                  By making this public, you are allowing other clinicians to
                  use this gait analysis and associated relevant patient
                  information (including attributes like height, but excluding
                  identifying info like name) for comparison against their own
                  analyses.
                </MutedMsg>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="csvFile"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { value, onChange, ...restProps } }) => (
              <FormItem>
                <FormLabel>Upload CSV *</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                      onChange(e.target.files ? e.target.files[0] : undefined)
                    }
                    {...restProps}
                  />
                </FormControl>
                <MutedMsg>
                  Please read through these{" "}
                  <HyperLink url="#">data requirements</HyperLink> for the input
                  CSV file, and ensure that they are met before creating a new
                  gait analysis.
                </MutedMsg>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="convertToMs"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <div className="flex gap-2 items-center mt-4">
                  <FormControl>
                    <input
                      type="checkbox"
                      value={value.toString()}
                      onChange={onChange}
                    />
                  </FormControl>
                  <FormLabel>
                    Convert acceleration units from g to m/s²
                  </FormLabel>
                </div>
                <MutedMsg>
                  If current acceleration values are in g (gravity), check the
                  box to convert to m/s² as required.
                </MutedMsg>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full disabled:bg-black"
          disabled={isSubmitting}
        >
          Extract & Save
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {success ? "Successful! ✅" : "Something went wrong! ❌"}
              </DialogTitle>
            </DialogHeader>
            <DialogDescription>
              <span> {dialogMessage}</span>
              {possibleError && (
                <>
                  <br />
                  <br />
                  <span>
                    The following might the problem:{" "}
                    <span className="text-red-500">{possibleError}</span>
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
}
