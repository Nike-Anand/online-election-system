import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Lock, LogOut } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { VotingBooth } from './components/VotingBooth';
import { useElection } from './hooks/useElection';
import { Party } from './types';

function App() {
  const { db, updateDb, isElectionActive, hasVoted } = useElection();
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);

  const showAlert = (message: string, type = 'error') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogin = () => {
    if (!db) return;

    if (loginData.username === db.admin.username && loginData.password === db.admin.password) {
      setCurrentUser({ ...db.admin, type: 'admin' });
      setView('admin-dashboard');
    } else {
      const user = db.users.find(
        (u: any) => u.username === loginData.username && u.password === loginData.password
      );
      
      if (user) {
        if (!isElectionActive()) {
          showAlert('Election is not active at this time!');
          return;
        }
        
        if (hasVoted(user.username)) {
          showAlert('You have already voted!');
          return;
        }
        
        setCurrentUser({ ...user, type: 'voter' });
        setView('voting-booth');
      } else {
        showAlert('Invalid credentials!');
      }
    }
  };

  const handleVote = (partyName: string) => {
    if (!db || !currentUser) return;

    const vote = {
      userId: currentUser.username,
      partyName,
      timestamp: new Date().toISOString(),
      boothId: 'BOOTH-001'
    };

    const updatedDb = {
      ...db,
      votes: [...db.votes, vote],
      parties: db.parties.map((p: Party) =>
        p.name === partyName ? { ...p, votes: p.votes + 1 } : p
      )
    };

    updateDb(updatedDb);
    setView('thank-you');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('login');
    setLoginData({ username: '', password: '' });
  };

  if (!db) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {alert.show && (
        <Alert className={`mb-4 ${alert.type === 'error' ? 'bg-red-50' : 'bg-green-50'}`}>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

{view === 'login' && (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center" 
             style={{ backgroundImage: "url(https://media.gettyimages.com/id/2156205721/photo/vote-india-vote.jpg?s=612x612&w=0&k=20&c=-AODahcUEvFnxNGhHOs6x1BF-gMXf3yr27zn7xMhin0=)" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <Card className="w-full max-w-md relative backdrop-blur-sm bg-white bg-opacity-10 shadow-xl">
            <CardHeader className="pb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-vote w-16 h-16 mx-auto mb-4"><path d="m9 12 2 2 4-4"></path><path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"></path><path d="M22 19H2"></path></svg>
              <CardTitle className="text-center text-3xl font-bold text-black">
                Election System
              </CardTitle>
              <p className="text-center text-gray-200 mt-2">Secure Digital Voting Platform</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-200">Username</Label>
                  <Input
                    className="mt-1 bg-white bg-opacity-20 border-gray-300 text-white placeholder-gray-300"
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <Label className="text-gray-200">Password</Label>
                  <Input
                    className="mt-1 bg-white bg-opacity-20 border-gray-300 text-white placeholder-gray-300"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 transition-colors duration-200"
                  onClick={handleLogin}>
                  <Lock className="mr-2 h-4 w-4" /> Login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>)
}

      {view === 'admin-dashboard' && (
        <AdminDashboard
          db={db}
          updateDb={updateDb}
          onLogout={handleLogout}
          showAlert={showAlert}
        />
      )}

      {view === 'voting-booth' && (
        <VotingBooth
          parties={db.parties}
          onVote={handleVote}
          onViewPartyInfo={setSelectedParty}
        />
      )}

      {view === 'thank-you' && (
        <Card className="w-full max-w-md mx-auto mt-8 text-center">
          <CardHeader>
            <CardTitle>Thank You for Voting!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Your vote has been recorded successfully.</p>
            <Button onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedParty} onOpenChange={() => setSelectedParty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedParty?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Party Symbol</h3>
              <p className="text-2xl">{selectedParty?.symbol}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Description</h3>
              <p>{selectedParty?.description}</p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Manifesto</h3>
              <p className="whitespace-pre-wrap">{selectedParty?.manifesto}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;

