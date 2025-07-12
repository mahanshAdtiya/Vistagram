import { useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    loading,
    error,
  } = useAuthStore();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      await signupWithEmail(email, password);
    } else {
      await loginWithEmail(email, password);
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center", className)}
      {...props}
    >
      <Card className="w-full max-w-md shadow-md transition-all duration-300 ease-in-out">
        <CardHeader className="items-center text-center transition-all duration-300">
          <CardTitle className="text-xl font-bold transition-all duration-300">
            {isSignup ? "Create an Account" : "Welcome to Vistagram"}
          </CardTitle>
          <CardDescription className="transition-all duration-300">
            <div className="text-center text-sm">
              {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignup((prev) => !prev)}
                className="underline underline-offset-4 text-primary font-medium transition-colors duration-200 cursor-pointer hover:text-primary/80"
              >
                {isSignup ? "Login" : "Sign up"}
              </button>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="transition-all duration-300 ease-in-out">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 animate-fade transition-opacity duration-300"
          >
            <div className="transition-all">
              <Label className="mb-2" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="relative">
              <Label className="mb-2" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-600 text-center transition-opacity duration-200">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignup ? "Signing up..." : "Logging in..."}
                </>
              ) : isSignup ? (
                "Sign up"
              ) : (
                "Login"
              )}
            </Button>

            <div className="relative text-center text-sm text-muted-foreground">
              <div className="absolute inset-0 top-1/2 border-t border-border" />
              <span className="relative z-10 bg-background px-2">or</span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full transition-colors duration-200"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
