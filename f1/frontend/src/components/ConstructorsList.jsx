"use client"

import { useState, useEffect } from "react"

const ConstructorsList = () => {
  // Team colors for detailed view only
  const getTeamColors = (constructorId) => {
    const teamColors = {
      red_bull: { primary: "#0600EF", secondary: "#DC143C" },
      mercedes: { primary: "#00D2BE", secondary: "#000000" },
      ferrari: { primary: "#DC143C", secondary: "#FFFF00" },
      mclaren: { primary: "#FF8700", secondary: "#000000" },
      aston_martin: { primary: "#006F62", secondary: "#CEDC00" },
      alpine: { primary: "#0090FF", secondary: "#FF1801" },
      williams: { primary: "#005AFF", secondary: "#FFFFFF" },
      rb: { primary: "#6692FF", secondary: "#FFFFFF" },
      sauber: { primary: "#00D100", secondary: "#000000" },
      haas: { primary: "#FFFFFF", secondary: "#DC143C" },
    }
    return teamColors[constructorId] || { primary: "#E10600", secondary: "#FFFFFF" }
  }

 
  const getTeamLogoUrls = (constructorId, name) => {
    const teamLogos = {
      red_bull: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/red-bull-racing-logo.png",
        "https://logos-world.net/wp-content/uploads/2021/03/Red-Bull-Racing-Logo.png",
        "/placeholder.svg?height=80&width=80",
      ],
      mercedes: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/mercedes-logo.png",
        "https://logos-world.net/wp-content/uploads/2021/03/Mercedes-AMG-Petronas-Logo.png",
        "/placeholder.svg?height=80&width=80",
      ],
      ferrari: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/ferrari-logo.png",
        `"https://logos-world.net/wp-content/uploads/2021/03/Scuderia-Ferrari-Logo.png",
        "/placeholder.svg?height=80&width=80",`
      ],
      mclaren: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/mclaren-logo.png",
        "https://logos-world.net/wp-content/uploads/2021/03/McLaren-Logo.png",
        "/placeholder.svg?height=80&width=80",
      ],
      aston_martin: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/aston-martin-logo.png",
        "https://logos-world.net/wp-content/uploads/2021/03/Aston-Martin-Logo.png",
        "/placeholder.svg?height=80&width=80",
      ],
      alpine: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/alpine-logo.png",
        "https://logos-world.net/wp-content/uploads/2021/03/Alpine-Logo.png",
        "/placeholder.svg?height=80&width=80",
      ],
      williams: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/williams-logo.png",
        "https://logos-world.net/wp-content/uploads/2021/03/Williams-Logo.png",
        "/placeholder.svg?height=80&width=80",
      ],
      rb: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/rb-logo.png",
        "https://logos-world.net/wp-content/uploads/2023/02/AlphaTauri-Logo.png",
        "/placeholder.svg?height=80&width=80",
      ],
      sauber: [
        "https://i.namu.wiki/i/M2DRCcTYlEVr82u-N5ggwF2VtxLxzEwqiouKWpQfWgUr2qTV_9BSNBwDZEInzcM6Y945X3YCpHoQZ8f0pC5TXQ.svg",
      ],
      haas: [
        "https://www.formula1.com/content/dam/fom-website/teams/2024/haas-logo.png",
        "https://logos-world.net/wp-content/uploads/2021/03/Haas-Logo.png",
        "/placeholder.svg?height=80&width=80",
      ],
    }

    return (
      teamLogos[constructorId] || [
        "/placeholder.svg?height=80&width=80&query=" + encodeURIComponent(name + " F1 team logo"),
      ]
    )
  }

  const [constructors, setConstructors] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedConstructor, setSelectedConstructor] = useState(null)
  const [constructorDrivers, setConstructorDrivers] = useState([])
  const [constructorResults, setConstructorResults] = useState([])
  const [constructorStanding, setConstructorStanding] = useState(null)
  const [allRaces, setAllRaces] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [imageErrors, setImageErrors] = useState({})
  const [searchTerm, setSearchTerm] = useState("") // Added search state

  // Check for team parameter in URL and auto-select team
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const teamParam = urlParams.get("team")

    if (teamParam && constructors.length > 0) {
      const targetConstructor = constructors.find((c) => c.constructor_id === teamParam)
      if (targetConstructor) {
        handleConstructorClick(targetConstructor)
      }
    }
  }, [constructors])

  // Handle image loading with fallbacks
  const handleImageError = (constructorId, currentIndex = 0) => {
    const urls = getTeamLogoUrls(constructorId)
    const nextIndex = currentIndex + 1

    if (nextIndex < urls.length) {
      // Try next URL
      setImageErrors((prev) => ({
        ...prev,
        [constructorId]: { ...prev[constructorId], currentIndex: nextIndex },
      }))
    } else {
      // All URLs failed, show fallback
      setImageErrors((prev) => ({
        ...prev,
        [constructorId]: { ...prev[constructorId], showFallback: true },
      }))
    }
  }

  const getCurrentImageUrl = (constructorId) => {
    const urls = getTeamLogoUrls(constructorId)
    const currentIndex = imageErrors[constructorId]?.currentIndex || 0
    return urls[currentIndex] || null
  }

  const shouldShowFallback = (constructorId) => {
    return imageErrors[constructorId]?.showFallback || false
  }

  useEffect(() => {
    const fetchConstructors = async () => {
      try {
        const [constructorsRes, racesRes] = await Promise.all([
          fetch("http://localhost:5000/api/constructors"),
          fetch("http://localhost:5000/api/races"),
        ])

        const constructorsData = await constructorsRes.json()
        const racesData = await racesRes.json()

        setConstructors(constructorsData)
        setAllRaces(racesData)
      } catch (error) {
        console.error("Error fetching constructors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchConstructors()
  }, [])

  const fetchConstructorDetails = async (constructorId) => {
    setLoadingDetails(true)
    try {
      // Fetch all data in parallel
      const [driversRes, resultsRes, standingsRes] = await Promise.all([
        fetch("http://localhost:5000/api/drivers"),
        fetch("http://localhost:5000/api/results"),
        fetch("http://localhost:5000/api/standings/constructors"),
      ])

      const allDrivers = await driversRes.json()
      const allResults = await resultsRes.json()
      const standings = await standingsRes.json()

      // Find drivers who drove for this constructor in 2024
      const constructorDriverIds = [
        ...new Set(
          allResults.filter((result) => result.constructor_id === constructorId).map((result) => result.driver_id),
        ),
      ]

      const drivers = allDrivers.filter((driver) => constructorDriverIds.includes(driver.driver_id))

      // Get constructor results
      const constructorResults = allResults.filter((result) => result.constructor_id === constructorId)

      // Get constructor standing
      const standing = standings.find((s) => s.constructor_id === constructorId)

      setConstructorDrivers(drivers)
      setConstructorResults(constructorResults)
      setConstructorStanding(standing)
    } catch (error) {
      console.error("Error fetching constructor details:", error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleConstructorClick = (constructor) => {
    setSelectedConstructor(constructor)
    fetchConstructorDetails(constructor.constructor_id)
  }

  const getConstructorStats = (results) => {
    const wins = results.filter((r) => r.position === 1).length
    const podiums = results.filter((r) => r.position <= 3).length
    const points = results.reduce((sum, r) => sum + (r.points || 0), 0)
    const races = [...new Set(results.map((r) => r.race_id))].length
    const positions = results.filter((r) => r.position && r.position > 0).map((r) => r.position)
    const bestFinish = positions.length > 0 ? Math.min(...positions) : null

    return {
      wins,
      podiums,
      points,
      races,
      bestFinish: bestFinish || "N/A",
    }
  }

  const getRaceNameById = (raceId) => {
    const race = allRaces.find((r) => r.race_id === raceId)
    return race ? race.race_name : `Race ${raceId}`
  }

  // Filter constructors based on search term
  const filteredConstructors = constructors.filter(
    (constructor) =>
      constructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      constructor.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      constructor.constructor_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-20 bg-gray-700 rounded mb-4"></div>
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (selectedConstructor) {
    const stats = getConstructorStats(constructorResults)

    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => setSelectedConstructor(null)}
          className="flex items-center space-x-2 text-f1-red hover:text-red-400 transition-colors"
        >
          <span>←</span>
          <span>Back to Teams</span>
        </button>

        {/* Team Header */}
        <div
          className="rounded-lg overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${getTeamColors(selectedConstructor.constructor_id).primary} 0%, ${getTeamColors(selectedConstructor.constructor_id).secondary} 100%)`,
          }}
        >
          <div className="p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                {!shouldShowFallback(selectedConstructor.constructor_id) ? (
                  <img
                    src={getCurrentImageUrl(selectedConstructor.constructor_id) || "/placeholder.svg"}
                    alt={`${selectedConstructor.name} logo`}
                    className="w-24 h-24 object-contain rounded-lg bg-white/10 p-3"
                    onError={() =>
                      handleImageError(
                        selectedConstructor.constructor_id,
                        imageErrors[selectedConstructor.constructor_id]?.currentIndex || 0,
                      )
                    }
                  />
                ) : (
                  <div
                    className="w-24 h-24 rounded-lg flex items-center justify-center text-3xl font-bold"
                    style={{
                      backgroundColor: getTeamColors(selectedConstructor.constructor_id).primary,
                      color: getTeamColors(selectedConstructor.constructor_id).secondary,
                    }}
                  >
                    {selectedConstructor.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .slice(0, 3)}
                  </div>
                )}
                <div>
                  <h1 className="text-4xl font-bold mb-2">{selectedConstructor.name}</h1>
                  <p className="text-lg opacity-90">{selectedConstructor.nationality}</p>
                </div>
              </div>
              {constructorStanding && (
                <div className="text-right">
                  <div className="text-3xl font-bold">P{constructorStanding.position}</div>
                  <div className="text-lg opacity-90">Championship</div>
                </div>
              )}
            </div>
          </div>

          {/* Team Stats Section */}
          <div className="bg-gray-50 p-8">
            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Championship Position */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="text-gray-700 text-sm font-medium mb-2">Championship Position</div>
                <div className="text-4xl font-black text-gray-900">
                  {constructorStanding ? constructorStanding.position : "N/A"}
                </div>
              </div>

              {/* Points */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="text-gray-700 text-sm font-medium mb-2">Points</div>
                <div className="text-4xl font-black text-gray-900">
                  {constructorStanding ? constructorStanding.points : stats.points}
                </div>
              </div>

              {/* Wins */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="text-gray-700 text-sm font-medium mb-2">Wins</div>
                <div className="text-4xl font-black text-gray-900">
                  {constructorStanding ? constructorStanding.wins : stats.wins}
                </div>
              </div>

              {/* Podiums */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
                <div className="text-gray-700 text-sm font-medium mb-2">Podiums</div>
                <div className="text-4xl font-black text-gray-900">{stats.podiums}</div>
              </div>
            </div>

            {/* Team Information */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Team Details */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-900">Team Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Constructor ID:</span>
                    <span className="font-semibold text-gray-900">{selectedConstructor.constructor_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nationality:</span>
                    <span className="font-semibold text-gray-900">{selectedConstructor.nationality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Races Entered (2024):</span>
                    <span className="font-semibold text-gray-900">{stats.races}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Finish (2024):</span>
                    <span className="font-semibold text-gray-900">P{stats.bestFinish}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Points (2024):</span>
                    <span className="font-semibold text-gray-900">{stats.points}</span>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold mb-4 text-gray-900">2024 Performance</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-gray-900">{stats.wins}</div>
                    <div className="text-gray-600">Race Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-gray-900">{stats.podiums}</div>
                    <div className="text-gray-600">Podium Finishes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{selectedConstructor.name}</div>
                    <div className="text-gray-600">{selectedConstructor.nationality} Team</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drivers Section */}
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="p-4" style={{ backgroundColor: getTeamColors(selectedConstructor.constructor_id).primary }}>
            <h3 className="text-xl font-bold text-black">2024 Drivers</h3>
          </div>
          <div className="p-6">
            {loadingDetails ? (
              <div className="text-center py-8">
                <div className="text-f1-gray">Loading driver information...</div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {constructorDrivers.map((driver) => (
                  <div key={driver.driver_id} className="bg-gray-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="text-2xl font-bold"
                        style={{ color: getTeamColors(selectedConstructor.constructor_id).primary }}
                      >
                        #{driver.permanent_number || "N/A"}
                      </div>
                      <div className="text-sm text-f1-gray">{driver.code}</div>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{driver.full_name}</h4>
                    <div className="space-y-2 text-sm text-f1-gray">
                      <div>🏁 Nationality: {driver.nationality}</div>
                      <div>📅 Born: {driver.date_of_birth}</div>
                      <div>
                        🔗{" "}
                        <a
                          href={`/drivers/${driver.driver_id}`}
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          Driver Profile
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Results */}
        {constructorResults.length > 0 && (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="p-4" style={{ backgroundColor: getTeamColors(selectedConstructor.constructor_id).primary }}>
              <h3 className="text-xl font-bold text-black">2024 Season Results</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {constructorResults.slice(0, 20).map((result, index) => (
                <div
                  key={result.result_id}
                  className={`p-4 border-b border-gray-700 ${
                    result.position <= 3 ? "bg-gradient-to-r from-yellow-500/10 to-transparent" : ""
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          result.position === 1
                            ? "bg-yellow-500 text-yellow-900"
                            : result.position === 2
                              ? "bg-gray-400 text-gray-900"
                              : result.position === 3
                                ? "bg-orange-600 text-orange-100"
                                : "bg-gray-600 text-white"
                        }`}
                      >
                        {result.position || "DNF"}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{result.driver_name}</div>
                        <div className="text-sm text-f1-gray">{getRaceNameById(result.race_id)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-white">{result.points} pts</div>
                      <div className="text-sm text-f1-gray">{result.time || result.status}</div>
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

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Search F1 2024 Teams</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search by team name, nationality, or team ID..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-f1-red focus:ring-1 focus:ring-f1-red"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-f1-gray">
            {searchTerm
              ? `Found ${filteredConstructors.length} team(s) matching "${searchTerm}"`
              : `Showing all ${constructors.length} teams in the 2024 F1 championship`}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConstructors.map((constructor) => (
          <div
            key={constructor.constructor_id}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg hover:bg-gray-700"
            onClick={() => handleConstructorClick(constructor)}
          >
            {/* Team Display */}
            <div className="flex justify-center mb-4 p-4">
              {!shouldShowFallback(constructor.constructor_id) ? (
                <img
                  src={getCurrentImageUrl(constructor.constructor_id) || "/placeholder.svg"}
                  alt={`${constructor.name} logo`}
                  className="w-20 h-20 object-contain rounded-lg bg-white/5 p-2"
                  onLoad={() => console.log(`Successfully loaded logo for ${constructor.constructor_id}`)}
                  onError={(e) => {
                    console.log(`Failed to load logo for ${constructor.constructor_id}:`, e.target.src)
                    handleImageError(
                      constructor.constructor_id,
                      imageErrors[constructor.constructor_id]?.currentIndex || 0,
                    )
                  }}
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-lg flex items-center justify-center text-2xl font-bold"
                  style={{
                    backgroundColor: getTeamColors(constructor.constructor_id).primary,
                    color: getTeamColors(constructor.constructor_id).secondary,
                  }}
                >
                  {constructor.name
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 3)}
                </div>
              )}
            </div>

            <div className="p-6 text-white">
              <h3 className="text-xl font-bold mb-2 text-center">{constructor.name}</h3>
              <div className="space-y-2 text-sm opacity-90">
                <div className="text-center">🏁 {constructor.nationality}</div>
                <div className="text-center">🆔 {constructor.constructor_id}</div>
              </div>
              <div className="mt-4 text-sm opacity-75 text-center">Click for details →</div>
            </div>
          </div>
        ))}
      </div>

      {filteredConstructors.length === 0 && searchTerm && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <div className="text-f1-gray text-lg">No teams found matching "{searchTerm}".</div>
          <button onClick={() => setSearchTerm("")} className="text-f1-red hover:underline mt-4">
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

export default ConstructorsList
