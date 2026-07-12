"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, user, googleLogin } = useAuth();
  const { success, error: showError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (
    field: keyof FormErrors,
    values = { email, password },
  ) => {
    switch (field) {
      case "email":
        if (!values.email.trim()) return "Email is required";
        if (!emailRegex.test(values.email))
          return "Enter a valid email address";
        return undefined;
      case "password":
        if (!values.password) return "Password is required";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = () => {
    const newErrors: FormErrors = {
      email: validateField("email"),
      password: validateField("password"),
    };
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field) }));
  };

  const handleChange = (field: keyof FormErrors, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (touched[field]) {
      const values = { email, password, [field]: value };
      setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));
    }
  };

  const fieldClasses = (hasError: boolean) =>
    `w-full pl-10 pr-10 py-2 bg-background rounded-lg border focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-input focus:ring-primary"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateAll()) return;

    try {
      const userData = await login(email, password);
      const role = userData?.role || user?.role || "buyer";
      const dashboardUrl =
        role === "admin"
          ? "/admin"
          : role === "supplier"
            ? "/supplier"
            : "/buyer";
      success("Signed in", `Welcome back, ${userData.name}.`);
      router.push(dashboardUrl);
    } catch (err) {
      setError(
        "Invalid email or password. Try buyer@tradehub.com / buyer123, supplier@tradehub.com / supplier123, or admin@tradehub.com / admin123.",
      );
      showError(
        "Login failed",
        "Use the demo credentials shown below to continue.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-background to-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mx-auto mb-4">
            B2B
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your B2B Marketplace account
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  className={fieldClasses(
                    !!(touched.email && errors.email),
                  ).replace("pr-10", "pr-4")}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className={fieldClasses(
                    !!(touched.password && errors.password),
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.password && errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-input"
                />
                <span>Remember me</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="gap-2"
              onClick={async () => {
                try {
                  const userData = await googleLogin(
                    "google.user@tradehub.com",
                    "Google User",
                  );
                  const role = userData?.role || user?.role || "buyer";
                  const dashboardUrl =
                    role === "admin"
                      ? "/admin"
                      : role === "supplier"
                        ? "/supplier"
                        : "/buyer";
                  success("Signed in", `Welcome, ${userData.name}.`);
                  router.push(dashboardUrl);
                } catch {
                  showError(
                    "Google sign-in failed",
                    "Please try again in a moment.",
                  );
                }
              }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button variant="outline" className="gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.49v8.5h2.5v-4.42c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.42h2.5M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.5H5.5v8.5h2.77z" />
              </svg>
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary font-medium hover:underline"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}
