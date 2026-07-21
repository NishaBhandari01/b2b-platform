// "use client";

// import { useFormContext } from "react-hook-form";
// import { Tag, Layers } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Field, SectionCard } from "@/components/add-product/form-primitives";
// import type { ProductFormValues } from "@/lib/schemas/product-schema";

// const CATEGORY_OPTIONS = [
//   "Steel & Metal",
//   "Industrial Components",
//   "Electrical Equipment",
//   "Fasteners",
//   "Chemicals",
//   "Textiles & Fabrics",
//   "Packaging",
//   "Machinery",
// ];

// const SUBCATEGORY_MAP: Record<string, string[]> = {
//   "Steel & Metal": [
//     "Beams & Channels",
//     "Sheets & Plates",
//     "Pipes & Tubes",
//     "Wire & Mesh",
//   ],
//   "Industrial Components": [
//     "Bearings",
//     "Hydraulics",
//     "Pneumatics",
//     "Gearboxes",
//   ],
//   "Electrical Equipment": [
//     "Motors",
//     "Cables & Wires",
//     "Switchgear",
//     "Transformers",
//   ],
//   Fasteners: ["Bolts & Nuts", "Screws", "Washers", "Rivets"],
//   Chemicals: ["Industrial Solvents", "Adhesives", "Coatings"],
//   "Textiles & Fabrics": ["Technical Fabrics", "Yarns", "Nonwovens"],
//   Packaging: ["Corrugated Boxes", "Industrial Drums", "Pallets"],
//   Machinery: ["CNC Machines", "Compressors", "Conveyors"],
// };

// export function StepBasicInfo() {
//   const {
//     register,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useFormContext<ProductFormValues>();

//   const category = watch("category");
//   const subOptions = category ? (SUBCATEGORY_MAP[category] ?? []) : [];

//   return (
//     <SectionCard
//       title="Basic Information"
//       description="Start with what buyers will see first — name, category, and identifiers."
//       icon={<Tag className="h-5 w-5" />}
//     >
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//         <Field
//           label="Product Name"
//           required
//           error={errors.productName?.message as string}
//           className="sm:col-span-2"
//         >
//           <Input
//             {...register("productName")}
//             placeholder="e.g. Galvanized Steel I-Beams"
//             className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
//           />
//         </Field>

//         <Field
//           label="Category"
//           required
//           error={errors.category?.message as string}
//         >
//           <Select
//             value={category || ""}
//             onValueChange={(v: any) => {
//               setValue("category", v, { shouldValidate: true });
//               setValue("subCategory", "");
//             }}
//           >
//             <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-emerald-200">
//               <SelectValue placeholder="Select a category" />
//             </SelectTrigger>
//             <SelectContent>
//               {CATEGORY_OPTIONS.map((c) => (
//                 <SelectItem key={c} value={c}>
//                   {c}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </Field>

//         <Field
//           label="Sub Category"
//           hint={!category ? "Select a category first" : undefined}
//         >
//           <Select
//             value={watch("subCategory")}
//             onValueChange={(v: any) => setValue("subCategory", v)}
//             disabled={!category}
//           >
//             <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-emerald-200 disabled:opacity-50">
//               <SelectValue placeholder="Select a sub category" />
//             </SelectTrigger>
//             <SelectContent>
//               {subOptions.map((s) => (
//                 <SelectItem key={s} value={s}>
//                   {s}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </Field>

//         <Field label="Brand">
//           <Input
//             {...register("brand")}
//             placeholder="e.g. TataSteel"
//             className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
//           />
//         </Field>

//         <Field label="Model Number">
//           <Input
//             {...register("modelNumber")}
//             placeholder="e.g. GSB-4402"
//             className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
//           />
//         </Field>

//         <Field label="SKU" hint="Leave blank to auto-generate">
//           <Input
//             {...register("sku")}
//             placeholder="e.g. STL-BEAM-001"
//             className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
//           />
//         </Field>

//         <Field
//           label="Product Status"
//           required
//           error={errors.status?.message as string}
//           className="sm:col-span-2"
//         >
//           <div className="flex flex-wrap gap-2.5">
//             {[
//               { value: "draft", label: "Draft", hint: "Not visible to buyers" },
//               {
//                 value: "active",
//                 label: "Active",
//                 hint: "Live in the marketplace",
//               },
//               {
//                 value: "out_of_stock",
//                 label: "Out of Stock",
//                 hint: "Visible, not orderable",
//               },
//             ].map((opt) => {
//               const selected = watch("status") === opt.value;
//               return (
//                 <button
//                   key={opt.value}
//                   type="button"
//                   onClick={() =>
//                     setValue(
//                       "status",
//                       opt.value as ProductFormValues["status"],
//                       {
//                         shouldValidate: true,
//                       },
//                     )
//                   }
//                   className={`flex flex-col items-start rounded-xl border px-4 py-2.5 text-left transition-colors ${
//                     selected
//                       ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
//                       : "border-slate-200 bg-white hover:border-slate-300"
//                   }`}
//                 >
//                   <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
//                     <Layers className="h-3.5 w-3.5 text-slate-400" />
//                     {opt.label}
//                   </span>
//                   <span className="mt-0.5 text-[11px] text-slate-400">
//                     {opt.hint}
//                   </span>
//                 </button>
//               );
//             })}
//           </div>
//         </Field>
//       </div>
//     </SectionCard>
//   );
// }

"use client";

import { useFormContext } from "react-hook-form";
import { Tag, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, SectionCard } from "@/components/add-product/form-primitives";
import type { ProductFormValues } from "@/lib/schemas/product-schema";

const CATEGORY_OPTIONS = [
  "Steel & Metal",
  "Industrial Components",
  "Electrical Equipment",
  "Fasteners",
  "Chemicals",
  "Textiles & Fabrics",
  "Packaging",
  "Machinery",
];

const SUBCATEGORY_MAP: Record<string, string[]> = {
  "Steel & Metal": [
    "Beams & Channels",
    "Sheets & Plates",
    "Pipes & Tubes",
    "Wire & Mesh",
  ],
  "Industrial Components": [
    "Bearings",
    "Hydraulics",
    "Pneumatics",
    "Gearboxes",
  ],
  "Electrical Equipment": [
    "Motors",
    "Cables & Wires",
    "Switchgear",
    "Transformers",
  ],
  Fasteners: ["Bolts & Nuts", "Screws", "Washers", "Rivets"],
  Chemicals: ["Industrial Solvents", "Adhesives", "Coatings"],
  "Textiles & Fabrics": ["Technical Fabrics", "Yarns", "Nonwovens"],
  Packaging: ["Corrugated Boxes", "Industrial Drums", "Pallets"],
  Machinery: ["CNC Machines", "Compressors", "Conveyors"],
};

export function StepBasicInfo() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ProductFormValues>();

  const category = watch("category") ?? "";
  const subCategory = watch("subCategory") ?? "";
  const status = watch("status") ?? "draft";

  const subOptions = category ? (SUBCATEGORY_MAP[category] ?? []) : [];

  return (
    <SectionCard
      title="Basic Information"
      description="Start with what buyers will see first — name, category, and identifiers."
      icon={<Tag className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Product Name */}
        <Field
          label="Product Name"
          required
          error={errors.productName?.message as string}
          className="sm:col-span-2"
        >
          <Input
            {...register("productName")}
            placeholder="e.g. Galvanized Steel I-Beams"
            className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
          />
        </Field>

        {/* Category */}
        <Field
          label="Category"
          required
          error={errors.category?.message as string}
        >
          <Select
            value={category}
            onValueChange={(value: any) => {
              setValue("category", value, {
                shouldValidate: true,
                shouldDirty: true,
              });

              setValue("subCategory", "", {
                shouldValidate: true,
                shouldDirty: true,
              });
            }}
          >
            <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-emerald-200">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>

            <SelectContent>
              {CATEGORY_OPTIONS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Sub Category */}
        <Field
          label="Sub Category"
          hint={!category ? "Select a category first" : undefined}
        >
          <Select
            value={subCategory}
            onValueChange={(value: any) =>
              setValue("subCategory", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
            disabled={!category}
          >
            <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-emerald-200 disabled:opacity-50">
              <SelectValue placeholder="Select a sub category" />
            </SelectTrigger>

            <SelectContent>
              {subOptions.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {/* Brand */}
        <Field label="Brand">
          <Input
            {...register("brand")}
            placeholder="e.g. TataSteel"
            className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
          />
        </Field>

        {/* Model Number */}
        <Field label="Model Number">
          <Input
            {...register("modelNumber")}
            placeholder="e.g. GSB-4402"
            className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
          />
        </Field>

        {/* SKU */}
        <Field label="SKU" hint="Leave blank to auto-generate">
          <Input
            {...register("sku")}
            placeholder="e.g. STL-BEAM-001"
            className="h-10 border-slate-200 text-sm focus-visible:ring-emerald-200"
          />
        </Field>

        {/* Product Status */}
        <Field
          label="Product Status"
          required
          error={errors.status?.message as string}
          className="sm:col-span-2"
        >
          <div className="flex flex-wrap gap-2.5">
            {[
              {
                value: "draft",
                label: "Draft",
                hint: "Not visible to buyers",
              },
              {
                value: "active",
                label: "Active",
                hint: "Live in the marketplace",
              },
              {
                value: "out_of_stock",
                label: "Out of Stock",
                hint: "Visible, not orderable",
              },
            ].map((option) => {
              const selected = status === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setValue(
                      "status",
                      option.value as ProductFormValues["status"],
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }
                  className={`flex flex-col items-start rounded-xl border px-4 py-2.5 text-left transition-colors ${
                    selected
                      ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-800">
                    <Layers className="h-3.5 w-3.5 text-slate-400" />
                    {option.label}
                  </span>

                  <span className="mt-0.5 text-[11px] text-slate-400">
                    {option.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </Field>
      </div>
    </SectionCard>
  );
}
