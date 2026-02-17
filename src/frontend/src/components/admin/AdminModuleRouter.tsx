import DashboardOverviewView from './modules/DashboardOverviewView';
import UsersModuleView from './modules/UsersModuleView';
import NewsModuleView from './modules/NewsModuleView';
import SchemesModuleView from './modules/SchemesModuleView';
import JobsModuleView from './modules/JobsModuleView';
import MediaLibraryModuleView from './modules/MediaLibraryModuleView';
import NotificationsModuleView from './modules/NotificationsModuleView';
import WebsiteSettingsModuleView from './modules/WebsiteSettingsModuleView';
import ReportsAnalyticsModuleView from './modules/ReportsAnalyticsModuleView';
import BackupSecurityModuleView from './modules/BackupSecurityModuleView';
import VotingResultsModuleView from './modules/VotingResultsModuleView';

interface AdminModuleRouterProps {
  activeModule: string;
}

export default function AdminModuleRouter({ activeModule }: AdminModuleRouterProps) {
  switch (activeModule) {
    case 'overview':
      return <DashboardOverviewView />;
    case 'users':
      return <UsersModuleView />;
    case 'news':
      return <NewsModuleView />;
    case 'schemes':
      return <SchemesModuleView />;
    case 'jobs':
      return <JobsModuleView />;
    case 'media':
      return <MediaLibraryModuleView />;
    case 'notifications':
      return <NotificationsModuleView />;
    case 'settings':
      return <WebsiteSettingsModuleView />;
    case 'reports':
      return <ReportsAnalyticsModuleView />;
    case 'security':
      return <BackupSecurityModuleView />;
    case 'voting-results':
      return <VotingResultsModuleView />;
    default:
      return <DashboardOverviewView />;
  }
}
