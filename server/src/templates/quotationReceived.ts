export const quotationReceivedTemplate = ({
  buyerName,
  supplierName,
  rfqTitle,
  price,
  leadTime,
  message,
  quotationUrl,
}: {
  buyerName: string;
  supplierName: string;
  rfqTitle: string;
  price: number;
  leadTime: string;
  message: string;
  quotationUrl: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="light" />
<title>New Quotation Received</title>
</head>

<body style="
margin:0;
padding:0;
background:#f1f5f9;
font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
color:#0f172a;
">

<!-- Preheader (hidden preview text in inbox) -->
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
${supplierName} sent a quotation of $${price.toLocaleString()} for "${rfqTitle}" — review it now.
</div>

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Logo / Brand strip -->
<tr>
<td style="padding:0 8px 20px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="font-size:15px;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">
B2B<span style="color:#059669;">Marketplace</span>
</td>
<td align="right" style="font-size:12px;color:#64748b;">
Quotation Notification
</td>
</tr>
</table>
</td>
</tr>

<!-- Card -->
<table width="100%" cellpadding="0" cellspacing="0"
style="
background:#ffffff;
border-radius:16px;
overflow:hidden;
border:1px solid #e2e8f0;
box-shadow:0 1px 3px rgba(15,23,42,.06);
">

<!-- Header -->
<tr>
<td style="
background:#0f172a;
background-image:linear-gradient(135deg,#0f172a 0%,#134e4a 60%,#059669 100%);
padding:36px 40px;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td>
<div style="
display:inline-block;
background:rgba(255,255,255,.12);
color:#a7f3d0;
font-size:11px;
font-weight:700;
letter-spacing:.06em;
text-transform:uppercase;
padding:6px 12px;
border-radius:999px;
">
New Quotation
</div>

<div style="
font-size:22px;
font-weight:700;
color:#ffffff;
margin-top:16px;
letter-spacing:-0.01em;
">
You've received a new quotation
</div>

<div style="
font-size:14px;
color:#cbd5e1;
margin-top:6px;
line-height:22px;
">
${supplierName} has responded to your RFQ request.
</div>
</td>
</tr>
</table>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:36px 40px 8px;">

<p style="font-size:15px;line-height:24px;margin:0;color:#334155;">
Hi <strong style="color:#0f172a;">${buyerName}</strong>,
</p>

<p style="font-size:15px;line-height:24px;margin-top:12px;color:#334155;">
<strong style="color:#0f172a;">${supplierName}</strong> submitted a quotation for your Request for Quotation below.
Review the details and decide whether to accept, decline, or message the supplier for clarification.
</p>

</td>
</tr>

<!-- Summary Card -->
<tr>
<td style="padding:20px 40px 0;">

<table width="100%" cellpadding="0" cellspacing="0" style="
background:#f8fafc;
border:1px solid #e2e8f0;
border-radius:12px;
">
<tr>
<td style="padding:22px 24px;">

<table width="100%" cellpadding="0" cellspacing="0">

<tr>
<td colspan="2" style="padding-bottom:14px;border-bottom:1px solid #e2e8f0;">
<div style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#64748b;">RFQ</div>
<div style="font-size:16px;font-weight:700;color:#0f172a;margin-top:4px;">${rfqTitle}</div>
</td>
</tr>

<tr><td colspan="2" style="height:14px;"></td></tr>

<tr>
<td width="50%" style="vertical-align:top;">
<div style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#64748b;">Quoted Price</div>
<div style="font-size:24px;font-weight:800;color:#059669;margin-top:4px;">$${price.toLocaleString()}</div>
</td>
<td width="50%" style="vertical-align:top;">
<div style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#64748b;">Lead Time</div>
<div style="font-size:24px;font-weight:800;color:#0f172a;margin-top:4px;">${leadTime}</div>
</td>
</tr>

<tr><td colspan="2" style="height:16px;"></td></tr>

<tr>
<td colspan="2" style="border-top:1px solid #e2e8f0;padding-top:14px;">
<div style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#64748b;">Supplier</div>
<div style="font-size:15px;font-weight:600;color:#0f172a;margin-top:4px;">${supplierName}</div>
</td>
</tr>

</table>

</td>
</tr>
</table>

</td>
</tr>

<!-- Supplier Message -->
<tr>
<td style="padding:24px 40px 0;">

<div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:10px;">
Message from supplier
</div>

<div style="
padding:18px 20px;
background:#ecfdf5;
border-left:3px solid #059669;
border-radius:0 10px 10px 0;
font-size:14px;
line-height:24px;
color:#334155;
white-space:pre-wrap;
">
${message}
</div>

</td>
</tr>

<!-- CTA -->
<tr>
<td style="padding:32px 40px 8px;" align="center">

<table cellpadding="0" cellspacing="0">
<tr>
<td style="
background:#059669;
border-radius:10px;
">
<a href="${quotationUrl}" style="
display:inline-block;
padding:14px 32px;
font-size:15px;
font-weight:700;
color:#ffffff;
text-decoration:none;
">
Review Quotation →
</a>
</td>
</tr>
</table>

</td>
</tr>

<!-- Next steps -->
<tr>
<td style="padding:28px 40px 0;">

<table width="100%" cellpadding="0" cellspacing="0" style="
background:#f8fafc;
border-radius:12px;
border:1px solid #e2e8f0;
">
<tr>
<td style="padding:20px 24px;">

<div style="font-size:13px;font-weight:700;color:#0f172a;margin-bottom:12px;">
What happens next
</div>

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="padding:6px 0;font-size:13px;line-height:20px;color:#475569;">
<span style="color:#059669;font-weight:700;">1.</span>&nbsp; Review the quotation details and pricing
</td>
</tr>
<tr>
<td style="padding:6px 0;font-size:13px;line-height:20px;color:#475569;">
<span style="color:#059669;font-weight:700;">2.</span>&nbsp; Compare it against other supplier offers
</td>
</tr>
<tr>
<td style="padding:6px 0;font-size:13px;line-height:20px;color:#475569;">
<span style="color:#059669;font-weight:700;">3.</span>&nbsp; Message the supplier if you need clarification
</td>
</tr>
<tr>
<td style="padding:6px 0;font-size:13px;line-height:20px;color:#475569;">
<span style="color:#059669;font-weight:700;">4.</span>&nbsp; Accept or decline the quotation
</td>
</tr>
</table>

</td>
</tr>
</table>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="padding:32px 40px 36px;">

<hr style="border:none;border-top:1px solid #e2e8f0;margin:0 0 20px;" />

<div style="font-size:12px;line-height:20px;color:#94a3b8;text-align:center;">
This is an automated notification from <strong style="color:#64748b;">B2B Marketplace</strong>. Please do not reply directly to this email.
<br /><br />
© ${new Date().getFullYear()} B2B Marketplace. All rights reserved.
</div>

</td>
</tr>

</table>
<!-- /Card -->

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};
