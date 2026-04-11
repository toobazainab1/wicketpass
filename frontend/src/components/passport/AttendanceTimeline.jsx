const HISTORY = [
  { match:"Karachi Kings vs Lahore Qalandars",    date:"April 14, 2026 • National Stadium, Karachi",   dot:"green",  pts:"+35 pts" },
  { match:"Peshawar Zalmi vs Quetta Gladiators",  date:"April 15, 2026 • Gaddafi Stadium, Lahore",     dot:"gold",   pts:"+35 pts" },
  { match:"Islamabad United vs Multan Sultans",   date:"April 16, 2026 • Rawalpindi Stadium",          dot:"purple", pts:"+35 pts" },
  { match:"Lahore Qalandars vs Peshawar Zalmi",   date:"April 17, 2026 • Gaddafi Stadium, Lahore",     dot:"cyan",   pts:"+35 pts" },
  { match:"Hyderabad Kingsmen vs Karachi Kings",  date:"April 18, 2026 • National Stadium, Karachi",   dot:"orange", pts:"+35 pts" },
  { match:"Rawalpindiz vs Islamabad United",      date:"April 19, 2026 • Rawalpindi Cricket Stadium",  dot:"blue",   pts:"+35 pts" },
  { match:"Multan Sultans vs Hyderabad Kingsmen", date:"April 20, 2026 • Multan Cricket Stadium",      dot:"purple", pts:"+35 pts" },
  { match:"Quetta Gladiators vs Rawalpindiz",     date:"April 21, 2026 • National Stadium, Karachi",   dot:"red",    pts:"+35 pts" },
]

export default function AttendanceTimeline() {
  return (
    <div className="pp-timeline">
      {HISTORY.map((h, i) => (
        <div className="pp-timeline-item" key={i}>
          <div className={`pp-timeline-dot ${h.dot}`} />
          <div className="pp-timeline-info">
            <div className="pp-timeline-match">{h.match}</div>
            <div className="pp-timeline-date">{h.date}</div>
          </div>
          <div className="pp-timeline-badge">{h.pts}</div>
        </div>
      ))}
    </div>
  )
}