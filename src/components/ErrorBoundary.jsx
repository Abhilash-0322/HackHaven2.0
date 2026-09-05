import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('ErrorBoundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-void flex items-center justify-center p-4">
          <div className="max-w-md w-full glass gradient-border rounded-2xl p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-neon-pink mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Agent malfunction</h2>
            <p className="text-gray-500 text-sm mb-6 font-mono">An unexpected error occurred. Your data is safe.</p>
            <div className="space-y-2">
              <button type="button" onClick={this.handleReset} className="neon-btn w-full">
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <button type="button" onClick={() => { window.location.href = '/'; }} className="neon-btn-ghost w-full">
                Return to dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
