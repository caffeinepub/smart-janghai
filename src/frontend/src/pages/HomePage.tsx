import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SiteLayout from '@/components/site/SiteLayout';
import TextLogo from '@/components/site/TextLogo';
import NotificationLauncherButton from '@/components/notifications/NotificationLauncherButton';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import NotificationPanelErrorBoundary from '@/components/notifications/NotificationPanelErrorBoundary';
import { useExampleNotifications } from '@/hooks/useExampleNotifications';
import { Lightbulb, Target, Users, Zap, LogIn, LayoutDashboard, Shield } from 'lucide-react';
import { HERO_BACKGROUND } from '@/assets/generatedAssets';

type CategoryType = 'innovation' | 'precision' | 'community' | 'impact' | null;

interface HomePageProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [heroImageError, setHeroImageError] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null);
  const { unreadCount } = useExampleNotifications();

  const handleCategoryClick = (category: CategoryType) => {
    try {
      setSelectedCategory(category);
      const detailSection = document.getElementById('category-detail');
      if (detailSection) {
        detailSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch (error) {
      console.error('Category interaction error:', error);
    }
  };

  const handleCategoryKeyDown = (e: React.KeyboardEvent, category: CategoryType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(category);
    }
  };

  const categoryDetails: Record<Exclude<CategoryType, null>, { title: string; description: string }> = {
    innovation: {
      title: 'Innovation',
      description: 'Explore cutting-edge insights and forward-thinking solutions that address modern challenges. We bring you the latest developments in technology, science, and creative problem-solving approaches that are shaping the future of our communities.',
    },
    precision: {
      title: 'Precision',
      description: 'Access accurate, verified information you can trust. Our commitment to precision ensures that every piece of content is thoroughly researched, fact-checked, and presented with clarity to help you make informed decisions with confidence.',
    },
    community: {
      title: 'Community',
      description: 'Join a vibrant network of individuals dedicated to building connections and fostering collaboration. We believe in the power of diverse groups working together to create positive change and support one another in achieving common goals.',
    },
    impact: {
      title: 'Impact',
      description: 'Discover how meaningful change creates lasting effects that resonate through generations. We focus on initiatives and information that drive real-world results, empowering communities to build a better future for themselves and those who follow.',
    },
  };

  return (
    <SiteLayout>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          {!heroImageError ? (
            <img
              src={HERO_BACKGROUND}
              alt="Hero background"
              className="w-full h-full object-cover"
              onError={() => setHeroImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>

        {/* Navigation Buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <Button
            onClick={() => onNavigate('login')}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Member Login
          </Button>
          <Button
            onClick={() => onNavigate('dashboard')}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            onClick={() => onNavigate('admin-login')}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            <Shield className="w-4 h-4 mr-2" />
            Admin Login
          </Button>
          <NotificationLauncherButton
            onClick={() => setIsNotificationPanelOpen(true)}
            unreadCount={unreadCount}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 bg-primary/10 text-primary-foreground backdrop-blur-sm">
            Welcome to the Future
          </Badge>
          
          <div className="flex justify-center mb-8">
            <TextLogo size="lg" variant="light" />
          </div>

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
              We are dedicated to providing comprehensive, reliable information that drives
              positive change and fosters growth. We believe in the power of knowledge to transform
              communities and create lasting impact.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card 
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick('innovation')}
              onKeyDown={(e) => handleCategoryKeyDown(e, 'innovation')}
            >
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

            <Card 
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick('precision')}
              onKeyDown={(e) => handleCategoryKeyDown(e, 'precision')}
            >
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

            <Card 
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick('community')}
              onKeyDown={(e) => handleCategoryKeyDown(e, 'community')}
            >
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

            <Card 
              className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              role="button"
              tabIndex={0}
              onClick={() => handleCategoryClick('impact')}
              onKeyDown={(e) => handleCategoryKeyDown(e, 'impact')}
            >
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

          {/* Category Detail Section */}
          {selectedCategory && (
            <div id="category-detail" className="mt-12 max-w-3xl mx-auto">
              <Card className="border-2 border-primary/30 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-2xl">{categoryDetails[selectedCategory].title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {categoryDetails[selectedCategory].description}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Latest Highlights
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay informed with our most recent updates and announcements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="w-fit mb-2">News</Badge>
                <CardTitle className="text-lg">Community Development Initiative</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  New programs launched to support local businesses and entrepreneurs in the region.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="secondary">Schemes</Badge>
                <CardTitle className="text-lg">Education Support Program</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Financial assistance available for students pursuing higher education opportunities.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="w-fit mb-2" variant="outline">Jobs</Badge>
                <CardTitle className="text-lg">Employment Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Multiple positions open across various sectors. Apply now to join growing organizations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border-2 border-primary/20">
            <CardContent className="text-center py-12 px-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our community today and access all the resources, information, and support you need to succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => onNavigate('login')}
                  className="text-base px-8"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Member Login
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('dashboard')}
                  className="text-base px-8"
                >
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  View Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Notification Panel */}
      <NotificationPanelErrorBoundary>
        <NotificationPanel
          isOpen={isNotificationPanelOpen}
          onClose={() => setIsNotificationPanelOpen(false)}
        />
      </NotificationPanelErrorBoundary>
    </SiteLayout>
  );
}
