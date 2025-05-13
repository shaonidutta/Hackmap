import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';

import api from '../../api/axios';
import { HACKATHON_ENDPOINTS, NOTIFICATION_ENDPOINTS } from '../../api/urls';
import DashboardLayout from './Layout';
import Loader from '../../components/common/Loader';

interface Team {
  team_id: number;
  hackathon_id: number;
  name: string;
  description: string;
  join_code: string;
}

interface Notification {
  id: number;
  type: 'TEAM_INVITE' | 'JOIN_REQUEST';
  team_id: number;
  team_name: string;
  sender_id: number;
  sender_username: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  created_at: string;
}

interface TeamDetailModalProps {
  onClose: () => void;
  onCreateTeam: (hackathonId: number, name: string, description: string) => Promise<void>;
}

interface Hackathon {
  id: number;
  title: string;
  theme: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  prizes: string;
  team_size_limit: number;
  organizer_id?: number;  // Optional since it might be missing
  organiser_id?: number;  // British spelling variant
  is_organizer?: boolean | number; // Might be 0/1 instead of false/true
  registered: boolean | number; // Might be 0/1 instead of false/true
  tags?: string[];
}

const TeamDetailModal = ({ onClose, onCreateTeam }: TeamDetailModalProps) => {
  const [availableHackathons, setAvailableHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState<number | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegisteredHackathons = async () => {
      try {
        setIsLoading(true);
        // Fetch all hackathons and filter on client side
        const response = await api.get('/hackathons');

        console.log('All hackathons:', response.data);

        // Filter hackathons where registered is true (1)
        // In the API response, registered might be 0/1 instead of false/true
        const registeredHackathons = response.data.filter(
          (hackathon: any) => hackathon.registered === true || hackathon.registered === 1
        );

        console.log('Filtered registered hackathons:', registeredHackathons);

        setAvailableHackathons(registeredHackathons);

        if (registeredHackathons.length > 0) {
          setSelectedHackathonId(registeredHackathons[0].id);
        }
      } catch (err: any) {
        console.error('Error fetching hackathons:', err);
        setError('Failed to load hackathons. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredHackathons();
  }, []);

  const handleSubmit = async () => {
    if (!selectedHackathonId) {
      setError('Please select a hackathon');
      return;
    }

    if (!teamName.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onCreateTeam(selectedHackathonId, teamName, teamDescription);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Create a New Team</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Create a team for a hackathon you're registered for.</p>

                {error && (
                  <div className="mt-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : availableHackathons.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">You're not registered for any hackathons yet.</p>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        navigate('/hackathons');
                      }}
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse Hackathons
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="hackathon" className="block text-sm font-medium text-gray-700">
                        Hackathon
                      </label>
                      <select
                        id="hackathon"
                        name="hackathon"
                        value={selectedHackathonId || ''}
                        onChange={(e) => setSelectedHackathonId(Number(e.target.value))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        {availableHackathons.map((hackathon) => (
                          <option key={hackathon.id} value={hackathon.id}>
                            {hackathon.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">
                        Team Name
                      </label>
                      <input
                        type="text"
                        name="teamName"
                        id="teamName"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter team name"
                      />
                    </div>

                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description (Optional)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        placeholder="Describe your team's focus or goals"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          {availableHackathons.length > 0 && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useToastContext();
  const [teams, setTeams] = useState<Team[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [processingNotificationId, setProcessingNotificationId] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch user's teams
        const teamsResponse = await api.get('/users/me/teams');
        setTeams(teamsResponse.data);

        // Fetch user's notifications
        const notificationsResponse = await api.get('/notifications');
        setNotifications(notificationsResponse.data);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleNotificationResponse = async (notificationId: number, action: 'ACCEPT' | 'DECLINE') => {
    try {
      setProcessingNotificationId(notificationId);

      // Get notification details for better messaging
      const notification = notifications.find(n => n.id === notificationId);
      const isTeamInvite = notification?.type === 'TEAM_INVITE';
      const teamName = notification?.team_name || 'team';

      // Call API to respond to notification
      await api.post(NOTIFICATION_ENDPOINTS.RESPOND(notificationId), { action });

      // Update notifications list
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, status: action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED' }
          : notification
      ));

      // If accepted a team invite, refresh teams and show success message
      if (action === 'ACCEPT') {
        const teamsResponse = await api.get('/users/me/teams');
        setTeams(teamsResponse.data);

        if (isTeamInvite) {
          showSuccessToast(`You've joined ${teamName} and been registered for the hackathon!`);
        } else {
          showSuccessToast(`Request accepted successfully!`);
        }
      } else {
        showSuccessToast(`Declined successfully!`);
      }
    } catch (err: any) {
      console.error('Error responding to notification:', err);
      showErrorToast(err.response?.data?.message || 'Failed to respond to notification. Please try again.');
    } finally {
      setProcessingNotificationId(null);
    }
  };

  const handleCreateTeam = async (hackathonId: number, name: string, description: string) => {
    try {
      const response = await api.post(HACKATHON_ENDPOINTS.CREATE_TEAM(hackathonId), {
        name,
        description
      });

      // Add the new team to the teams list
      setTeams([...teams, {
        team_id: response.data.id,
        hackathon_id: response.data.hackathon_id,
        name: response.data.name,
        description: response.data.description,
        join_code: response.data.join_code
      }]);

      // Navigate to the team detail page
      navigate(`/teams/${response.data.id}`);
    } catch (err: any) {
      console.error('Error creating team:', err);
      throw err;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.username}!</p>
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
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Notifications Section */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg leading-6 font-medium text-gray-900">Notifications</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Your recent notifications and invites.</p>
                </div>
                {notifications.filter(n => n.status === 'PENDING').length > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {notifications.filter(n => n.status === 'PENDING').length} pending
                  </span>
                )}
              </div>
              <div className="border-t border-gray-200">
                {notifications.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    No notifications yet.
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <li key={notification.id} className="px-4 py-4">
                        <div className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {notification.type === 'TEAM_INVITE'
                                ? `${notification.sender_username} invited you to join ${notification.team_name}`
                                : `${notification.sender_username} requested to join ${notification.team_name}`}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          {notification.status === 'PENDING' ? (
                            <div className="flex space-x-2">
                              {processingNotificationId === notification.id ? (
                                <div className="flex items-center">
                                  <Loader size="small" color="blue" />
                                </div>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleNotificationResponse(notification.id, 'ACCEPT')}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleNotificationResponse(notification.id, 'DECLINE')}
                                    className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    Decline
                                  </button>
                                </>
                              )}
                            </div>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              notification.status === 'ACCEPTED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {notification.status}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* My Teams Section */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg leading-6 font-medium text-gray-900">My Teams</h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Teams you're a member of.</p>
                </div>
                <button
                  onClick={() => setShowCreateTeamModal(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Team
                </button>
              </div>
              <div className="border-t border-gray-200">
                {teams.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    <p>You're not a member of any teams yet.</p>
                    <Link
                      to="/hackathons"
                      className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse Hackathons
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {teams.map((team) => (
                      <li key={team.team_id} className="px-4 py-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{team.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{team.description || 'No description'}</p>
                        </div>
                        <Link
                          to={`/teams/${team.team_id}`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Team
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Detail Modal */}
      {showCreateTeamModal && (
        <TeamDetailModal
          onClose={() => setShowCreateTeamModal(false)}
          onCreateTeam={handleCreateTeam}
        />
      )}
    </DashboardLayout>
  );
};

export default DashboardPage;
