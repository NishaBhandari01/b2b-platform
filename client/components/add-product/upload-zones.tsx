"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, FileText, Star, Loader2 } from "lucide-react";
import type { UploadedImage, UploadedDocument } from "@/lib/schemas/product-schema";
import { uploadFileApi } from "@/lib/api/product.api";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Simulates an upload so the UI has real progress feedback without a backend wired up yet. */
function simulateUpload(onProgress: (pct: number) => void, onDone: () => void) {
  let pct = 0;
  const interval = setInterval(() => {
    pct = Math.min(100, pct + Math.random() * 30 + 10);
    onProgress(Math.round(pct));
    if (pct >= 100) {
      clearInterval(interval);
      onDone();
    }
  }, 220);
}

/* ------------------------------------------------------------------ */
/*  Image dropzone — used for main image (single) and gallery (multi)  */
/* ------------------------------------------------------------------ */

export function ImageDropzone({
  images,
  onChange,
  multiple = false,
  maxImages = 8,
  helperText,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
  maxImages?: number;
  helperText?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (files.length === 0) return;

    const room = multiple ? Math.max(0, maxImages - images.length) : 1;
    const accepted = files.slice(0, room || files.length);

    const newImages: UploadedImage[] = accepted.map((file) => ({
      id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
    }));

    let working = multiple ? [...images, ...newImages] : newImages;
    onChange(working);

    newImages.forEach((img) => {
      if (img.file) {
        uploadFileApi(
          img.file,
          (pct) => {
            working = working.map((i) => (i.id === img.id ? { ...i, progress: pct } : i));
            onChange(working);
          }
        )
          .then((res) => {
            working = working.map((i) =>
              i.id === img.id
                ? { ...i, status: "done", progress: 100, url: res.url, publicId: res.publicId }
                : i
            );
            onChange(working);
          })
          .catch(() => {
            working = working.map((i) =>
              i.id === img.id ? { ...i, status: "error", progress: 0 } : i
            );
            onChange(working);
          });
      }
    });
  };

  const removeImage = (id: string) => onChange(images.filter((i) => i.id !== id));

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragging
            ? "border-emerald-400 bg-emerald-50"
            : "border-slate-200 bg-slate-50/60 hover:border-emerald-300 hover:bg-emerald-50/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
          <UploadCloud className="h-5 w-5 text-emerald-600" />
        </div>
        <p className="text-[13px] font-semibold text-slate-700">
          Drag & drop images here, or{" "}
          <span className="text-emerald-600 underline underline-offset-2">browse</span>
        </p>
        <p className="mt-1 text-[12px] text-slate-400">
          {helperText ?? "PNG or JPG, up to 10MB each"}
          {multiple && ` · ${images.length}/${maxImages} uploaded`}
        </p>
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
            >
              <img src={img.url} alt={img.name} className="h-full w-full object-cover" />

              {img.status === "uploading" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-900/55 backdrop-blur-[1px]">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span className="text-[10px] font-semibold text-white">{img.progress}%</span>
                  <div className="h-1 w-3/4 overflow-hidden rounded-full bg-white/30">
                    <div
                      className="h-full rounded-full bg-white transition-all"
                      style={{ width: `${img.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {!multiple && idx === 0 && (
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-md bg-slate-900/85 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  Main
                </span>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(img.id);
                }}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/70 text-white opacity-0 transition-opacity hover:bg-rose-600 group-hover:opacity-100"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Document dropzone — single-file slot (brochure, datasheet, etc.)   */
/* ------------------------------------------------------------------ */

export function DocumentSlot({
  label,
  accept = ".pdf,.doc,.docx",
  document,
  onChange,
}: {
  label: string;
  accept?: string;
  document?: UploadedDocument;
  onChange: (doc: UploadedDocument | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file: File) => {
    const doc: UploadedDocument = {
      id: `doc_${Date.now()}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
    };
    onChange(doc);
    uploadFileApi(
      file,
      (pct) => onChange({ ...doc, progress: pct })
    )
      .then((res) => {
        onChange({
          ...doc,
          progress: 100,
          status: "done",
          url: res.url,
          publicId: res.publicId,
        });
      })
      .catch(() => {
        onChange({
          ...doc,
          progress: 0,
          status: "error",
        });
      });
  };

  if (document) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <FileText className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-slate-800">{label}</p>
          <p className="truncate text-[12px] text-slate-400">
            {document.name} · {formatBytes(document.size)}
          </p>
          {document.status === "uploading" && (
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${document.progress}%` }}
              />
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Remove ${label}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
      }}
      className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed p-3 transition-colors ${
        isDragging
          ? "border-emerald-400 bg-emerald-50"
          : "border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        <UploadCloud className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-semibold text-slate-700">{label}</p>
        <p className="text-[12px] text-slate-400">
          Drop a file or <span className="text-emerald-600 underline underline-offset-2">browse</span> · PDF, DOC, DOCX
        </p>
      </div>
    </div>
  );
}
