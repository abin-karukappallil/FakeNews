"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const loginSub = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Invalid credentials", {
                    richColors: true,
                });
                return;
            }

            if (!data.token || !data.userId) {
                toast.error("Unexpected server response. Try again.", {
                    richColors: true,
                });
                return;
            }

            Cookies.set("token", data.token);
            Cookies.set("userId", data.userId);

            router.push("/");
        } catch (e) {
          void e;
            toast.error("Something went wrong. Please try again.", {
                richColors: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="lg:p-8 flex mt-48 p-4 flex-col justify-center items-center my-auto">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
                    </div>
                    <div className="grid gap-6">
                        <form onSubmit={loginSub}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                        autoCapitalize="none"
                                        autoComplete="current-password"
                                        autoCorrect="off"
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>
                            </div>
                        </form>
                    </div>
                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Dont have an account?{" "}
                        <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
    );
}
