import { useState, useEffect } from 'react';
import { User, Party, Vote, ElectionSettings } from '../types';

interface ElectionDB {
  admin: User;
  users: User[];
  parties: Party[];
  votes: Vote[];
  electionSettings: ElectionSettings;
}

const DEFAULT_DB: ElectionDB = {
  admin: { username: 'admin', password: 'admin123', voterId: 'ADMIN001', role: 'admin' },
  users: [],
  parties: [],
  votes: [],
  electionSettings: {
    startTime: null,
    endTime: null,
    isActive: false,
    registrationOpen: true,
    minVotingAge: 18,
    boothLocations: ['Booth A', 'Booth B', 'Booth C']
  }
};

export function useElection() {
  const [db, setDb] = useState<ElectionDB | null>(null);

  useEffect(() => {
    const savedDb = localStorage.getItem('election_db');
    if (!savedDb) {
      localStorage.setItem('election_db', JSON.stringify(DEFAULT_DB));
      setDb(DEFAULT_DB);
    } else {
      setDb(JSON.parse(savedDb));
    }
  }, []);

  const updateDb = (newDb: ElectionDB) => {
    localStorage.setItem('election_db', JSON.stringify(newDb));
    setDb(newDb);
  };

  const isElectionActive = () => {
    if (!db?.electionSettings.isActive) return false;
    const now = new Date();
    const start = db.electionSettings.startTime ? new Date(db.electionSettings.startTime) : null;
    const end = db.electionSettings.endTime ? new Date(db.electionSettings.endTime) : null;
    
    return start && end && now >= start && now <= end;
  };

  const hasVoted = (userId: string) => {
    return db?.votes.some(vote => vote.userId === userId) ?? false;
  };

  const getResults = () => {
    return db?.parties.map(party => ({
      name: party.name,
      votes: party.votes,
      percentage: (party.votes / (db.votes.length || 1)) * 100
    })) ?? [];
  };

  const getVoterTurnout = () => {
    const totalVoters = db?.users.length ?? 0;
    const totalVotes = db?.votes.length ?? 0;
    return {
      total: totalVoters,
      voted: totalVotes,
      percentage: totalVoters ? (totalVotes / totalVoters) * 100 : 0
    };
  };

  return {
    db,
    updateDb,
    isElectionActive,
    hasVoted,
    getResults,
    getVoterTurnout
  };
}