'use client';

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  businessName: z.string().min(1, "Required"),
  fullName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone"),
  website: z.string().url("Must be a valid URL").optional(),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept terms"),
  file: z.any().optional()
});

export default function ClientOnboardingForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    if (data.file?.[0]) {
      formData.append("file", data.file[0]);
    }

    const res = await fetch("/api/onboard", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Form submitted!");
    } else {
      alert("Error submitting form.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Business Name" {...register("businessName")} />
      {errors.businessName && <p className="text-red-500">{errors.businessName.message}</p>}

      <Input placeholder="Full Name" {...register("fullName")} />
      {errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>}

      <Input placeholder="Email" type="email" {...register("email")} />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <Input placeholder="Phone" type="tel" {...register("phone")} />
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}

      <Input type="file" {...register("file")} />

      <Button type="submit" disabled={loading}>
        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
