export default function AdminTabs({ active, setActive, tabs }) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-full border border-bark/10 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`whitespace-nowrap rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wider transition-colors ${active === tab.id ? "bg-coral text-white" : "border border-transparent text-bark hover:border-oat hover:bg-white"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
