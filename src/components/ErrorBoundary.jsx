import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './ui/Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-slate-500">
            This section encountered an error. Please refresh or try again later.
          </p>
          <Button className="mt-6" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
