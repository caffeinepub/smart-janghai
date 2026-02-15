import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, AlertCircle, FileText, Phone, Mail } from 'lucide-react';

export default function DashboardRightPanel() {
  const quickLinks = [
    { label: 'Government Portal', icon: ExternalLink },
    { label: 'Apply for Schemes', icon: FileText },
    { label: 'Contact Support', icon: Phone },
    { label: 'Email Updates', icon: Mail },
  ];

  const announcements = [
    {
      title: 'System Maintenance',
      date: 'Feb 15, 2026',
      priority: 'high',
      description: 'Scheduled maintenance on Sunday 2-4 AM',
    },
    {
      title: 'New Feature Launch',
      date: 'Feb 10, 2026',
      priority: 'medium',
      description: 'Job alerts now available in your dashboard',
    },
    {
      title: 'Policy Update',
      date: 'Feb 5, 2026',
      priority: 'low',
      description: 'Updated privacy policy effective immediately',
    },
  ];

  return (
    <div className="space-y-6 sticky top-24">
      {/* Quick Links */}
      <Card className="glass-card-light soft-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start gap-2 hover:bg-primary/5"
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Important Announcements */}
      <Card className="glass-card-light soft-shadow">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            Important Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {announcements.map((announcement, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium text-sm">{announcement.title}</h4>
                <Badge
                  variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {announcement.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {announcement.description}
              </p>
              <p className="text-xs text-muted-foreground">{announcement.date}</p>
              {index < announcements.length - 1 && (
                <div className="border-t pt-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
