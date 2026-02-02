"use client";

import { useState, useTransition } from "react";

import { saveProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProfileFormProps = {
  profile?: {
    fullName?: string | null;
    companyName?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
    phone?: string | null;
    billingEmail?: string | null;
    taxId?: string | null;
    defaultTerms?: string | null;
    defaultNotes?: string | null;
    defaultDueDays?: number | null;
  } | null;
};

export const ProfileForm = ({ profile }: ProfileFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    startTransition(async () => {
      const result = await saveProfileAction({
        fullName: String(payload.fullName || ""),
        companyName: String(payload.companyName || ""),
        addressLine1: String(payload.addressLine1 || ""),
        addressLine2: String(payload.addressLine2 || ""),
        city: String(payload.city || ""),
        state: String(payload.state || ""),
        postalCode: String(payload.postalCode || ""),
        country: String(payload.country || ""),
        phone: String(payload.phone || ""),
        billingEmail: payload.billingEmail
          ? String(payload.billingEmail)
          : undefined,
        taxId: String(payload.taxId || ""),
        defaultTerms: String(payload.defaultTerms || ""),
        defaultNotes: String(payload.defaultNotes || ""),
        defaultDueDays: payload.defaultDueDays
          ? Number(payload.defaultDueDays)
          : undefined,
      });

      if (result.success) {
        setMessage("Profile updated.");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              defaultValue={profile?.fullName ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              name="companyName"
              defaultValue={profile?.companyName ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="billingEmail">Billing email</Label>
            <Input
              id="billingEmail"
              name="billingEmail"
              type="email"
              defaultValue={profile?.billingEmail ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address line 1</Label>
            <Input
              id="addressLine1"
              name="addressLine1"
              defaultValue={profile?.addressLine1 ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address line 2</Label>
            <Input
              id="addressLine2"
              name="addressLine2"
              defaultValue={profile?.addressLine2 ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" defaultValue={profile?.city ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input id="state" name="state" defaultValue={profile?.state ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              defaultValue={profile?.postalCode ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              defaultValue={profile?.country ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax/VAT</Label>
            <Input id="taxId" name="taxId" defaultValue={profile?.taxId ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultDueDays">Default due days</Label>
            <Input
              id="defaultDueDays"
              name="defaultDueDays"
              type="number"
              min="1"
              max="365"
              defaultValue={profile?.defaultDueDays ?? 14}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="defaultTerms">Default terms</Label>
            <Textarea
              id="defaultTerms"
              name="defaultTerms"
              defaultValue={profile?.defaultTerms ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="defaultNotes">Default notes</Label>
            <Textarea
              id="defaultNotes"
              name="defaultNotes"
              defaultValue={profile?.defaultNotes ?? ""}
            />
          </div>
        </CardContent>
      </Card>

      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save profile"}
        </Button>
      </div>
    </form>
  );
};
