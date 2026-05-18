export default function AdminTabs({ active, setActive, tabs }) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-full border border-bark/10 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold ${active === tab.id ? "bg-moss text-white" : "text-bark hover:bg-cream"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
