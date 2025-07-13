import { useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';


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
    loading,
    error,
  } = useAuthStore();

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      await signupWithEmail(name,email, password);
      setEmail("")
      setName("")
      setPassword("")
      setIsSignup(false);
    } else {
      await loginWithEmail(email, password);
      navigate("/")
    }
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
            {isSignup && (
              <div className="transition-all">
                <Label className="mb-2" htmlFor="name">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

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
              className="w-full transition-all duration-200 cursor-pointer"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
