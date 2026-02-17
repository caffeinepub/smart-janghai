import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Newspaper, Building2, Briefcase, Bookmark, ArrowRight, Calendar } from 'lucide-react';

export default function DashboardMainContent() {
  const infoCards = [
    {
      icon: Newspaper,
      title: 'Latest News Updates',
      description: '24 new articles published today',
      count: '24',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Building2,
      title: 'Active Government Schemes',
      description: '12 schemes available for application',
      count: '12',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Briefcase,
      title: 'Job Alerts',
      description: '8 new job postings this week',
      count: '8',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Bookmark,
      title: 'Saved Articles',
      description: 'You have 15 saved items',
      count: '15',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentActivities = [
    {
      date: 'Feb 14, 2026',
      category: 'News',
      categoryColor: 'bg-blue-100 text-blue-700',
      title: 'New infrastructure project announced for Janghai',
      description: 'State government approves major road development initiative...',
    },
    {
      date: 'Feb 13, 2026',
      category: 'Scheme',
      categoryColor: 'bg-green-100 text-green-700',
      title: 'Agricultural subsidy program extended',
      description: 'Farmers can now apply for extended benefits until March 2026...',
    },
    {
      date: 'Feb 12, 2026',
      category: 'Jobs',
      categoryColor: 'bg-purple-100 text-purple-700',
      title: 'Government recruitment drive opens',
      description: '500+ positions available across various departments...',
    },
    {
      date: 'Feb 11, 2026',
      category: 'Education',
      categoryColor: 'bg-amber-100 text-amber-700',
      title: 'Scholarship applications now open',
      description: 'Students can apply for merit-based scholarships...',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, User 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Member since: 2026
          </p>
        </div>

        {/* Profile Completion */}
        <Card className="soft-shadow">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Profile Completion</span>
                <span className="text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Complete your profile to unlock all features
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {infoCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="soft-shadow hover:shadow-soft-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <CardTitle className="text-base">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-3">
                    {card.description}
                  </CardDescription>
                  <Button variant="outline" size="sm" className="w-full">
                    View More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <Card className="soft-shadow">
          <CardContent className="p-0">
            <div className="divide-y">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground">
                          {activity.date}
                        </span>
                        <Badge variant="secondary" className={activity.categoryColor}>
                          {activity.category}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-foreground mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {activity.description}
                      </p>
                      <Button variant="link" className="h-auto p-0 text-primary">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
