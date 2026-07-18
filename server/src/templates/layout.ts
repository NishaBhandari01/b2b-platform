export const emailLayout = (title: string, content: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
</head>

<body style="
    margin:0;
    padding:0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table
    width="650"
    cellpadding="0"
    cellspacing="0"
    style="
        background:#ffffff;
        border-radius:12px;
        overflow:hidden;
        box-shadow:0 6px 20px rgba(0,0,0,.08);
    "
>

<tr>
<td
    style="
        background:#059669;
        color:#fff;
        padding:25px;
        text-align:center;
        font-size:28px;
        font-weight:bold;
    "
>
B2B Marketplace
</td>
</tr>

<tr>
<td style="padding:40px;">
${content}
</td>
</tr>

<tr>
<td
style="
background:#f9fafb;
padding:20px;
text-align:center;
font-size:13px;
color:#6b7280;
"
>
© ${new Date().getFullYear()} B2B Marketplace

<br><br>

This is an automated email. Please do not reply.

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
