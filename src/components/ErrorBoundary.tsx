import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled render error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" dir="rtl">
          <div className="text-center max-w-md">
            <h1 className="text-lg font-bold text-gray-900 mb-2">حدث خطأ غير متوقع</h1>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error?.message || "تعذر عرض هذه الصفحة"}
            </p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
