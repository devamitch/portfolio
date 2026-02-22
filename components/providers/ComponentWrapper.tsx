"use client";

import React, {
  Component,
  ComponentType,
  Profiler,
  ProfilerOnRenderCallback,
  PropsWithChildren,
  ReactNode,
  Suspense,
  createContext,
  memo,
  useCallback,
  useContext,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import { COLORS, MONO } from "~/data/portfolio.data";

interface PerfMetrics {
  id: string;
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<unknown>;
}

interface PerfContextValue {
  metrics: Record<string, PerfMetrics>;
  logMetric: (m: PerfMetrics) => void;
  hasError: boolean;
}

const PerfContext = createContext<PerfContextValue>({
  metrics: {},
  logMetric: () => {},
  hasError: false,
});

export const usePerfContext = () => useContext(PerfContext);

// ─────────────────────────────────────────────────────────────────────────────
// ② ERROR BOUNDARY
// ─────────────────────────────────────────────────────────────────────────────
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
  id: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

class ComponentErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error(
      `[ComponentWrapper:${this.props.id}] Error caught:`,
      error,
      info,
    );
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);
    return (
      <DefaultErrorFallback
        error={error}
        reset={this.reset}
        id={this.props.id}
      />
    );
  }
}

function DefaultErrorFallback({
  error,
  reset,
  id,
}: {
  error: Error;
  reset: () => void;
  id: string;
}) {
  return (
    <div
      style={{
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        background: COLORS.bg2,
        border: `1px solid rgba(255,68,68,0.18)`,
        borderRadius: 8,
        gap: 12,
        fontFamily: MONO,
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "rgba(255,68,68,0.6)",
          textTransform: "uppercase",
        }}
      >
        [{id}] RENDER ERROR
      </div>
      <div
        style={{
          fontSize: 12,
          color: "rgba(255,68,68,0.85)",
          maxWidth: 480,
          textAlign: "center",
          lineHeight: 1.5,
        }}
      >
        {error.message}
      </div>
      <button
        onClick={reset}
        style={{
          marginTop: 8,
          padding: "7px 22px",
          fontSize: 11,
          letterSpacing: "0.14em",
          color: COLORS.gold,
          background: COLORS.goldF,
          border: `1px solid ${COLORS.goldD}`,
          borderRadius: 4,
          cursor: "pointer",
          fontFamily: MONO,
          textTransform: "uppercase",
        }}
      >
        RETRY
      </button>
    </div>
  );
}

interface IOGateProps {
  children: ReactNode;
  rootMargin?: string;
  placeholderHeight?: number;
  revealDelay?: number;
  enabled?: boolean;
  onVisible?: () => void;
}

function IOGate({
  children,
  rootMargin = "300px 0px",
  placeholderHeight = 400,
  revealDelay = 0,
  enabled = true,
  onVisible,
}: IOGateProps) {
  const [hasRevealed, setHasRevealed] = useState(!enabled);

  const { ref } = useInView({
    rootMargin,
    threshold: 0,
    triggerOnce: true, // fires once, disconnects observer → no overhead after
    skip: hasRevealed, // skip re-observing if already revealed
    onChange: (inView) => {
      if (!inView) return;
      if (revealDelay > 0) {
        setTimeout(() => {
          setHasRevealed(true);
          onVisible?.();
        }, revealDelay);
      } else {
        setHasRevealed(true);
        onVisible?.();
      }
    },
  });

  if (!hasRevealed) {
    return (
      <div
        ref={ref}
        style={{
          height: placeholderHeight,
          background: COLORS.bg2,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          backgroundImage: `linear-gradient(
            90deg,
            ${COLORS.bg2} 0%,
            rgba(201,168,76,0.03) 50%,
            ${COLORS.bg2} 100%
          )`,
        }}
        aria-hidden="true"
        data-io-gate="pending"
      />
    );
  }

  return <>{children}</>;
}

// ─────────────────────────────────────────────────────────────────────────────
// ④ PROFILER WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
interface ProfilerWrapperProps {
  id: string;
  children: ReactNode;
  onRender?: ProfilerOnRenderCallback;
  logMetric?: (m: PerfMetrics) => void;
  enabled?: boolean;
}

function ProfilerWrapper({
  id,
  children,
  onRender,
  logMetric,
  enabled = true,
}: ProfilerWrapperProps) {
  const handleRender = useCallback<ProfilerOnRenderCallback>(
    (
      pid,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime,
      interactions,
    ) => {
      const metric: PerfMetrics = {
        id: pid,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      };
      logMetric?.(metric);
      onRender?.(
        pid,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      );

      if (process.env.NODE_ENV === "development" && actualDuration > 16) {
        console.warn(
          `[Profiler:${pid}] Slow render — ${phase} took ${actualDuration.toFixed(1)}ms (budget: 16ms)`,
        );
      }
    },
    [logMetric, onRender],
  );

  if (!enabled) return <>{children}</>;
  return (
    <Profiler id={id} onRender={handleRender}>
      {children}
    </Profiler>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑤ DEFAULT SUSPENSE FALLBACK
// ─────────────────────────────────────────────────────────────────────────────
function DefaultSuspenseFallback({ height = 400 }: { height?: number }) {
  return (
    <div
      style={{
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: COLORS.bg2,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        gap: 6,
      }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            width: 5,
            height: 5,
            borderRadius: "50%",
            backgroundColor: COLORS.gold,
            animation: `__dot_bounce 1.4s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑥ PERF CONTEXT PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
function PerfProvider({
  children,
  hasError,
}: PropsWithChildren<{ hasError: boolean }>) {
  const [metrics, setMetrics] = useState<Record<string, PerfMetrics>>({});

  const logMetric = useCallback((m: PerfMetrics) => {
    setMetrics((prev) => ({ ...prev, [m.id]: m }));
  }, []);

  return (
    <PerfContext.Provider value={{ metrics, logMetric, hasError }}>
      {children}
    </PerfContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑦ MAIN ComponentWrapper
// ─────────────────────────────────────────────────────────────────────────────
export interface ComponentWrapperProps {
  /** Unique ID used for profiling, error reporting, and logging */
  id: string;
  children: ReactNode;

  // Error Boundary
  errorFallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;

  // Profiler
  profiling?: boolean;
  onRender?: ProfilerOnRenderCallback;

  // IO Gate
  /** Defer mount + chunk download until near viewport. Default: true */
  lazyReveal?: boolean;
  /** How far before viewport to start loading. Default: "300px 0px" */
  rootMargin?: string;
  /** ms delay after intersection. Default: 0 */
  revealDelay?: number;
  /** Placeholder height before reveal. Match your component. Default: 400 */
  placeholderHeight?: number;
  /** Called once when component first becomes visible */
  onVisible?: () => void;

  // Suspense
  suspenseFallback?: ReactNode;

  className?: string;
  style?: React.CSSProperties;
}

export const ComponentWrapper = memo(function ComponentWrapper({
  id,
  children,
  errorFallback,
  onError,
  profiling = process.env.NODE_ENV === "development",
  onRender,
  lazyReveal = true,
  rootMargin = "300px 0px",
  revealDelay = 0,
  placeholderHeight = 400,
  onVisible,
  suspenseFallback,
  className,
  style,
}: ComponentWrapperProps) {
  const { logMetric } = usePerfContext();

  return (
    <div className={className} style={style}>
      <ComponentErrorBoundary
        id={id}
        fallback={errorFallback}
        onError={onError}
      >
        <IOGate
          enabled={lazyReveal}
          rootMargin={rootMargin}
          revealDelay={revealDelay}
          placeholderHeight={placeholderHeight}
          onVisible={onVisible}
        >
          <ProfilerWrapper
            id={id}
            enabled={profiling}
            onRender={onRender}
            logMetric={logMetric}
          >
            <Suspense
              fallback={
                suspenseFallback ?? (
                  <DefaultSuspenseFallback height={placeholderHeight} />
                )
              }
            >
              {children}
            </Suspense>
          </ProfilerWrapper>
        </IOGate>
      </ComponentErrorBoundary>
    </div>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ⑧ PAGE-LEVEL PROVIDER — wrap your page or layout root once
// ─────────────────────────────────────────────────────────────────────────────
export interface ComponentWrapperProviderProps extends PropsWithChildren {
  showDevOverlay?: boolean;
}

export function ComponentWrapperProvider({
  children,
  showDevOverlay = false,
}: ComponentWrapperProviderProps) {
  const [hasError] = useState(false);

  return (
    <PerfProvider hasError={hasError}>
      {children}
      {showDevOverlay && process.env.NODE_ENV === "development" && (
        <DevPerfOverlay />
      )}
    </PerfProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ⑨ DEV OVERLAY
// ─────────────────────────────────────────────────────────────────────────────
function DevPerfOverlay() {
  const { metrics } = usePerfContext();
  const entries = Object.values(metrics);
  const [open, setOpen] = useState(false);

  if (entries.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        fontFamily: MONO,
        fontSize: 10,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          padding: "5px 12px",
          background: COLORS.bg2,
          border: `1px solid ${COLORS.goldD}`,
          color: COLORS.gold,
          borderRadius: 4,
          cursor: "pointer",
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.12em",
        }}
      >
        PERF ({entries.length})
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            background: COLORS.bg2,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: 16,
            minWidth: 320,
            maxHeight: 400,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              color: COLORS.vfaint,
              marginBottom: 4,
            }}
          >
            RENDER METRICS
          </div>
          {entries.map((m) => (
            <div
              key={m.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 10px",
                background: COLORS.bg3,
                borderRadius: 4,
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <span style={{ color: COLORS.dim }}>{m.id}</span>
              <div style={{ display: "flex", gap: 12 }}>
                <span
                  style={{
                    color: m.actualDuration > 16 ? COLORS.red : COLORS.gold,
                  }}
                >
                  {m.actualDuration.toFixed(1)}ms
                </span>
                <span
                  style={{ color: COLORS.vfaint, textTransform: "uppercase" }}
                >
                  {m.phase}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function withComponentWrapper<P extends object>(
  WrappedComponent: ComponentType<P>,
  wrapperProps: Omit<ComponentWrapperProps, "children">,
) {
  const Wrapped = memo(function WithComponentWrapper(props: P) {
    return (
      <ComponentWrapper {...wrapperProps}>
        <WrappedComponent {...props} />
      </ComponentWrapper>
    );
  });

  Wrapped.displayName = `WithWrapper(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? "Component"
  })`;

  return Wrapped;
}
