"use client"

import { useState, useEffect } from "react"

const StandingsView = () => {
  const [driverStandings, setDriverStandings] = useState([])
  const [constructorStandings, setConstructorStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("drivers")

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const [driversRes, constructorsRes] = await Promise.all([
          fetch("http://localhost:5000/api/standings/drivers"),
          fetch("http://localhost:5000/api/standings/constructors"),
        ])

        const drivers = await driversRes.json()
        const constructors = await constructorsRes.json()

        setDriverStandings(drivers)
        setConstructorStandings(constructors)
      } catch (error) {
        console.error("Error fetching standings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-6 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1">
          <button
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === "drivers" ? "bg-f1-red text-white" : "text-f1-gray hover:text-white"
            }`}
            onClick={() => setActiveTab("drivers")}
          >
            Drivers Championship
          </button>
          <button
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === "constructors" ? "bg-f1-red text-white" : "text-f1-gray hover:text-white"
            }`}
            onClick={() => setActiveTab("constructors")}
          >
            Constructors Championship
          </button>
        </div>
      </div>

      {activeTab === "drivers" && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-f1-red p-4">
            <h2 className="text-xl font-bold">Drivers Championship</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {driverStandings.map((standing, index) => (
              <div key={standing.standing_id} className="p-4 hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-500 text-yellow-900"
                          : index === 1
                            ? "bg-gray-400 text-gray-900"
                            : index === 2
                              ? "bg-orange-600 text-orange-100"
                              : "bg-gray-600 text-white"
                      }`}
                    >
                      {standing.position}
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        <a href={`/drivers/${standing.driver_id}`} className="hover:text-f1-red transition-colors">
                          {standing.driver_name}
                        </a>
                      </div>
                      <div className="text-f1-gray">
                        <a
                          href={`/constructors?team=${standing.constructor_id}`}
                          className="hover:text-f1-red transition-colors"
                        >
                          {standing.constructor_name}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{standing.points}</div>
                    <div className="text-f1-gray">{standing.wins} wins</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "constructors" && (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="bg-f1-red p-4">
            <h2 className="text-xl font-bold">Constructors Championship</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {constructorStandings.map((standing, index) => (
              <div key={standing.standing_id} className="p-4 hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0
                          ? "bg-yellow-500 text-yellow-900"
                          : index === 1
                            ? "bg-gray-400 text-gray-900"
                            : index === 2
                              ? "bg-orange-600 text-orange-100"
                              : "bg-gray-600 text-white"
                      }`}
                    >
                      {standing.position}
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        <a
                          href={`/constructors?team=${standing.constructor_id}`}
                          className="hover:text-f1-red transition-colors"
                        >
                          {standing.constructor_name}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{standing.points}</div>
                    <div className="text-f1-gray">{standing.wins} wins</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StandingsView
