"use client"

import { useState, useEffect } from "react"

const StatsCard = () => {
  const [stats, setStats] = useState({
    totalDrivers: 0,
    totalRaces: 0,
    totalConstructors: 0,
    completedRaces: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [driversRes, racesRes, constructorsRes] = await Promise.all([
          fetch("http://localhost:5000/api/drivers"),
          fetch("http://localhost:5000/api/races"),
          fetch("http://localhost:5000/api/constructors"),
        ])

        const drivers = await driversRes.json()
        const races = await racesRes.json()
        const constructors = await constructorsRes.json()

        // Count completed races (races with results)
        const resultsRes = await fetch("http://localhost:5000/api/results")
        const results = await resultsRes.json()
        const completedRaces = new Set(results.map((r) => r.race_id)).size

        setStats({
          totalDrivers: drivers.length,
          totalRaces: races.length,
          totalConstructors: constructors.length,
          completedRaces,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 animate-pulse border border-white/10">
            <div className="h-8 bg-white/10 rounded-lg mb-4"></div>
            <div className="h-6 bg-white/10 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      value: stats.totalDrivers,
      label: "Drivers",
      icon: "👨‍💼",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/20 to-blue-600/20",
    },
    {
      value: stats.totalConstructors,
      label: "Teams",
      icon: "🏎️",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/20 to-purple-600/20",
    },
    {
      value: stats.totalRaces,
      label: "Total Races",
      icon: "🏁",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/20 to-green-600/20",
    },
    {
      value: stats.completedRaces,
      label: "Completed",
      icon: "✅",
      gradient: "from-primary-500 to-primary-600",
      bgGradient: "from-primary-500/20 to-primary-600/20",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-large`}
        >
          <div className="relative z-10">
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
            <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
              {stat.value}
            </div>
            <div className="text-white/70 font-medium">{stat.label}</div>
          </div>

          {/* Hover effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  )
}

export default StatsCard
