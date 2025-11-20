import { FilterPanel } from './components/filters/FilterPanel.jsx';
import { PartySeatShareChart } from './components/charts/PartySeatShareChart.jsx';
import { TurnoutChart } from './components/charts/TurnoutChart.jsx';
import { GenderRepresentationChart } from './components/charts/GenderRepresentationChart.jsx';
import { MarginDistributionChart } from './components/charts/MarginDistributionChart.jsx';
import { VoteShareChart } from './components/charts/VoteShareChart.jsx';
import { EducationChart } from './components/charts/EducationChart.jsx';
import { ConstituencyResultsTable } from './components/table/ConstituencyResultsTable.jsx';
import { CandidateSearch } from './components/search/CandidateSearch.jsx';
import { useDashboardData } from './hooks/useDashboardData.js';
import styles from './App.module.css';

const App = () => {
  const dashboard = useDashboardData();

  return (
    <div className={styles.appWrapper}>
      <FilterPanel />
      <div className={styles.chartGrid}>
        <PartySeatShareChart query={dashboard.seatShareQuery} />
        <VoteShareChart query={dashboard.voteShareQuery} />
        <TurnoutChart query={dashboard.turnoutQuery} />
        <GenderRepresentationChart query={dashboard.genderQuery} />
        <MarginDistributionChart query={dashboard.marginQuery} />
        <EducationChart query={dashboard.educationQuery} />
      </div>
      <ConstituencyResultsTable />
      <CandidateSearch />
    </div>
  );
};

export default App;
