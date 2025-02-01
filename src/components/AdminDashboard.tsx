import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { UserPlus, LogOut, Settings, BarChart, Flag, CheckCircle, XCircle, Info } from 'lucide-react';
import { User, Party } from '../types';

interface AdminDashboardProps {
  db: any;
  updateDb: (db: any) => void;
  onLogout: () => void;
  showAlert: (message: string, type: string) => void;
}

export function AdminDashboard({ db, updateDb, onLogout, showAlert }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'voters' | 'parties' | 'settings' | 'results'>('voters');
  const [newUser, setNewUser] = useState<Partial<User>>({
    username: '',
    password: '',
    voterId: '',
    role: 'voter'
  });

  const [newParty, setNewParty] = useState<Partial<Party>>({
    name: '',
    symbol: '',
    description: '',
    manifesto: '',
    votes: 0
  });

  const addUser = () => {
    if (!newUser.username || !newUser.password || !newUser.voterId) {
      showAlert('All fields are required!', 'error');
      return;
    }

    if (db.users.some((u: User) => u.username === newUser.username || u.voterId === newUser.voterId)) {
      showAlert('User or Voter ID already exists!', 'error');
      return;
    }

    const updatedDb = {
      ...db,
      users: [...db.users, newUser]
    };
    updateDb(updatedDb);
    setNewUser({ username: '', password: '', voterId: '', role: 'voter' });
    showAlert('User added successfully!', 'success');
  };

  const addParty = () => {
    if (!newParty.name || !newParty.symbol) {
      showAlert('Party name and symbol are required!', 'error');
      return;
    }

    if (db.parties.some((p: Party) => p.name === newParty.name)) {
      showAlert('Party already exists!', 'error');
      return;
    }

    const updatedDb = {
      ...db,
      parties: [...db.parties, { ...newParty, votes: 0 }]
    };
    updateDb(updatedDb);
    setNewParty({ name: '', symbol: '', description: '', manifesto: '', votes: 0 });
    showAlert('Party added successfully!', 'success');
  };

  const updateElectionSettings = (settings: any) => {
    const updatedDb = {
      ...db,
      electionSettings: { ...db.electionSettings, ...settings }
    };
    updateDb(updatedDb);
    showAlert('Election settings updated!', 'success');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'voters':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Register New Voter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Username</Label>
                  <Input
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label>Voter ID</Label>
                  <Input
                    value={newUser.voterId}
                    onChange={(e) => setNewUser({ ...newUser, voterId: e.target.value })}
                    placeholder="Enter voter ID"
                  />
                </div>
                <Button onClick={addUser} className="w-full group">
                  <UserPlus className="mr-2 h-4 w-4 group-hover:rotate-45 transition-transform" /> 
                  Register Voter
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'parties':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="h-5 w-5" />
                  Register Political Party
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Party Name</Label>
                  <Input
                    value={newParty.name}
                    onChange={(e) => setNewParty({ ...newParty, name: e.target.value })}
                    placeholder="Enter party name"
                  />
                </div>
                <div>
                  <Label>Party Symbol</Label>
                  <Input
                    value={newParty.symbol}
                    onChange={(e) => setNewParty({ ...newParty, symbol: e.target.value })}
                    placeholder="Enter party symbol"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newParty.description}
                    onChange={(e) => setNewParty({ ...newParty, description: e.target.value })}
                    placeholder="Enter party description"
                  />
                </div>
                <div>
                  <Label>Manifesto</Label>
                  <Textarea
                    value={newParty.manifesto}
                    onChange={(e) => setNewParty({ ...newParty, manifesto: e.target.value })}
                    placeholder="Enter party manifesto"
                  />
                </div>
                <Button onClick={addParty} className="w-full group">
                  <Flag className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" /> 
                  Register Party
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Election Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="datetime-local"
                    value={db.electionSettings.startTime || ''}
                    onChange={(e) => updateElectionSettings({ startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="datetime-local"
                    value={db.electionSettings.endTime || ''}
                    onChange={(e) => updateElectionSettings({ endTime: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => updateElectionSettings({ isActive: !db.electionSettings.isActive })}
                    variant={db.electionSettings.isActive ? "destructive" : "default"}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    {db.electionSettings.isActive ? (
                      <>
                        <XCircle className="h-4 w-4" /> Stop Election
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" /> Start Election
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => updateElectionSettings({ registrationOpen: !db.electionSettings.registrationOpen })}
                    variant={db.electionSettings.registrationOpen ? "destructive" : "default"}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    {db.electionSettings.registrationOpen ? (
                      <>
                        <XCircle className="h-4 w-4" /> Close Registration
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" /> Open Registration
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      case 'results':
        return (
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Election Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={db.parties}
                        dataKey="votes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {db.parties.map((_: any, index: number) => (
                          <Cell key={index} fill={`hsl(${index * 45}, 70%, 50%)`} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-500" /> Total Voters
                    </h3>
                    <p className="text-2xl font-bold">{db.users.length}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-green-500" /> Total Votes Cast
                    </h3>
                    <p className="text-2xl font-bold">{db.votes.length}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg col-span-2">
                    <h3 className="font-semibold flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-purple-500" /> Voter Turnout
                    </h3>
                    <p className="text-2xl font-bold">
                      {((db.votes.length / (db.users.length || 1)) * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
    }
  };

  return (
    <div
    className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center"
    style={{ backgroundImage: "url('https://media.gettyimages.com/id/458534317/photo/indian-parliament-new-delhi.jpg?s=612x612&w=0&k=20&c=U5LGu_W2KfqJwgi7iJfJGinN5WOeF8_hPnZ9CVvD9Aw=')" }}
     >
     
    <div className="container mx-auto p-2 space-y-6 max-w-lg">
      <div className="bg-gray-100 rounded-lg p-2 flex gap-2 mb-6">
        {[
          { key: 'voters', icon: UserPlus, label: 'Voters' },
          { key: 'parties', icon: Flag, label: 'Parties' },
          { key: 'settings', icon: Settings, label: 'Settings' },
          { key: 'results', icon: BarChart, label: 'Results' }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'ghost'}
            onClick={() => setActiveTab(tab.key as any)}
            className="flex-1 flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {renderTabContent()}

      <Button 
        variant="destructive" 
        onClick={onLogout} 
        className="mt-6 w-full group"
      >
        <LogOut className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
        Logout
      </Button>
    </div>
    </div>
  );
}


export default AdminDashboard;