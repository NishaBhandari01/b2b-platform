export const quotationAcceptedTemplate = ({
  supplierName,
  buyerName,
  orderNumber,
  orderUrl,
  amount,
}: {
  supplierName: string;
  buyerName: string;
  orderNumber: string;
  orderUrl: string;
  amount: number;
}) => {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="color-scheme" content="light"/>
<title>Quotation Accepted</title>
</head>


<body style="
margin:0;
padding:0;
background:#f1f5f9;
font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
color:#0f172a;
">


<table width="100%" cellpadding="0" cellspacing="0"
style="background:#f1f5f9;padding:32px 16px">

<tr>
<td align="center">


<table width="600"
style="
max-width:600px;
width:100%;
background:#ffffff;
border-radius:16px;
overflow:hidden;
border:1px solid #e2e8f0;
">


<!-- Header -->

<tr>
<td style="
background:#0f172a;
padding:36px 40px;
">

<div style="
font-size:22px;
font-weight:700;
color:white;
">
🎉 Your quotation has been accepted
</div>


<p style="
color:#cbd5e1;
font-size:14px;
line-height:22px;
">
Congratulations! The buyer has accepted your quotation and a new order has been created.
</p>


</td>
</tr>



<!-- Body -->

<tr>
<td style="padding:36px 40px">


<p>
Hi <strong>${supplierName}</strong>,
</p>


<p style="
font-size:15px;
line-height:24px;
color:#334155;
">

<strong>${buyerName}</strong> has accepted your quotation.
Please review the order details and start processing it.

</p>



<!-- Order Card -->

<table width="100%"
style="
background:#f8fafc;
border:1px solid #e2e8f0;
border-radius:12px;
padding:20px;
">


<tr>
<td>

<p style="
font-size:12px;
color:#64748b;
text-transform:uppercase;
font-weight:700;
">
Order Number
</p>


<p style="
font-size:22px;
font-weight:800;
color:#059669;
">
${orderNumber}
</p>


</td>
</tr>



<tr>
<td>

<p style="
font-size:12px;
color:#64748b;
text-transform:uppercase;
font-weight:700;
">
Order Amount
</p>


<p style="
font-size:22px;
font-weight:800;
">
$${amount.toLocaleString()}
</p>


</td>
</tr>


</table>



<br/>


<!-- Button -->

<table width="100%">
<tr>
<td align="center">

<a href="${orderUrl}"
style="
display:inline-block;
background:#059669;
color:white;
padding:14px 32px;
border-radius:10px;
font-weight:700;
text-decoration:none;
">

View Order

</a>

</td>
</tr>
</table>



</td>
</tr>



<!-- Footer -->


<tr>
<td style="
padding:30px 40px;
text-align:center;
font-size:12px;
color:#94a3b8;
">

This is an automated notification from
<strong>B2B Marketplace</strong>.

<br/><br/>

© ${new Date().getFullYear()} B2B Marketplace

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
