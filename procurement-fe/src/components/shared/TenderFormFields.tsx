"use client";
import React from "react";
import { STATUS_OPTIONS } from "./constants";
import type { TenderStatus, FormState } from "@/src/types";

interface Props {
  form: FormState;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  errors?: Record<string, string>;
}

const INPUT_CLS =
  "w-full bg-(--bg-input) border border-(--border) rounded-lg px-4 py-2.5 text-sm text-(--text-primary) placeholder-(--text-faint) outline-none focus:border-indigo-500 transition-colors";
const INPUT_ERR =
  "w-full bg-(--bg-input) border border-red-500 rounded-lg px-4 py-2.5 text-sm text-(--text-primary) placeholder-(--text-faint) outline-none focus:border-red-400 transition-colors";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-400 mt-1">{msg}</p>;
}

export default function TenderFormFields({
  form,
  onChange,
  errors = {},
}: Props) {
  return (
    <>
     
      <div>
        <label className="block text-xs font-medium text-(--text-muted) mb-1.5">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={onChange}
          required
          placeholder="e.g. Construction of New Office Building"
          className={errors.title ? INPUT_ERR : INPUT_CLS}
        />
        <FieldError msg={errors.title} />
      </div>

      <div>
        <label className="block text-xs font-medium text-(--text-muted) mb-1.5">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          name="name"
          value={form.name}
          onChange={onChange}
          className={errors.name ? INPUT_ERR : INPUT_CLS}
        >
          {[
            "Infrastructure",
            "Logistic",
            "Education",
            "HealthCare",
            "Technology",
            "Environment",
          ].map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <FieldError msg={errors.name} />
      </div>

      <div>
        <label className="block text-xs font-medium text-(--text-muted) mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          rows={4}
          placeholder="Describe the tender scope and requirements..."
          className={`${errors.description ? INPUT_ERR : INPUT_CLS} resize-none`}
        />
        <FieldError msg={errors.description} />
      </div>

      <div>
        <label className="block text-xs font-medium text-(--text-muted) mb-1.5">
          Status <span className="text-red-400">*</span>
        </label>
        <select
          name="status"
          value={form.status}
          onChange={onChange}
          required
          className={`${errors.status ? INPUT_ERR : INPUT_CLS} appearance-none cursor-pointer`}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <FieldError msg={errors.status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-(--text-muted) mb-1.5">
            Closing Date <span className="text-red-400">*</span>
          </label>
          <input
            type="datetime-local"
            name="closingDate"
            value={form.closingDate ?? ""}
            onChange={onChange}
            required
            className={errors.closingDate ? INPUT_ERR : INPUT_CLS}
          />
          <FieldError msg={errors.closingDate} />
        </div>
        <div>
          <label className="block text-xs font-medium text-(--text-muted) mb-1.5">
            Estimated Value ($) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            name="estimatedValue"
            value={form.estimatedValue}
            onChange={onChange}
            required
            min={0}
            step="0.01"
            placeholder="e.g. 1000000"
            className={errors.estimatedValue ? INPUT_ERR : INPUT_CLS}
          />
          <FieldError msg={errors.estimatedValue} />
        </div>
      </div>
    </>
  );
}
