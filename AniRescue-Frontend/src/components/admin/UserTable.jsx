import Select from "../common/Select";
import Badge from "../common/Badge";

export default function UserTable({ users = [], onRoleChange }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-bark/10 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wide text-bark/60">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Email</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id || user.id} className="border-t border-bark/5">
                <td className="px-5 py-4 font-bold text-ink">{user.name}</td>
                <td className="px-5 py-4 text-bark/65">{user.email}</td>
                <td className="px-5 py-4">
                  <Select aria-label={`Role for ${user.name}`} value={user.role} onChange={(event) => onRoleChange?.(user._id || user.id, event.target.value)}>
                    <option value="donor">Donor</option>
                    <option value="campaigner">Campaigner</option>
                    <option value="admin">Admin</option>
                  </Select>
                </td>
                <td className="px-5 py-4"><Badge variant="success">{user.status || "active"}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
