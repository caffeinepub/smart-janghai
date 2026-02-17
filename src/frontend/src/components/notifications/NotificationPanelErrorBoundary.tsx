import { Component, type ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class NotificationPanelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Notification panel error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Show a compact inline fallback instead of rendering nothing
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>Notifications unavailable</span>
        </div>
      );
    }

    return this.props.children;
  }
}
