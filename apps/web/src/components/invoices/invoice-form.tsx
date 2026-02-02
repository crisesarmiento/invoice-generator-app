"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

import { createClientAction } from "@/actions/clients";
import { createInvoiceAction, updateInvoiceAction } from "@/actions/invoices";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";

type ClientOption = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  taxId?: string | null;
};

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

type InvoiceFormDefaults = {
  defaultNotes?: string | null;
  defaultTerms?: string | null;
  defaultDueDays?: number | null;
};

type InvoiceFormProps = {
  clients: ClientOption[];
  defaults: InvoiceFormDefaults;
  invoice?: {
    id: string;
    clientId: string;
    issueDate: string;
    dueDate: string;
    status: "DRAFT" | "SENT" | "PAID" | "OVERDUE";
    notes?: string | null;
    terms?: string | null;
    items: InvoiceItem[];
  };
};

const emptyItem = (): InvoiceItem => ({
  description: "",
  quantity: 1,
  unitPrice: 0,
});

export const InvoiceForm = ({ clients, defaults, invoice }: InvoiceFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clientOptions, setClientOptions] = useState<ClientOption[]>(clients);
  const [clientId, setClientId] = useState(invoice?.clientId ?? "");
  const [issueDate, setIssueDate] = useState(
    invoice?.issueDate ?? new Date().toISOString().slice(0, 10),
  );
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate ??
      new Date(
        Date.now() +
          (defaults.defaultDueDays ?? 14) * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .slice(0, 10),
  );
  const [status, setStatus] = useState<
    "DRAFT" | "SENT" | "PAID" | "OVERDUE"
  >(invoice?.status ?? "DRAFT");
  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items.length ? invoice.items : [emptyItem()],
  );
  const [notes, setNotes] = useState(invoice?.notes ?? defaults.defaultNotes ?? "");
  const [terms, setTerms] = useState(invoice?.terms ?? defaults.defaultTerms ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isClientDialogOpen, setClientDialogOpen] = useState(false);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
    [items],
  );

  const selectedClient = clientOptions.find((client) => client.id === clientId);

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]:
                field === "description" ? value : Number.parseFloat(value || "0"),
            }
          : item,
      ),
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);
  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== index));

  const submitInvoice = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!clientId) {
      setError("Please select a client.");
      return;
    }

    startTransition(async () => {
      const payload = {
        clientId,
        issueDate,
        dueDate,
        status,
        notes,
        terms,
        items,
      };

      const result = invoice
        ? await updateInvoiceAction(invoice.id, payload)
        : await createInvoiceAction(payload);

      if (!result.success) {
        setError(result.error ?? "Unable to save invoice.");
        return;
      }

      router.push("/dashboard");
    });
  };

  const createClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? "") || undefined,
      phone: String(formData.get("phone") ?? "") || undefined,
      addressLine1: String(formData.get("addressLine1") ?? "") || undefined,
      addressLine2: String(formData.get("addressLine2") ?? "") || undefined,
      city: String(formData.get("city") ?? "") || undefined,
      state: String(formData.get("state") ?? "") || undefined,
      postalCode: String(formData.get("postalCode") ?? "") || undefined,
      country: String(formData.get("country") ?? "") || undefined,
      taxId: String(formData.get("taxId") ?? "") || undefined,
    };

    const result = await createClientAction(payload);
    if (result.success && result.client) {
      setClientOptions((prev) => [...prev, result.client]);
      setClientId(result.client.id);
      formElement.reset();
      setClientDialogOpen(false);
      return;
    }

    setError(result.error ?? "Unable to create client.");
  };

  return (
    <form onSubmit={submitInvoice} className="space-y-6">
      <Card>
        <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Client</Label>
            <div className="flex gap-2">
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clientOptions.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isClientDialogOpen} onOpenChange={setClientDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New client</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4" onSubmit={createClient}>
                    <div className="space-y-2">
                      <Label htmlFor="name">Client name</Label>
                      <Input id="name" name="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1">Address line 1</Label>
                      <Input id="addressLine1" name="addressLine1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2">Address line 2</Label>
                      <Input id="addressLine2" name="addressLine2" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" name="state" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal code</Label>
                        <Input id="postalCode" name="postalCode" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" name="country" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax/VAT</Label>
                      <Input id="taxId" name="taxId" />
                    </div>
                    <Button type="submit" className="w-full">
                      Save client
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {selectedClient ? (
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                <div className="font-semibold text-slate-700 dark:text-slate-200">
                  {selectedClient.name}
                </div>
                {selectedClient.email ? <div>{selectedClient.email}</div> : null}
                {selectedClient.phone ? <div>{selectedClient.phone}</div> : null}
                {selectedClient.addressLine1 ? (
                  <div>
                    {selectedClient.addressLine1}
                    {selectedClient.addressLine2
                      ? `, ${selectedClient.addressLine2}`
                      : ""}
                  </div>
                ) : null}
                {selectedClient.city || selectedClient.state ? (
                  <div>
                    {[selectedClient.city, selectedClient.state, selectedClient.postalCode]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                ) : null}
                {selectedClient.country ? <div>{selectedClient.country}</div> : null}
                {selectedClient.taxId ? <div>Tax/VAT: {selectedClient.taxId}</div> : null}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SENT">Sent</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="issueDate">Invoice date</Label>
            <Input
              id="issueDate"
              type="date"
              value={issueDate}
              onChange={(event) => setIssueDate(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Line items</h3>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="mr-1 h-4 w-4" />
              Add item
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={`${item.description}-${index}`}
                className="grid gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800 md:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={item.description}
                    onChange={(event) =>
                      updateItem(index, "description", event.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Qty</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(index, "quantity", event.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unit price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(event) =>
                      updateItem(index, "unitPrice", event.target.value)
                    }
                    required
                  />
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </div>
                  {items.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end text-lg font-semibold">
            Total: {formatCurrency(total)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Optional notes for your client"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="terms">Terms</Label>
            <Textarea
              id="terms"
              value={terms}
              onChange={(event) => setTerms(event.target.value)}
              placeholder="Default payment terms"
            />
          </div>
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save invoice"}
        </Button>
      </div>
    </form>
  );
};
