async function loadCustomer() {
    const response = await fetch ('http://localhost:8080/get-customer');
   const customers = await response.json();
   console.log(customers);

   let body = '';

   customers.forEach(customer => {
    body += `<tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.address}</td>
                <td>${customer.email}</td>
                <td>${customer.salary}</td>
            </tr>`;
   });
   
   document.getElementById('tblCustomers').innerHTML = body;
}
loadCustomer();