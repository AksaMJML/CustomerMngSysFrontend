async function loadCustomer() {
    const response = await fetch('http://localhost:8080/get-customer');
    const customers = await response.json();
    console.log(customers);

    let body = "";

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

function AddCustomer() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const id = document.getElementById('txtId').value;
    const name = document.getElementById('txtName').value;
    const address = document.getElementById('txtAddress').value;
    const email = document.getElementById('txtEmail').value;
    const salary = document.getElementById('txtSalary').value;

    const raw = JSON.stringify({
        "id": id,
        "name": name,
        "address": address,
        "email": email,
        "salary": salary
    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://localhost:8080/add-customer", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
}

loadCustomer();