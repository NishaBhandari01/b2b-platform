export const resetPasswordEmail = (name: string, resetLink: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Reset Password</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;margin-top:40px;border-radius:10px;padding:40px;">

<tr>
<td align="center">
<h2 style="margin:0;color:#2563eb;">
B2B Platform
</h2>
</td>
</tr>

<tr>
<td style="padding-top:30px;">
<p>Hello <strong>${name}</strong>,</p>

<p>
We received a request to reset your password.
</p>

<p>
Click the button below to create a new password.
This link will expire in <strong>15 minutes</strong>.
</p>

<div style="text-align:center;margin:35px 0;">
<a
href="${resetLink}"
style="
background:#2563eb;
color:white;
padding:14px 28px;
text-decoration:none;
border-radius:8px;
display:inline-block;
font-weight:bold;
">
Reset Password
</a>
</div>

<p>
If you didn't request this, you can safely ignore this email.
Your password won't be changed.
</p>

<hr style="margin:30px 0;" />

<p style="font-size:13px;color:#666;">
B2B Platform Team
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;
};
