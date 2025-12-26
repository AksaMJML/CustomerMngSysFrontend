async function loadCustomer() {
    const response = await fetch ('http://localhost:8080/get-customer');
   const customers = await response.json();
   console.log(customers);

}

loadCustomer();