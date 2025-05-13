import { useState, useEffect, FormEvent } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../Dashboard/Layout';
import api from '../../api/axios';
import { IDEA_ENDPOINTS } from '../../api/urls';
import { useAuthContext } from '../../context/AuthContext';

interface Comment {
  id: number;
  user_id: number;
  username: string;
  content: string;
  created_at: string;
}

interface Idea {
  id: number;
  team_id: number;
  summary: string;
  tech: string[];
  comments: Comment[];
  endorsement_count: number;
}

const IdeaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthContext();

  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  const [hasEndorsed, setHasEndorsed] = useState(false);
  const [isEndorsing, setIsEndorsing] = useState(false);

  useEffect(() => {
    const fetchIdeaData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch idea details
        const response = await api.get(IDEA_ENDPOINTS.GET_BY_ID(Number(id)));
        setIdea(response.data);

        // Check if the current user has already endorsed this idea
        // We'll need to modify the server to include this information in the future
        // For now, we'll assume the user hasn't endorsed if we can't check
        try {
          // Check if the idea has endorsements and if the current user is one of them
          // This would require a server-side change to include user_has_endorsed in the response
          if (response.data.user_has_endorsed !== undefined) {
            setHasEndorsed(response.data.user_has_endorsed);
          }
        } catch (endorsementErr) {
          console.error('Error checking endorsement status:', endorsementErr);
          // Default to not endorsed if we can't check
          setHasEndorsed(false);
        }
      } catch (err: any) {
        console.error('Error fetching idea data:', err);
        setError('Failed to load idea data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchIdeaData();
    }
  }, [id]);

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setCommentError('Please enter a comment');
      return;
    }

    try {
      setIsSubmittingComment(true);
      setCommentError('');

      const response = await api.post(IDEA_ENDPOINTS.ADD_COMMENT(Number(id)), {
        content: newComment
      });

      // Add new comment to the list
      setIdea(prevIdea => {
        if (!prevIdea) return null;

        return {
          ...prevIdea,
          comments: [
            {
              id: response.data.id,
              user_id: user?.id || 0,
              username: user?.username || '',
              content: newComment,
              created_at: new Date().toISOString()
            },
            ...prevIdea.comments
          ]
        };
      });

      // Clear comment input
      setNewComment('');
    } catch (err: any) {
      console.error('Error submitting comment:', err);
      setCommentError(err.response?.data?.message || 'Failed to submit comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleEndorse = async () => {
    if (hasEndorsed) return;

    try {
      setIsEndorsing(true);

      const response = await api.post(IDEA_ENDPOINTS.ENDORSE(Number(id)));

      // Update endorsement count
      setIdea(prevIdea => {
        if (!prevIdea) return null;

        return {
          ...prevIdea,
          endorsement_count: response.data.endorsement_count
        };
      });

      setHasEndorsed(true);
    } catch (err: any) {
      console.error('Error endorsing idea:', err);
      alert('Failed to endorse idea. Please try again.');
    } finally {
      setIsEndorsing(false);
    }
  };

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
        ) : idea ? (
          <div className="py-6">
            {/* Back to Team button at top left */}
            <div className="mb-6">
              <Link
                to={`/teams/${idea.team_id}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Team
              </Link>
            </div>

            {/* Idea summary card with white background and shadow */}
            <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100 mb-6">
              <div className="px-6 py-5">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">{idea.summary}</h1>
                <div className="flex flex-wrap gap-1.5">
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

              {/* Endorsement section */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-yellow-50 rounded-full p-1.5">
                    <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="ml-1.5 text-sm font-medium text-gray-700">{idea.endorsement_count}</span>
                </div>
                <button
                  onClick={handleEndorse}
                  disabled={hasEndorsed || isEndorsing}
                  className={`inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    hasEndorsed
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  } ${isEndorsing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isEndorsing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : hasEndorsed ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      Endorsed
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                      Endorse Idea
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* Comments Section */}
              <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-100">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
                  <p className="mt-1 text-sm text-gray-500">{idea.comments.length} comment(s)</p>
                </div>

                {/* Comments List */}
                <div>
                  {idea.comments.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                      <div className="mx-auto w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-sm">No comments yet. Be the first to comment!</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {idea.comments.map((comment) => (
                        <li key={comment.id} className="px-6 py-4">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium shadow-sm">
                                {comment.username.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900">{comment.username}</h3>
                                <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</p>
                              </div>
                              <p className="text-sm text-gray-600">{comment.content}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Add Comment Form */}
                <div className="border-t border-gray-100 px-6 py-5 bg-gray-50">
                  <form onSubmit={handleSubmitComment}>
                    <div>
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Add a comment</label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows={3}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                      ></textarea>
                    </div>

                    {commentError && (
                      <div className="mt-2 text-sm text-red-600">
                        {commentError}
                      </div>
                    )}

                    <div className="mt-3 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmittingComment}
                        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmittingComment ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {isSubmittingComment ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Posting...
                          </>
                        ) : (
                          'Post Comment'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Idea not found</h3>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IdeaDetailPage;
