/**
 * AI Guard - Brain Dashboard
 * Simple visual dashboard showing LLM's internal state
 */

import { h, Component } from 'preact';
import { BrainTracker } from './brain-tracker';

interface BrainDashboardProps {
  tracker: BrainTracker;
}

interface BrainDashboardState {
  state: any;
  isExpanded: boolean;
}

class BrainDashboard extends Component<BrainDashboardProps, BrainDashboardState> {
  private updateInterval: number | null = null;

  constructor(props: BrainDashboardProps) {
    super(props);
    this.state = {
      state: props.tracker.getSimpleState(),
      isExpanded: false
    };
  }

  componentDidMount() {
    // Update dashboard every 500ms
    this.updateInterval = window.setInterval(() => {
      this.setState({
        state: this.props.tracker.getSimpleState()
      });
    }, 500);
  }

  componentWillUnmount() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  toggleExpanded = () => {
    this.setState({ isExpanded: !this.state.isExpanded });
  };

  render() {
    const { state, isExpanded } = this.state;

    return (
      <div className="ai-guard-brain-dashboard">
        <div className="brain-header" onClick={this.toggleExpanded}>
          <span className="brain-icon">🧠</span>
          <span className="brain-title">AI Brain Monitor</span>
          <span className="brain-toggle">{isExpanded ? '▼' : '▶'}</span>
        </div>

        {isExpanded && (
          <div className="brain-content">
            {/* Memory Section */}
            <div className="brain-section">
              <div className="section-header">💾 Memory</div>
              <div className="section-content">
                <MetricRow 
                  label="Pressure" 
                  value={state.memory.pressure}
                  warning={parseInt(state.memory.pressure) > 70}
                />
                <MetricRow 
                  label="Forgotten Items" 
                  value={state.memory.forgotten}
                  warning={state.memory.forgotten > 0}
                />
                <MetricRow 
                  label="Active Memory" 
                  value={`${state.memory.shortTermSize} messages`}
                />
              </div>
            </div>

            {/* Context Section */}
            <div className="brain-section">
              <div className="section-header">🎯 Context</div>
              <div className="section-content">
                <MetricRow 
                  label="Drift" 
                  value={state.context.drift}
                  warning={parseInt(state.context.drift) > 50}
                />
                <MetricRow 
                  label="Token Window" 
                  value={state.context.tokenWindow}
                />
                <div className="metric-row">
                  <span className="metric-label">Focused On:</span>
                  <span className="metric-value">
                    {state.context.topics.length > 0 
                      ? state.context.topics.join(', ')
                      : 'Nothing specific'}
                  </span>
                </div>
              </div>
            </div>

            {/* Reasoning Section */}
            <div className="brain-section">
              <div className="section-header">🤔 Reasoning</div>
              <div className="section-content">
                <MetricRow 
                  label="Confidence" 
                  value={state.reasoning.confidence}
                  warning={parseInt(state.reasoning.confidence) < 50}
                />
                <MetricRow 
                  label="Uncertainty Markers" 
                  value={state.reasoning.uncertaintyLevel}
                  warning={state.reasoning.uncertaintyLevel > 3}
                />
                <MetricRow 
                  label="Hallucinations" 
                  value={state.reasoning.hallucinations}
                  warning={state.reasoning.hallucinations > 0}
                  critical={state.reasoning.hallucinations > 2}
                />
                <MetricRow 
                  label="Self-Corrections" 
                  value={state.reasoning.corrections}
                />
              </div>
            </div>

            {/* Attention Section */}
            <div className="brain-section">
              <div className="section-header">👁️ Attention</div>
              <div className="section-content">
                <MetricRow 
                  label="Focus Score" 
                  value={state.attention.focus}
                  warning={parseInt(state.attention.focus) < 50}
                />
                <MetricRow 
                  label="Distractions" 
                  value={state.attention.distractions}
                  warning={state.attention.distractions > 2}
                />
                <div className="metric-row">
                  <span className="metric-label">Paying Attention To:</span>
                  <span className="metric-value">
                    {state.attention.focusedOn.length > 0
                      ? state.attention.focusedOn.join(', ')
                      : 'Nothing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Emotional Section */}
            <div className="brain-section">
              <div className="section-header">😊 Emotional State</div>
              <div className="section-content">
                <MetricRow 
                  label="Tone" 
                  value={state.emotional.tone}
                />
                <MetricRow 
                  label="Tone Shift" 
                  value={state.emotional.toneShift}
                  warning={state.emotional.toneShift === 'Yes'}
                />
                <MetricRow 
                  label="Stress Level" 
                  value={state.emotional.stress}
                  warning={parseInt(state.emotional.stress) > 50}
                  critical={parseInt(state.emotional.stress) > 75}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

// Metric Row Component
interface MetricRowProps {
  label: string;
  value: string | number;
  warning?: boolean;
  critical?: boolean;
}

const MetricRow = ({ label, value, warning, critical }: MetricRowProps) => {
  let className = 'metric-row';
  if (critical) className += ' critical';
  else if (warning) className += ' warning';

  return (
    <div className={className}>
      <span className="metric-label">{label}:</span>
      <span className="metric-value">{value}</span>
      {(warning || critical) && <span className="metric-alert">⚠️</span>}
    </div>
  );
};

export default BrainDashboard;
export { BrainDashboard };
