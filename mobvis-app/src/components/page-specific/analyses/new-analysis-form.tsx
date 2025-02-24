"use client";

import HyperLink from "@/components/custom/hyperlink";
import MutedMsg from "@/components/custom/muted-msg";
import { Button } from "@/components/shadcn-components/button";
import { Checkbox } from "@/components/shadcn-components/checkbox";
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
import { mandatoryErrorMsg } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
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

type FormValues = z.infer<typeof formSchema>;

function onSubmit(values: FormValues) {
  console.log(values);
}

export default function NewAnalysisForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      samplingRate: 0,
      sensorHeight: 0,
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
                <FormItem className="w-1/2">
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
                <FormItem className="w-1/2">
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
                    <Checkbox checked={value} onCheckedChange={onChange} />
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
                    <Checkbox checked={value} onCheckedChange={onChange} />
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
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          Create
        </Button>
      </form>
    </Form>
  );
}
