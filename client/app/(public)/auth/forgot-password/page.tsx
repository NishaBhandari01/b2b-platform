// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Mail, ArrowRight } from "lucide-react";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   return (
//     <div className="min-h-screen bg-linear-to-br from-primary/10 via-background to-background flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mx-auto mb-4">
//             B2B
//           </div>
//           <h1 className="text-3xl font-bold">Reset your password</h1>
//           <p className="text-muted-foreground mt-2">
//             We will send a secure recovery link to your email.
//           </p>
//         </div>

//         <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
//           {submitted ? (
//             <div className="space-y-4">
//               <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
//                 Recovery instructions were sent to {email || "your email"}.
//               </div>
//               <Link href="/auth/login">
//                 <Button className="w-full gap-2">
//                   Back to sign in <ArrowRight className="w-4 h-4" />
//                 </Button>
//               </Link>
//             </div>
//           ) : (
//             <form
//               onSubmit={(event) => {
//                 event.preventDefault();
//                 setSubmitted(true);
//               }}
//               className="space-y-5"
//             >
//               <div>
//                 <label className="block text-sm font-medium mb-2">
//                   Email address
//                 </label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                   <input
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(event) => setEmail(event.target.value)}
//                     placeholder="you@example.com"
//                     className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary"
//                   />
//                 </div>
//               </div>
//               <Button type="submit" className="w-full gap-2">
//                 Send recovery link <ArrowRight className="w-4 h-4" />
//               </Button>
//             </form>
//           )}
//         </div>

//         <p className="text-center text-sm text-muted-foreground mt-6">
//           Remembered your password?{" "}
//           <Link
//             href="/auth/login"
//             className="text-primary font-medium hover:underline"
//           >
//             Sign in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { Mail, ArrowRight } from "lucide-react";

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const { forgotPassword, isForgotPasswordLoading } = useAuth();
  const { success, error: showError } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (field: keyof FormErrors, values = { email }) => {
    switch (field) {
      case "email":
        if (!values.email.trim()) return "Email is required";
        if (!emailRegex.test(values.email))
          return "Enter a valid email address";
        return undefined;
      default:
        return undefined;
    }
  };

  const validateAll = () => {
    const newErrors: FormErrors = { email: validateField("email") };
    setErrors(newErrors);
    setTouched({ email: true });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleBlur = (field: keyof FormErrors) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field) }));
  };

  const handleChange = (field: keyof FormErrors, value: string) => {
    if (field === "email") setEmail(value);

    if (touched[field]) {
      const values = {
        email: value,
      };

      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, values),
      }));
    }
  };

  const fieldClasses = (hasError: boolean) =>
    `w-full pl-10 pr-4 py-2 bg-background rounded-lg border focus:outline-none focus:ring-2 ${
      hasError
        ? "border-red-500 focus:ring-red-500"
        : "border-input focus:ring-primary"
    }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateAll()) return;

    try {
      await forgotPassword(email);
      success("Check your inbox", `Recovery instructions sent to ${email}.`);
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
      showError("Request failed", message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary/10 via-background to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold mx-auto mb-4">
            B2B
          </div>
          <h1 className="text-3xl font-bold">Reset your password</h1>
          <p className="text-muted-foreground mt-2">
            We will send a secure recovery link to your email.
          </p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-lg border border-border p-8 shadow-lg">
          {submitted ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                Recovery instructions were sent to {email || "your email"}.
              </div>
              <Link href="/auth/login">
                <Button className="w-full gap-2">
                  Back to sign in <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email address
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
                    className={fieldClasses(!!(touched.email && errors.email))}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isForgotPasswordLoading}
              >
                {isForgotPasswordLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Send recovery link <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Back to sign in */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Remembered your password?{" "}
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
