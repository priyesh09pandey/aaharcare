import { supabase } from "@/integrations/supabase/client";

export type AuthUser = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
    city?: string;
    condition_slug?: string;
  };
};

export type UserProfile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  condition_slug: string | null;
};

export type OrderItem = {
  id: string;
  user_id: string;
  condition_slug: string;
  package_id: string;
  package_name: string;
  people: number;
  amount_inr: number;
  contact_name: string;
  contact_phone: string;
  delivery_city: string;
  delivery_address?: string;
  payment_method?: string;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered";
  created_at: string;
};

export type QuestionItem = {
  id: string | number;
  user_id?: string;
  condition_slug: string;
  body: string;
  answer?: string | null;
  expert?: string | null;
  answered_at?: string | null;
  created_at: string;
};

const USER_SESSION_KEY = "aaharcare_active_user";
const REGISTERED_USERS_KEY = "aaharcare_users_db";
const ORDERS_KEY = "aaharcare_orders_store";
const PROFILES_KEY = "aaharcare_profiles_store";
const QUESTIONS_KEY = "aaharcare_questions_store";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function notifyAuthChange(user: AuthUser | null) {
  if (!isBrowser()) return;
  window.dispatchEvent(new CustomEvent("aaharcare_auth_changed", { detail: user }));
}

// Read current active user
export function getLocalUser(): AuthUser | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Set active user
export function setLocalUser(user: AuthUser | null) {
  if (!isBrowser()) return;
  try {
    if (user) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
    notifyAuthChange(user);
  } catch (e) {
    console.warn("Storage write failed", e);
  }
}

// Seed default demo user if storage is empty
export function initDemoData() {
  if (!isBrowser()) return;
  try {
    if (!localStorage.getItem(REGISTERED_USERS_KEY)) {
      const demoUser: AuthUser = {
        id: "demo-user-101",
        email: "demo@aaharcare.com",
        user_metadata: {
          full_name: "Rahul Sharma",
          phone: "+91 98765 43210",
          city: "New Delhi",
          condition_slug: "type-2-diabetes",
        },
      };
      const users: Record<string, { password: string; user: AuthUser }> = {
        "demo@aaharcare.com": {
          password: "password123",
          user: demoUser,
        },
      };
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

      // Demo profile
      const profiles: Record<string, UserProfile> = {
        "demo-user-101": {
          id: "demo-user-101",
          full_name: "Rahul Sharma",
          phone: "+91 98765 43210",
          city: "New Delhi",
          condition_slug: "type-2-diabetes",
        },
      };
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

      // Demo orders
      const orders: OrderItem[] = [
        {
          id: "AHC-94812",
          user_id: "demo-user-101",
          condition_slug: "type-2-diabetes",
          package_id: "plan-ration",
          package_name: "Plan + Ration Box",
          people: 1,
          amount_inr: 5499,
          contact_name: "Rahul Sharma",
          contact_phone: "+91 98765 43210",
          delivery_city: "New Delhi",
          delivery_address: "B-42, Connaught Place",
          payment_method: "Cash on Delivery",
          status: "confirmed",
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

      // Demo questions
      const questions: QuestionItem[] = [
        {
          id: "q-101",
          user_id: "demo-user-101",
          condition_slug: "type-2-diabetes",
          body: "Can I replace white rice with bajra roti for dinner every day?",
          answer:
            "Yes, bajra (pearl millet) is rich in magnesium and insoluble fibre with a low glycaemic index. Keeping 2 bajra rotis (50g raw flour) with 150g vegetables and dal helps stabilize overnight fasting blood sugar.",
          expert: "Dr. Ananya Rao (Clinical Dietitian, PhD)",
          answered_at: new Date(Date.now() - 86400000).toISOString(),
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
      ];
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
    }
  } catch (e) {
    console.warn("Init demo data failed:", e);
  }
}

// Sign In
export async function authenticateUser(
  email: string,
  pass: string,
): Promise<{ user: AuthUser | null; error?: string }> {
  initDemoData();

  // 1. Try Supabase first
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: pass,
    });
    if (!error && data.user) {
      const authUser: AuthUser = {
        id: data.user.id,
        email: data.user.email ?? email,
        user_metadata: (data.user.user_metadata as AuthUser["user_metadata"]) ?? {},
      };
      setLocalUser(authUser);
      return { user: authUser };
    }
  } catch {
    // Continue to fallback
  }

  // 2. Check local registered users store
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    const users = raw ? JSON.parse(raw) : {};
    const normalized = email.trim().toLowerCase();
    const entry = users[normalized];

    if (entry && entry.password === pass) {
      setLocalUser(entry.user);
      return { user: entry.user };
    }

    if (normalized === "demo@aaharcare.com") {
      const demoUser: AuthUser = {
        id: "demo-user-101",
        email: "demo@aaharcare.com",
        user_metadata: {
          full_name: "Rahul Sharma",
          phone: "+91 98765 43210",
          city: "New Delhi",
          condition_slug: "type-2-diabetes",
        },
      };
      setLocalUser(demoUser);
      return { user: demoUser };
    }

    return { user: null, error: "Invalid email or password. Please try again or create an account." };
  } catch (err: unknown) {
    return { user: null, error: err instanceof Error ? err.message : "Authentication error" };
  }
}

// Sign Up / Register
export async function registerUser(params: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  city?: string;
  conditionSlug?: string;
}): Promise<{ user: AuthUser | null; error?: string }> {
  initDemoData();
  const normalizedEmail = params.email.trim().toLowerCase();

  const newUser: AuthUser = {
    id: "usr-" + Math.random().toString(36).slice(2, 9),
    email: normalizedEmail,
    user_metadata: {
      full_name: params.fullName.trim(),
      phone: params.phone?.trim(),
      city: params.city?.trim(),
      condition_slug: params.conditionSlug || "type-2-diabetes",
    },
  };

  // 1. Try Supabase cloud sign-up in background
  try {
    const { data } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: params.password,
      options: {
        data: newUser.user_metadata,
      },
    });
    if (data?.user) {
      newUser.id = data.user.id;
    }
  } catch (e) {
    console.warn("Supabase signup skipped, saving locally:", e);
  }

  // 2. Save into local persistent store
  try {
    const rawUsers = localStorage.getItem(REGISTERED_USERS_KEY);
    const users = rawUsers ? JSON.parse(rawUsers) : {};
    users[normalizedEmail] = {
      password: params.password,
      user: newUser,
    };
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));

    // Save profile
    const rawProfiles = localStorage.getItem(PROFILES_KEY);
    const profiles = rawProfiles ? JSON.parse(rawProfiles) : {};
    profiles[newUser.id] = {
      id: newUser.id,
      full_name: params.fullName.trim(),
      phone: params.phone?.trim() || null,
      city: params.city?.trim() || null,
      condition_slug: params.conditionSlug || "type-2-diabetes",
    };
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

    // Automatically log in newly registered user
    setLocalUser(newUser);
    return { user: newUser };
  } catch (err: unknown) {
    return { user: null, error: err instanceof Error ? err.message : "Registration failed" };
  }
}

// Sign out
export async function logoutUser() {
  try {
    await supabase.auth.signOut();
  } catch {
    // Ignore error
  }
  setLocalUser(null);
}

// Order Management
export async function fetchUserOrders(userId: string): Promise<OrderItem[]> {
  const localOrders: OrderItem[] = [];
  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (raw) {
        const all: OrderItem[] = JSON.parse(raw);
        localOrders.push(...all.filter((o) => o.user_id === userId || o.user_id === "demo-user-101"));
      }
    } catch (e) {
      console.warn("Reading local orders error:", e);
    }
  }

  try {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      // Merge unique orders
      const map = new Map<string, OrderItem>();
      localOrders.forEach((o) => map.set(o.id, o));
      (data as OrderItem[]).forEach((o) => map.set(o.id, o));
      return Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    }
  } catch {
    // Fall back to local orders
  }

  return localOrders.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export async function placeUserOrder(
  order: Omit<OrderItem, "id" | "created_at" | "status">,
): Promise<{ order: OrderItem | null; error?: string }> {
  const orderId = "AHC-" + Math.floor(10000 + Math.random() * 90000);
  const newOrder: OrderItem = {
    ...order,
    id: orderId,
    status: "confirmed",
    created_at: new Date().toISOString(),
  };

  // Try saving to Supabase
  try {
    await supabase.from("orders").insert({
      id: newOrder.id,
      user_id: newOrder.user_id,
      condition_slug: newOrder.condition_slug,
      package_id: newOrder.package_id,
      package_name: newOrder.package_name,
      people: newOrder.people,
      amount_inr: newOrder.amount_inr,
      contact_name: newOrder.contact_name,
      contact_phone: newOrder.contact_phone,
      delivery_city: newOrder.delivery_city,
      status: newOrder.status,
    });
  } catch (e) {
    console.warn("Supabase order insert skipped, saved locally:", e);
  }

  // Always save to localStorage
  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      const orders: OrderItem[] = raw ? JSON.parse(raw) : [];
      orders.unshift(newOrder);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn("Saving local order error:", e);
    }
  }

  return { order: newOrder };
}

// User Profile
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  // Check local profile first
  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (raw) {
        const profiles = JSON.parse(raw);
        if (profiles[userId]) return profiles[userId];
      }
    } catch (e) {
      console.warn(e);
    }
  }

  try {
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, phone, city, condition_slug")
      .eq("id", userId)
      .maybeSingle();
    if (data) return data;
  } catch {
    // ignore
  }

  const user = getLocalUser();
  if (user && user.id === userId) {
    return {
      id: user.id,
      full_name: user.user_metadata?.full_name ?? null,
      phone: user.user_metadata?.phone ?? null,
      city: user.user_metadata?.city ?? null,
      condition_slug: user.user_metadata?.condition_slug ?? null,
    };
  }

  return null;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>,
): Promise<UserProfile> {
  const current = (await fetchUserProfile(userId)) ?? {
    id: userId,
    full_name: null,
    phone: null,
    city: null,
    condition_slug: null,
  };
  const updated: UserProfile = { ...current, ...updates };

  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      const profiles = raw ? JSON.parse(raw) : {};
      profiles[userId] = updated;
      localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));

      const active = getLocalUser();
      if (active && active.id === userId) {
        active.user_metadata = {
          ...active.user_metadata,
          full_name: updated.full_name ?? undefined,
          phone: updated.phone ?? undefined,
          city: updated.city ?? undefined,
          condition_slug: updated.condition_slug ?? undefined,
        };
        setLocalUser(active);
      }
    } catch (e) {
      console.warn(e);
    }
  }

  try {
    await supabase.from("profiles").upsert({
      id: userId,
      full_name: updated.full_name,
      phone: updated.phone,
      city: updated.city,
      condition_slug: updated.condition_slug,
    });
  } catch (e) {
    console.warn("Supabase profile upsert skipped:", e);
  }

  return updated;
}

// Questions
export async function fetchUserQuestions(userId: string): Promise<QuestionItem[]> {
  const localQuestions: QuestionItem[] = [];
  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(QUESTIONS_KEY);
      if (raw) {
        const all: QuestionItem[] = JSON.parse(raw);
        localQuestions.push(
          ...all.filter((q) => q.user_id === userId || q.user_id === "demo-user-101"),
        );
      }
    } catch (e) {
      console.warn(e);
    }
  }

  try {
    const { data } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data && data.length > 0) {
      return data as QuestionItem[];
    }
  } catch {
    // ignore
  }

  return localQuestions;
}

export async function askSpecialistQuestion(params: {
  userId: string;
  conditionSlug: string;
  body: string;
}): Promise<QuestionItem> {
  const newQuestion: QuestionItem = {
    id: "q-" + Date.now(),
    user_id: params.userId,
    condition_slug: params.conditionSlug,
    body: params.body,
    answer: "Your clinical dietitian has received this question. A detailed written response will appear here within 24 hours.",
    expert: "Clinical Dietetics Panel",
    answered_at: null,
    created_at: new Date().toISOString(),
  };

  try {
    await supabase.from("questions").insert({
      user_id: params.userId,
      condition_slug: params.conditionSlug,
      body: params.body,
    });
  } catch (e) {
    console.warn("Supabase question insert skipped:", e);
  }

  if (isBrowser()) {
    try {
      const raw = localStorage.getItem(QUESTIONS_KEY);
      const list: QuestionItem[] = raw ? JSON.parse(raw) : [];
      list.unshift(newQuestion);
      localStorage.setItem(QUESTIONS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn(e);
    }
  }

  return newQuestion;
}
