import React, { useEffect, useState } from 'react';
import { apiCall } from '@/store/utils';
import { endpoints } from '@/store/urls';
import stl from './MatchTable.module.scss';
import toast from 'react-hot-toast';

const MatchTable = ({ tournamentId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await apiCall(endpoints.getFixtures, {
          params: { tournament_id: tournamentId }
        });

        if (response && response.matches) {
          setMatches(response.matches);
        }
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        toast.error('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    if (tournamentId) {
      fetchMatches();
    }
  }, [tournamentId]);

  const exportToCSV = () => {
    try {
      const headers = [
        'Match ID',
        'Round',
        'Pool',
        'Team 1',
        'Team 2',
        'Result',
        'Outcome',
        'Status'
      ];

      const csvRows = matches.map(match => [
        match.match_id,
        match.round_name || `Round ${match.round_id}`,
        match.pool || '-',
        match.team1_players,
        match.team2_players,
        match.outcome === 'walkover'
          ? `Winner: ${match.winner_team_id} (Walkover)`
          : match.match_result,
        match.outcome || 'normal',
        match.match_status.status
      ]);

      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell ?? ''}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `tournament_${tournamentId}_matches.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('CSV file downloaded successfully');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Failed to export matches to CSV');
    }
  };

  if (loading) {
    return <div className={stl.loading}>Loading matches...</div>;
  }

  return (
    <div className={stl.container}>
      <div className={stl.header}>
        <button onClick={exportToCSV} className={stl.exportButton}>
          Export to CSV
        </button>
      </div>

      <div className={stl.tableWrapper}>
        <table className={stl.table}>
          <thead>
            <tr>
              <th>Match ID</th>
              <th>Round</th>
              <th>Pool</th>
              <th>Team 1</th>
              <th>Team 2</th>
              <th>Result</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {matches.map((match) => (
              <tr key={match.match_id}>
                <td>{match.match_id}</td>
                <td>{match.round_name || `Round ${match.round_id}`}</td>
                <td>{match.pool || '-'}</td>
                <td>{match.team1_players}</td>
                <td>{match.team2_players}</td>

                <td>
                  {match.outcome === 'walkover' ? (
                    <>
                      <strong>{match.winner_team_id}</strong>
                      <span
                        style={{
                          marginLeft: 8,
                          background: '#ffe5e5',
                          color: '#b00020',
                          padding: '3px 6px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        Walkover
                      </span>
                    </>
                  ) : (
                    match.match_result
                  )}
                </td>

                <td>
                  <span className={`${stl.status} ${stl[match.match_status.status]}`}>
                    {match.match_status.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default MatchTable;
