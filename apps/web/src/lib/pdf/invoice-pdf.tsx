import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

type InvoicePdfItem = {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type InvoicePdfData = {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  status: string;
  company: {
    name?: string | null;
    fullName?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    taxId?: string | null;
  };
  client: {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    taxId?: string | null;
  };
  items: InvoicePdfItem[];
  total: string;
  notes?: string | null;
  terms?: string | null;
};

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    padding: 32,
    color: "#0f172a",
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 9,
    textTransform: "uppercase",
    color: "#64748b",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 6,
    marginBottom: 6,
    fontWeight: 600,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottom: "1px solid #f1f5f9",
  },
  colDescription: { width: "45%" },
  colQty: { width: "15%", textAlign: "right" },
  colPrice: { width: "20%", textAlign: "right" },
  colTotal: { width: "20%", textAlign: "right" },
  totalRow: {
    marginTop: 12,
    paddingTop: 8,
    borderTop: "1px solid #e2e8f0",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export const InvoicePdf = ({ data }: { data: InvoicePdfData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Invoice</Text>
          <Text>#{data.invoiceNumber}</Text>
        </View>
        <View>
          <Text style={styles.label}>Issued</Text>
          <Text>{data.issueDate}</Text>
          <Text style={styles.label}>Due</Text>
          <Text>{data.dueDate}</Text>
          <Text style={styles.label}>Status</Text>
          <Text>{data.status}</Text>
        </View>
      </View>

      <View style={[styles.section, styles.row]}>
        <View>
          <Text style={styles.label}>From</Text>
          <Text>{data.company.name || data.company.fullName || "Your Company"}</Text>
          {data.company.address ? <Text>{data.company.address}</Text> : null}
          {data.company.email ? <Text>{data.company.email}</Text> : null}
          {data.company.phone ? <Text>{data.company.phone}</Text> : null}
          {data.company.taxId ? <Text>Tax/VAT: {data.company.taxId}</Text> : null}
        </View>
        <View>
          <Text style={styles.label}>Bill to</Text>
          <Text>{data.client.name}</Text>
          {data.client.address ? <Text>{data.client.address}</Text> : null}
          {data.client.email ? <Text>{data.client.email}</Text> : null}
          {data.client.phone ? <Text>{data.client.phone}</Text> : null}
          {data.client.taxId ? <Text>Tax/VAT: {data.client.taxId}</Text> : null}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.tableHeader}>
          <Text style={styles.colDescription}>Description</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colPrice}>Price</Text>
          <Text style={styles.colTotal}>Total</Text>
        </View>
        {data.items.map((item, index) => (
          <View key={`${item.description}-${index}`} style={styles.tableRow}>
            <Text style={styles.colDescription}>{item.description}</Text>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colPrice}>{item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.colTotal}>{item.lineTotal.toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text>Total</Text>
          <Text>{data.total}</Text>
        </View>
      </View>

      {data.notes ? (
        <View style={styles.section}>
          <Text style={styles.label}>Notes</Text>
          <Text>{data.notes}</Text>
        </View>
      ) : null}

      {data.terms ? (
        <View style={styles.section}>
          <Text style={styles.label}>Terms</Text>
          <Text>{data.terms}</Text>
        </View>
      ) : null}
    </Page>
  </Document>
);
