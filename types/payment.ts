export type DonationCause =
  | "general"
  | "building"
  | "missions"
  | "compassion"
  | "youth";

export type DonationFrequency = "one-time" | "monthly";

export type PaymentGateway = "razorpay" | "stripe" | "upi";

export interface DonationRequest {
  amount: number;
  currency: "INR" | "USD";
  cause: DonationCause;
  frequency: DonationFrequency;
  donorName?: string;
  donorEmail?: string;
  gateway: PaymentGateway;
}

export interface RazorpayOrder {
  orderId: string;
  amount: number;
  currency: string;
}

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}
