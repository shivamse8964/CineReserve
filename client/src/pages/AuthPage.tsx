import { useUser } from "../hooks/use-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, useForm } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@db/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useUser();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: { username: string; password: string }) => {
    try {
      const result = await (isLogin ? login(data) : register(data));
      if (!result.ok) {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1612934622902-d3ad43c407b9")',
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.7)'
      }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-background/80 backdrop-blur-lg rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                {...form.register("username")}
                type="text"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                {...form.register("password")}
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
