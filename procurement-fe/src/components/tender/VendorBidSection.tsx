"use client";
import React, { useState } from "react";
import Link from "next/link";
import { IconGavel, IconCurrencyDollar, IconCheck } from "@tabler/icons-react";
import { useGetMyVendorQuery, useCreateVendorMutation } from "@/src/store/api/vendorApi";
import { useGetBidsByVendorQuery, useCreateBidMutation } from "@/src/store/api/bidApi";
import { notifications } from "@mantine/notifications";
import type { Tender } from "@/src/types";
import { vendorSchema, bidSchema } from "@/src/lib/schemas";

interface Props {
  tender: Tender;
  closing: string;
}

export default function VendorBidSection({ tender, closing }: Props) {
  const canBid = tender.status === "published" && closing !== "Closed";

  const { data: vendor, isLoading: vendorLoading, isError: vendorError } = useGetMyVendorQuery(undefined);
  const { data: myBids = [], isLoading: myBidsLoading } = useGetBidsByVendorQuery(undefined, { skip: !vendor?.id });
  const hasAlreadyBid    = myBids.some((b) => b.tenderId === tender.id);
  const hasVendorProfile = !!vendor && !vendorError;

  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorForm, setVendorForm] = useState({ name: "", registrationNumber: "", email: "", phoneNumber: "" });
  const [vendorErrors, setVendorErrors] = useState<Record<string, string>>({});
  const [createVendor, { isLoading: isCreatingVendor }] = useCreateVendorMutation();

  const [bidAmount, setBidAmount]   = useState("");
  const [bidAmountError, setBidAmountError] = useState<string | null>(null);
  const [showBidForm, setShowBidForm] = useState(false);
  const [createBid, { isLoading: isSubmitting }] = useCreateBidMutation();

  async function handleSubmitBid(e: React.FormEvent) {
    e.preventDefault();
    if (!vendor?.id) return;

    const parsed = bidSchema.safeParse({ amount: bidAmount });
    if (!parsed.success) {
      setBidAmountError(parsed.error.issues[0].message);
      return;
    }
    setBidAmountError(null);

    try {
      await createBid({ tenderId: tender.id, vendorId: vendor.id, amount: Number(parsed.data.amount) }).unwrap();
      notifications.show({ title: "Bid Submitted", message: "Your bid has been submitted successfully.", color: "green" });
      setBidAmount(""); setShowBidForm(false);
    } catch {
      notifications.show({ title: "Error", message: "Failed to submit bid.", color: "red" });
    }
  }

  async function handleCreateVendor(e: React.FormEvent) {
    e.preventDefault();

    const parsed = vendorSchema.safeParse(vendorForm);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => { errors[String(issue.path[0])] = issue.message; });
      setVendorErrors(errors);
      return;
    }
    setVendorErrors({});

    try {
      await createVendor({ name: parsed.data.name, registrationNumber: parsed.data.registrationNumber, email: parsed.data.email || undefined, phoneNumber: parsed.data.phoneNumber || undefined }).unwrap();
      notifications.show({ title: "Vendor Created", message: "Your vendor profile is ready.", color: "green" });
      setShowVendorForm(false);
    } catch {
      notifications.show({ title: "Error", message: "Failed to create vendor profile.", color: "red" });
    }
  }

  if (vendorLoading || myBidsLoading) return (
    <div className="mt-6 bg-(--bg-surface) border border-(--border) rounded-2xl px-8 py-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-(--bg-elevated) animate-pulse" />
        <div className="space-y-2"><div className="h-3 w-32 bg-(--bg-elevated) rounded animate-pulse" /><div className="h-2.5 w-48 bg-(--bg-elevated) rounded animate-pulse" /></div>
      </div>
    </div>
  );

  return (
    <div className="mt-6 bg-(--bg-surface) border border-(--border) rounded-2xl overflow-hidden">
      <div className="px-8 py-5">
        {!hasVendorProfile ? (
          showVendorForm ? (
            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div><h2 className="text-sm font-semibold text-(--text-primary)">Create Vendor Profile</h2><p className="text-xs text-(--text-subtle) mt-0.5">You need a vendor profile before you can submit bids.</p></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Company name", field: "name", required: true, placeholder: "Acme Corporation" },
                  { label: "Registration number", field: "registrationNumber", required: true, placeholder: "REG-123456" },
                  { label: "Email (optional)", field: "email", required: false, placeholder: "vendor@company.com" },
                  { label: "Phone (optional)", field: "phoneNumber", required: false, placeholder: "+1 234 567 8900" },
                ].map(({ label, field, required, placeholder }) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-(--text-subtle) mb-1">{label}{required && <span className="text-red-400"> *</span>}</label>
                    <input required={required} value={(vendorForm as Record<string, string>)[field]} placeholder={placeholder}
                      onChange={(e) => { setVendorForm((f) => ({ ...f, [field]: e.target.value })); setVendorErrors((er) => ({ ...er, [field]: "" })); }}
                      className={`w-full bg-(--bg-input) border rounded-lg px-3 py-2 text-sm text-(--text-primary) placeholder-(--text-faint) outline-none focus:border-indigo-500 transition-colors ${vendorErrors[field] ? "border-red-500" : "border-(--border-strong)"}`} />
                    {vendorErrors[field] && <p className="text-xs text-red-400 mt-1">{vendorErrors[field]}</p>}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-1">
                <button type="submit" disabled={isCreatingVendor} className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors disabled:opacity-50">{isCreatingVendor ? "Creating..." : "Create Vendor Profile"}</button>
                <button type="button" onClick={() => setShowVendorForm(false)} className="px-4 py-2.5 rounded-lg border border-(--border-strong) text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors">Cancel</button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-950/60 flex items-center justify-center shrink-0"><IconGavel size={18} className="text-orange-400" /></div>
                <div><p className="text-sm font-semibold text-(--text-primary)">Vendor profile required</p><p className="text-xs text-(--text-subtle) mt-0.5">You need a vendor profile to submit bids.</p></div>
              </div>
              <button onClick={() => setShowVendorForm(true)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-sm font-semibold cursor-pointer text-white transition-colors">Create Vendor Profile</button>
            </div>
          )
        ) : hasAlreadyBid ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-950/60 flex items-center justify-center"><IconCheck size={18} className="text-emerald-400" /></div>
            <div><p className="text-sm font-semibold text-emerald-400">Bid Submitted</p><p className="text-xs text-(--text-subtle) mt-0.5">You have already submitted a bid. <Link href="/bids/my" className="text-indigo-400 hover:text-indigo-300 transition-colors">View my bids →</Link></p></div>
          </div>
        ) : !canBid ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-(--bg-elevated) flex items-center justify-center"><IconGavel size={18} className="text-(--text-faint)" /></div>
            <div><p className="text-sm font-medium text-(--text-subtle)">Bidding not available</p><p className="text-xs text-(--text-faint) mt-0.5">This tender is {tender.status} and is not accepting bids.</p></div>
          </div>
        ) : showBidForm ? (
          <form onSubmit={handleSubmitBid}>
            <h2 className="text-sm font-semibold text-(--text-primary) mb-4">Submit Your Bid</h2>
            <div className="flex items-center gap-3">
              <div className={`flex-1 flex items-center bg-(--bg-input) border rounded-lg px-3 py-2.5 gap-2 focus-within:border-indigo-500 transition-colors ${bidAmountError ? "border-red-500" : "border-(--border-strong)"}`}>
                <IconCurrencyDollar size={15} className="text-(--text-faint) shrink-0" />
                <input type="number" value={bidAmount} onChange={(e) => { setBidAmount(e.target.value); setBidAmountError(null); }} placeholder="Enter bid amount" min={1} step="0.01" required autoFocus
                  className="bg-transparent text-sm text-(--text-primary) placeholder-(--text-faint) outline-none flex-1" />
              </div>
              <button type="submit" disabled={isSubmitting || !bidAmount} className="px-5 py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors disabled:opacity-50">{isSubmitting ? "Submitting..." : "Submit Bid"}</button>
              <button type="button" onClick={() => { setShowBidForm(false); setBidAmountError(null); }} className="px-4 py-2.5 rounded-lg border border-(--border-strong) text-sm text-(--text-subtle) hover:text-(--text-primary) transition-colors">Cancel</button>
            </div>
            {bidAmountError && <p className="text-xs text-red-400 mt-2">{bidAmountError}</p>}
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-950/60 flex items-center justify-center"><IconGavel size={18} className="text-indigo-400" /></div>
              <div><p className="text-sm font-semibold text-(--text-primary)">Submit a Bid</p><p className="text-xs text-(--text-subtle) mt-0.5">Estimated value: ${Number(tender.estimatedValue).toLocaleString()}</p></div>
            </div>
            <button onClick={() => setShowBidForm(true)} className="flex items-center gap-1.5 px-5 py-2.5 cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition-colors">
              <IconGavel size={15} /> Place Bid
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
