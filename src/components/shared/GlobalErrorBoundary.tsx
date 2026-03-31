import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-3xl shadow-xl border border-outline-variant/20 text-center space-y-6">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-error" />
            </div>
            
            <div className="space-y-2">
              <h1 className="font-headline font-black text-2xl text-on-surface">System Interruption</h1>
              <p className="text-secondary text-sm">
                Something unexpected happened. We've logged the incident and our team is already looking into it.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-error/5 rounded-xl text-left border border-error/10 overflow-hidden text-xs font-mono text-error/80 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {this.state.error?.toString()}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4">
              <Button onClick={() => window.location.reload()} className="h-12 font-bold uppercase tracking-widest text-xs gap-2">
                <RotateCcw className="w-4 h-4" /> Try Refreshing
              </Button>
              <Button onClick={this.handleReset} variant="outline" className="h-12 font-bold uppercase tracking-widest text-xs gap-2">
                <Home className="w-4 h-4" /> Back to Safety
              </Button>
            </div>

            <p className="text-[10px] text-secondary font-medium">
              Reference ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
