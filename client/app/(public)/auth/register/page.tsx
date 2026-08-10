"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import {
  Mail,
  Lock,
  User,
  UserCheck,
  ArrowRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { UserRole } from "@/types";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signup, isLoading } = useAuth();
  const { success, error: showError } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(
    (searchParams.get("role") as UserRole) || "buyer",
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (
    field: keyof FormErrors,
    values = { name, email, password, confirmPassword },
  ) => {
    switch (field) {
      case "name":
        if (!values.name.trim()) return "Name is required";
        if (values.name.trim().length < 2)
          return "Name must be at least 2 characters";
        return undefined;
      case "email":
        if (!values.email.trim()) return "Email is required";
        if (!emailRegex.test(values.email))
          return "Enter a valid email address";
        return undefined;
      case "password":
        if (!values.password) return "Password is required";
        if (values.password.length < 8)
          return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(values.password))
          return "Include at least one uppercase letter";
        if (!/[0-9]/.test(values.password))
          return "Include at least one number";
        return undefined;
      case "confirmPassword":
        if (!values.confirmPassword) return "Please confirm your password";
        if (values.confirmPassword !== values.password)
          return "Passwords do not match";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = () => {
    const values = { name, email, password, confirmPassword };
    const newErrors: FormErrors = {
      name: validateField("name", values),
      email: validateField("email", values),
      password: validateField("password", values),
      confirmPassword: validateField("confirmPassword", values),
      terms: !agreedToTerms
        ? "You must agree to the terms and conditions"
        : undefined,
    };
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field) }));
  };

  const handleChange = (field: keyof FormErrors, value: string) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);

    // Re-validate live once a field has been touched, so errors clear as the user fixes them
    if (touched[field]) {
      const values = { name, email, password, confirmPassword, [field]: value };
      setErrors((prev) => ({ ...prev, [field]: validateField(field, values) }));

      // Confirm password depends on password, so keep it in sync too
      if (field === "password" && touched.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateField("confirmPassword", values),
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateAll()) return;

    try {
      await signup(email, password, name, role);
      const dashboardUrl =
        role === "admin"
          ? "/admin"
          : role === "supplier"
            ? "/supplier"
            : "/buyer";
      success(
        "Account created",
        `Welcome aboard, ${name}. Your workspace is ready.`,
      );
      router.push(dashboardUrl);
    } catch (err) {
      setSubmitError("Registration failed. Please try again.");
      showError(
        "Registration failed",
        "Please try again with a different email.",
      );
    }
  };

  const fieldClasses = (hasError: boolean) =>
    `w-full pl-10 pr-10 py-2 bg-background rounded-lg border focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-input focus:ring-primary"
    }`;

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-background to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mx-auto mb-4">
            B2B
          </div>
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-2">
            Join the B2B Marketplace today
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">
                I&apos;m a...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    value: "supplier" as UserRole,
                    label: "Seller/Supplier",
                    icon: UserCheck,
                  },
                  { value: "buyer" as UserRole, label: "Buyer", icon: User },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value)}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 justify-center ${
                        role === option.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  placeholder="John Doe"
                  aria-invalid={!!errors.name}
                  className={fieldClasses(!!(touched.name && errors.name))}
                />
              </div>
              {touched.name && errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

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
                  placeholder="Enter your email address"
                  aria-invalid={!!errors.email}
                  className={fieldClasses(!!(touched.email && errors.email))}
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
              {touched.password && errors.password ? (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  At least 8 characters, one uppercase letter and one number
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  onBlur={() => handleBlur("confirmPassword")}
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  className={fieldClasses(
                    !!(touched.confirmPassword && errors.confirmPassword),
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit-level Error Message */}
            {submitError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
                {submitError}
              </div>
            )}

            {/* Terms */}
            <div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => {
                    setAgreedToTerms(e.target.checked);
                    setErrors((prev) => ({
                      ...prev,
                      terms: e.target.checked
                        ? undefined
                        : "You must agree to the terms and conditions",
                    }));
                  }}
                  className="w-4 h-4 rounded border-input mt-1"
                />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {touched.terms && errors.terms && (
                <p className="text-xs text-red-600 mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              {isLoading ? (
                "Creating account..."
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
