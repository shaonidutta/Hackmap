"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../Dashboard/Layout"
import api from "../../api/axios"
import { HACKATHON_ENDPOINTS } from "../../api/urls"
import OrganizerDashboard from "../../components/OrganizerDashboard"
import OrganizeHackathonModal from "../../components/OrganizeHackathonModal"
import { useAuthContext } from "../../context/AuthContext"

// Add this after the imports
// Custom CSS for animations
const fadeInAnimation = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
`

interface Hackathon {
  id: number
  title: string
  theme: string
  start_date: string
  end_date: string
  registration_deadline: string
  prizes: string
  team_size_limit: number
  organizer_id?: number // Using American spelling
  organiser_id?: number // Using British spelling
  registered: boolean
  tags: string[]
  isCurrentUserOrganizer?: boolean // Flag to indicate if current user is the organizer
}

interface HackathonDetailModalProps {
  hackathon: Hackathon
  onClose: () => void
  onRegister: (hackathonId: number, skills: string[]) => Promise<void>
}

const HackathonDetailModal = ({ hackathon, onClose, onRegister }: HackathonDetailModalProps) => {
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSubmit = async () => {
    if (skills.length === 0) {
      setError("Please add at least one skill")
      return
    }

    try {
      setIsLoading(true)
      setError("")
      await onRegister(hackathon.id, skills)
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register for hackathon")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm transition-opacity duration-300">
      <div
        className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-full max-w-lg mx-auto my-8 animate-fadeIn"
        style={{ animation: "fadeIn 0.3s ease-out" }}
      >
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="flex flex-col">
            <div className="w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900 border-b pb-2">{hackathon.title}</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">{hackathon.theme}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {hackathon.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-all duration-200 hover:bg-blue-200 hover:scale-105"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <p className="text-gray-500">Start Date</p>
                    <p className="font-medium">{new Date(hackathon.start_date).toLocaleDateString()}</p>
                  </div>
                  <div className="p-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <p className="text-gray-500">End Date</p>
                    <p className="font-medium">{new Date(hackathon.end_date).toLocaleDateString()}</p>
                  </div>
                  <div className="p-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <p className="text-gray-500">Registration Deadline</p>
                    <p className="font-medium">{new Date(hackathon.registration_deadline).toLocaleDateString()}</p>
                  </div>
                  <div className="p-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
                    <p className="text-gray-500">Team Size Limit</p>
                    <p className="font-medium">{hackathon.team_size_limit} members</p>
                  </div>
                </div>
                <div className="mt-4 p-2 rounded-md hover:bg-gray-50 transition-colors duration-200">
                  <p className="text-gray-500">Prizes</p>
                  <p className="font-medium">{hackathon.prizes}</p>
                </div>

                {hackathon.isCurrentUserOrganizer ? (
                  <OrganizerDashboard hackathon={hackathon} />
                ) : (
                  !hackathon.registered && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900">Register with your skills</h4>
                      <p className="text-xs text-gray-500 mt-1">Add skills that you can contribute to a team</p>

                      {error && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md animate-pulse">{error}</div>
                      )}

                      <div className="mt-2 flex">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md transition-all duration-200"
                          placeholder="e.g., JavaScript, UI Design"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md"
                        >
                          Add
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 transition-all duration-200 hover:bg-blue-200"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="flex-shrink-0 ml-1.5 h-5 w-5 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-500 focus:outline-none focus:bg-blue-500 focus:text-white transition-colors duration-200"
                            >
                              <span className="sr-only">Remove {skill}</span>
                              <svg className="h-3 w-3" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-col sm:flex-row-reverse gap-2">
          {hackathon.isCurrentUserOrganizer ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all duration-200 hover:shadow-md transform hover:translate-y-[-1px]"
            >
              Close
            </button>
          ) : hackathon.registered ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all duration-200 hover:shadow-md transform hover:translate-y-[-1px]"
            >
              Already Registered
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all duration-200 hover:shadow-md transform hover:translate-y-[-1px] ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registering...
                </span>
              ) : (
                "Register"
              )}
            </button>
          )}
          {!hackathon.isCurrentUserOrganizer && (
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm transition-all duration-200 hover:shadow-md transform hover:translate-y-[-1px]"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const HackathonsPage = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [filteredHackathons, setFilteredHackathons] = useState<Hackathon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null)
  const [filter, setFilter] = useState<"all" | "registered" | "available" | "organized">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showOrganizeModal, setShowOrganizeModal] = useState(false)

  // Get user ID directly from auth context
  const { userId } = useAuthContext()

  // Count hackathons by category
  const registeredCount = hackathons.filter((h) => Boolean(h.registered) === true).length

  // For available, filter hackathons that user is not registered for and is not organizing
  const availableCount = hackathons.filter((h) => Boolean(h.registered) === false && !h.isCurrentUserOrganizer).length

  // For organized, use the isCurrentUserOrganizer flag we computed
  const organizedCount = hackathons.filter((h) => h.isCurrentUserOrganizer).length

  const navigate = useNavigate()

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        setIsLoading(true)
        setError("")
        const response = await api.get(HACKATHON_ENDPOINTS.GET_ALL)

        // Debug the response data
        console.log("Hackathons API response:", response.data)

        // Process the data to ensure consistent property types and names
        const processedData = response.data.map((hackathon: any) => {
          // Create a new object with processed properties
          const processedHackathon = {
            ...hackathon,
            registered: Boolean(hackathon.registered),
            // Use organizer_id if available, otherwise use organiser_id
            organizer_id: hackathon.organizer_id || hackathon.organiser_id,
          }

          // Check if the current user is the organizer
          if (processedHackathon.organizer_id) {
            processedHackathon.isCurrentUserOrganizer = Number(processedHackathon.organizer_id) === Number(userId)
          } else if (hackathon.is_organizer !== undefined) {
            // If is_organizer flag is available, use it
            processedHackathon.isCurrentUserOrganizer = Boolean(hackathon.is_organizer)
          } else {
            // Default to false if we can't determine
            processedHackathon.isCurrentUserOrganizer = false
          }

          return processedHackathon
        })

        console.log("Processed hackathons data:", processedData)

        setHackathons(processedData)
        setFilteredHackathons(processedData)
      } catch (err: any) {
        console.error("Error fetching hackathons:", err)
        setError("Failed to load hackathons. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHackathons()
  }, [])

  useEffect(() => {
    // Apply filters
    let result = hackathons

    console.log("Applying filter:", filter)
    console.log("Current hackathons:", hackathons)

    // Filter by status
    if (filter === "registered") {
      // Show only hackathons the user has registered for
      result = result.filter((hackathon) => Boolean(hackathon.registered) === true)
      console.log("After registered filter:", result)
    } else if (filter === "available") {
      // Show only hackathons the user has not registered for AND is not organizing
      result = result.filter(
        (hackathon) => Boolean(hackathon.registered) === false && !hackathon.isCurrentUserOrganizer,
      )
      console.log("After available filter:", result)
    } else if (filter === "organized") {
      // Show only hackathons the user is organizing
      result = result.filter((hackathon) => hackathon.isCurrentUserOrganizer)
      console.log("After organized filter:", result)
    }
    // 'all' filter shows everything, so no filtering needed

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (hackathon) =>
          hackathon.title.toLowerCase().includes(term) ||
          hackathon.theme.toLowerCase().includes(term) ||
          hackathon.tags.some((tag) => tag.toLowerCase().includes(term)),
      )
    }

    setFilteredHackathons(result)
  }, [hackathons, filter, searchTerm, userId])

  const handleRegister = async (hackathonId: number, skills: string[]) => {
    try {
      await api.post(HACKATHON_ENDPOINTS.REGISTER(hackathonId), { skills })

      // Update hackathons list
      setHackathons(
        hackathons.map((hackathon) => (hackathon.id === hackathonId ? { ...hackathon, registered: true } : hackathon)),
      )

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (err) {
      console.error("Error registering for hackathon:", err)
      throw err
    }
  }

  const handleCreateHackathon = (newHackathon: Hackathon) => {
    // Process the new hackathon to match our data structure
    const processedHackathon = {
      ...newHackathon,
      registered: false,
      isCurrentUserOrganizer: true,
    }

    // Add the new hackathon to the list
    setHackathons([processedHackathon, ...hackathons])

    // Close the modal
    setShowOrganizeModal(false)

    // Show the new hackathon details
    setSelectedHackathon(processedHackathon)
  }

  return (
    <DashboardLayout>
      <style>{fadeInAnimation}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Hackathons</h1>
            <p className="mt-1 text-sm text-gray-500">Browse and register for upcoming hackathons.</p>
          </div>
          <button
            onClick={() => setShowOrganizeModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 hover:shadow-md transform hover:translate-y-[-2px]"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Organize a Hackathon
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col space-y-4">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow hover:translate-y-[-1px]"
              }`}
            >
              All Hackathons ({hackathons.length})
            </button>
            <button
              onClick={() => setFilter("registered")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                filter === "registered"
                  ? "bg-green-600 text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow hover:translate-y-[-1px]"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Registered ({registeredCount})
            </button>
            <button
              onClick={() => setFilter("available")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                filter === "available"
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow hover:translate-y-[-1px]"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Available ({availableCount})
            </button>
            <button
              onClick={() => setFilter("organized")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center ${
                filter === "organized"
                  ? "bg-purple-600 text-white shadow-md transform scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow hover:translate-y-[-1px]"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Organized ({organizedCount})
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full max-w-md group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, theme, or tags..."
              className="pl-11 pr-10 py-3 bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full rounded-lg shadow-md text-sm transition-all duration-200 hover:shadow-lg focus:shadow-lg bg-opacity-95 backdrop-filter backdrop-blur-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
              >
                <svg
                  className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
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
        ) : filteredHackathons.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hackathons found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? "Try a different search term."
                : filter === "registered"
                  ? "You have not registered for any hackathons yet."
                  : filter === "available"
                    ? "No available hackathons found. Check back later."
                    : filter === "organized"
                      ? "You are not organizing any hackathons yet."
                      : "No hackathons found. Check back later."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredHackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="bg-white overflow-hidden shadow-md hover:shadow-xl rounded-lg cursor-pointer transition-all duration-300 hover:translate-y-[-4px] border border-transparent hover:border-blue-100"
                onClick={() => setSelectedHackathon(hackathon)}
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 truncate">{hackathon.title}</h3>
                    <div className="flex flex-wrap gap-1">
                      {hackathon.isCurrentUserOrganizer && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 transition-colors duration-200 hover:bg-purple-200">
                          Organizer
                        </span>
                      )}
                      {hackathon.registered && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 transition-colors duration-200 hover:bg-green-200">
                          Registered
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{hackathon.theme}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hackathon.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 transition-all duration-200 hover:bg-blue-200 hover:scale-105"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="p-1 rounded hover:bg-gray-50 transition-colors duration-200">
                      <p className="text-gray-500">Start Date</p>
                      <p className="font-medium">{new Date(hackathon.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="p-1 rounded hover:bg-gray-50 transition-colors duration-200">
                      <p className="text-gray-500">End Date</p>
                      <p className="font-medium">{new Date(hackathon.end_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6 transition-colors duration-200 group-hover:bg-gray-100">
                  <div className="text-sm flex justify-between items-center">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:translate-y-[-1px] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedHackathon(hackathon)
                      }}
                    >
                      Details
                    </button>
                    <div className="text-xs text-gray-700 font-medium">
                      {new Date(hackathon.registration_deadline) > new Date() ? (
                        <span>Registration ends:<br/>{new Date(hackathon.registration_deadline).toLocaleDateString()}</span>
                      ) : (
                        <span className="text-red-600 font-medium">Registration closed</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedHackathon && (
        <HackathonDetailModal
          hackathon={selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
          onRegister={handleRegister}
        />
      )}

      {showOrganizeModal && (
        <OrganizeHackathonModal onClose={() => setShowOrganizeModal(false)} onSuccess={handleCreateHackathon} />
      )}
    </DashboardLayout>
  )
}

export default HackathonsPage
