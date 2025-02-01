import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Party } from '../types';
import { Check, Info, Award } from 'lucide-react';

interface VotingBoothProps {
  parties: Party[];
  onVote: (partyName: string) => void;
  onViewPartyInfo: (party: Party) => void;
}

export function VotingBooth({ parties, onVote, onViewPartyInfo }: VotingBoothProps) {
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [hoveredParty, setHoveredParty] = useState<string | null>(null);

  const handleVote = () => {
    if (selectedParty) {
      onVote(selectedParty);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477281765962-ef34e8bb0967?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZvdGV8ZW58MHx8MHx8fDA%3D')" }}
    >
      <Card 
        className="w-full max-w-4xl mx-auto shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-md p-6"
      >
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
            <Award className="w-8 h-8" />
            Cast Your Vote
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {parties.map((party) => (
              <motion.div
                key={party.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: parties.findIndex(p => p.name === party.name) * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 ease-in-out
                  ${selectedParty === party.name 
                    ? 'border-blue-500 bg-blue-50/50 ring-4 ring-blue-200/50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/20'}
                `}
                onClick={() => setSelectedParty(party.name)}
                onMouseEnter={() => setHoveredParty(party.name)}
                onMouseLeave={() => setHoveredParty(null)}
              >
                <AnimatePresence>
                  {selectedParty === party.name && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="absolute top-2 right-2 text-blue-500"
                    >
                      <Check className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-4xl">{party.symbol}</div>
                  <h3 className="text-xl font-bold text-gray-800">{party.name}</h3>
                </div>
                <motion.p 
                  className="text-sm text-gray-600 mb-4 h-16 overflow-hidden"
                  animate={{ 
                    opacity: hoveredParty === party.name ? 0.7 : 1,
                    scale: hoveredParty === party.name ? 1.02 : 1
                  }}
                >
                  {party.description}
                </motion.p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center gap-2 hover:bg-blue-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewPartyInfo(party);
                  }}
                >
                  <Info className="h-4 w-4" />
                  View Manifesto
                </Button>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleVote}
              disabled={!selectedParty}
              className="
                px-10 py-3 text-lg font-bold
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:from-blue-700 hover:to-purple-700
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300 ease-in-out
              "
            >
              Confirm Vote
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

export default VotingBooth;
