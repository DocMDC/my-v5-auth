"use client";

import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MarrowReportSchema } from "@/schemas";
import { useState } from "react";
import MarrowForm from "@/components/marrow-form";
import MarrowPrelimReport from "@/components/marrow-prelim-report";

export default function MarrowReport() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof MarrowReportSchema>>({
    resolver: zodResolver(MarrowReportSchema),
    defaultValues: {
      finalDiagnosis: "",
      impression: "",
      wbc: null,
      hgb: null,
      plt: null,
      mcv: null,
      rdw: null,
      peripheralSmear: "received",
    },
  });

  //   const { finalDiagnosis, impression } = form.getValues();
  const finalDiagnosis = useWatch({
    name: "finalDiagnosis",
    control: form.control,
  });
  const impression = useWatch({
    name: "impression",
    control: form.control,
  });
  const wbc = useWatch({
    name: "wbc",
    control: form.control,
  });
  const hgb = useWatch({
    name: "hgb",
    control: form.control,
  });
  const plt = useWatch({
    name: "plt",
    control: form.control,
  });
  const mcv = useWatch({
    name: "mcv",
    control: form.control,
  });
  const rdw = useWatch({
    name: "rdw",
    control: form.control,
  });
  const peripheralSmear = useWatch({
    name: "peripheralSmear",
    control: form.control,
  });

  const onSubmit = (values: z.infer<typeof MarrowReportSchema>) => {
    setError("");
    setSuccess("");

    console.log(values);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-4">
      <div className="mb-10 lg:mb-0">
        <MarrowForm form={form} onSubmit={onSubmit} />
      </div>
      <div>
        <MarrowPrelimReport
          finalDiagnosis={finalDiagnosis}
          impression={impression}
          wbc={wbc}
          hgb={hgb}
          plt={plt}
          mcv={mcv}
          rdw={rdw}
          peripheralSmear={peripheralSmear}
        />
      </div>
    </div>
  );
}
