/**
 * AaharCare Payment Gateway Integration
 * Supports Razorpay Standard Checkout (Cards, UPI, Netbanking, Wallets)
 * with graceful fallback to Instant UPI QR & Simulated Gateway for offline/demo presentations.
 */

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export type RazorpayOptions = {
  amountInInr: number;
  packageName: string;
  conditionName: string;
  peopleCount: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  customKeyId?: string;
};

export type PaymentSuccessResult = {
  paymentId: string;
  method: "razorpay" | "upi_qr" | "cod";
  signature?: string;
  orderId?: string;
};

const DEFAULT_TEST_KEY = "rzp_test_51Vaicq7X2e0lA";

/**
 * Returns the configured Razorpay Key ID
 */
export function getRazorpayKey(): string {
  if (typeof window !== "undefined") {
    const envKey = (import.meta as any).env?.VITE_RAZORPAY_KEY_ID;
    if (envKey && typeof envKey === "string" && envKey.trim().length > 5) {
      return envKey.trim();
    }
  }
  return DEFAULT_TEST_KEY;
}

/**
 * Dynamically loads the Razorpay checkout.js script
 */
export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    // Timeout safety for offline demo environments
    const timer = setTimeout(() => {
      resolve(false);
    }, 4000);

    script.onload = () => {
      clearTimeout(timer);
      resolve(true);
    };

    script.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };

    document.body.appendChild(script);
  });
}

/**
 * Launch Razorpay Checkout Modal
 */
export async function openRazorpayCheckout(
  options: RazorpayOptions,
): Promise<PaymentSuccessResult> {
  const isLoaded = await loadRazorpayScript();

  if (!isLoaded || !window.Razorpay) {
    throw new Error("RAZORPAY_SCRIPT_UNAVAILABLE");
  }

  const key = options.customKeyId?.trim() || getRazorpayKey();

  return new Promise((resolve, reject) => {
    try {
      const rzpOptions = {
        key: key,
        amount: Math.round(options.amountInInr * 100), // In paise (₹1 = 100 paise)
        currency: "INR",
        name: "AaharCare Medical Diets",
        description: `Monthly Package: ${options.packageName} (${options.conditionName})`,
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=128&h=128&fit=crop&crop=faces",
        prefill: {
          name: options.userName,
          email: options.userEmail || "patient@aaharcare.com",
          contact: options.userPhone || "+919876543210",
        },
        notes: {
          package_name: options.packageName,
          medical_condition: options.conditionName,
          people_count: String(options.peopleCount),
          platform: "AaharCare Tele-Nutrition",
        },
        theme: {
          color: "#166534", // Medical forest emerald
        },
        modal: {
          ondismiss: () => {
            reject(new Error("PAYMENT_DISMISSED"));
          },
        },
        handler: (response: any) => {
          if (response && response.razorpay_payment_id) {
            resolve({
              paymentId: response.razorpay_payment_id,
              method: "razorpay",
              signature: response.razorpay_signature,
              orderId: response.razorpay_order_id,
            });
          } else {
            reject(new Error("PAYMENT_NO_ID"));
          }
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.on("payment.failed", (response: any) => {
        reject(
          new Error(
            response?.error?.description || "Payment failed. Please try another card or UPI.",
          ),
        );
      });
      rzp.open();
    } catch (err: any) {
      reject(err);
    }
  });
}

/**
 * Generate UPI Intent URL for QR code or direct payment apps
 */
export function getUpiPaymentUrl(params: {
  amountInr: number;
  orderRef: string;
  payeeVpa?: string;
  payeeName?: string;
}): string {
  const vpa = params.payeeVpa || "aaharcare@okaxis";
  const name = params.payeeName || "AaharCare Healthcare";
  const note = `Diet Package Order ${params.orderRef}`;
  return `upi://pay?pa=${encodeURIComponent(vpa)}&pn=${encodeURIComponent(name)}&am=${params.amountInr}&cu=INR&tn=${encodeURIComponent(note)}&tr=${encodeURIComponent(params.orderRef)}`;
}
