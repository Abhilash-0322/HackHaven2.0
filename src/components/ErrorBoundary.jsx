import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './ui/Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4">
          <div className="max-w-md w-full editorial-card text-center">
            <AlertTriangle className="h-12 w-12 text-terracotta mx-auto mb-4" />
            <h2 className="font-display text-2xl text-editorial-ink mb-2">Something went wrong</h2>
            <p className="font-serif text-charcoal-light mb-6">
              {this.state.error?.message || 'We encountered an unexpected error.'}
            </p>
            <div className="space-y-3">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
              <Button variant="secondary" onClick={() => { window.location.href = '/'; }} className="w-full">
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
