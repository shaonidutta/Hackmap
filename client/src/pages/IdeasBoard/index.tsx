import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../Dashboard/Layout';
import api from '../../api/axios';
import { IDEA_ENDPOINTS, TEAM_ENDPOINTS } from '../../api/urls';
import { useToastContext } from '../../context/ToastContext';


interface Team {
  team_id: number;
  name: string;
}

interface Idea {
  id: number;
  team_id: number;
  team_name: string;
  summary: string;
  tech: string[];
  created_at: string;
  endorsement_count: number;
  user_has_endorsed: boolean;
}

interface CreateIdeaModalProps {
  onClose: () => void;
  onCreateIdea: (teamId: number, summary: string, tech: string[]) => Promise<void>;
  teams: Team[];
}

const CreateIdeaModal = ({ onClose, onCreateIdea, teams }: CreateIdeaModalProps) => {
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [summary, setSummary] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techTags, setTechTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  // Common tech suggestions
  const techSuggestions = [
    'React', 'Angular', 'Vue', 'Node.js', 'Express',
    'MongoDB', 'PostgreSQL', 'TypeScript', 'JavaScript',
    'Python', 'Django', 'Flask', 'Java', 'Spring Boot',
    'AWS', 'Docker', 'Kubernetes', 'GraphQL', 'REST API'
  ];

  useEffect(() => {
    if (teams.length > 0) {
      setSelectedTeamId(teams[0].team_id);
    }

    // Add escape key listener to close modal
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [teams, onClose]);

  const handleAddTech = () => {
    if (techInput.trim() && !techTags.includes(techInput.trim())) {
      setTechTags([...techTags, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleAddTechSuggestion = (tech: string) => {
    if (!techTags.includes(tech)) {
      setTechTags([...techTags, tech]);
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setTechTags(techTags.filter(tech => tech !== techToRemove));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedTeamId) {
        setError('Please select a team');
        return;
      }
      if (!summary.trim()) {
        setError('Summary is required');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!selectedTeamId) {
      setError('Please select a team');
      setStep(1);
      return;
    }

    if (!summary.trim()) {
      setError('Summary is required');
      setStep(1);
      return;
    }

    if (techTags.length === 0) {
      setError('At least one technology is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onCreateIdea(selectedTeamId, summary, techTags);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create idea');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Share a New Idea</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 flex items-center">
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step === 1 ? 'bg-white text-blue-600' : 'bg-blue-200 text-blue-800'} font-bold text-sm`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step === 2 ? 'bg-white' : 'bg-blue-200'}`}></div>
            <div className={`flex items-center justify-center h-8 w-8 rounded-full ${step === 2 ? 'bg-white text-blue-600' : 'bg-blue-200 text-blue-800'} font-bold text-sm`}>
              2
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {teams.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">You're not a member of any teams</h3>
              <p className="text-gray-500 mb-6">Join a team first to share project ideas.</p>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">
                      Select Team <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="team"
                      name="team"
                      value={selectedTeamId || ''}
                      onChange={(e) => setSelectedTeamId(Number(e.target.value))}
                      className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                    >
                      {teams.map((team) => (
                        <option key={team.team_id} value={team.team_id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
                      Idea Summary <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="summary"
                      id="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Enter a brief summary of your idea"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Provide a clear, concise summary of your project idea (max 100 characters)
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Technologies */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="tech" className="block text-sm font-medium text-gray-700 mb-1">
                      Technologies <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        id="tech"
                        name="tech"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTech();
                          }
                        }}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Add a technology"
                      />
                      <button
                        type="button"
                        onClick={handleAddTech}
                        className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-700 rounded-r-md hover:bg-gray-100"
                      >
                        Add
                      </button>
                    </div>

                    {/* Tech tags */}
                    {techTags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {techTags.map((tech, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tech}
                            <button
                              type="button"
                              onClick={() => handleRemoveTech(tech)}
                              className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                            >
                              <span className="sr-only">Remove {tech}</span>
                              <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tech suggestions */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Popular technologies:</p>
                      <div className="flex flex-wrap gap-2">
                        {techSuggestions.filter(tech => !techTags.includes(tech)).slice(0, 10).map((tech, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddTechSuggestion(tech)}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                          >
                            + {tech}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {teams.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            {step === 1 ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
            )}

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sharing...
                  </>
                ) : 'Share Idea'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const IdeasBoardPage = () => {
  const { showToast } = useToastContext();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateIdeaModal, setShowCreateIdeaModal] = useState(false);

  useEffect(() => {
    const fetchIdeasData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch all ideas
        const ideasResponse = await api.get(IDEA_ENDPOINTS.GET_ALL);
        setIdeas(ideasResponse.data);

        // Fetch user's teams for the create idea modal
        const teamsResponse = await api.get('/users/me/teams');
        setTeams(teamsResponse.data);
      } catch (err: any) {
        console.error('Error fetching ideas data:', err);
        setError('Failed to load ideas data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIdeasData();
  }, []);

  const handleEndorseIdea = async (ideaId: number) => {
    try {
      const response = await api.post(IDEA_ENDPOINTS.ENDORSE(ideaId));

      // Update the ideas list with the new endorsement count
      setIdeas(ideas.map(idea =>
        idea.id === ideaId
          ? {
            ...idea,
            endorsement_count: response.data.endorsement_count,
            user_has_endorsed: true
          }
          : idea
      ));

      // Show success toast
      showToast('Idea endorsed successfully!', 'success');
    } catch (err: any) {
      console.error('Error endorsing idea:', err);
      showToast(err.response?.data?.message || 'Failed to endorse idea. Please try again.', 'error');
    }
  };

  const handleCreateIdea = async (teamId: number, summary: string, tech: string[]) => {
    try {
      const response = await api.post(TEAM_ENDPOINTS.CREATE_IDEA(teamId), {
        summary,
        tech
      });

      // Find the team name
      const team = teams.find(t => t.team_id === teamId);

      // Add the new idea to the ideas list
      const newIdea: Idea = {
        id: response.data.id,
        team_id: response.data.team_id,
        team_name: team?.name || 'Unknown Team',
        summary: response.data.summary,
        tech: response.data.tech,
        created_at: new Date().toISOString(),
        endorsement_count: 0,
        user_has_endorsed: false
      };

      setIdeas([newIdea, ...ideas]);

      // Reset filters to show the new idea
      setSearchTerm('');
      setSelectedTech([]);

      // Show success toast
      showToast('Your idea has been shared successfully!', 'success');
    } catch (err: any) {
      console.error('Error creating idea:', err);
      showToast(err.response?.data?.message || 'Failed to share idea', 'error');
      throw err;
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');

  // Get all unique tech tags from ideas
  const allTechTags = ideas.reduce((tags: string[], idea) => {
    idea.tech.forEach(tech => {
      if (!tags.includes(tech)) {
        tags.push(tech);
      }
    });
    return tags;
  }, []);

  // Filter and sort ideas
  const filteredIdeas = ideas.filter(idea => {
    // Search term filter
    const matchesSearch = searchTerm === '' ||
      idea.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.team_name.toLowerCase().includes(searchTerm.toLowerCase());

    // Tech filter
    const matchesTech = selectedTech.length === 0 ||
      selectedTech.some(tech => idea.tech.includes(tech));

    return matchesSearch && matchesTech;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return b.endorsement_count - a.endorsement_count;
    }
  });

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          {/* Header with gradient background */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg mb-8 p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold">Project Ideas Board</h1>
                <p className="mt-2 text-blue-100">Explore and endorse innovative project ideas from all teams.</p>
              </div>
              <button
                onClick={() => setShowCreateIdeaModal(true)}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md bg-white text-blue-700 hover:bg-blue-50 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Share New Idea
              </button>
            </div>
          </div>

          {/* Search and filter section */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search input */}
              <div className="flex-grow">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search ideas by title or team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Tech filter dropdown */}
              <div className="w-full md:w-64">
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !selectedTech.includes(e.target.value)) {
                        setSelectedTech([...selectedTech, e.target.value]);
                      }
                    }}
                  >
                    <option value="">Filter by technology</option>
                    {allTechTags.map(tech => (
                      <option key={tech} value={tech}>{tech}</option>
                    ))}
                  </select>
                </div>
                {selectedTech.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTech.map(tech => (
                      <span
                        key={tech}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => setSelectedTech(selectedTech.filter(t => t !== tech))}
                          className="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none"
                        >
                          <span className="sr-only">Remove {tech}</span>
                          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    {selectedTech.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setSelectedTech([])}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Sort options */}
              <div className="w-full md:w-48">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular')}
                >
                  <option value="newest">Sort by: Newest</option>
                  <option value="popular">Sort by: Most Popular</option>
                </select>
              </div>
            </div>
          </div>

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
          ) : filteredIdeas.length === 0 && ideas.length === 0 ? (
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
              <div className="px-6 py-10 text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No project ideas yet</h3>
                <p className="text-gray-500 mb-6">Be the first to share an innovative idea with the community!</p>
                <button
                  onClick={() => setShowCreateIdeaModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Share the First Idea
                </button>
              </div>
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matching ideas found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTech([]);
                }}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">Showing {filteredIdeas.length} of {ideas.length} ideas</p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="bg-white overflow-hidden shadow-md hover:shadow-lg rounded-xl border border-gray-100 transition-all duration-200 hover:translate-y-[-4px] flex flex-col h-full"
                  >
                    {/* Card header with team name */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {idea.team_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(idea.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Card content */}
                    <div className="px-4 py-5 sm:p-6 flex flex-col flex-grow">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{idea.summary}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {idea.tech.map((tech, index) => {
                            // Determine color based on tech category
                            let bgColor = 'bg-gray-100';
                            let textColor = 'text-gray-800';

                            if (['React', 'Vue', 'Angular', 'Svelte'].includes(tech)) {
                              bgColor = 'bg-blue-100';
                              textColor = 'text-blue-800';
                            } else if (['Node.js', 'Express', 'Django', 'Flask'].includes(tech)) {
                              bgColor = 'bg-green-100';
                              textColor = 'text-green-800';
                            } else if (['Python', 'JavaScript', 'TypeScript', 'Java'].includes(tech)) {
                              bgColor = 'bg-purple-100';
                              textColor = 'text-purple-800';
                            } else if (['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase'].includes(tech)) {
                              bgColor = 'bg-yellow-100';
                              textColor = 'text-yellow-800';
                            } else if (['AWS', 'Azure', 'GCP', 'Heroku'].includes(tech)) {
                              bgColor = 'bg-indigo-100';
                              textColor = 'text-indigo-800';
                            }

                            return (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
                              >
                                {tech}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Spacer to push footer to bottom */}
                      <div className="flex-grow"></div>

                      {/* Card footer with actions */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="bg-yellow-50 rounded-full p-1.5">
                            <svg className="h-4 w-4 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                          <span className="ml-1.5 text-sm font-medium text-gray-700">{idea.endorsement_count}</span>
                        </div>
                        <div className="flex space-x-2">
                          {!idea.user_has_endorsed ? (
                            <button
                              onClick={() => handleEndorseIdea(idea.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              Endorse
                            </button>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-50">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              Endorsed
                            </span>
                          )}
                          <Link
                            to={`/ideas/${idea.id}`}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add animation styles */}
        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

        {/* Create Idea Modal */}
        {showCreateIdeaModal && (
          <CreateIdeaModal
            onClose={() => setShowCreateIdeaModal(false)}
            onCreateIdea={handleCreateIdea}
            teams={teams}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default IdeasBoardPage;
