import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Lock, Send } from 'lucide-react';

interface MemberLoginCardProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard') => void;
}

export default function MemberLoginCard({ onNavigate }: MemberLoginCardProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard (UI only)
    onNavigate('dashboard');
  };

  const handleOTPRequest = () => {
    // OTP request handler (UI only)
    console.log('OTP requested for:', mobileNumber);
  };

  return (
    <Card className="w-full max-w-md glass-card-light soft-shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Mobile Number Field */}
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-sm font-medium">
              Mobile Number
            </Label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background/50 text-sm font-medium min-w-[70px]">
                <Phone className="w-4 h-4 text-muted-foreground" />
                +91
              </div>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="flex-1 bg-background/50"
                maxLength={10}
              />
            </div>
          </div>

          {/* OTP Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-primary/30 hover:bg-primary/5"
            onClick={handleOTPRequest}
          >
            <Send className="w-4 h-4 mr-2" />
            Request OTP
          </Button>

          {/* Password Field (Alternative) */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password (Alternative Login)
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-background/50"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal cursor-pointer"
            >
              Remember Me
            </Label>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-medium transition-all duration-300 hover:shadow-lg"
          >
            Login
          </Button>

          {/* Links */}
          <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm pt-2">
            <button
              type="button"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              onClick={() => console.log('Create account')}
            >
              Create New Account
            </button>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => console.log('Forgot password')}
            >
              Forgot Password?
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
