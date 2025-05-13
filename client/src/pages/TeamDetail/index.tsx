import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../Dashboard/Layout';
import api from '../../api/axios';
import { TEAM_ENDPOINTS, USER_ENDPOINTS } from '../../api/urls';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';

interface TeamMember {
  user_id: number;
  username: string;
}

interface Team {
  id: number;
  hackathon_id: number;
  name: string;
  description: string;
  join_code: string;
  members: TeamMember[];
}

interface Idea {
  id: number;
  team_id: number;
  summary: string;
  tech: string[];
}

const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToastContext();

  const [team, setTeam] = useState<Team | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteUsername, setInviteUsername] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [newIdeaSummary, setNewIdeaSummary] = useState('');
  const [newIdeaTech, setNewIdeaTech] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');
  const [ideaError, setIdeaError] = useState('');
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch team details
        const teamResponse = await api.get(TEAM_ENDPOINTS.GET_BY_ID(Number(id)));
        setTeam(teamResponse.data);

        // Fetch user's ideas and filter by team ID
        const ideasResponse = await api.get(USER_ENDPOINTS.IDEAS);
        // Filter ideas to only show those from this team
        const teamIdeas = ideasResponse.data.filter((idea: Idea) => idea.team_id === Number(id));
        setIdeas(teamIdeas);
      } catch (err: any) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchTeamData();
    }
  }, [id]);

  const handleInviteUser = async () => {
    if (!inviteUsername.trim()) {
      setInviteError('Please enter a username');
      return;
    }

    try {
      setIsInviting(true);
      setInviteError('');

      await api.post(TEAM_ENDPOINTS.INVITE(Number(id)), { username: inviteUsername });

      // Close modal and reset form
      setShowInviteModal(false);
      setInviteUsername('');

      // Show success toast notification
      showSuccessToast('Invitation sent successfully!');
    } catch (err: any) {
      console.error('Error inviting user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send invitation';
      setInviteError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsInviting(false);
    }
  };

  const handleAddTech = () => {
    if (newTech.trim() && !newIdeaTech.includes(newTech.trim())) {
      setNewIdeaTech([...newIdeaTech, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setNewIdeaTech(newIdeaTech.filter(tech => tech !== techToRemove));
  };

  const handleSubmitIdea = async () => {
    if (!newIdeaSummary.trim()) {
      setIdeaError('Please enter a summary for your idea');
      return;
    }

    if (newIdeaTech.length === 0) {
      setIdeaError('Please add at least one technology');
      return;
    }

    try {
      setIsSubmittingIdea(true);
      setIdeaError('');

      const response = await api.post(TEAM_ENDPOINTS.CREATE_IDEA(Number(id)), {
        summary: newIdeaSummary,
        tech: newIdeaTech
      });

      // Add new idea to the list
      setIdeas([...ideas, response.data]);

      // Close modal and reset form
      setShowNewIdeaModal(false);
      setNewIdeaSummary('');
      setNewIdeaTech([]);

      // Show success toast notification
      showSuccessToast('Idea created successfully!');

      // Navigate to the idea detail page
      navigate(`/ideas/${response.data.id}`);
    } catch (err: any) {
      console.error('Error creating idea:', err);
      const errorMessage = err.response?.data?.message || 'Failed to create idea';
      setIdeaError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setIsSubmittingIdea(false);
    }
  };

  const isTeamMember = team?.members.some(member => member.user_id === user?.id);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : team ? (
          <div className="py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">{team.name}</h1>
              {isTeamMember && (
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Invite Member
                  </button>
                  <button
                    onClick={() => setShowNewIdeaModal(true)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    New Idea
                  </button>
                </div>
              )}
            </div>

            <p className="mt-1 text-sm text-gray-500">{team.description || 'No description'}</p>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Team Members */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">Team Members</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{team.members.length} member(s)</p>
                </div>
                <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {team.members.map((member) => (
                      <li key={member.user_id} className="px-4 py-4 flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                            {member.username.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{member.username}</p>
                          {member.user_id === user?.id && (
                            <p className="text-xs text-gray-500">You</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Project Ideas */}
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg leading-6 font-medium text-gray-900">Project Ideas</h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">{ideas.length} idea(s)</p>
                  </div>
                  {isTeamMember && (
                    <button
                      onClick={() => setShowNewIdeaModal(true)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Idea
                    </button>
                  )}
                </div>
                <div className="border-t border-gray-200">
                  {ideas.length === 0 ? (
                    <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                      <p>No ideas yet.</p>
                      {isTeamMember && (
                        <button
                          onClick={() => setShowNewIdeaModal(true)}
                          className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Share an Idea
                        </button>
                      )}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {ideas.map((idea) => (
                        <li key={idea.id} className="px-4 py-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900">{idea.summary}</h3>
                            <button
                              onClick={() => navigate(`/ideas/${idea.id}`)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              View Details
                            </button>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {idea.tech.map((tech, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Team not found</h3>
          </div>
        )}
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Invite User to Team</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Enter the username of the person you want to invite.</p>

                    {inviteError && (
                      <div className="mt-2 text-sm text-red-600">
                        {inviteError}
                      </div>
                    )}

                    <div className="mt-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={inviteUsername}
                        onChange={(e) => setInviteUsername(e.target.value)}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleInviteUser}
                disabled={isInviting}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${isInviting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isInviting ? 'Sending...' : 'Send Invitation'}
              </button>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Idea Modal */}
      {showNewIdeaModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Share a New Idea</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Share your project idea with your team.</p>

                    {ideaError && (
                      <div className="mt-2 text-sm text-red-600">
                        {ideaError}
                      </div>
                    )}

                    <div className="mt-4">
                      <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                        Summary
                      </label>
                      <textarea
                        id="summary"
                        name="summary"
                        rows={3}
                        value={newIdeaSummary}
                        onChange={(e) => setNewIdeaSummary(e.target.value)}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe your idea..."
                      />
                    </div>

                    <div className="mt-4">
                      <label htmlFor="tech" className="block text-sm font-medium text-gray-700">
                        Technologies
                      </label>
                      <div className="mt-1 flex">
                        <input
                          type="text"
                          id="tech"
                          name="tech"
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTech()}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., React, Node.js"
                        />
                        <button
                          type="button"
                          onClick={handleAddTech}
                          className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Add
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {newIdeaTech.map((tech, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(tech)}
                              className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white"
                            >
                              <span className="sr-only">Remove {tech}</span>
                              <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={handleSubmitIdea}
                disabled={isSubmittingIdea}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmittingIdea ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmittingIdea ? 'Submitting...' : 'Submit Idea'}
              </button>
              <button
                type="button"
                onClick={() => setShowNewIdeaModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TeamDetailPage;
