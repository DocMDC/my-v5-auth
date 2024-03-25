"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as z from "zod";
import { useForm, useFormState, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MarrowReportSchema } from "@/schemas";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

type MarrowFormType = {
  form: UseFormReturn<
    {
      finalDiagnosis: string;
      impression: string;
      wbc: number | null;
      hgb: number | null;
      plt: number | null;
      mcv: number | null;
      rdw: number | null;
      peripheralSmear: string | null;
    },
    any,
    undefined
  >;
  onSubmit: (values: z.infer<typeof MarrowReportSchema>) => void;
};

const cbcArray = [
  {
    name: "wbc",
    units: "k/microL",
  },
  {
    name: "hgb",
    units: "g/dL",
  },
  {
    name: "plt",
    units: "k/microL",
  },
  {
    name: "mcv",
    units: "fL",
  },
  {
    name: "rdw",
    units: "%",
  },
];

export default function MarrowForm({ form, onSubmit }: MarrowFormType) {
  const [isPending, startTransition] = useTransition();

  const renderCBCValues = (fieldName: string, units: string) => {
    switch (fieldName) {
      case "wbc":
      case "hgb":
      case "plt":
      case "mcv":
      case "rdw":
        return (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between pr-24 md:pr-60 2xl:pr-0 2xl:mt-1">
                  <FormLabel className="text-xs">
                    {`${fieldName.toUpperCase()} (${units})`}
                  </FormLabel>
                  <FormControl className="h-8 w-16 2xl:ml-2">
                    <Input
                      {...field}
                      type="number"
                      disabled={isPending}
                      value={field.value || ""}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-[350px] shadow-md mt-10 lg:mt-0 md:w-[500px] 2xl:w-[725px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          Bone Marrow Diagnostic Report
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div>
              <FormField
                control={form.control}
                name="finalDiagnosis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Final Diagnosis</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="Enter final diagnosis information here"
                        className="h-32"
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>

            <div className="mt-4">
              <FormField
                control={form.control}
                name="impression"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Impression</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        disabled={isPending}
                        placeholder="Enter impression here"
                        className="h-32"
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>

            <div className="mt-4 h-86">
              <h2 className="text-lg font-medium">Peripheral Blood Smear</h2>

              <div className="flex flex-col h-full w-full">
                <h3>CBC :</h3>

                <div className="space-y-2 2xl:flex 2xl:space-x-4 2xl:space-y-0">
                  {cbcArray.map((data) =>
                    renderCBCValues(data.name, data.units)
                  )}
                </div>

                <div className="flex items-center mt-4">
                  <h3 className="mr-10">Peripheral smear:</h3>
                  <FormItem>
                    <FormControl className="h-8 w-32">
                      <select
                        {...form.register("peripheralSmear")}
                        disabled={isPending}
                        defaultValue="received"
                        className="border rounded px-2"
                      >
                        <option value="received">Received</option>
                        <option value="notReceived">Not received</option>
                        <option value="normal">Normal</option>
                        <option value="peripheralSmearCustomText">
                          Custom Free Text
                        </option>
                      </select>
                    </FormControl>
                  </FormItem>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
