import Button from "../common/Button";
import Badge from "../common/Badge";

export default function CampaignerApprovalTable({ rows = [], onApprove, onReject }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-bark/10 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream text-xs uppercase tracking-wide text-bark/60">
            <tr>
              <th className="px-5 py-4">Applicant</th>
              <th className="px-5 py-4">Type & Display Name</th>
              <th className="px-5 py-4">Location & Reference</th>
              <th className="px-5 py-4">Detailed Info & Documents</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isIndividual = row.campaignerType === "Individual";
              return (
                <tr key={row._id || row.id} className="border-t border-bark/5 align-top">
                  <td className="px-5 py-4">
                    <div className="font-bold text-ink">{row.userId?.name || "Unknown"}</div>
                    <div className="text-xs text-bark/65">{row.userId?.email || "No email"}</div>
                    <div className="mt-2 text-xs font-semibold text-teal-600">
                      Status: {row.status}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-bark/80 text-xs font-bold uppercase tracking-wider">{row.campaignerType}</div>
                    <div className="font-extrabold text-ink text-base">{row.publicDisplayName}</div>
                    <div className="mt-1 text-xs text-bark/65">
                      Role: {isIndividual ? row.animalWelfareRole : row.authorizedPersonRole}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-ink">{row.location}</div>
                    <div className="mt-1 text-xs text-bark/65">Ref: {row.referenceContact}</div>
                    {!isIndividual && (
                      <div className="mt-1 text-xs text-bark/65">Org Contact: {row.organizationEmailPhone}</div>
                    )}
                  </td>
                  <td className="px-5 py-4 min-w-[300px]">
                    <details className="group rounded-xl border border-bark/10 bg-cream p-3 open:bg-white open:shadow-sm">
                      <summary className="cursor-pointer font-semibold text-sm text-ink outline-none marker:text-bark/40">
                        View Application Details
                      </summary>
                      <div className="mt-3 space-y-3 text-xs text-bark/80">
                        <div>
                          <strong className="text-ink">Reason / Background:</strong>
                          <p className="mt-1 whitespace-pre-wrap">{row.campaignerReason}</p>
                        </div>
                        <div className="rounded border border-bark/10 bg-cream p-2">
                          <strong className="text-ink">Payout ({row.payoutMethod}):</strong>
                          {row.payoutMethod === "upi" ? (
                            <div className="mt-1">UPI ID: {row.upiId}</div>
                          ) : (
                            <div className="mt-1">
                              Acct: {row.bankDetails?.accountNumber} | IFSC: {row.bankDetails?.ifscCode}<br/>
                              Bank: {row.bankDetails?.bankName} | Holder: {row.bankDetails?.accountHolderName}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {row.verificationDocumentUrl && <a href={row.verificationDocumentUrl} target="_blank" rel="noreferrer" className="text-coral underline">Legacy Doc</a>}
                          {row.identityProofUrl && <a href={row.identityProofUrl} target="_blank" rel="noreferrer" className="text-coral underline">ID Proof</a>}
                          {row.animalWelfareProofUrl && <a href={row.animalWelfareProofUrl} target="_blank" rel="noreferrer" className="text-coral underline">Welfare Proof</a>}
                          {row.payoutProofUrl && <a href={row.payoutProofUrl} target="_blank" rel="noreferrer" className="text-coral underline">Payout Proof</a>}
                          {row.organizationProofUrl && <a href={row.organizationProofUrl} target="_blank" rel="noreferrer" className="text-coral underline">Org Proof</a>}
                          {row.authorizationLetterUrl && <a href={row.authorizationLetterUrl} target="_blank" rel="noreferrer" className="text-coral underline">Auth Letter</a>}
                        </div>
                      </div>
                    </details>
                  </td>
                  <td className="px-5 py-4">
                    {row.status === "pending" ? (
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => onApprove?.(row._id || row.id)}>
                          Approve
                        </Button>
                        <Button size="sm" variant="urgent" onClick={() => onReject?.(row._id || row.id)}>
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Badge variant={row.status === "approved" ? "success" : "urgent"}>
                        {row.status}
                      </Badge>
                    )}
                  </td>
                </tr>
              );
            })}
            {!rows.length && (
              <tr>
                <td colSpan="5" className="px-5 py-10 text-center text-bark/60">
                  No campaigner requests pending right now.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
