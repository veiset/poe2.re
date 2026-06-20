import { Component, ErrorInfo, ReactNode } from "react";
import { WarningBox } from "@/components/warning/WarningBox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { defaultSettings } from "@/app/settings.ts";
import { saveSettings, selectedProfile } from "@/lib/localStorage.ts";
import { Bug } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    const profile = selectedProfile();
    saveSettings({ ...defaultSettings, name: profile });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const bugUrl = "https://github.com/veiset/poe2.re/issues/new?assignees=veiset&labels=bug&projects=&template=bug_report.md&title=Bug%3A+%3CTitle%3E";
      return (
        <div className="p-8 flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
          <div className="max-w-2xl w-full">
            <WarningBox
              header="Something went wrong!"
              headerClassName="text-2xl mb-2"
              text={
                <div className="flex flex-col gap-4">
                  <p>
                    An unexpected error occurred. This might be due to corrupted settings or an incompatible profile.
                  </p>
                  <div>
                    <Button
                      variant="default"
                      onClick={this.handleReset}
                      className="hover:bg-primary/80 hover:brightness-125 transition-all duration-200"
                    >
                      Reset Settings and Reload
                    </Button>
                  </div>
                  <p className="text-sm">
                    If this error persists, please consider reporting it as a bug on GitHub.
                    Including the error message below helps in diagnosing the issue.
                  </p>
                  {this.state.error && (
                    <pre className="bg-black/20 p-2 rounded text-xs overflow-auto max-h-40">
                      {this.state.error.message}
                    </pre>
                  )}
                  <div>
                    <Button
                      variant="default"
                      asChild
                      className="hover:bg-primary/80 hover:brightness-125 transition-all duration-200"
                    >
                      <a href={bugUrl} target="_blank" rel="noopener noreferrer">
                        <Bug className="mr-2 h-4 w-4" />
                        Report Bug
                      </a>
                    </Button>
                  </div>
                </div>
              }
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
