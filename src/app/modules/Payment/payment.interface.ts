// Interface defining the structure of payment data
export interface PaymentData {
  transactionID: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
}
