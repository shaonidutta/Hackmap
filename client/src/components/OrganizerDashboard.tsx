import React from 'react';

interface Hackathon {
  id: number;
  title: string;
  theme?: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  prizes?: string;
  team_size_limit: number;
  organizer_id?: number;
  organiser_id?: number;
  registered: boolean;
  tags?: string[];
  isCurrentUserOrganizer?: boolean;
}

interface OrganizerDashboardProps {
  hackathon: Hackathon;
}

const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ hackathon }) => {

  return (
    <div className="mt-4">
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 mb-4 rounded-r-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-indigo-800">
              You are the organizer of this hackathon
            </p>
          </div>
        </div>
      </div>

      <h4 className="text-md font-medium text-gray-900 mb-3">Manage Your Hackathon</h4>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => window.location.href = `/hackathons/${hackathon.id}/edit`}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit Details
        </button>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
