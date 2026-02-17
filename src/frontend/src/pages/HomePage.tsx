import { useState } from 'react';
import { useGetUserNotifications } from '@/hooks/notifications';
import SiteLayout from '@/components/site/SiteLayout';
import TextLogo from '@/components/site/TextLogo';
import NotificationLauncherButton from '@/components/notifications/NotificationLauncherButton';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import NotificationPanelErrorBoundary from '@/components/notifications/NotificationPanelErrorBoundary';
import VotingPromoSection from '@/components/site/VotingPromoSection';
import ComingSoonRibbon from '@/components/site/ComingSoonRibbon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Newspaper, Briefcase, FileText, GraduationCap, Users, ArrowRight } from 'lucide-react';
import { HERO_BACKGROUND } from '@/assets/generatedAssets';

interface HomePageProps {
  onNavigate: (page: 'home' | 'login' | 'dashboard' | 'admin-login' | 'admin-dashboard') => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const { data: notifications = [] } = useGetUserNotifications();
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  const categories = [
    { icon: Newspaper, title: 'Latest News', description: 'Stay updated with local news and announcements', color: 'text-blue-600' },
    { icon: Briefcase, title: 'Job Opportunities', description: 'Find employment opportunities in your area', color: 'text-green-600' },
    { icon: FileText, title: 'Government Schemes', description: 'Access welfare schemes and benefits', color: 'text-orange-600' },
    { icon: GraduationCap, title: 'Education', description: 'Educational resources and information', color: 'text-purple-600' },
  ];

  const highlights = [
    { title: 'Community Updates', description: 'Real-time updates from local administration' },
    { title: 'Digital Services', description: 'Access government services online' },
    { title: 'Public Welfare', description: 'Information on welfare programs and schemes' },
  ];

  return (
    <SiteLayout>
      {/* Voting Promo Section - Top of Page */}
      <VotingPromoSection />

      {/* Hero Section */}
      <section
        className="relative min-h-[600px] flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 61, 98, 0.85), rgba(10, 61, 98, 0.85)), url(${HERO_BACKGROUND})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute top-4 right-4 z-10">
          <NotificationPanelErrorBoundary>
            <NotificationLauncherButton
              unreadCount={unreadCount}
              onClick={() => setNotificationPanelOpen(true)}
            />
          </NotificationPanelErrorBoundary>
        </div>

        <div className="container mx-auto px-4 text-center">
          <TextLogo size="xl" variant="light" />
          <p className="text-xl md:text-2xl mt-6 mb-8 max-w-2xl mx-auto">
            Your Gateway to Local Information, Services, and Community Updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => onNavigate('login')}
              className="bg-[oklch(0.65_0.15_30)] hover:bg-[oklch(0.60_0.15_30)] text-white"
            >
              Member Login
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="border-white text-white hover:bg-white/10"
            >
              <Users className="mr-2 w-5 h-5" />
              User Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigate('admin-login')}
              className="border-white text-white hover:bg-white/10"
            >
              <Shield className="mr-2 w-5 h-5" />
              Admin Access
            </Button>
          </div>
        </div>
      </section>

      {/* Coming Soon Ribbon */}
      <ComingSoonRibbon />

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <category.icon className={`w-12 h-12 ${category.color} mb-4`} />
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SMART JANGHAI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{highlight.title}</h3>
                <p className="text-muted-foreground">{highlight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our community and stay connected with the latest updates and services
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => onNavigate('login')}
          >
            Sign In Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <NotificationPanelErrorBoundary>
        <NotificationPanel
          isOpen={notificationPanelOpen}
          onClose={() => setNotificationPanelOpen(false)}
        />
      </NotificationPanelErrorBoundary>
    </SiteLayout>
  );
}
