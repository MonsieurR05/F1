"use client"

import { useState, useEffect } from "react"

const RacesList = () => {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRace, setSelectedRace] = useState(null)
  const [raceResults, setRaceResults] = useState([])
  const [qualifying, setQualifying] = useState([])
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [imageErrors, setImageErrors] = useState({})

  // Updated track layout images with multiple fallback options
  const getTrackImageUrls = (circuitId, circuitName, country) => {
    // Primary: Try to use working F1 images or alternatives
    const primaryImages = {
      bahrain: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/9col/image.png",
        
      ],
      jeddah: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png.transform/9col/image.png", 
        
      ],
      albert_park: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Australia_Circuit.png.transform/9col/image.png",
        
      ],
      suzuka: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Japan_Circuit.png.transform/9col/image.png",
        
      ],
      shanghai: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/China_Circuit.png.transform/9col/image.png",
        
      ],
      miami: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Miami_Circuit.png.transform/9col/image.png",
          
      ],
      imola: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Emilia_Romagna_Circuit.png.transform/9col/image.png",
      ],
      monaco: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Monaco_Circuit.png.transform/9col/image.png",
      ],
      villeneuve: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Canada_Circuit.png.transform/9col/image.png",
      ],
      catalunya: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Spain_Circuit.png.transform/9col/image.png",
      ],
      red_bull_ring: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Austria_Circuit.png.transform/9col/image.png",
      ],
      silverstone: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Great_Britain_Circuit.png.transform/9col/image.png"
      ],
      hungaroring: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Hungary_Circuit.png.transform/9col/image.png",
      ],
      spa: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Belgium_Circuit.png.transform/9col/image.png",
      ],
      zandvoort: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Netherlands_Circuit.png.transform/9col/image.png", 
      ],
      monza: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Italy_Circuit.png.transform/9col/image.png",
      ],
      baku: [
        "https://media.formula1.com/image/upload/f_auto,c_limit,q_auto,w_1320/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Baku_Circuit" 
      ],
      marina_bay: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Singapore_Circuit.png.transform/9col/image.png",
      ],
      americas: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/USA_Circuit.png.transform/9col/image.png",
      ],
      rodriguez: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Mexico_Circuit.png.transform/9col/image.png",
      ],
      interlagos: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Brazil_Circuit.png.transform/9col/image.png",
      ],
      vegas: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Las_Vegas_Circuit.png.transform/9col/image.png", 
      ],
      losail: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Qatar_Circuit.png.transform/9col/image.png",
      ],
      yas_marina: [
        "https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Abu_Dhabi_Circuit.png.transform/9col/image.png",
      ],
    }

    return (
      primaryImages[circuitId] || [
        "/placeholder.svg?height=300&width=400&query=" +
          encodeURIComponent(`${circuitName} F1 circuit layout map ${country}`),
      ]
    )
  }

  // Get current image URL to display
  const getCurrentImageUrl = (circuitId, circuitName, country) => {
    const urls = getTrackImageUrls(circuitId, circuitName, country)
    const currentIndex = imageErrors[circuitId]?.currentIndex || 0
    return urls[currentIndex] || urls[urls.length - 1] // fallback to last URL (placeholder)
  }

  // Handle image loading errors with fallbacks
  const handleImageError = (circuitId, circuitName, country) => {
    const urls = getTrackImageUrls(circuitId, circuitName, country)
    const currentIndex = imageErrors[circuitId]?.currentIndex || 0
    const nextIndex = currentIndex + 1

    if (nextIndex < urls.length) {
      setImageErrors((prev) => ({
        ...prev,
        [circuitId]: { currentIndex: nextIndex },
      }))
    }
  }

  // Calculate circuit statistics from race data and results
  const getCircuitStats = (race, results) => {
    // Get first GP year from race data
    const getFirstGP = (circuitId) => {
      const firstGPs = {
        bahrain: 2004,
        jeddah: 2021,
        albert_park: 1996,
        suzuka: 1987,
        shanghai: 2004,
        miami: 2022,
        imola: 1980,
        monaco: 1950,
        villeneuve: 1978,
        catalunya: 1991,
        red_bull_ring: 1970,
        silverstone: 1950,
        hungaroring: 1986,
        spa: 1950,
        zandvoort: 1952,
        monza: 1950,
        baku: 2017,
        marina_bay: 2008,
        americas: 2012,
        rodriguez: 1963,
        interlagos: 1973,
        vegas: 2023,
        losail: 2021,
        yas_marina: 2009,
      }
      return firstGPs[circuitId] || "Unknown"
    }

    // Estimate circuit length (km) based on typical F1 circuits
    const getCircuitLength = (circuitId) => {
      const lengths = {
        bahrain: 5.412,
        jeddah: 6.174,
        albert_park: 5.278,
        suzuka: 5.807,
        shanghai: 5.451,
        miami: 5.412,
        imola: 4.909,
        monaco: 3.337,
        villeneuve: 4.361,
        catalunya: 4.675,
        red_bull_ring: 4.318,
        silverstone: 5.891,
        hungaroring: 4.381,
        spa: 7.004,
        zandvoort: 4.259,
        monza: 5.793,
        baku: 6.003,
        marina_bay: 5.063,
        americas: 5.513,
        rodriguez: 4.304,
        interlagos: 4.309,
        vegas: 6.12,
        losail: 5.38,
        yas_marina: 5.281,
      }
      return lengths[circuitId] || 5.0
    }

    // Get all-time lap records for each circuit
    const getAllTimeLapRecord = (circuitId) => {
      const lapRecords = {
        bahrain: { time: "1:31.447", driver: "Pedro de la Rosa", year: "2005" },
        jeddah: { time: "1:30.734", driver: "Lewis Hamilton", year: "2021" },
        albert_park: { time: "1:19.813", driver: "Charles Leclerc", year: "2024" },
        suzuka: { time: "1:30.983", driver: "Lewis Hamilton", year: "2019" },
        shanghai: { time: "1:32.238", driver: "Michael Schumacher", year: "2004" },
        miami: { time: "1:31.361", driver: "Max Verstappen", year: "2023" },
        imola: { time: "1:15.484", driver: "Lewis Hamilton", year: "2020" },
        monaco: { time: "1:12.909", driver: "Lewis Hamilton", year: "2021" },
        villeneuve: { time: "1:13.078", driver: "Valtteri Bottas", year: "2019" },
        catalunya: { time: "1:18.149", driver: "Max Verstappen", year: "2023" },
        red_bull_ring: { time: "1:05.619", driver: "Carlos Sainz Jr.", year: "2020" },
        silverstone: { time: "1:27.097", driver: "Max Verstappen", year: "2020" },
        hungaroring: { time: "1:16.627", driver: "Lewis Hamilton", year: "2020" },
        spa: { time: "1:46.286", driver: "Valtteri Bottas", year: "2018" },
        zandvoort: { time: "1:11.097", driver: "Lewis Hamilton", year: "2021" },
        monza: { time: "1:21.046", driver: "Rubens Barrichello", year: "2004" },
        baku: { time: "1:43.009", driver: "Charles Leclerc", year: "2019" },
        marina_bay: { time: "1:41.905", driver: "Kevin Magnussen", year: "2018" },
        americas: { time: "1:36.169", driver: "Charles Leclerc", year: "2019" },
        rodriguez: { time: "1:17.774", driver: "Valtteri Bottas", year: "2021" },
        interlagos: { time: "1:10.540", driver: "Valtteri Bottas", year: "2018" },
        vegas: { time: "1:35.490", driver: "Oscar Piastri", year: "2023" },
        losail: { time: "1:23.196", driver: "Max Verstappen", year: "2021" },
        yas_marina: { time: "1:26.103", driver: "Max Verstappen", year: "2021" },
      }
      return lapRecords[circuitId] || { time: "N/A", driver: "Unknown", year: "N/A" }
    }

    const circuitLength = getCircuitLength(race.circuit_id)
    const laps = Math.round(305 / circuitLength) // Calculate laps to reach ~305km
    const raceDistance = (circuitLength * laps).toFixed(3)
    const lapRecord = getAllTimeLapRecord(race.circuit_id)

    return {
      firstGP: getFirstGP(race.circuit_id),
      laps: laps,
      circuitLength: circuitLength.toFixed(3),
      raceDistance: raceDistance,
      fastestLap: lapRecord.time,
      fastestLapDriver: lapRecord.driver,
      fastestLapYear: lapRecord.year,
    }
  }

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/races")
        const data = await response.json()
        setRaces(data)
      } catch (error) {
        console.error("Error fetching races:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRaces()
  }, [])

  const fetchRaceDetails = async (raceId) => {
    setLoadingDetails(true)
    try {
      const [resultsRes, qualifyingRes] = await Promise.all([
        fetch(`http://localhost:5000/api/races/${raceId}/results`),
        fetch(`http://localhost:5000/api/races/${raceId}/qualifying`),
      ])

      const results = await resultsRes.json()
      const qual = await qualifyingRes.json()

      setRaceResults(results)
      setQualifying(qual)
    } catch (error) {
      console.error("Error fetching race details:", error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleRaceClick = (race) => {
    setSelectedRace(race)
    fetchRaceDetails(race.race_id)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCountryFlag = (country) => {
    const flags = {
      Bahrain: "🇧🇭",
      "Saudi Arabia": "🇸🇦",
      Australia: "🇦🇺",
      Japan: "🇯🇵",
      China: "🇨🇳",
      Miami: "🇺🇸",
      Italy: "🇮🇹",
      Monaco: "🇲🇨",
      Canada: "🇨🇦",
      Spain: "🇪🇸",
      Austria: "🇦🇹",
      UK: "🇬🇧",
      Hungary: "🇭🇺",
      Belgium: "🇧🇪",
      Netherlands: "🇳🇱",
      Azerbaijan: "🇦🇿",
      Singapore: "🇸🇬",
      USA: "🇺🇸",
      Mexico: "🇲🇽",
      Brazil: "🇧🇷",
      "Las Vegas": "🇺🇸",
      Qatar: "🇶🇦",
      "Abu Dhabi": "🇦🇪",
    }
    return flags[country] || "🏁"
  }

  const filteredRaces = races.filter(
    (race) =>
      race.race_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      race.circuit_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      race.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      race.country.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (selectedRace) {
    const circuitStats = getCircuitStats(selectedRace, raceResults)

    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => setSelectedRace(null)}
          className="flex items-center space-x-2 text-f1-red hover:text-red-400 transition-colors"
        >
          <span>←</span>
          <span>Back to Race Calendar</span>
        </button>

        {/* Circuit Header */}
        <div className="bg-gradient-to-r from-f1-red to-red-700 rounded-lg overflow-hidden">
          <div className="p-6 text-white">
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-4xl">{getCountryFlag(selectedRace.country)}</span>
              <div>
                <h1 className="text-3xl font-bold">{selectedRace.circuit_name}</h1>
                <p className="text-red-100">
                  {selectedRace.locality}, {selectedRace.country}
                </p>
              </div>
            </div>
          </div>

          {/* Track Layout Section */}
          <div className="bg-gray-50 p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Track Image - Left Side */}
              <div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <img
                    src={
                      getCurrentImageUrl(selectedRace.circuit_id, selectedRace.circuit_name, selectedRace.country) ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={`${selectedRace.circuit_name} track layout`}
                    className="w-full h-64 object-contain rounded-lg"
                    onError={() =>
                      handleImageError(selectedRace.circuit_id, selectedRace.circuit_name, selectedRace.country)
                    }
                  />
                </div>
              </div>

              {/* Circuit Stats Cards - Right Side */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Grand Prix */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-gray-700 text-sm font-medium mb-2">First Grand Prix</div>
                  <div className="text-4xl font-black text-gray-900">{circuitStats.firstGP}</div>
                </div>

                {/* Number of Laps */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-gray-700 text-sm font-medium mb-2">Number of Laps</div>
                  <div className="text-4xl font-black text-gray-900">{circuitStats.laps}</div>
                </div>

                {/* Circuit Length */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-gray-700 text-sm font-medium mb-2">Circuit Length</div>
                  <div className="text-4xl font-black text-gray-900">
                    {circuitStats.circuitLength}
                    <span className="text-lg font-semibold text-gray-600 ml-1">km</span>
                  </div>
                </div>

                {/* Race Distance */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="text-gray-700 text-sm font-medium mb-2">Race Distance</div>
                  <div className="text-4xl font-black text-gray-900">
                    {circuitStats.raceDistance}
                    <span className="text-lg font-semibold text-gray-600 ml-1">km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lap Record - Full Width Bottom */}
            <div className="mt-6">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
                <div className="text-gray-700 text-sm font-medium mb-3">Lap Record</div>
                <div className="flex items-baseline space-x-3">
                  <div className="text-5xl font-black text-gray-900">{circuitStats.fastestLap}</div>
                  <div className="text-base text-gray-600 font-medium">
                    {circuitStats.fastestLapDriver} ({circuitStats.fastestLapYear})
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Race Results and Qualifying */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Race Results */}
          {raceResults.length > 0 && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="bg-f1-red p-4">
                <h3 className="text-xl font-bold">🏁 Race Results</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {raceResults.map((result, index) => (
                  <div
                    key={result.result_id}
                    className={`p-4 border-b border-gray-700 ${
                      index < 3 ? "bg-gradient-to-r from-yellow-500/10 to-transparent" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index === 0
                              ? "bg-yellow-500 text-yellow-900"
                              : index === 1
                                ? "bg-gray-400 text-gray-900"
                                : index === 2
                                  ? "bg-orange-600 text-orange-100"
                                  : "bg-gray-600 text-white"
                          }`}
                        >
                          {result.position || "DNF"}
                        </div>
                        <div>
                          <div className="font-semibold">{result.driver_name}</div>
                          <div className="text-sm text-f1-gray">{result.constructor_name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{result.points} pts</div>
                        <div className="text-sm text-f1-gray">{result.time || result.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qualifying Results */}
          {qualifying.length > 0 && (
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="bg-blue-600 p-4">
                <h3 className="text-xl font-bold">⏱️ Qualifying Results</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {qualifying.map((qual, index) => (
                  <div
                    key={qual.qualifying_id}
                    className={`p-4 border-b border-gray-700 ${
                      index < 3 ? "bg-gradient-to-r from-blue-500/10 to-transparent" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {qual.position}
                        </div>
                        <div>
                          <div className="font-semibold">{qual.driver_name}</div>
                          <div className="text-sm text-f1-gray">{qual.constructor_name}</div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        {qual.q3 && <div className="font-semibold">Q3: {qual.q3}</div>}
                        {qual.q2 && <div>Q2: {qual.q2}</div>}
                        {qual.q1 && <div>Q1: {qual.q1}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {loadingDetails && (
          <div className="text-center py-8">
            <div className="text-f1-gray">Loading race details...</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Search F1 2024 Races</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search by race name, circuit, location, or country..."
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
              ? `Found ${filteredRaces.length} race(s) matching "${searchTerm}"`
              : `Showing all ${races.length} races in the 2024 F1 season`}
          </p>
        </div>
      </div>

      {filteredRaces.map((race) => (
        <div
          key={race.race_id}
          className="bg-gray-800 rounded-lg p-6 cursor-pointer hover:bg-gray-700 transition-all duration-200 border-l-4 border-f1-red hover:border-red-400"
          onClick={() => handleRaceClick(race)}
        >
          {/* ... existing race card code ... */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{getCountryFlag(race.country)}</div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="bg-f1-red text-white px-2 py-1 rounded text-sm font-bold">R{race.round}</span>
                  <h3 className="text-xl font-bold">{race.race_name}</h3>
                </div>
                <div className="text-f1-gray">
                  <span className="font-semibold">{race.circuit_name}</span> • {race.locality}, {race.country}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">{formatDate(race.date)}</div>
              {race.time && <div className="text-f1-gray text-sm">{race.time}</div>}
              <div className="text-f1-red text-sm mt-1">Click for details →</div>
            </div>
          </div>
        </div>
      ))}

      {filteredRaces.length === 0 && searchTerm && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <div className="text-f1-gray text-lg">No races found matching "{searchTerm}".</div>
          <button onClick={() => setSearchTerm("")} className="text-f1-red hover:underline mt-4">
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

export default RacesList
