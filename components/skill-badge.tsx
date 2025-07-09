interface SkillBadgeProps {
  name: string
}

export default function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <div className="bg-slate-700/50 text-sm px-3 py-1 rounded-full border border-slate-600 hover:border-cyan-500/50 transition-colors">
      {name}
    </div>
  )
}
