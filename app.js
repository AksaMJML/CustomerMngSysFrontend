async function loadCustomer() {
    const response = await fetch('http://localhost:8080/get-customer');
    const customers = await response.json();
    console.log(customers);

    const tbody = document.getElementById('tblCustomersBody');
    tbody.innerHTML = ''; 

    customers.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${escapeHtml(c.id)}</td>
            <td>${escapeHtml(c.name)}</td>
            <td>${escapeHtml(c.address)}</td>
            <td><a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></td>
            <td class="text-end">${formatCurrency(c.salary)}</td>
        `;
        tbody.appendChild(tr);
    });

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

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('customerForm').addEventListener('submit', AddCustomer);
    const salaryEl = document.getElementById('txtSalary');
    if (salaryEl) {
        salaryEl.addEventListener('blur', formatSalaryDisplay);
        salaryEl.addEventListener('focus', unformatSalaryDisplay);
    }
    const tabAdd = document.getElementById('tab-add');
    const tabList = document.getElementById('tab-list');
    const panelAdd = document.getElementById('panel-add');
    const panelList = document.getElementById('panel-list');
    if (panelAdd) panelAdd.style.display = '';
    if (panelList) panelList.style.display = 'none';
    if (tabAdd && tabList && panelAdd && panelList) {
        tabAdd.addEventListener('click', () => {
            tabAdd.classList.add('active'); tabList.classList.remove('active');
            panelAdd.style.display = ''; panelList.style.display = 'none';
            document.getElementById('txtName').focus();
        });
        tabList.addEventListener('click', async () => {
            tabList.classList.add('active'); tabAdd.classList.remove('active');
            panelAdd.style.display = 'none'; panelList.style.display = '';
            await loadCustomer();
            panelList.scrollIntoView({behavior:'smooth', block:'start'});
        });
    }
    loadCustomer();
});

function formatSalaryDisplay(e){
    const el = e ? e.target : document.getElementById('txtSalary');
    const num = parseFloat(String(el.value).replace(/[^0-9.\-]/g,'')) || 0;
    el.value = new Intl.NumberFormat(undefined, {minimumFractionDigits:2, maximumFractionDigits:2}).format(num);
}
function unformatSalaryDisplay(e){
    const el = e ? e.target : document.getElementById('txtSalary');
    el.value = String(el.value).replace(/,/g,'');
}
function parseSalaryValue(val){
    const cleaned = String(val||'').replace(/[^0-9.\-]/g,'');
    const n = parseFloat(cleaned);
    return isNaN(n) ? '' : n;
}

function showAlert(type, message, timeout = 4000) {
    const placeholder = document.getElementById('alertPlaceholder');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
    placeholder.appendChild(wrapper);
    if (timeout) setTimeout(() => {
        try { bootstrap.Alert.getOrCreateInstance(wrapper.querySelector('.alert')).close(); } catch(e){}
    }, timeout);
}

function formatCurrency(value) {
    const num = parseFloat(value) || 0;
    return new Intl.NumberFormat(undefined, {style:'currency', currency:'USD', maximumFractionDigits:2}).format(num);
}

function escapeHtml(text) { if (text===null || text===undefined) return ''; return String(text).replace(/[&<>"']/g, (s) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }

// Modern AddCustomer handler (replaces previous implementation by being declared later)
async function AddCustomer(e) {
    if (e && e.preventDefault) e.preventDefault();
    const id = document.getElementById('txtId').value.trim();
    const name = document.getElementById('txtName').value.trim();
    const address = document.getElementById('txtAddress').value.trim();
    const email = document.getElementById('txtEmail').value.trim();
    const salary = parseSalaryValue(document.getElementById('txtSalary').value);

    if (!id || !name) { showAlert('warning', 'ID and Name are required'); return; }
    const payload = { id, name, address, email, salary };

    try {
        const res = await fetch('http://localhost:8080/add-customer', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || 'Server error');
        }
        await res.text();
        showAlert('success', 'Customer added successfully');
        document.getElementById('customerForm').reset();
        loadCustomer();
    } catch (err) {
        showAlert('danger', 'Failed to add customer: ' + err.message);
    }
}