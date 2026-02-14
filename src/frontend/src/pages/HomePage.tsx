import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import SiteLayout from '@/components/site/SiteLayout';
import { Lightbulb, Target, Users, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/generated/hero-smart-janghai.dim_1920x1080.png"
            alt="Smart Janghai Hero"
            className="w-full h-full object-cover"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary-foreground backdrop-blur-sm">
            Welcome to the Future
          </Badge>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white drop-shadow-2xl">
            SMART JANGHAI
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto font-light tracking-wide drop-shadow-lg">
            Your trusted information hub for innovation and progress
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Empowering Communities Through Knowledge
            </h2>
            <Separator className="w-24 mx-auto mb-6 h-1 bg-primary" />
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Smart Janghai is dedicated to providing comprehensive, reliable information that drives
              positive change and fosters growth. We believe in the power of knowledge to transform
              communities and create lasting impact.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Cutting-edge insights and forward-thinking solutions for modern challenges.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Precision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Accurate, verified information you can trust and rely on every day.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Building connections and fostering collaboration across diverse groups.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Creating meaningful change that resonates through generations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              What We Offer
            </h2>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Comprehensive Resources</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Access a wide range of carefully curated information, guides, and resources designed
                    to help you make informed decisions and stay ahead of the curve.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Expert Insights</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Benefit from expert analysis and thoughtful perspectives on topics that matter most
                    to your community and personal growth.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Continuous Updates</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Stay current with regularly updated content that reflects the latest developments
                    and emerging trends in your areas of interest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Join the Smart Janghai Community
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Be part of a growing network of informed individuals committed to making a difference.
                Together, we can build a brighter, more connected future.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-4">
              <p className="text-muted-foreground">
                More features and interactive elements coming soon. Stay tuned for updates!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
