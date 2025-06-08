"use client"

import { useState, useEffect } from "react"

const DriversList = () => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Updated image sources with correct Astro paths
  const getDriverImageUrls = (driverId, driverName) => {
    const imageUrls = {

      // Red Bull Racing 
      perez: ["https://a.espncdn.com/combiner/i?img=/i/headshots/rpm/players/full/4472.png&w=350&h=254"],
      max_verstappen: ["https://formula1review.com/wp-content/uploads/2024/03/max-verstappen.png"],

      // Mercedes
      hamilton: ["https://a.espncdn.com/combiner/i?img=/i/headshots/rpm/players/full/868.png"],
      russell: ["https://cdn.racingnews365.com/Riders/Russell/_570x570_crop_center-center_none/f1_2024_gr_mer_lg.png?v=1708704486"],

      // Aston Martin 
      alonso: ["https://formula1review.com/wp-content/uploads/2024/03/fernando-alonso.png"],
      stroll: ["https://cdn.racingnews365.com/Riders/Stroll/_570x570_crop_center-center_none/f1_2024_ls_ast_lg.png?v=1708704434"],

      // Ferrari
      leclerc: ["https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png"],
      sainz: ["https://a.espncdn.com/i/headshots/rpm/players/full/4686.png"],

      // McLaren
      norris: ["https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png"],
      piastri: ["https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png"],

      // Alpine
      gasly: ["https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png"],
      ocon: ["https://formula1review.com/wp-content/uploads/2024/03/esteban-ocon.png"],

      // Williams
      albon: ["https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png"],
      sargeant: ["https://www.formula1.com/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png"],

      // RB (AlphaTauri)
      tsunoda: ["https://a.espncdn.com/combiner/i?img=/i/headshots/rpm/players/full/5652.png&w=350&h=254"],
      ricciardo: ["https://www.formula1.com/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png"],

      // Haas - Fixed Kevin Magnussen URL
      kevin_magnussen: ["https://www.formula1.com/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png"],
      hulkenberg: ["https://a.espncdn.com/combiner/i?img=/i/headshots/rpm/players/full/4396.png&w=350&h=254"],

      // Kick Sauber
      bottas: ["https://www.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png"],
      zhou: ["https://www.formula1.com/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png"],


      // Reserve Drivers
      lawson: ["https://cdn.racingnews365.com/_570x570_crop_center-center_none/lawson-cutout-2025-vcarb.png?v=1743592719"],
      doohan: ["https://cdn.racingnews365.com/_570x570_crop_center-center_none/jacdoo01.png?v=1741600637"],
      colapinto: ["https://www.kymillman.com/wp-content/uploads/f1/products/f1-signed-photos/franco-colapinto/franco-colapinto.png"],
      bearman: ["https://www.kymillman.com/wp-content/uploads/f1/products/f1-signed-photos/oliver-bearman/oliver-bearman.png"]
    }

    return (
      imageUrls[driverId] || [
        "/placeholder.svg?height=96&width=96&query=" + encodeURIComponent(driverName + " F1 driver"),
      ]
    )
  }

  // Get the current image URL to try - removed silhouette fallback
  const getCurrentImageUrl = (driverId, driverName, attemptIndex = 0) => {
    const urls = getDriverImageUrls(driverId, driverName)
    return (
      urls[attemptIndex] || "/placeholder.svg?height=96&width=96&query=" + encodeURIComponent(driverName + " F1 driver")
    )
  }

  // Get country flag emoji
  const getCountryFlag = (nationality) => {
    const flags = {
      Dutch: "🇳🇱",
      British: "🇬🇧",
      Monégasque: "🇲🇨",
      Spanish: "🇪🇸",
      Mexican: "🇲🇽",
      Australian: "🇦🇺",
      Canadian: "🇨🇦",
      German: "🇩🇪",
      French: "🇫🇷",
      Japanese: "🇯🇵",
      Finnish: "🇫🇮",
      Danish: "🇩🇰",
      Thai: "🇹🇭",
      Chinese: "🇨🇳",
      American: "🇺🇸",
      Argentine: "🇦🇷",
      Italian: "🇮🇹",
      Swiss: "🇨🇭",
      Austrian: "🇦🇹",
      Belgian: "🇧🇪",
    }
    return flags[nationality] || "🏁"
  }

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/drivers")
        const data = await response.json()
        setDrivers(data)
      } catch (error) {
        console.error("Error fetching drivers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [])

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.nationality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.driver_id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
        <h2 className="text-xl font-bold mb-4">Search F1 2024 Drivers</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search by name, nationality, code, or driver ID..."
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
              ? `Found ${filteredDrivers.length} driver(s) matching "${searchTerm}"`
              : `Showing all ${drivers.length} drivers in the 2024 F1 championship`}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDrivers.map((driver) => (
          <a
            key={driver.driver_id}
            href={`/drivers/${driver.driver_id}`}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg hover:bg-gray-700 block"
          >
            {/* Driver Image */}
            <div className="flex justify-center p-4">
              <img
                src={getCurrentImageUrl(driver.driver_id, driver.full_name, 0) || "/placeholder.svg"}
                alt={`${driver.full_name} portrait`}
                className="w-24 h-24 object-cover rounded-full border-2 border-f1-red"
                onError={(e) => {
                  // Try next image URL or fallback to placeholder
                  const urls = getDriverImageUrls(driver.driver_id, driver.full_name)
                  const currentSrc = e.target.src
                  const currentIndex = urls.findIndex((url) => url === currentSrc)
                  const nextIndex = currentIndex + 1

                  if (nextIndex < urls.length) {
                    e.target.src = urls[nextIndex]
                  } else {
                    e.target.src =
                      "/placeholder.svg?height=96&width=96&query=" + encodeURIComponent(driver.full_name + " F1 driver")
                  }
                }}
              />
            </div>

            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-f1-red">#{driver.permanent_number || "N/A"}</div>
                <div className="text-sm text-f1-gray">{driver.code}</div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-center">{driver.full_name}</h3>

              <div className="space-y-2 text-sm text-f1-gray text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span>{getCountryFlag(driver.nationality)}</span>
                  <span>{driver.nationality}</span>
                </div>
                <div>📅 {driver.date_of_birth}</div>
              </div>

              <div className="mt-4 text-sm opacity-75 text-center">Click for details →</div>
            </div>
          </a>
        ))}
      </div>

      {filteredDrivers.length === 0 && searchTerm && (
        <div className="text-center py-12 bg-gray-800 rounded-lg">
          <div className="text-f1-gray text-lg">No drivers found matching "{searchTerm}".</div>
          <button onClick={() => setSearchTerm("")} className="text-f1-red hover:underline mt-4">
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}

export default DriversList
